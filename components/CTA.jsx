"use client";

import Image from "next/image";
import React, {useCallback, useEffect, useRef, useState} from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PARTNER_LOGOS = [
  {src: "/images/Logo-1-biofarm.webp", alt: "Biofarm"},
  {src: "/images/Logo-2-favaro.webp", alt: "Favaro"},
  {src: "/images/Logo-3-grupoandremaria.webp", alt: "Grupo Andre Maria"},
  {src: "/images/Logo-4-ibis.webp", alt: "Ibis"},
  {src: "/images/cta-1-artemper.webp", alt: "Artemper"},
  {src: "/images/Logo-5-oxiquimica.webp", alt: "Oxiquimica"},
  {src: "/images/Logo-6-tenesse.webp", alt: "Tenesse"},
  {src: "/images/cta-3-athenas.webp", alt: "Athenas"},
];

function createPixel(ctx, canvas, x, y, color, baseSpeed, delay) {
  const rand = (min, max) => Math.random() * (max - min) + min;

  const p = {
    x,
    y,
    color,
    ctx,
    speed: rand(0.08, 0.4) * baseSpeed,
    size: 0,
    sizeStep: rand(0.12, 0.28),
    minSize: 0.5,
    maxSizeInt: 2,
    maxSize: rand(0.5, 2),
    delay,
    counter: 0,
    counterStep: rand(1.8, 3.2) + (canvas.width + canvas.height) * 0.008,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    draw() {
      const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    },
    appear() {
      p.isIdle = false;
      if (p.counter <= p.delay) {
        p.counter += p.counterStep;
        return;
      }
      if (p.size >= p.maxSize) p.isShimmer = true;
      if (p.isShimmer) p.shimmer();
      else p.size += p.sizeStep;
      p.draw();
    },
    disappear() {
      p.isShimmer = false;
      p.counter = 0;
      if (p.size <= 0) {
        p.isIdle = true;
        return;
      }
      p.size -= 0.1;
      p.draw();
    },
    shimmer() {
      if (p.size >= p.maxSize) p.isReverse = true;
      else if (p.size <= p.minSize) p.isReverse = false;
      if (p.isReverse) p.size -= p.speed;
      else p.size += p.speed;
    },
  };

  return p;
}

function PixelCanvas({colors, gap = 5, speed = 30}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(0);
  const lastFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const isActiveRef = useRef(true);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || colors.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const {width, height} = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const effectiveSpeed = reducedMotionRef.current ? 0 : Math.min(speed, 100) * 0.001;
    const pixels = [];

    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = reducedMotionRef.current ? 0 : Math.sqrt(dx * dx + dy * dy) * 0.65;
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }

    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode) => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;

    const loop = () => {
      if (!isActiveRef.current || document.hidden) {
        animationRef.current = 0;
        return;
      }

      animationRef.current = requestAnimationFrame(loop);

      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pixels = pixelsRef.current;
      for (const pixel of pixels) pixel[mode]();

      if (pixels.every((p) => p.isIdle)) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    lastFrameRef.current = performance.now();
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();

    const setActive = (active) => {
      isActiveRef.current = active && !document.hidden;
      if (isActiveRef.current && !animationRef.current) animate("appear");
      if (!isActiveRef.current && animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
    };

    const visibilityChange = () => setActive(!document.hidden);
    const intersectionObserver = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0.01,
    });
    const resizeObserver = new ResizeObserver(() => init());

    if (wrapRef.current) {
      intersectionObserver.observe(wrapRef.current);
      resizeObserver.observe(wrapRef.current);
    }
    document.addEventListener("visibilitychange", visibilityChange);
    animate("appear");

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", visibilityChange);
      cancelAnimationFrame(animationRef.current);
    };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export default function CTA({
  word1 = "Design",
  word2 = "Exclusivo.",
  description = (
    <span className="font-bold tracking-[0.06em] sm:tracking-[0.09em] text-[#eaeaea] w-full max-w-[34rem] sm:max-w-[1900px]">
      Se você precisa de um modelo exclusivo entre em contato com nossa equipe. <br />
    </span>
  ),
  whatsappUrl = "https://wa.me/5516981984000",
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [themeColors, setThemeColors] = useState([]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    setThemeColors(["#75706f", "#75706f", "#75706f", "#acaba9", "#eaeaea"]);

    const loadTimer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(loadTimer);
  }, []);

  return (
    <section className="relative w-full min-h-[72svh] sm:min-h-[60vh] bg-[#000000] flex flex-col justify-center py-16 sm:py-20 px-4 sm:px-12 overflow-hidden select-none isolate">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .tahoe-glass-text {
            color: transparent;
            background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.4) 25%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.9) 55%, rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 1) 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.3);
            filter: drop-shadow(0 15px 35px rgba(0,0,0,0.4)) drop-shadow(0 5px 10px rgba(0,0,0,0.2));
            animation: shimmer 8s linear infinite;
        }
        @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: 0% center; }
        }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        {themeColors.length > 0 && <PixelCanvas colors={themeColors} gap={6} speed={30} />}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#121212_100%)] pointer-events-none opacity-80" />
      </div>

      <div className="flex flex-col items-center justify-center text-center z-10 pointer-events-none w-full mb-8">
        <h1 className="tahoe-glass-text flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-4 lg:gap-6 px-1 w-full text-[clamp(2.35rem,13vw,3.2rem)] sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] sm:leading-none">
          <span className="font-serif italic font-medium">{word1}</span>
          <span className="font-sans font-extrabold tracking-tighter">{word2}</span>
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center text-center z-10 order-2 px-1 w-full pointer-events-none mb-8">
        <p className="w-full max-w-[21rem] sm:max-w-[95%] px-1 text-[0.8rem] sm:text-lg font-light leading-relaxed text-[#acaba9] md:max-w-6xl">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "z-20 pointer-events-auto flex flex-row items-center justify-center transition-all duration-1000 transform px-1 mt-1",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
        style={{transitionDelay: "450ms"}}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="font-neuehaas inline-flex items-center w-fit px-[1.15rem] py-[0.6rem] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] bg-[#f5f5f5] text-[#000000] font-extralight text-[0.65rem] tracking-[0.16em] uppercase no-underline shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.15)] pointer-events-auto">
          <span>Solicite seu orçamento →</span>
        </a>
      </div>

      <div
        className={cn(
          "hidden md:flex absolute bottom-8 left-0 right-0 w-full z-10 pointer-events-auto flex-col items-center justify-center gap-4 transition-all duration-1000 transform",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
        style={{transitionDelay: "600ms"}}>
        <div className="relative w-full max-w-5xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
          <div className="flex w-max py-3 animate-marquee">
            <div className="flex gap-16 pr-16 items-center">
              {PARTNER_LOGOS.map((logo) => (
                <Image
                  key={logo.src}
                  src={logo.src}
                  alt={logo.alt}
                  width={250}
                  height={80}
                  className="h-[29px] w-auto select-none object-contain sm:h-[38px]"
                />
              ))}
            </div>
            <div className="flex gap-16 pr-16 items-center" aria-hidden="true">
              {PARTNER_LOGOS.map((logo) => (
                <Image
                  key={`copy-${logo.src}`}
                  src={logo.src}
                  alt=""
                  width={250}
                  height={80}
                  className="h-[29px] w-auto select-none object-contain sm:h-[38px]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
