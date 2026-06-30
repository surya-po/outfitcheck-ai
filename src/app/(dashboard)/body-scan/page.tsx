"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ScanFace, RefreshCcw, Save, ArrowRight } from "lucide-react";
import { CameraPreview, type CameraPreviewHandle } from "@/components/body-scan/CameraPreview";
import { CameraOverlay } from "@/components/body-scan/CameraOverlay";
import { HeightBadge } from "@/components/body-scan/HeightBadge";
import { ScanTips } from "@/components/body-scan/ScanTips";
import { CameraControls } from "@/components/body-scan/CameraControls";
import { PoseStatusPanel } from "@/components/body-scan/PoseStatusPanel";
import { MeasurementPanel } from "@/components/body-scan/MeasurementPanel";
import { usePoseLandmarker } from "@/hooks/usePoseLandmarker";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BodyMeasurementResult } from "@/lib/body-measurements/types";

// New Fashion Analysis Engine imports
import { FashionAnalysisProfile } from "@/lib/body-analysis-engine/analysis-types";
import { fashionAnalysisService } from "@/lib/body-analysis-engine/analysis-service";
import { BodyShapeCard } from "@/components/body-scan/analysis-cards/BodyShapeCard";
import { ProportionsCard } from "@/components/body-scan/analysis-cards/ProportionsCard";
import { SizingCard } from "@/components/body-scan/analysis-cards/SizingCard";
import { AiVisionCard } from "@/components/body-scan/analysis-cards/AiVisionCard";
import { RecommendationCard } from "@/components/body-scan/analysis-cards/RecommendationCard";

export default function BodyScanPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Capture States
  const [hasCaptured, setHasCaptured] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedMeasurements, setCapturedMeasurements] = useState<BodyMeasurementResult | null>(null);

  // Analysis Engine States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProfile, setAnalysisProfile] = useState<FashionAnalysisProfile | null>(null);

  // Video / canvas element refs for MediaPipe
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);

  // Ref for stream to help with cleanup without adding it to dependency arrays
  const streamCleanupRef = useRef<MediaStream | null>(null);
  const cameraRef = useRef<CameraPreviewHandle>(null);

  // ─── MediaPipe Pose Detection ───────────────────────────
  const poseState = usePoseLandmarker({
    videoElement,
    canvasElement,
    enabled: isCameraActive && !hasCaptured, // Pause AI tracking when captured
  });

  // Track the absolute latest measurements in a ref so captureFrame doesn't trigger endless re-renders
  const latestMeasurementsRef = useRef<BodyMeasurementResult | null>(null);
  useEffect(() => {
    latestMeasurementsRef.current = poseState.measurements;
  }, [poseState.measurements]);

  // Sync video/canvas refs from CameraPreview after mount
  useEffect(() => {
    if (isCameraActive && cameraRef.current) {
      // Small delay to let the video element attach the stream
      const timer = setTimeout(() => {
        setVideoElement(cameraRef.current?.getVideoElement() ?? null);
        setCanvasElement(cameraRef.current?.getCanvasElement() ?? null);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setVideoElement(null);
      setCanvasElement(null);
    }
  }, [isCameraActive]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamCleanupRef.current) {
        streamCleanupRef.current.getTracks().forEach((track) => track.stop());
        streamCleanupRef.current = null;
      }
    };
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 1280 },
        },
        audio: false,
      });
      setStream(mediaStream);
      streamCleanupRef.current = mediaStream;
      setIsCameraActive(true);
      setHasCaptured(false);
      setCapturedImage(null);
      setCapturedMeasurements(null);
      setAnalysisProfile(null);
    } catch {
      // Ignore or log error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamCleanupRef.current) {
      streamCleanupRef.current.getTracks().forEach((track) => track.stop());
      streamCleanupRef.current = null;
    }
    setStream(null);
    setIsCameraActive(false);
  }, []);

  const captureFrame = useCallback(() => {
    const frameData = cameraRef.current?.captureFrame();
    if (frameData) {
      setCapturedImage(frameData);
      // Freeze the latest measurements
      setCapturedMeasurements(latestMeasurementsRef.current);
      setHasCaptured(true);
      
      // Trigger Analysis Workflow
      setIsAnalyzing(true);
      const meas = latestMeasurementsRef.current;
      if (meas) {
        fashionAnalysisService
          .analyze(meas, frameData)
          .then((profile) => {
            setAnalysisProfile(profile);
          })
          .finally(() => {
            setIsAnalyzing(false);
          });
      } else {
        setIsAnalyzing(false);
      }
      
      // Stop the camera to save resources once we freeze the frame
      stopCamera();
    }
  }, [stopCamera]);



  // ─── RESULT SCREEN (After Capture) ──────────────────────
  if (hasCaptured && capturedImage) {
    return (
      <div className="animate-in fade-in-50 duration-500">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E2D] tracking-tight">
            Analisis Selesai
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tinjau hasil pengukuran scan tubuh AI dan profil fashion Anda di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-[#FDF2F8] bg-white p-4 sm:p-5 shadow-sm">
              <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] max-h-[600px] rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capturedImage}
                  alt="Captured scan"
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={startCamera} className="flex-1 rounded-xl h-12">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Ulangi Scan
                </Button>
                <Button onClick={() => {
                  alert("Analisis disimpan! (Integrasi database menyusul)");
                }} className="flex-1 bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl h-12">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Hasil Analisis
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button variant="secondary" className="w-full rounded-xl h-12">
                    Lanjut <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Analysis Cards Container */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E1E2D] to-gray-900 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-white font-bold text-xl mb-4">Profil Fashion AI</h2>
              
              {isAnalyzing ? (
                <div className="py-12 text-center text-white/50 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EC4899] mb-4"></div>
                  Sedang menganalisis profil fashion Anda...
                </div>
              ) : analysisProfile ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <BodyShapeCard result={analysisProfile.shape} />
                  <ProportionsCard result={analysisProfile.proportion} />
                  <SizingCard result={analysisProfile.sizing} />
                  
                  {/* The AI Vision card takes up full width below the others on sm screens */}
                  <div className="sm:col-span-2">
                    <AiVisionCard result={analysisProfile.colorAnalysis} />
                  </div>

                  {/* Fashion Recommendation Card */}
                  {analysisProfile.recommendation && (
                    <div className="sm:col-span-2 mt-4">
                      <RecommendationCard result={analysisProfile.recommendation} />
                    </div>
                  )}
                </div>
              ) : null}
            </div>

          </div>
          
          <div className="space-y-4">
            <MeasurementPanel result={capturedMeasurements} />
          </div>
        </div>
      </div>
    );
  }

  // ─── LIVE CAMERA SCREEN ─────────────────────────────────
  return (
    <div className="animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white shadow-md shadow-[#EC4899]/20">
            <ScanFace className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E2D] tracking-tight">
              Scan Tubuh AI
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Berdirilah secara alami di depan kamera untuk hasil analisis tubuh yang paling akurat.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Camera Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Camera Card */}
          <div className="rounded-2xl border border-[#FDF2F8] bg-white p-4 sm:p-5 shadow-sm">
            {/* Camera Preview with Overlays */}
            <div className="relative mb-4">
              <CameraPreview
                ref={cameraRef}
                stream={stream}
                isActive={isCameraActive}
              />
              {/* Only show guide overlay when no pose detected yet */}
              {poseState.status !== "tracking" && (
                <CameraOverlay isActive={isCameraActive} />
              )}
              <HeightBadge 
                isActive={isCameraActive} 
                isEstimating={poseState.status === "initializing" || poseState.status === "no-person" || poseState.measurements?.measurements?.estimatedHeight.value === null} 
                estimatedHeight={poseState.measurements?.measurements?.estimatedHeight.value ? Math.round(poseState.measurements.measurements.estimatedHeight.value) : undefined}
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Compact inline status */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-500 ${
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
                {poseState.statusMessage}
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

        {/* Right Column - Status + Tips */}
        <div className="space-y-4">
          {/* Pose Detection Status Panel */}
          <PoseStatusPanel
            status={poseState.status}
            statusMessage={poseState.statusMessage}
            landmarkCount={poseState.landmarkCount}
            totalLandmarks={poseState.totalLandmarks}
            fps={poseState.fps}
          />

          {/* Measurements Panel */}
          <MeasurementPanel result={poseState.measurements} />

          {/* Scan Tips */}
          <ScanTips />
        </div>
      </div>
    </div>
  );
}
