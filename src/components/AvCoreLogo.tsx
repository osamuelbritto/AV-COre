import React from 'react';

interface AvCoreLogoProps {
  className?: string;
  size?: number; // width in pixels
  customLogoUrl?: string;
}

export const AvCoreLogo: React.FC<AvCoreLogoProps> = ({
  className = '',
  size = 220,
  customLogoUrl,
}) => {
  if (customLogoUrl) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img
          src={customLogoUrl}
          alt="Logo"
          className="max-h-32 object-contain"
          style={{ width: `${size}px` }}
        />
      </div>
    );
  }

  // Calculate proportional height (original aspect ratio 320x260)
  const height = Math.round((size * 260) / 320);

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: `${size}px` }}
    >
      <svg
        viewBox="0 0 320 260"
        width={size}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
      >
        {/* Blue Circle Badge */}
        <g transform="translate(160, 84)">
          <circle cx="0" cy="0" r="74" fill="#005fae" />

          {/* White AV Geometric Monogram */}
          {/* Main A Frame: Apex and slanted legs */}
          <path
            d="
              M -5 -46 L 5 -46 L 46 40 L 28 40 L 19 20 L -19 20 L -28 40 L -46 40 Z
              M -12 6 L 12 6 L 0 -24 Z
            "
            fill="#ffffff"
          />

          {/* Central Nested V Monogram */}
          <path
            d="
              M -22 -6 L 0 38 L 22 -6 L 10 -6 L 0 16 L -10 -6 Z
            "
            fill="#ffffff"
          />

          {/* Left horizontal base bar */}
          <path
            d="
              M -50 18 L -20 18 L -20 28 L -50 28 Z
            "
            fill="#ffffff"
          />
        </g>

        {/* Brand Name "AV CORE" */}
        <text
          x="160"
          y="204"
          textAnchor="middle"
          fontSize="36"
          fontWeight="800"
          fontFamily="Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="1.5"
        >
          <tspan fill="#005fae">AV</tspan>
          <tspan fill="#111827"> CORE</tspan>
        </text>

        {/* Slogan "Soluções em Tecnologia e Interatividade" */}
        <text
          x="160"
          y="232"
          textAnchor="middle"
          fontSize="14"
          fontWeight="500"
          fontFamily="Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fill="#1e293b"
          letterSpacing="-0.2"
        >
          Soluções em Tecnologia e Interatividade
        </text>
      </svg>
    </div>
  );
};
