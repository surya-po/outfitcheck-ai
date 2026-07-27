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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
      {!isCameraActive ? (
        <button
          onClick={onStartCamera}
          disabled={isLoading}
          className="flex justify-center items-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#EC4899] to-[#F472B6] text-white text-sm font-semibold shadow-md shadow-[#EC4899]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#EC4899]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
          {isLoading ? "Memulai..." : "Mulai Kamera"}
        </button>
      ) : (
        <>
          <button
            onClick={onStopCamera}
            className="flex justify-center items-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CameraOff className="w-5 h-5" />
            Matikan Kamera
          </button>
          <button
            onClick={onCapture}
            className={`flex justify-center items-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              hasCaptured
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-[#EC4899] to-[#F472B6] text-white shadow-[#EC4899]/20'
            }`}
          >
            <Aperture className="w-5 h-5" />
            {hasCaptured ? "Ulangi Scan" : "Ambil Gambar"}
          </button>
        </>
      )}
    </div>
  );
}


