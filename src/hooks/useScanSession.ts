/**
 * useScanSession.ts
 *
 * Persists body scan results in sessionStorage so they survive in-app
 * navigation (e.g. user accidentally goes to Dashboard and comes back).
 *
 * Data is cleared when:
 *  - User clicks "Ulangi" (starts a new scan)
 *  - User clicks "Simpan Analisis" and saves successfully
 *  - The browser tab / session is closed
 *
 * Data is NOT persisted to the database here — that remains the
 * responsibility of the existing saveScanHistory() action.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { FashionAnalysisProfile } from "@/lib/body-analysis-engine/analysis-types";
import { UserStylePreference } from "@/lib/fashion-recommendation-engine/recommendation-types";
import { BodyMeasurementResult } from "@/lib/body-measurements/types";
import { Product } from "@/lib/product-matching-engine/product-types";

const SESSION_KEY = "Fitcheck_scan_session";

interface ScanSession {
  viewStep: "preference" | "scan" | "result";
  capturedImage: string | null;
  capturedMeasurements: BodyMeasurementResult | null;
  analysisProfile: FashionAnalysisProfile | null;
  matchedProducts: Product[];
  scanMetadata: Record<string, unknown>;
  userStylePreference: UserStylePreference;
  scanMode: "quick" | "accurate";
  savedAt: number;
}

const DEFAULT_SESSION: ScanSession = {
  viewStep: "preference",
  capturedImage: null,
  capturedMeasurements: null,
  analysisProfile: null,
  matchedProducts: [],
  scanMetadata: {},
  userStylePreference: { preferredStyles: [], preferredOccasion: undefined },
  scanMode: "quick",
  savedAt: 0,
};

/**
 * Read the current session from sessionStorage.
 * Returns DEFAULT_SESSION if nothing is stored or the stored value is invalid.
 */
function readSession(): ScanSession {
  if (typeof window === "undefined") return DEFAULT_SESSION;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return DEFAULT_SESSION;
    const parsed = JSON.parse(raw) as ScanSession;
    // Only restore if there's actual scan data
    if (!parsed.capturedImage && parsed.viewStep === "result") {
      return DEFAULT_SESSION;
    }
    return parsed;
  } catch {
    return DEFAULT_SESSION;
  }
}

/**
 * Write a partial update to sessionStorage.
 */
function writeSession(update: Partial<ScanSession>) {
  if (typeof window === "undefined") return;
  try {
    const current = readSession();
    const next: ScanSession = { ...current, ...update, savedAt: Date.now() };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    // sessionStorage may be unavailable (private mode quota exceeded etc.)
    console.warn("useScanSession: failed to write to sessionStorage");
  }
}

/**
 * Remove the session entirely.
 */
function clearSession() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* no-op */
  }
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useScanSession() {
  // Initialise from sessionStorage on first render (client only)
  const [session, setSessionState] = useState<ScanSession>(DEFAULT_SESSION);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = readSession();
    setSessionState(stored);
    setIsHydrated(true);
  }, []);

  /**
   * Update one or more fields in the session.
   * Automatically persists to sessionStorage.
   */
  const updateSession = useCallback((update: Partial<ScanSession>) => {
    setSessionState((prev) => {
      const next = { ...prev, ...update, savedAt: Date.now() };
      writeSession(next);
      return next;
    });
  }, []);

  /**
   * Reset the session to default (new scan).
   * Call this when the user wants to start over.
   */
  const resetSession = useCallback(() => {
    clearSession();
    setSessionState(DEFAULT_SESSION);
  }, []);

  return {
    session,
    isHydrated,
    updateSession,
    resetSession,
  };
}
