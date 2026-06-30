"use client";

import { Activity, Eye, Gauge, AlertTriangle, CheckCircle2, XCircle, Loader2, Radio } from "lucide-react";

interface PoseStatusPanelProps {
  status: "idle" | "initializing" | "tracking" | "no-person" | "partial" | "low-confidence" | "error";
  statusMessage: string;
  landmarkCount: number;
  totalLandmarks: number;
  fps: number;
}

const statusIcons: Record<PoseStatusPanelProps["status"], typeof Activity> = {
  idle: Radio,
  initializing: Loader2,
  tracking: CheckCircle2,
  "no-person": XCircle,
  partial: AlertTriangle,
  "low-confidence": AlertTriangle,
  error: XCircle,
};

const statusColors: Record<PoseStatusPanelProps["status"], {
  bg: string;
  border: string;
  text: string;
  dot: string;
  iconBg: string;
}> = {
  idle: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-500",
    dot: "bg-gray-400",
    iconBg: "bg-gray-100",
  },
  initializing: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
    dot: "bg-blue-500",
    iconBg: "bg-blue-100",
  },
  tracking: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    iconBg: "bg-emerald-100",
  },
  "no-person": {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    dot: "bg-amber-500",
    iconBg: "bg-amber-100",
  },
  partial: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    dot: "bg-orange-500",
    iconBg: "bg-orange-100",
  },
  "low-confidence": {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-600",
    dot: "bg-yellow-500",
    iconBg: "bg-yellow-100",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    dot: "bg-red-500",
    iconBg: "bg-red-100",
  },
};

export function PoseStatusPanel({
  status,
  statusMessage,
  landmarkCount,
  totalLandmarks,
  fps,
}: PoseStatusPanelProps) {
  const colors = statusColors[status];
  const Icon = statusIcons[status];
  const isActive = status === "tracking" || status === "partial" || status === "low-confidence" || status === "no-person";

  return (
    <div className="rounded-2xl border border-[#FDF2F8] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#EC4899]">
          <Activity className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold text-[#1E1E2D]">
          Deteksi Pose
        </h3>
      </div>

      {/* Status indicator */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-4 transition-all duration-500 ${colors.bg} ${colors.border}`}>
        <div className="relative">
          <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
          {status === "tracking" && (
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
          )}
          {status === "initializing" && (
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-75" />
          )}
        </div>
        <div className={`p-1 rounded-md ${colors.iconBg}`}>
          <Icon className={`w-3.5 h-3.5 ${colors.text} ${status === "initializing" ? "animate-spin" : ""}`} />
        </div>
        <span className={`text-sm font-medium ${colors.text}`}>
          {statusMessage}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Landmarks */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#FFFAFC] border border-[#FDF2F8]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FDF2F8] text-[#EC4899]">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Titik Pose
            </p>
            <p className={`text-sm font-bold ${isActive ? "text-[#1E1E2D]" : "text-gray-400"}`}>
              {isActive ? `${landmarkCount} / ${totalLandmarks}` : "-- / --"}
            </p>
          </div>
        </div>

        {/* FPS */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#FFFAFC] border border-[#FDF2F8]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FDF2F8] text-[#EC4899]">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              FPS
            </p>
            <p className={`text-sm font-bold ${
              isActive
                ? fps >= 24
                  ? "text-emerald-600"
                  : fps >= 15
                    ? "text-amber-600"
                    : "text-red-600"
                : "text-gray-400"
            }`}>
              {isActive ? fps : "--"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
