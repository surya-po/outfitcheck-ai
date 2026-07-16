"use client";

import { Radio, CheckCircle2, AlertCircle } from "lucide-react";

type ScanStatusType = "waiting" | "ready" | "error";

interface ScanStatusProps {
  status: ScanStatusType;
}

const statusConfig: Record<ScanStatusType, {
  label: string;
  icon: typeof Radio;
  bgColor: string;
  textColor: string;
  dotColor: string;
  borderColor: string;
}> = {
  waiting: {
    label: "Waiting for camera...",
    icon: Radio,
    bgColor: "bg-gray-50",
    textColor: "text-gray-500",
    dotColor: "bg-gray-400",
    borderColor: "border-gray-200",
  },
  ready: {
    label: "Camera Ready",
    icon: CheckCircle2,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    dotColor: "bg-emerald-500",
    borderColor: "border-emerald-200",
  },
  error: {
    label: "Camera Error",
    icon: AlertCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    dotColor: "bg-red-500",
    borderColor: "border-red-200",
  },
};

export function ScanStatus({ status }: ScanStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-button)] border transition-all duration-500 ${config.bgColor} ${config.borderColor}`}>
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
        {status === "ready" && (
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
        )}
      </div>
      <Icon className={`w-4 h-4 ${config.textColor}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}


