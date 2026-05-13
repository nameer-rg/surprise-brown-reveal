import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import congratsImg from "@/assets/congrats.png";
import mariyaImg from "@/assets/mariya.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Congrats Mariya! 🎓" },
      { name: "description", content: "A little surprise to celebrate your amazing result." },
    ],
  }),
});

function ScratchReveal({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { width, height } = canvas;
    // Cute brown gradient cover
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#8b5a3c");
    grad.addColorStop(1, "#c79170");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "bold 28px serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ Scratch to reveal ✨", width / 2, height / 2 - 10);
    ctx.font = "18px serif";
    ctx.fillText("a little surprise for you", width / 2, height / 2 + 20);
  }, []);

  const strokes = useRef(0);

  const fireConfetti = () => {
    const end = Date.now() + 1200;
    const colors = ["#8b5a3c", "#c79170", "#e8c39e", "#fff1d6", "#a0522d"];
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors });
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const cx = ((x - rect.left) / rect.width) * canvas.width;
    const cy = ((y - rect.top) / rect.height) * canvas.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.fill();
  };

  const endStroke = () => {
    drawing.current = false;
    if (revealed) return;
    strokes.current += 1;
    if (strokes.current >= 3) {
      setRevealed(true);
      fireConfetti();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-[oklch(0.45_0.08_50)]">
      <img src={src} alt="Surprise for Mariya" className="absolute inset-0 w-full h-full object-cover" />
      <canvas
        ref={canvasRef}
        width={500}
        height={625}
        className={`absolute inset-0 w-full h-full cursor-grab transition-opacity duration-700 ${revealed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        onMouseDown={(e) => { drawing.current = true; scratch(e.clientX, e.clientY); }}
        onMouseUp={() => (drawing.current = false)}
        onMouseLeave={() => (drawing.current = false)}
        onMouseMove={(e) => drawing.current && scratch(e.clientX, e.clientY)}
        onTouchStart={(e) => { drawing.current = true; const t = e.touches[0]; scratch(t.clientX, t.clientY); }}
        onTouchEnd={() => (drawing.current = false)}
        onTouchMove={(e) => { const t = e.touches[0]; scratch(t.clientX, t.clientY); }}
      />
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Soft brown blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[oklch(0.85_0.08_60)] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-[28rem] h-[28rem] rounded-full bg-[oklch(0.78_0.1_50)] blur-3xl opacity-50" />

      <section className="relative px-6 pt-16 pb-10 text-center">
        <p className="uppercase tracking-[0.4em] text-sm text-[oklch(0.45_0.08_50)] mb-4">a tiny surprise</p>
        <h1 className="font-serif italic text-5xl md:text-7xl text-[oklch(0.35_0.1_45)] leading-tight">
          You did it, Mariya!
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-[oklch(0.35_0.05_50)]">
          Every late night, every page turned, every doubt you pushed through — it all added up to this. So proud of you. 🤎
        </p>
      </section>

      <section className="relative px-6 pb-16 flex justify-center">
        <img
          src={congratsImg}
          alt="Congrats!"
          className="w-full max-w-sm drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
        />
      </section>

      <section className="relative px-6 pb-20">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-[oklch(0.35_0.1_45)]">
            Psst… there's something underneath 👇
          </h2>
          <p className="mt-3 text-[oklch(0.4_0.05_50)]">Scratch the card to unwrap your surprise.</p>
        </div>
        <ScratchReveal src={mariyaImg} />
      </section>

      <section className="relative px-6 pb-24 max-w-2xl mx-auto text-center">
        <div className="rounded-3xl bg-[oklch(0.92_0.04_60)] border-2 border-[oklch(0.55_0.08_50)] p-8 shadow-xl">
          <p className="font-serif italic text-2xl text-[oklch(0.3_0.08_45)] leading-relaxed">
            "The future belongs to those who believe in the beauty of their dreams."
          </p>
          <p className="mt-6 text-[oklch(0.4_0.05_50)]">
            Congratulations again, brilliant girl. This is just the beginning. 🌷
          </p>
        </div>
      </section>

      <footer className="relative pb-10 text-center text-sm text-[oklch(0.45_0.05_50)]">
        Made with 🤎 just for you.
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </main>
  );
}
