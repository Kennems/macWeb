
import React from 'react';
import Squircle from './OS/Squircle';

// Global Definitions for Shadows and Clip Paths to be rendered once in App.tsx
export const IconDefs = () => (
  <svg width="0" height="0" className="absolute pointer-events-none">
    <defs>
      {/* Apple Squircle Path (Normalized) - Continuous Curvature */}
      <clipPath id="squircle-clip" clipPathUnits="objectBoundingBox">
          <path d="M 0.5,0 C 0.89,0 0.96,0.04 0.985,0.15 C 1,0.22 1,0.35 1,0.5 C 1,0.65 1,0.78 0.985,0.85 C 0.96,0.96 0.89,1 0.5,1 C 0.11,1 0.04,0.96 0.015,0.85 C 0,0.78 0,0.65 0,0.5 C 0,0.35 0,0.22 0.015,0.15 C 0.04,0.04 0.11,0 0.5,0 Z" />
      </clipPath>

      {/* Inner Shadow for Bezel Depth */}
      <filter id="iconInnerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feComponentTransfer in="SourceAlpha">
              <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="2" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feFlood floodColor="rgba(0, 0, 0, 0.15)" result="color" />
          <feComposite in2="offsetblur" operator="in" />
          <feComposite in2="SourceAlpha" operator="in" />
          <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode />
          </feMerge>
      </filter>

      {/* Soft Drop Shadow for Internal Elements */}
      <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feFlood floodColor="rgba(0,0,0,0.2)" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
          </feMerge>
      </filter>
      
      {/* Deep Shadow for VSCode/complex shapes */}
      <filter id="deepShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
          <feOffset dx="0" dy="3" result="offsetblur" />
          <feFlood floodColor="rgba(0,0,0,0.3)" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
          </feMerge>
      </filter>

      {/* Metal Gradient for Settings */}
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EBEBEB" />
          <stop offset="100%" stopColor="#8A8A8A" />
      </linearGradient>
    </defs>
  </svg>
);

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <Squircle className={className || "w-full h-full drop-shadow-2xl"}>
        {children}
    </Squircle>
);

export const FinderIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <linearGradient id="finderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00D7FA" />
            <stop offset="100%" stopColor="#00A0F5" />
        </linearGradient>
        <rect width="100" height="100" fill="url(#finderGrad)" />
        
        {/* The Face */}
        <g transform="translate(50,50)">
             {/* Split Line Shadow */}
             <path d="M 0 -44 L 0 44" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />

             {/* Left Face */}
             <path d="M -1 -42 C -25 -42 -42 -25 -42 0 L -42 4 C -42 29 -25 42 -1 42 L -1 -42 Z" fill="#ffffff" opacity="0.25" />
             
             {/* Smile */}
             <path d="M -26 12 Q 0 38 26 12" fill="none" stroke="#082b4d" strokeWidth="5" strokeLinecap="round" />
             
             {/* Eyes */}
             <circle cx="-18" cy="-8" r="5.5" fill="#082b4d" />
             <circle cx="18" cy="-8" r="5.5" fill="#082b4d" />
        </g>
    </svg>
  </IconWrapper>
);

export const SafariIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="#ffffff" />
        
        <radialGradient id="safariGrad" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="#1c7ef3" />
            <stop offset="100%" stopColor="#156ad0" />
        </radialGradient>
        
        {/* Blue Background */}
        <circle cx="50" cy="50" r="45" fill="url(#safariGrad)" />
        
        {/* Small Ticks (Minutes) */}
        <g stroke="white" strokeWidth="0.5" opacity="0.6">
            {[...Array(60)].map((_, i) => (
                <line key={`min-${i}`} x1="50" y1="8" x2="50" y2="10" transform={`rotate(${i * 6} 50 50)`} />
            ))}
        </g>

        {/* Large Ticks (Hours) */}
        <g stroke="white" strokeWidth="1.5" opacity="0.9">
            {[...Array(12)].map((_, i) => (
                <line key={`hour-${i}`} x1="50" y1="8" x2="50" y2="13" transform={`rotate(${i * 30} 50 50)`} />
            ))}
        </g>
        
        {/* Needle */}
        <g transform="rotate(45 50 50)" filter="url(#dropShadow)">
            <path d="M 50 10 L 55 50 L 50 50 L 45 50 Z" fill="#ea4335" /> {/* Red Tip */}
            <path d="M 50 90 L 55 50 L 50 50 L 45 50 Z" fill="#ffffff" /> {/* White Tail */}
            <circle cx="50" cy="50" r="3" fill="#C0C0C0" />
        </g>
    </svg>
  </IconWrapper>
);

export const PhotosIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="white" />
        <rect width="100" height="100" fill="url(#grid)" />
        
        <g transform="translate(50,50)">
            {[
                { c: '#ffac33', r: 0 }, { c: '#ffba0d', r: 45 }, 
                { c: '#54ba36', r: 90 }, { c: '#00a653', r: 135 },
                { c: '#0088cc', r: 180 }, { c: '#50489f', r: 225 },
                { c: '#c45096', r: 270 }, { c: '#e94335', r: 315 }
            ].map((petal, i) => (
                 <path 
                    key={i} 
                    d="M 0 0 C 6 -18 18 -18 24 0 C 18 18 6 18 0 0" 
                    fill={petal.c} 
                    transform={`rotate(${petal.r}) translate(0, -28)`} 
                    style={{mixBlendMode: 'multiply'}} 
                    opacity="0.95"
                 />
            ))}
        </g>
    </svg>
  </IconWrapper>
);

export const CalculatorIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="#333333" />
        {/* Inner Bezel */}
        <rect x="2" y="2" width="96" height="96" rx="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        <g transform="translate(13, 16) scale(0.75)">
            <rect x="0" y="0" width="100" height="30" rx="4" fill="#1a1a1a" />
            <text x="90" y="22" fill="white" textAnchor="end" fontSize="18" fontFamily="monospace" fontWeight="bold">0</text>
            
            <g transform="translate(0, 40)">
                <g fill="#5e5e5e"><rect x="0" y="0" width="22" height="22" rx="11" /><rect x="26" y="0" width="22" height="22" rx="11" /><rect x="52" y="0" width="22" height="22" rx="11" /></g>
                <rect x="78" y="0" width="22" height="22" rx="11" fill="#ff9f0a" />

                <g fill="#7d7d7d"><rect x="0" y="26" width="22" height="22" rx="11" /><rect x="26" y="26" width="22" height="22" rx="11" /><rect x="52" y="26" width="22" height="22" rx="11" /></g>
                <rect x="78" y="26" width="22" height="22" rx="11" fill="#ff9f0a" />

                <g fill="#7d7d7d"><rect x="0" y="52" width="48" height="22" rx="11" /><rect x="52" y="52" width="22" height="22" rx="11" /></g>
                <rect x="78" y="52" width="22" height="22" rx="11" fill="#ff9f0a" />
            </g>
        </g>
    </svg>
  </IconWrapper>
);

export const NotesIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="white" />
        <rect width="100" height="28" fill="#fdd754" />
        <rect y="28" width="100" height="1" fill="#dcb635" opacity="0.5" />
        
        {/* Lines */}
        <g fill="#e6e6e6">
             {[...Array(5)].map((_, i) => (
                 <rect key={i} x="0" y={45 + (i * 12)} width="100" height="1" />
             ))}
        </g>

        {/* Text Simulation */}
        <g opacity="0.5" fill="#999">
           <rect x="12" y="42" width="30" height="3" rx="1" />
           <rect x="12" y="54" width="76" height="3" rx="1" />
           <rect x="12" y="66" width="60" height="3" rx="1" />
           <rect x="12" y="78" width="50" height="3" rx="1" />
        </g>
    </svg>
  </IconWrapper>
);

export const TerminalIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <linearGradient id="termBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#444" />
            <stop offset="1" stopColor="#222" />
        </linearGradient>
        <rect width="100" height="100" fill="url(#termBody)" />
        
        {/* Top Bar */}
        <path d="M 0 24 L 100 24" stroke="black" strokeOpacity="0.3" strokeWidth="1" />
        <rect x="0" y="0" width="100" height="24" fill="white" opacity="0.05" />

        {/* Controls */}
        <circle cx="14" cy="12" r="3" fill="#ff5f57" />
        <circle cx="26" cy="12" r="3" fill="#febc2e" />
        <circle cx="38" cy="12" r="3" fill="#28c840" />

        {/* Prompt */}
        <text x="10" y="65" fill="white" fontFamily="monospace" fontSize="32" fontWeight="bold" filter="url(#deepShadow)">{`>_`}</text>
        
        {/* Glossy Edge */}
        <rect x="0.5" y="0.5" width="99" height="99" rx="22" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
    </svg>
  </IconWrapper>
);

export const VSCodeIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="white" />
        <g transform="scale(0.7) translate(22,22)" filter="url(#deepShadow)">
             {/* Right Blue */}
            <path d="M 70 15 L 100 90 L 70 70 L 70 15 Z" fill="#007ACC" />
             {/* Left Blue */}
            <path d="M 70 15 L 20 40 L 30 50 L 70 70 L 70 15 Z" fill="#0065A9" />
             {/* Arrow Head */}
            <path d="M 20 40 L 5 50 L 20 60 L 30 50 L 20 40 Z" fill="#3FA4D7" />
             {/* Bottom Fold */}
            <path d="M 20 60 L 70 85 L 70 70 L 30 50 L 20 60 Z" fill="#007ACC" />
        </g>
    </svg>
  </IconWrapper>
);

export const GeminiIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="white" />
        <defs>
            <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4285f4" />
                <stop offset="50%" stopColor="#9b72cb" />
                <stop offset="100%" stopColor="#d96570" />
            </linearGradient>
        </defs>
        <path transform="scale(0.65) translate(26,26)" d="M 50 5 C 50 5 60 40 95 50 C 60 60 50 95 50 95 C 50 95 40 60 5 50 C 40 40 50 5 50 5 Z" fill="url(#geminiGradient)" filter="url(#deepShadow)" />
    </svg>
  </IconWrapper>
);

export const SettingsIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="url(#metalGrad)" />
        
        {/* Gear Shape */}
        <g transform="translate(50,50)" filter="url(#deepShadow)">
            <g fill="#B0B0B0" stroke="#777" strokeWidth="0.5">
                {[...Array(8)].map((_, i) => (
                    <path key={i} d="M -8 -48 L 8 -48 L 6 -34 L -6 -34 Z" transform={`rotate(${i * 45})`} />
                ))}
            </g>
            <circle cx="0" cy="0" r="34" fill="#BFBFBF" stroke="#888" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="20" fill="#555" stroke="#333" strokeWidth="1" />
            <circle cx="0" cy="0" r="8" fill="#222" />
        </g>
    </svg>
  </IconWrapper>
);

export const LaunchpadIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <linearGradient id="lpBg" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0" stopColor="#555" />
             <stop offset="1" stopColor="#333" />
        </linearGradient>
        <rect width="100" height="100" fill="url(#lpBg)" />
        
        <g transform="translate(16,16)">
            <rect x="0" y="0" width="16" height="16" rx="4" fill="#ff5f57" filter="url(#dropShadow)" />
            <rect x="26" y="0" width="16" height="16" rx="4" fill="#febc2e" filter="url(#dropShadow)" />
            <rect x="52" y="0" width="16" height="16" rx="4" fill="#28c840" filter="url(#dropShadow)" />
            
            <rect x="0" y="26" width="16" height="16" rx="4" fill="#48c9b0" filter="url(#dropShadow)" />
            <rect x="26" y="26" width="16" height="16" rx="4" fill="#a569bd" filter="url(#dropShadow)" />
            <rect x="52" y="26" width="16" height="16" rx="4" fill="#5dade2" filter="url(#dropShadow)" />
            
            <rect x="0" y="52" width="16" height="16" rx="4" fill="#f4d03f" filter="url(#dropShadow)" />
            <rect x="26" y="52" width="16" height="16" rx="4" fill="#eb984e" filter="url(#dropShadow)" />
            <rect x="52" y="52" width="16" height="16" rx="4" fill="#ec7063" filter="url(#dropShadow)" />
        </g>
    </svg>
  </IconWrapper>
);

export const TyporaIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 100 100" className="w-full h-full">
         <rect width="100" height="100" fill="#F8F8F8" />
         {/* Document lines */}
         <g transform="translate(22,20)" filter="url(#dropShadow)">
            <rect y="0" width="25" height="4" rx="1" fill="#333" />
            <rect y="12" width="56" height="2" rx="1" fill="#BBB" />
            <rect y="19" width="50" height="2" rx="1" fill="#BBB" />
            <rect y="26" width="54" height="2" rx="1" fill="#BBB" />
            
            <rect y="40" width="20" height="4" rx="1" fill="#666" />
            <rect y="50" width="45" height="2" rx="1" fill="#BBB" />
            <rect y="57" width="40" height="2" rx="1" fill="#BBB" />
         </g>
         <text x="70" y="85" fontSize="45" fontFamily="serif" fontWeight="bold" fill="#000" opacity="0.1">T</text>
    </svg>
  </IconWrapper>
);

// Dynamic Calendar Icon
export const CalendarIcon = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    
    return (
        <IconWrapper>
            <div className="w-full h-full bg-white flex flex-col font-sans">
                <div className="h-[28%] bg-[#ff3b30] flex items-center justify-center shadow-sm z-10">
                    <span className="text-white text-[10px] font-bold tracking-wide mt-0.5">{month}</span>
                </div>
                <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                    <span className="text-[#1e1e1e] text-3xl font-light -mt-1 font-sans">{day}</span>
                </div>
            </div>
        </IconWrapper>
    );
};
