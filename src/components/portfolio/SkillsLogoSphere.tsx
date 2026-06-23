import { useEffect, useRef, useState } from "react";
import { usePortfolioRead } from "@/hooks/usePortfolioData";
import { getSkillIconUrl } from "@/lib/skills";

// Fibonacci sphere distribution for even spread
function fibonacciSphere(n: number, index: number): [number, number, number] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / (n - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const theta = golden * index;
  return [Math.cos(theta) * radius, y, Math.sin(theta) * radius];
}

interface SkillPoint {
  name: string;
  baseX: number;
  baseY: number;
  baseZ: number;
  x: number;
  y: number;
  z: number;
  iconError: boolean;
}

interface SkillsLogoSphereProps {
  highlightedSkill: string | null;
}

const SPHERE_RADIUS = 160;

const SkillsLogoSphere = ({ highlightedSkill }: SkillsLogoSphereProps) => {
  const { skills } = usePortfolioRead();
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const rotXRef = useRef(0);
  const rotYRef = useRef(0);
  const velXRef = useRef(0.003);
  const velYRef = useRef(0.005);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const [points, setPoints] = useState<SkillPoint[]>([]);
  const [iconErrors, setIconErrors] = useState<Set<string>>(new Set());

  // Initialize points
  useEffect(() => {
    const pts = skills.map((name, i) => {
      const [bx, by, bz] = fibonacciSphere(skills.length, i);
      return { name, baseX: bx, baseY: by, baseZ: bz, x: bx, y: by, z: bz, iconError: false };
    });
    setPoints(pts);
  }, [skills]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!isDragging.current) {
        // Auto-rotate with slight wobble
        rotXRef.current += velXRef.current;
        rotYRef.current += velYRef.current;
      }

      const cosX = Math.cos(rotXRef.current);
      const sinX = Math.sin(rotXRef.current);
      const cosY = Math.cos(rotYRef.current);
      const sinY = Math.sin(rotYRef.current);

      setPoints((prev) =>
        prev.map((p) => {
          // Rotate around Y axis
          const x1 = p.baseX * cosY - p.baseZ * sinY;
          const z1 = p.baseX * sinY + p.baseZ * cosY;
          // Rotate around X axis
          const y2 = p.baseY * cosX - z1 * sinX;
          const z2 = p.baseY * sinX + z1 * cosX;
          return { ...p, x: x1, y: y2, z: z2 };
        })
      );

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Mouse drag to rotate
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      velXRef.current = 0;
      velYRef.current = 0;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      rotYRef.current += dx * 0.005;
      rotXRef.current += dy * 0.005;
      velXRef.current = dy * 0.001;
      velYRef.current = dx * 0.001;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const center = 210; // half of container size (420px)

  // Sort by z for depth (back to front rendering)
  const sorted = [...points].sort((a, b) => a.z - b.z);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto select-none"
      style={{ width: 420, height: 420, cursor: "grab" }}
    >
      {/* Sphere shell */}
      <div
        className="absolute rounded-full border border-border/40 pointer-events-none"
        style={{
          inset: "8%",
          background:
            "radial-gradient(circle at 32% 28%, hsl(var(--card)) 0%, hsl(var(--background)) 60%)",
          boxShadow:
            "inset -12px -16px 40px rgba(0,0,0,0.4), inset 8px 8px 24px rgba(255,255,255,0.04), 0 0 80px -20px hsl(var(--primary) / 0.2)",
        }}
      />
      <div className="pointer-events-none absolute rounded-full bg-gradient-to-br from-white/8 via-transparent to-transparent" style={{ inset: "8%" }} />
      {/* Inner rings */}
      <div className="pointer-events-none absolute rounded-full border border-white/5" style={{ inset: "22%" }} />
      <div className="pointer-events-none absolute rounded-full border border-white/[0.03]" style={{ inset: "36%" }} />

      {/* Skill icons */}
      {sorted.map((p) => {
        // Project 3D -> 2D
        const scale = (p.z + 2) / 3; // z in [-1,1] => scale in [0.33,1]
        const screenX = center + p.x * SPHERE_RADIUS;
        const screenY = center + p.y * SPHERE_RADIUS;
        const opacity = 0.35 + scale * 0.65;
        const size = 36 + scale * 10;
        const isHighlighted = highlightedSkill === p.name;
        const hasError = iconErrors.has(p.name);

        return (
          <div
            key={p.name}
            title={p.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-none"
            style={{
              left: screenX,
              top: screenY,
              zIndex: Math.round(scale * 100),
              opacity,
            }}
          >
            <div
              className={`flex items-center justify-center rounded-full border backdrop-blur-sm transition-colors duration-200 ${
                isHighlighted
                  ? "border-primary bg-primary/20 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.7)]"
                  : "border-border/60 bg-card/80"
              }`}
              style={{ width: size, height: size }}
            >
              {!hasError ? (
                <img
                  src={getSkillIconUrl(p.name)}
                  alt={p.name}
                  style={{ width: size * 0.5, height: size * 0.5 }}
                  onError={() => setIconErrors((prev) => new Set([...prev, p.name]))}
                />
              ) : (
                <span
                  className="font-semibold text-foreground"
                  style={{ fontSize: Math.max(8, size * 0.24) }}
                >
                  {p.name.slice(0, 2)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsLogoSphere;
