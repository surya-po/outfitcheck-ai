"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SettingsSelectOption {
  label: string;
  value: string;
}

interface SettingsSelectProps {
  storageKey: string;
  label: string;
  options: SettingsSelectOption[];
  defaultValue: string;
}

export function SettingsSelect({ storageKey, label, options, defaultValue }: SettingsSelectProps) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setValue(stored);
    } else {
      localStorage.setItem(storageKey, defaultValue);
    }
  }, [storageKey, defaultValue]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    localStorage.setItem(storageKey, newValue);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-between py-3">
        <label className="text-sm font-medium text-gray-900 opacity-50">{label}</label>
        <div className="w-[180px] h-10 bg-gray-100 rounded-[var(--radius-button)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3">
      <label className="text-sm font-medium text-gray-900">{label}</label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px] rounded-[var(--radius-button)] bg-white border-gray-200">
          <SelectValue placeholder="Pilih opsi..." />
        </SelectTrigger>
        <SelectContent className="rounded-[var(--radius-button)] border-gray-100 shadow-sm">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


