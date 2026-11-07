import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const AmbientBackground: React.FC = () => {
  const { themeMode, primaryColor, secondaryColor } = useContext(AppContext);
  const isDark = themeMode === "dark";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Shape 1: Top-Right Floating Polygon (Clip-path geometric gem) */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 transition-opacity duration-700 animate-ambient-float-1 ${
          isDark ? "opacity-20" : "opacity-15"
        }`}
        style={{
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          background: `linear-gradient(135deg, ${primaryColor || "#3b82f6"}, ${secondaryColor || "#8b5cf6"})`,
          filter: "blur(50px)",
          willChange: "transform",
        }}
      />

      {/* Shape 2: Bottom-Left Organic Diamond Wave */}
      <div
        className={`absolute -bottom-32 -left-32 w-[28rem] h-[28rem] transition-opacity duration-700 animate-ambient-float-2 ${
          isDark ? "opacity-15" : "opacity-12"
        }`}
        style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          background: isDark
            ? "linear-gradient(135deg, #06b6d4, #3b82f6)"
            : "linear-gradient(135deg, #60a5fa, #a78bfa)",
          filter: "blur(65px)",
          willChange: "transform",
        }}
      />

      {/* Shape 3: Center-Right Floating Hexagon */}
      <div
        className={`absolute top-1/3 -right-20 w-80 h-80 transition-opacity duration-700 animate-ambient-float-3 ${
          isDark ? "opacity-10" : "opacity-10"
        }`}
        style={{
          clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%)",
          background: isDark
            ? "linear-gradient(135deg, #10b981, #06b6d4)"
            : "linear-gradient(135deg, #34d399, #60a5fa)",
          filter: "blur(60px)",
          willChange: "transform",
        }}
      />

      {/* Shape 4: Subtle Top-Left Ambient Orb */}
      <div
        className={`absolute top-12 left-1/4 w-72 h-72 transition-opacity duration-700 animate-ambient-float-4 ${
          isDark ? "opacity-10" : "opacity-8"
        }`}
        style={{
          clipPath: "circle(50% at 50% 50%)",
          background: `radial-gradient(circle, ${primaryColor || "#3b82f6"} 0%, transparent 70%)`,
          filter: "blur(45px)",
          willChange: "transform",
        }}
      />

      {/* Subtle Grid Texture Mesh overlay for tactile modern feel */}
      <div
        className={`absolute inset-0 bg-repeat ${
          isDark
            ? "opacity-[0.015] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]"
            : "opacity-[0.025] [background-image:linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)]"
        }`}
        style={{ backgroundSize: "40px 40px" }}
      />
    </div>
  );
};

export default AmbientBackground;

