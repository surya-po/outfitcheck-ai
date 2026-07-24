"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ScanFace, RefreshCcw, Save, ArrowRight, Zap, Target } from "lucide-react";
import { CameraPreview, type CameraPreviewHandle } from "@/components/body-scan/CameraPreview";
import { CameraOverlay } from "@/components/body-scan/CameraOverlay";
import { HeightBadge } from "@/components/body-scan/HeightBadge";
import { ScanTips } from "@/components/body-scan/ScanTips";
import { CameraControls } from "@/components/body-scan/CameraControls";
import { PoseStatusPanel } from "@/components/body-scan/PoseStatusPanel";
import { MeasurementPanel } from "@/components/body-scan/MeasurementPanel";
import { usePoseLandmarker } from "@/hooks/usePoseLandmarker";
import { useScanSession } from "@/hooks/useScanSession";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BodyMeasurementResult } from "@/lib/body-measurements/types";
import { StylePreferenceSelector } from "@/components/body-scan/StylePreferenceSelector";
import { UserStylePreference } from "@/lib/fashion-recommendation-engine/recommendation-types";

// New Fashion Analysis Engine imports
import { FashionAnalysisProfile } from "@/lib/body-analysis-engine/analysis-types";
import { fashionAnalysisService } from "@/lib/body-analysis-engine/analysis-service";
import { BodyShapeCard } from "@/components/body-scan/analysis-cards/BodyShapeCard";
import { ProportionsCard } from "@/components/body-scan/analysis-cards/ProportionsCard";
import { ShapeDebugPanel } from "@/components/body-scan/analysis-cards/ShapeDebugPanel";

import { AiVisionCard } from "@/components/body-scan/analysis-cards/AiVisionCard";
import { RecommendationCard } from "@/components/body-scan/analysis-cards/RecommendationCard";
import { OutfitRecommendationCard } from "@/components/body-scan/analysis-cards/OutfitRecommendationCard";
import { generateOutfitRecommendations } from "@/lib/outfit-engine/outfit-service";
import { saveScanHistory } from "@/app/actions/history";
import { findBestMatchingProducts } from "@/app/actions/product";
import { getSavedOutfitProductIds, toggleFavoriteOutfit } from "@/app/actions/wardrobe";
import { Product } from "@/lib/product-matching-engine/product-types";
import { useRouter } from "next/navigation";

// Absolute Measurement Modules
import { validatePose } from "@/lib/body-analysis-engine/validation/pose-validation";
import { calculateImageQuality } from "@/lib/body-analysis-engine/validation/quality-score";
import { loadOpenCV } from "@/lib/body-analysis-engine/calibration/reference-card-utils";
import { detectReferenceCard } from "@/lib/body-analysis-engine/calibration/reference-card-detector";
import { calculatePixelScale } from "@/lib/body-analysis-engine/calibration/pixel-scale";
import { calculateAllMeasurements } from "@/lib/body-analysis-engine/measurement/measurement-engine";

export default function BodyScanPage() {
  // ─── Session persistence (survives navigation within the tab) ────────
  const { session, isHydrated, updateSession, resetSession } = useScanSession();

  // ─── Derived from session (persisted) ──────────────────────────────
  const scanMode          = session.scanMode;
  const viewStep          = session.viewStep;
  const capturedImage     = session.capturedImage;
  const capturedMeasurements = session.capturedMeasurements;
  const analysisProfile   = session.analysisProfile;
  const matchedProducts   = session.matchedProducts;
  const scanMetadata      = session.scanMetadata;
  const userStylePreference = session.userStylePreference;

  // Shorthand setters that sync to sessionStorage
  const setScanMode     = (v: "quick" | "accurate") => updateSession({ scanMode: v });
  const setViewStep     = (v: "preference" | "scan" | "result") => updateSession({ viewStep: v });
  const setCapturedImage = (v: string | null) => updateSession({ capturedImage: v });
  const setCapturedMeasurements = (v: BodyMeasurementResult | null) => updateSession({ capturedMeasurements: v });
  const setAnalysisProfile = (v: typeof analysisProfile) => updateSession({ analysisProfile: v });
  const setMatchedProducts = (v: typeof matchedProducts) => updateSession({ matchedProducts: v });
  const setScanMetadata = (v: Record<string, unknown>) => updateSession({ scanMetadata: v });
  const setUserStylePreference = (v: UserStylePreference) => updateSession({ userStylePreference: v });

  // ─── Transient UI state (not persisted — ok to lose on navigation) ─────
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState<number | null>(null);

  const router = useRouter();

  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);

  const streamCleanupRef = useRef<MediaStream | null>(null);
  const cameraRef = useRef<CameraPreviewHandle>(null);

  // Restore hasCaptured from session after hydration
  useEffect(() => {
    if (isHydrated && session.capturedImage && session.viewStep === "result") {
      setHasCaptured(true);
    }
  }, [isHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const poseState = usePoseLandmarker({
    videoElement,
    canvasElement,
    enabled: isCameraActive && !hasCaptured,
  });

  const latestMeasurementsRef = useRef<BodyMeasurementResult | null>(null);
  useEffect(() => {
    latestMeasurementsRef.current = poseState.measurements;
  }, [poseState.measurements]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCameraActive) {
      const checkElements = () => {
        const video = cameraRef.current?.getVideoElement();
        const canvas = cameraRef.current?.getCanvasElement();
        if (video && canvas) {
          setVideoElement(video);
          setCanvasElement(canvas);
        } else {
          timer = setTimeout(checkElements, 100);
        }
      };
      checkElements();
    } else {
      setVideoElement(null);
      setCanvasElement(null);
    }
    return () => clearTimeout(timer);
  }, [isCameraActive]);

  useEffect(() => {
    getSavedOutfitProductIds().then((ids) => setSavedProductIds(new Set(ids))).catch(console.error);
  }, []);

  useEffect(() => {
    return () => {
      if (streamCleanupRef.current) {
        streamCleanupRef.current.getTracks().forEach((track) => track.stop());
        streamCleanupRef.current = null;
      }
    };
  }, []);

  const handleToggleFavorite = async (product: Product) => {
    setSavedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) next.delete(product.id);
      else next.add(product.id);
      return next;
    });

    try {
      await toggleFavoriteOutfit(product.id, product.compatibilityScore, product.recommendationReason);
    } catch (err: any) {
      alert("Gagal menambahkan ke wardrobe");
      setSavedProductIds((prev) => {
        const next = new Set(prev);
        if (next.has(product.id)) next.delete(product.id);
        else next.add(product.id);
        return next;
      });
    }
  };

  const startCamera = useCallback(async () => {
    // Reset results when starting a new scan
    resetSession();
    setHasCaptured(false);
    setCountdown(null);
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: false,
      });
      setStream(mediaStream);
      streamCleanupRef.current = mediaStream;
      setIsCameraActive(true);
      
      if (scanMode === "accurate") {
        setAnalysisStep("Loading Computer Vision...");
        await loadOpenCV();
        setAnalysisStep("");
      }
    } catch (err: any) {
      alert("Gagal mengakses kamera.");
    } finally {
      setIsLoading(false);
    }
  }, [scanMode, resetSession]);

  const stopCamera = useCallback(() => {
    if (streamCleanupRef.current) {
      streamCleanupRef.current.getTracks().forEach((track) => track.stop());
      streamCleanupRef.current = null;
    }
    setStream(null);
    setIsCameraActive(false);
  }, []);

  const captureFrame = useCallback(async () => {
    const frameData = cameraRef.current?.captureFrame();
    if (!frameData) return;
    
    let finalMeasurements = latestMeasurementsRef.current;
    const metadata: any = { scanMode };

    if (scanMode === "accurate") {
      try {
        const landmarks = poseState.result?.landmarks?.[0];
        const snapshotCanvas = cameraRef.current?.getSnapshotCanvas();
        
        if (!landmarks || !snapshotCanvas) throw new Error("Gagal mendapatkan data postur tubuh.");
        
        const poseValidation = validatePose(landmarks);
        if (!poseValidation.isValid) throw new Error(poseValidation.messages[0]);

        const quality = calculateImageQuality(snapshotCanvas);
        metadata.qualityScore = quality.score;
        if (!quality.isValid) throw new Error(quality.messages[0]);

        const cardResult = detectReferenceCard(snapshotCanvas);
        metadata.referenceCardDetected = cardResult.detected;
        metadata.referenceCardConfidence = cardResult.confidence;
        if (!cardResult.detected) throw new Error("Kartu referensi tidak terdeteksi. Pastikan kartu terlihat jelas.");

        const scale = calculatePixelScale(cardResult.pixelWidth, cardResult.confidence);
        metadata.pixelScale = scale.cmPerPixel;
        const absMeas = calculateAllMeasurements(landmarks, snapshotCanvas.width, snapshotCanvas.height, scale);
        
        metadata.measurementConfidence = absMeas.overallConfidence;
        metadata.heightMethod = "Segmented Addition";

        if (absMeas.overallConfidence < 75) {
          alert("Peringatan: Confidence pengukuran rendah (" + absMeas.overallConfidence + "%). Hasil mungkin kurang akurat.");
        }

        finalMeasurements = {
          measurements: {
            estimatedHeight: { value: absMeas.height.cm, confidence: absMeas.height.confidence, timestamp: Date.now() },
            shoulderWidth: { value: absMeas.shoulderWidth.cm, confidence: absMeas.shoulderWidth.confidence, timestamp: Date.now() },
            hipWidth: { value: absMeas.hipWidth.cm, confidence: absMeas.hipWidth.confidence, timestamp: Date.now() },
            waistWidth: { value: absMeas.hipWidth.cm * 0.8, confidence: absMeas.overallConfidence, timestamp: Date.now() }, // Approximation
            legLength: { value: absMeas.legLength.cm, confidence: absMeas.legLength.confidence, timestamp: Date.now() },
            torsoLength: { value: absMeas.torsoLength.cm, confidence: absMeas.torsoLength.confidence, timestamp: Date.now() },
            armLength: { value: absMeas.armLength.cm, confidence: absMeas.armLength.confidence, timestamp: Date.now() },
            shoulderHipRatio: { value: absMeas.shoulderWidth.cm / absMeas.hipWidth.cm, confidence: absMeas.overallConfidence, timestamp: Date.now() },
            overallConfidence: absMeas.overallConfidence
          },
          quality: {
            isUpperBodyOnly: false, isFeetMissing: false, isTooClose: false, isTooFar: false, isRotated: false, isPoorLighting: false, warnings: []
          }
        };

      } catch (err: any) {
        alert("Kalibrasi Gagal: " + err.message);
        return;
      }
    }

    setCapturedImage(frameData);
    setHasCaptured(true);
    setIsAnalyzing(true);
    stopCamera();

    setCapturedMeasurements(finalMeasurements);
    setScanMetadata(metadata as Record<string, unknown>);
    // Transition to result step — persisted so navigating back restores results
    setViewStep("result");
    setAnalysisStep("5/5: Menganalisis Fashion (AI)...");
    
    if (finalMeasurements) {
      fashionAnalysisService
        .analyze(finalMeasurements, frameData, userStylePreference)
        .then(async (profile) => {
          setAnalysisProfile(profile);
          if (profile) {
            const products = await findBestMatchingProducts(profile);
            setMatchedProducts(products);
          }
        })
        .finally(() => {
          setIsAnalyzing(false);
          setAnalysisStep("");
        });
    } else {
      setIsAnalyzing(false);
    }
  }, [stopCamera, scanMode, poseState.result, startCamera]);

  const captureFrameRef = useRef(captureFrame);
  useEffect(() => {
    captureFrameRef.current = captureFrame;
  }, [captureFrame]);

  // Auto-capture countdown timer effect
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => (c !== null ? c - 1 : null)), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      captureFrameRef.current();
      setCountdown(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  // Gesture detection effect
  useEffect(() => {
    let cancelTimer: NodeJS.Timeout;

    if (!isCameraActive || hasCaptured || poseState.status !== "tracking") {
      setCountdown(null);
      return;
    }

    if (poseState.detectedGesture === "Raised_Hand") {
      setCountdown(prev => (prev === null ? 3 : prev));
    } else {
      // Cancel countdown if hand is lowered for more than 500ms (debouncing flickers)
      cancelTimer = setTimeout(() => {
        setCountdown(null);
      }, 500);
    }

    return () => clearTimeout(cancelTimer);
  }, [poseState.detectedGesture, isCameraActive, hasCaptured, poseState.status]);

  const handleSave = async () => {
    if (!analysisProfile || !capturedImage || !capturedMeasurements) return;
    
    setIsSaving(true);
    try {
      const colorConf = analysisProfile.colorAnalysis.confidence || 0;
      const shapeConf = analysisProfile.shape.confidence || 0;
      const aiScore = (colorConf + shapeConf) / 2 || 90;

      const result = await saveScanHistory({
        capturedImageBase64: capturedImage,
        measurementsJson: { ...capturedMeasurements, metadata: scanMetadata },
        fashionAnalysisJson: {
          shape: analysisProfile.shape,
          proportion: analysisProfile.proportion,
          sizing: analysisProfile.sizing,
        },
        geminiAnalysisJson: analysisProfile.colorAnalysis || {},
        recommendationJson: analysisProfile.recommendation || {},
        matchedProductsJson: matchedProducts || [],
        aiScore: aiScore
      });

      if (result && result.success === false) {
        throw new Error(result.error);
      }

      alert("Analisis berhasil disimpan!");
      resetSession(); // Clear persisted session after successful save
      router.push("/history");
    } catch (error: any) {
      alert("Gagal menyimpan analisis: " + (error?.message || "Terjadi kesalahan yang tidak diketahui."));
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Guard: wait for sessionStorage hydration before rendering ──────
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // ─── PREFERENCE STEP (Step 1 + 2: Style & Occasion) ──────
  if (viewStep === "preference") {
    return (
      <div className="animate-in fade-in-50 duration-500">
        <StylePreferenceSelector
          onComplete={(pref) => {
            setUserStylePreference(pref);
            setViewStep("scan");
          }}
        />
      </div>
    );
  }

  // ─── RESULT SCREEN (After Capture / Restored from session) ────
  if ((hasCaptured || session.viewStep === "result") && capturedImage) {
    return (
      <div className="animate-in fade-in-50 duration-500">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight">
                Analisis Selesai
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Tinjau hasil pengukuran scan tubuh AI dan profil fashion Anda di bawah ini.
              </p>
            </div>
            {/* Restored session indicator — shows when user navigated away and came back */}
            {!hasCaptured && session.viewStep === "result" && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 whitespace-nowrap shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Hasil tersimpan
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Image and Measurements */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-4 shadow-sm">
              <div className="relative w-full aspect-[3/4] max-h-[500px] rounded-[var(--radius-card)] overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={capturedImage}
                  alt="Captured scan"
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || isAnalyzing || !analysisProfile}
                  className="w-full rounded-[var(--radius-button)] h-12 shadow-sm font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Menyimpan..." : "Simpan Analisis"}
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Reset session and go back to preference step for a fresh scan
                      resetSession();
                      setHasCaptured(false);
                    }}
                    className="flex-1 rounded-[var(--radius-button)] h-11 border-border/60"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Scan Baru
                  </Button>
                  <Link href="/history" className="flex-1">
                    <Button variant="secondary" className="w-full rounded-[var(--radius-button)] h-11">
                      Lanjut <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <MeasurementPanel result={capturedMeasurements} />
            </div>
          </div>

          {/* Right Column: AI Analysis */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-card to-muted p-6 sm:p-8 shadow-sm relative overflow-hidden h-full border border-border/60">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-foreground font-heading font-bold text-xl sm:text-2xl mb-6">Profil Fashion AI</h2>
              
              {process.env.NODE_ENV === 'development' && analysisProfile?.shape && (
                <ShapeDebugPanel result={analysisProfile.shape} />
              )}
              
              {isAnalyzing ? (
                <div className="py-24 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                  <div className="font-medium text-foreground">{analysisStep}</div>
                </div>
              ) : analysisProfile ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <BodyShapeCard result={analysisProfile.shape} />
                  <ProportionsCard result={analysisProfile.proportion} />

                  <div className="sm:col-span-2">
                    <AiVisionCard result={analysisProfile.colorAnalysis} />
                  </div>

                  {analysisProfile.recommendation && (
                    <div className="sm:col-span-2">
                      <RecommendationCard 
                        result={analysisProfile.recommendation} 
                        products={matchedProducts} 
                        savedProductIds={savedProductIds}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    </div>
                  )}

                  {analysisProfile.shape && (
                    <div className="sm:col-span-2">
                      <OutfitRecommendationCard 
                        outfits={generateOutfitRecommendations(
                          analysisProfile,
                          userStylePreference.preferredStyles,
                          userStylePreference.preferredOccasion
                        )}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="block lg:hidden">
              <MeasurementPanel result={capturedMeasurements} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── LIVE CAMERA SCREEN ─────────────────────────────────
  return (
    <div className="animate-in fade-in-50 duration-500">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-button)] bg-gradient-to-br from-primary to-[#E14D72] text-primary-foreground shadow-sm">
            <ScanFace className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight">
              Scan Tubuh AI
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Berdirilah secara alami di depan kamera.
            </p>
          </div>
        </div>
        
        {/* Mode Selector */}
        {!isCameraActive && (
          <div className="flex bg-muted/50 p-1 rounded-[var(--radius-button)]">
            <button
              onClick={() => setScanMode("quick")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scanMode === "quick" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="w-4 h-4" /> Quick
            </button>
            <button
              onClick={() => setScanMode("accurate")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scanMode === "accurate" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Target className="w-4 h-4" /> Accurate
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-4 sm:p-6 shadow-sm">
            <div className="relative mb-4">
              <CameraPreview
                ref={cameraRef}
                stream={stream}
                isActive={isCameraActive}
              />
              {poseState.status !== "tracking" && (
                <CameraOverlay isActive={isCameraActive} />
              )}
              {scanMode === "quick" && (
                <HeightBadge 
                  isActive={isCameraActive} 
                  isEstimating={poseState.status === "initializing" || poseState.status === "no-person" || poseState.measurements?.measurements?.estimatedHeight.value === null} 
                  estimatedHeight={poseState.measurements?.measurements?.estimatedHeight.value ? Math.round(poseState.measurements.measurements.estimatedHeight.value) : undefined}
                />
              )}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/20">
                  <span className="text-9xl font-bold text-white drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] animate-pulse">
                    {countdown > 0 ? countdown : ""}
                  </span>
                </div>
              )}
              {countdown === 0 && (
                <div className="absolute inset-0 bg-white z-20 animate-in fade-out duration-700 pointer-events-none" />
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-button)] text-xs font-medium transition-all duration-500 ${
                poseState.status === "tracking"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : poseState.status === "initializing"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : poseState.status === "no-person" || poseState.status === "partial"
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-gray-50 text-gray-500 border border-gray-200"
              }`}>
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${
                    poseState.status === "tracking"
                      ? "bg-emerald-500"
                      : poseState.status === "initializing"
                        ? "bg-blue-500"
                        : poseState.status === "no-person" || poseState.status === "partial"
                          ? "bg-amber-500"
                          : "bg-gray-400"
                  }`} />
                  {poseState.status === "tracking" && (
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
                  )}
                </div>
                {poseState.detectedGesture === "Open_Palm" ? "Gestur Tangan Terdeteksi!" : analysisStep || poseState.statusMessage}
              </div>
              <CameraControls
                isCameraActive={isCameraActive}
                isLoading={isLoading}
                hasCaptured={hasCaptured}
                onStartCamera={startCamera}
                onStopCamera={stopCamera}
                onCapture={captureFrame}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <PoseStatusPanel
            status={poseState.status}
            statusMessage={poseState.statusMessage}
            landmarkCount={poseState.landmarkCount}
            totalLandmarks={poseState.totalLandmarks}
            fps={poseState.fps}
          />
          <MeasurementPanel result={poseState.measurements} />
          
          <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Mode: {scanMode === "accurate" ? "Accurate Scan" : "Quick Scan"}
            </h3>
            {scanMode === "accurate" ? (
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                <li>Gunakan KTP/ATM sebagai referensi ukuran.</li>
                <li>Pegang kartu secara horizontal/vertikal di samping tubuh.</li>
                <li>Pastikan cahaya cukup terang.</li>
                <li>Seluruh tubuh terlihat dari ujung kepala hingga kaki.</li>
              </ul>
            ) : (
              <p className="text-sm text-gray-600">
                Mode ini mengestimasi tinggi badan berdasarkan rasio tubuh rata-rata secara instan tanpa perlu memegang kartu.
              </p>
            )}
          </div>
          
          <ScanTips />
        </div>
      </div>
    </div>
  );
}


