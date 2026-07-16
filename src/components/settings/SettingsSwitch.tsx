"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

interface SettingsSwitchProps {
  storageKey: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}

export function SettingsSwitch({ storageKey, label, description, defaultChecked = false }: SettingsSwitchProps) {
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setChecked(stored === "true");
    } else {
      // Initialize if not present
      localStorage.setItem(storageKey, String(defaultChecked));
    }
  }, [storageKey, defaultChecked]);

  const handleCheckedChange = (newChecked: boolean) => {
    setChecked(newChecked);
    localStorage.setItem(storageKey, String(newChecked));
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-between py-3">
        <div className="space-y-0.5 mr-4 opacity-50">
          <label className="text-sm font-medium text-gray-900">{label}</label>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        <div className="w-11 h-6 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5 mr-4">
        <label className="text-sm font-medium text-gray-900 cursor-pointer" onClick={() => handleCheckedChange(!checked)}>
          {label}
        </label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <Switch 
        checked={checked}
        onCheckedChange={handleCheckedChange}
        className="data-[state=checked]:bg-[#EC4899]"
      />
    </div>
  );
}


