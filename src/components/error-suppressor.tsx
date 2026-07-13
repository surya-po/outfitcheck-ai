"use client";

if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return; // Ignore this specific Next.js 15 / React 19 next-themes warning
    }
    originalError.apply(console, args);
  };
}

export function ErrorSuppressor() {
  return null;
}
