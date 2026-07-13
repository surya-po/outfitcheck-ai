"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

export interface CameraPreviewHandle {
  getVideoElement: () => HTMLVideoElement | null;
  getCanvasElement: () => HTMLCanvasElement | null;
  captureFrame: () => string | null;
}

interface CameraPreviewProps {
  stream: MediaStream | null;
  isActive: boolean;
}

export const CameraPreview = forwardRef<CameraPreviewHandle, CameraPreviewProps>(
  function CameraPreview({ stream, isActive }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getVideoElement: () => videoRef.current,
      getCanvasElement: () => canvasRef.current,
      captureFrame: () => {
        const video = videoRef.current;
        if (!video || !isActive) return null;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        ctx.drawImage(video, 0, 0);
        
        const skeletonCanvas = canvasRef.current;
        if (skeletonCanvas) {
          ctx.drawImage(skeletonCanvas, 0, 0);
        }

        return canvas.toDataURL("image/jpeg", 0.85);
      },
    }));

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      if (stream) {
        video.srcObject = stream;
        video.play().catch((err) => {
          console.error("[CameraPreview] Failed to play video:", err);
        });
      } else {
        video.srcObject = null;
      }
    }, [stream]);

    return (
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] max-h-[520px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Skeleton overlay canvas — drawn by usePoseLandmarker */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none z-[6] transition-opacity duration-700 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Placeholder when camera is off */}
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 animate-in fade-in-50 duration-700">
            {/* Stylized person silhouette */}
            <svg
              viewBox="0 0 120 200"
              className="w-20 h-32 opacity-20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head */}
              <circle cx="60" cy="28" r="18" stroke="#EC4899" strokeWidth="2" />
              {/* Body */}
              <line x1="60" y1="46" x2="60" y2="110" stroke="#EC4899" strokeWidth="2" />
              {/* Arms */}
              <line x1="60" y1="65" x2="25" y2="95" stroke="#EC4899" strokeWidth="2" />
              <line x1="60" y1="65" x2="95" y2="95" stroke="#EC4899" strokeWidth="2" />
              {/* Legs */}
              <line x1="60" y1="110" x2="35" y2="175" stroke="#EC4899" strokeWidth="2" />
              <line x1="60" y1="110" x2="85" y2="175" stroke="#EC4899" strokeWidth="2" />
            </svg>
            <div className="text-center">
              <p className="text-white/40 text-sm font-medium">
                Camera Preview
              </p>
              <p className="text-white/25 text-xs mt-1">
                Press &quot;Start Camera&quot; to begin
              </p>
            </div>
          </div>
        )}

        {/* Scanning effect when active */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none z-[5]">
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#EC4899]/40 to-transparent animate-scan-line" />
          </div>
        )}
      </div>
    );
  }
);
