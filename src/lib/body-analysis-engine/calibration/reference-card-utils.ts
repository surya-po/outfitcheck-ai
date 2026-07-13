/**
 * Utility to lazy load OpenCV.js so it doesn't bloat the main application bundle.
 * It injects the script tag into the document head and returns a promise.
 */
export function loadOpenCV(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If it's already loaded or loading
    if ((window as any).cv && (window as any).cv.Mat) {
      resolve();
      return;
    }

    const scriptId = 'opencv-js-script';
    if (document.getElementById(scriptId)) {
      // It's in the DOM but might not be fully loaded, wait for the global event
      const checkInterval = setInterval(() => {
        if ((window as any).cv && (window as any).cv.Mat) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
    
    script.onload = () => {
      // opencv.js is loaded, but WASM might still be initializing.
      // We check if cv.Mat is available.
      const checkInterval = setInterval(() => {
        if ((window as any).cv && (window as any).cv.Mat) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    };

    script.onerror = () => {
      reject(new Error('Failed to load OpenCV.js from CDN'));
    };

    document.head.appendChild(script);
  });
}
