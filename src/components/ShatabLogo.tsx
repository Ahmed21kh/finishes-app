import React from "react";

interface ShatabLogoIconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Modern Architectural & Interior Finishes Logo Icon for "شطب"
 * Features:
 * - Luxury squircle base with multi-stop cobalt/indigo gradient
 * - Three architectural crown dots inspired by the Arabic letter "ش" (Shin)
 * - Modern luxury villa & interior finishes facade with double-height glass atrium
 * - Precision-engineered geometry that scales crisply from 16px to 512px
 */
export const ShatabLogoIcon: React.FC<ShatabLogoIconProps> = ({
  size = 44,
  className = "",
  style,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      style={style}
      aria-label="شطب لوجو"
    >
      <defs>
        {/* Luxury Background Gradient */}
        <linearGradient id="shatabIconBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="45%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        {/* Glass Reflection Highlight */}
        <linearGradient id="shatabIconGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Cyan Accent */}
        <linearGradient id="shatabCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Squircle Base with Precision Rounded Corners */}
      <rect x="28" y="28" width="456" height="456" rx="118" fill="url(#shatabIconBg)" />
      <rect x="28" y="28" width="456" height="456" rx="118" fill="url(#shatabIconGlow)" />
      <rect
        x="28"
        y="28"
        width="456"
        height="456"
        rx="118"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeOpacity="0.3"
      />

      {/* 3 Crown Architectural Diamond Dots (Shin نقاط ش) */}
      <circle cx="204" cy="144" r="14" fill="#38bdf8" />
      <circle cx="256" cy="112" r="16" fill="#7dd3fc" />
      <circle cx="308" cy="144" r="14" fill="#38bdf8" />

      {/* Main Architectural Villa & Interior Finishes Structure */}
      {/* Outer Gable Structure (Pristine Architectural White) */}
      <path
        d="M256 160 L108 274 C101 279 105 290 114 290 H144 V394 C144 404 152 412 162 412 H350 C360 412 368 404 368 394 V290 H398 C407 290 411 279 404 274 L256 160 Z"
        fill="#ffffff"
      />

      {/* Modern Double-Height Entrance Atrium */}
      <path d="M226 252 H286 V412 H226 V252 Z" fill="#1e3a8a" opacity="0.95" />
      {/* Vertical Cyan Accent Line / Door Handle */}
      <rect x="254" y="268" width="4" height="144" fill="#38bdf8" opacity="0.85" />
      <circle cx="266" cy="344" r="4" fill="#ffffff" />

      {/* Left Architectural Vertical Slits (Partitioning & Finishes) */}
      <rect x="172" y="306" width="28" height="68" rx="6" fill="#1e3a8a" opacity="0.9" />
      <line x1="186" y1="306" x2="186" y2="374" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />

      {/* Right Architectural Vertical Slits (Partitioning & Finishes) */}
      <rect x="312" y="306" width="28" height="68" rx="6" fill="#1e3a8a" opacity="0.9" />
      <line x1="326" y1="306" x2="326" y2="374" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />

      {/* Upper Architectural Triangular Apex Window */}
      <polygon points="256,194 280,228 232,228" fill="url(#shatabCyan)" />
    </svg>
  );
};

export default ShatabLogoIcon;
