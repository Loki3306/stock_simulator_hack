import { useEffect, useRef } from "react";

export default function Particles({ density = 60 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let stopped = false;
    const reduce = document.body.dataset.reduceMotion === "1";

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    function resize() {
      const { width, height } = c.getBoundingClientRect();
      c.width = Math.floor(width * DPR);
      c.height = Math.floor(height * DPR);
      ctx.scale(DPR, DPR);
    }
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const count = Math.floor((c.width / DPR) * (c.height / DPR) / (12000 / (density / 60)));
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * (c.width / DPR),
      y: Math.random() * (c.height / DPR),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    function step() {
      if (stopped) return;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.save();
      ctx.scale(DPR, DPR);
      for (const p of pts) {
        p.x += reduce ? 0 : p.vx;
        p.y += reduce ? 0 : p.vy;
        if (p.x < 0 || p.x > c.width / DPR) p.vx *= -1;
        if (p.y < 0 || p.y > c.height / DPR) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(142,143,247,0.7)";
        ctx.fill();
      }
      // lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 90) {
            ctx.strokeStyle = `rgba(255,170,34,${0.18 * (1 - d / 90)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => { stopped = true; cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full opacity-60" aria-hidden />;
}
