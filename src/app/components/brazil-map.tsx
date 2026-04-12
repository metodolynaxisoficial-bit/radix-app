import { motion } from "motion/react";
import { useState } from "react";

interface RegionData {
  name: string;
  count: number;
}

const regions: Record<string, RegionData> = {
  norte: { name: "Norte", count: 12 },
  nordeste: { name: "Nordeste", count: 45 },
  "centro-oeste": { name: "Centro-Oeste", count: 18 },
  sudeste: { name: "Sudeste", count: 89 },
  sul: { name: "Sul", count: 34 },
};

export function BrazilMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Norte */}
        <motion.path
          d="M 100 50 L 250 50 L 280 120 L 250 180 L 150 160 L 100 100 Z"
          fill="rgba(212, 175, 55, 0.05)"
          stroke="#0D7C66"
          strokeWidth="1.5"
          className="cursor-pointer transition-all duration-300"
          whileHover={{ fill: "rgba(212, 175, 55, 0.15)" }}
          onMouseEnter={() => setHoveredRegion("norte")}
          onMouseLeave={() => setHoveredRegion(null)}
        />

        {/* Nordeste */}
        <motion.path
          d="M 280 120 L 350 140 L 360 220 L 320 270 L 250 240 L 250 180 Z"
          fill="rgba(212, 175, 55, 0.05)"
          stroke="#0D7C66"
          strokeWidth="1.5"
          className="cursor-pointer transition-all duration-300"
          whileHover={{ fill: "rgba(212, 175, 55, 0.15)" }}
          onMouseEnter={() => setHoveredRegion("nordeste")}
          onMouseLeave={() => setHoveredRegion(null)}
        />

        {/* Centro-Oeste */}
        <motion.path
          d="M 150 160 L 250 180 L 250 240 L 220 300 L 140 280 L 120 220 Z"
          fill="rgba(212, 175, 55, 0.05)"
          stroke="#0D7C66"
          strokeWidth="1.5"
          className="cursor-pointer transition-all duration-300"
          whileHover={{ fill: "rgba(212, 175, 55, 0.15)" }}
          onMouseEnter={() => setHoveredRegion("centro-oeste")}
          onMouseLeave={() => setHoveredRegion(null)}
        />

        {/* Sudeste */}
        <motion.path
          d="M 220 300 L 250 240 L 320 270 L 310 340 L 250 360 L 200 340 Z"
          fill="rgba(212, 175, 55, 0.05)"
          stroke="#0D7C66"
          strokeWidth="1.5"
          className="cursor-pointer transition-all duration-300"
          whileHover={{ fill: "rgba(212, 175, 55, 0.15)" }}
          onMouseEnter={() => setHoveredRegion("sudeste")}
          onMouseLeave={() => setHoveredRegion(null)}
        />

        {/* Sul */}
        <motion.path
          d="M 140 350 L 200 340 L 250 360 L 240 430 L 160 450 L 120 410 Z"
          fill="rgba(212, 175, 55, 0.05)"
          stroke="#0D7C66"
          strokeWidth="1.5"
          className="cursor-pointer transition-all duration-300"
          whileHover={{ fill: "rgba(212, 175, 55, 0.15)" }}
          onMouseEnter={() => setHoveredRegion("sul")}
          onMouseLeave={() => setHoveredRegion(null)}
        />

        {/* Region Labels with Counts */}
        <text x="175" y="120" className="fill-text-primary text-[14px] font-semibold" textAnchor="middle">
          {regions.norte.count}
        </text>
        <text x="305" y="200" className="fill-text-primary text-[14px] font-semibold" textAnchor="middle">
          {regions.nordeste.count}
        </text>
        <text x="185" y="240" className="fill-text-primary text-[14px] font-semibold" textAnchor="middle">
          {regions["centro-oeste"].count}
        </text>
        <text x="265" y="305" className="fill-text-primary text-[14px] font-semibold" textAnchor="middle">
          {regions.sudeste.count}
        </text>
        <text x="190" y="400" className="fill-text-primary text-[14px] font-semibold" textAnchor="middle">
          {regions.sul.count}
        </text>
      </svg>

      {/* Tooltip */}
      {hoveredRegion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-bg-glass backdrop-blur-[22px] border border-bg-card-border rounded-lg px-4 py-2 shadow-lg"
        >
          <div className="text-[13px] text-text-primary font-medium">
            {regions[hoveredRegion].name}: {regions[hoveredRegion].count} PSS ativos
          </div>
        </motion.div>
      )}
    </div>
  );
}
