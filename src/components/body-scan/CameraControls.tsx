"use client";

import { Camera, CameraOff, Aperture, Loader2 } from "lucide-react";

interface CameraControlsProps {
  isCameraActive: boolean;
  isLoading: boolean;
  hasCaptured: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapture: () => void;
}

export function CameraControls({
  isCameraActive,
  isLoading,
  hasCaptured,
  onStartCamera,
  onStopCamera,
  onCapture,
}: CameraControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {!isCameraActive ? (
        <button
          onClick={onStartCamera}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#F472B6] text-white text-sm font-semibold shadow-lg shadow-[#EC4899]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#EC4899]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {isLoading ? "Memulai..." : "Mulai Kamera"}
        </button>
      ) : (
        <>
          <button
            onClick={onStopCamera}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold transition-all duration-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CameraOff className="w-4 h-4" />
            Matikan Kamera
          </button>
          <button
            onClick={onCapture}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              hasCaptured
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-gradient-to-r from-[#EC4899] to-[#F472B6] text-white shadow-lg shadow-[#EC4899]/20'
            }`}
          >
            <Aperture className="w-4 h-4" />
            {hasCaptured ? "Ulangi Scan" : "Ambil Gambar"}
          </button>
        </>
      )}
    </div>
  );
}
