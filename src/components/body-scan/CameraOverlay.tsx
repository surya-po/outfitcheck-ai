"use client";

interface CameraOverlayProps {
  isActive: boolean;
}

export function CameraOverlay({ isActive }: CameraOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <svg
        viewBox="0 0 300 500"
        className={`w-full h-full max-w-[280px] max-h-[460px] transition-opacity duration-700 ${
          isActive ? 'opacity-100' : 'opacity-40'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle
          cx="150"
          cy="60"
          r="30"
          stroke="#EC4899"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeOpacity="0.6"
          className={isActive ? 'animate-pulse' : ''}
        />
        
        {/* Neck */}
        <line x1="150" y1="90" x2="150" y2="110" stroke="#EC4899" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.4" />
        
        {/* Shoulders */}
        <line x1="85" y1="115" x2="215" y2="115" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.6" />
        
        {/* Left arm */}
        <line x1="85" y1="115" x2="65" y2="240" stroke="#EC4899" strokeWidth="1" strokeDasharray="6 4" strokeOpacity="0.35" />
        
        {/* Right arm */}
        <line x1="215" y1="115" x2="235" y2="240" stroke="#EC4899" strokeWidth="1" strokeDasharray="6 4" strokeOpacity="0.35" />

        {/* Torso - left */}
        <line x1="95" y1="115" x2="100" y2="260" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.5" />
        
        {/* Torso - right */}
        <line x1="205" y1="115" x2="200" y2="260" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.5" />

        {/* Waist line */}
        <line x1="100" y1="220" x2="200" y2="220" stroke="#EC4899" strokeWidth="1" strokeDasharray="5 3" strokeOpacity="0.4" />

        {/* Hip line */}
        <line x1="95" y1="265" x2="205" y2="265" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.5" />

        {/* Left leg */}
        <line x1="110" y1="265" x2="105" y2="430" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.45" />
        
        {/* Right leg */}
        <line x1="190" y1="265" x2="195" y2="430" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.45" />

        {/* Left knee marker */}
        <circle cx="107" cy="345" r="4" stroke="#EC4899" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.3" />
        
        {/* Right knee marker */}
        <circle cx="193" cy="345" r="4" stroke="#EC4899" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.3" />
        
        {/* Ground line */}
        <line x1="70" y1="440" x2="230" y2="440" stroke="#EC4899" strokeWidth="1" strokeDasharray="8 4" strokeOpacity="0.3" />

        {/* Corner brackets - top-left */}
        <path d="M 30 30 L 30 60 M 30 30 L 60 30" stroke="#EC4899" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Corner brackets - top-right */}
        <path d="M 270 30 L 270 60 M 270 30 L 240 30" stroke="#EC4899" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Corner brackets - bottom-left */}
        <path d="M 30 470 L 30 440 M 30 470 L 60 470" stroke="#EC4899" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Corner brackets - bottom-right */}
        <path d="M 270 470 L 270 440 M 270 470 L 240 470" stroke="#EC4899" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
