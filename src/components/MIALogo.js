import React from 'react';

const MIALogo = ({ size = 24, className = '', style = {} }) => {
  // Generate burst lines radiating from center
  const generateBurstLines = () => {
    const lines = [];
    const centerX = 50;
    const centerY = 50;
    const numLines = 60;
    
    for (let i = 0; i < numLines; i++) {
      const angle = (i * 360 / numLines) * Math.PI / 180;
      const length = 15 + Math.random() * 25; // Random length between 15-40
      const startRadius = 8 + Math.random() * 5; // Start from inner area
      
      const startX = centerX + Math.cos(angle) * startRadius;
      const startY = centerY + Math.sin(angle) * startRadius;
      const endX = centerX + Math.cos(angle) * (startRadius + length);
      const endY = centerY + Math.sin(angle) * (startRadius + length);
      
      // Alternate colors for variety
      const colors = ['#8B5CF6', '#A855F7', '#EC4899', '#06B6D4', '#3B82F6'];
      const color = colors[i % colors.length];
      
      lines.push(
        <line
          key={i}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={color}
          strokeWidth={Math.random() * 1.5 + 0.5}
          opacity={0.6 + Math.random() * 0.4}
        />
      );
    }
    return lines;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      
      {/* Burst lines radiating outward */}
      {generateBurstLines()}
      
      {/* Central MIA text */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="28"
        fontWeight="900"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fill="url(#textGradient)"
        filter="url(#glow)"
        letterSpacing="2px"
        stroke="#FFFFFF"
        strokeWidth="0.5"
      >
        MIA
      </text>
    </svg>
  );
};

export default MIALogo;
