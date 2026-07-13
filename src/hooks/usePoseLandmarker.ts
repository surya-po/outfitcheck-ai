"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  type PoseLandmarkerResult,
  type NormalizedLandmark,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { BodyMeasurementEngine } from "@/lib/body-measurements/BodyMeasurementEngine";
import { type BodyMeasurementResult } from "@/lib/body-measurements/types";

// ─── Types ──────────────────────────────────────────────────

export interface PoseDetectionState {
  isInitialized: boolean;
  isDetecting: boolean;
  landmarkCount: number;
  totalLandmarks: number;
  fps: number;
  status: "idle" | "initializing" | "tracking" | "no-person" | "partial" | "low-confidence" | "error";
  statusMessage: string;
  result: PoseLandmarkerResult | null;
  measurements: BodyMeasurementResult | null;
}

interface UsePoseLandmarkerOptions {
  videoElement: HTMLVideoElement | null;
  canvasElement: HTMLCanvasElement | null;
  enabled: boolean;
}

// ─── Connection map for skeleton drawing ────────────────────

const POSE_CONNECTIONS: [number, number][] = [
  // Face
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
  // Torso
  [9, 10], [11, 12], [11, 23], [12, 24], [23, 24],
  // Left arm
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  // Right arm
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  // Left leg
  [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
  // Right leg
  [24, 26], [26, 28], [28, 30], [28, 32], [30, 32],
];

// Minimum visibility threshold for a landmark to count as "detected"
const VISIBILITY_THRESHOLD = 0.5;
// Minimum landmarks required to consider "partial body"
const PARTIAL_BODY_THRESHOLD = 15;

// ─── Hook ───────────────────────────────────────────────────

export function usePoseLandmarker({
  videoElement,
  canvasElement,
  enabled,
}: UsePoseLandmarkerOptions): PoseDetectionState {
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);
  const fpsFramesRef = useRef<number[]>([]);
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);

  const [state, setState] = useState<PoseDetectionState>({
    isInitialized: false,
    isDetecting: false,
    landmarkCount: 0,
    totalLandmarks: 33,
    fps: 0,
    status: "idle",
    statusMessage: "Waiting for camera...",
    result: null,
    measurements: null,
  });

  const [measurementEngine] = useState(() => new BodyMeasurementEngine());

  // ─── Initialize PoseLandmarker ──────────────────────────

  const initialize = useCallback(async () => {
    if (landmarkerRef.current) return; // Already initialized

    console.log("[MediaPipe] Starting initialization...");
    setState((prev) => ({
      ...prev,
      status: "initializing",
      statusMessage: "Loading AI model...",
    }));

    try {
      console.log("[MediaPipe] Fetching FilesetResolver...");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      console.log("[MediaPipe] Creating PoseLandmarker...");
      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      landmarkerRef.current = landmarker;
      console.log("[MediaPipe] PoseLandmarker created successfully.");

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        status: "tracking",
        statusMessage: "AI Model loaded. Detecting...",
      }));
    } catch (err) {
      console.error("[MediaPipe] Failed to initialize:", err);
      setState((prev) => ({
        ...prev,
        status: "error",
        statusMessage: "Failed to load AI model.",
      }));
    }
  }, []);

  // ─── Draw skeleton on canvas ────────────────────────────

  const drawSkeleton = useCallback(
    (landmarks: NormalizedLandmark[]) => {
      if (!canvasElement) return;

      const ctx = canvasElement.getContext("2d");
      if (!ctx) return;

      // Initialize DrawingUtils once
      if (!drawingUtilsRef.current) {
        drawingUtilsRef.current = new DrawingUtils(ctx);
      }

      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      ctx.save();

      // Mirror the canvas to match the mirrored video
      ctx.translate(canvasElement.width, 0);
      ctx.scale(-1, 1);

      // Draw connections (skeleton lines)
      for (const [startIdx, endIdx] of POSE_CONNECTIONS) {
        const start = landmarks[startIdx];
        const end = landmarks[endIdx];
        if (
          !start ||
          !end ||
          (start.visibility ?? 0) < VISIBILITY_THRESHOLD ||
          (end.visibility ?? 0) < VISIBILITY_THRESHOLD
        ) {
          continue;
        }

        const x1 = start.x * canvasElement.width;
        const y1 = start.y * canvasElement.height;
        const x2 = end.x * canvasElement.width;
        const y2 = end.y * canvasElement.height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(236, 72, 153, 0.6)";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Draw landmarks (dots)
      for (const landmark of landmarks) {
        if ((landmark.visibility ?? 0) < VISIBILITY_THRESHOLD) continue;

        const x = landmark.x * canvasElement.width;
        const y = landmark.y * canvasElement.height;
        const visibility = landmark.visibility ?? 0;

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(236, 72, 153, ${0.15 * visibility})`;
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(244, 114, 182, ${0.9 * visibility})`;
        ctx.fill();

        // White core
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * visibility})`;
        ctx.fill();
      }

      ctx.restore();
    },
    [canvasElement]
  );

  // ─── Clear canvas ───────────────────────────────────────

  const clearCanvas = useCallback(() => {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
  }, [canvasElement]);

  // ─── Start / Stop detection ─────────────────────────────

  useEffect(() => {
    let isActive = true;

    const detect = () => {
      const landmarker = landmarkerRef.current;
      if (!landmarker || !videoElement || !canvasElement || !isActive) return;

      if (videoElement.readyState < 2) {
        rafIdRef.current = requestAnimationFrame(detect);
        return;
      }

      // Sync canvas size with video safely
      if (
        canvasElement.width !== videoElement.videoWidth ||
        canvasElement.height !== videoElement.videoHeight
      ) {
        canvasElement.setAttribute("width", String(videoElement.videoWidth));
        canvasElement.setAttribute("height", String(videoElement.videoHeight));
      }

      const now = performance.now();

      // Avoid duplicate timestamps (MediaPipe requirement)
      if (now <= lastTimestampRef.current) {
        rafIdRef.current = requestAnimationFrame(detect);
        return;
      }

      // FPS calculation
      fpsFramesRef.current.push(now);
      const oneSecondAgo = now - 1000;
      fpsFramesRef.current = fpsFramesRef.current.filter((t) => t > oneSecondAgo);
      const currentFps = fpsFramesRef.current.length;

      try {
        const result = landmarker.detectForVideo(videoElement, now);
        lastTimestampRef.current = now;

        if (result.landmarks && result.landmarks.length > 0) {
          const landmarks = result.landmarks[0];

          // Count visible landmarks
          const visibleCount = landmarks.filter(
            (l) => (l.visibility ?? 0) >= VISIBILITY_THRESHOLD
          ).length;

          // Calculate average confidence
          const avgConfidence =
            landmarks.reduce((sum, l) => sum + (l.visibility ?? 0), 0) /
            landmarks.length;

          // Determine status
          let status: PoseDetectionState["status"] = "tracking";
          let statusMessage = "Tracking";

          if (visibleCount < PARTIAL_BODY_THRESHOLD) {
            status = "partial";
            statusMessage = "Move backward — full body needed";
          } else if (avgConfidence < 0.4) {
            status = "low-confidence";
            statusMessage = "Improve lighting";
          }

          drawSkeleton(landmarks);

          let measurements: BodyMeasurementResult | null = null;
          if (result.worldLandmarks && result.worldLandmarks.length > 0) {
            measurements = measurementEngine.processFrame(
              landmarks,
              result.worldLandmarks[0]
            );
          }

          setState((prev) => ({
            ...prev,
            isDetecting: true,
            landmarkCount: visibleCount,
            fps: currentFps,
            status,
            statusMessage,
            result,
            measurements,
          }));
        } else {
          clearCanvas();
          measurementEngine.reset();
          setState((prev) => ({
            ...prev,
            isDetecting: true,
            landmarkCount: 0,
            fps: currentFps,
            status: "no-person",
            statusMessage: "No person detected",
            result: null,
            measurements: null,
          }));
        }
      } catch (err) {
        console.error("[MediaPipe] Detection error:", err);
      }

      rafIdRef.current = requestAnimationFrame(detect);
    };

    if (enabled && videoElement && canvasElement) {
      // Initialize if needed, then start loop
      const start = async () => {
        try {
          console.log("[MediaPipe Hook] Checking initialization state...");
          if (!landmarkerRef.current) {
            await initialize();
          }
          // Small delay to let video element become ready
          if (isActive) {
            setTimeout(() => {
              console.log("[MediaPipe Hook] Starting detection loop...");
              if (isActive) rafIdRef.current = requestAnimationFrame(detect);
            }, 300);
          }
        } catch (err) {
          console.error("[MediaPipe Hook] Failed during start:", err);
        }
      };
      start();
    } else {
      // Stop detection
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      clearCanvas();
      
      // Update state if we disabled it. Do it in a timeout to avoid synchronous setState in effect
      if (!enabled) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isDetecting: false,
            landmarkCount: 0,
            fps: 0,
            status: "idle",
            statusMessage: "Waiting for camera...",
            result: null,
            measurements: null,
          }));
        }, 0);
      }
    }

    return () => {
      isActive = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };
  }, [enabled, videoElement, canvasElement, initialize, drawSkeleton, clearCanvas, measurementEngine]);

  // ─── Cleanup PoseLandmarker on unmount ──────────────────

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
    };
  }, []);

  return state;
}

