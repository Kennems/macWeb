
import React from 'react';

interface SquircleProps {
  children: React.ReactNode;
  className?: string;
}

const Squircle: React.FC<SquircleProps> = ({ children, className = '' }) => {
  // Uses the global clipPath defined in Icons.tsx (IconDefs) to avoid duplicate IDs
  return (
    <div className={`relative ${className}`}>
      <div 
        style={{ clipPath: 'url(#squircle-clip)' }} 
        className="w-full h-full transition-transform duration-200 will-change-transform bg-transparent"
      >
        {children}
      </div>
    </div>
  );
};

export default Squircle;
