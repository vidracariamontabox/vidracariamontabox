"use client";

import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import BlurTextReveal from "./ui/BlurTextReveal";
import FAQParticles from "./FAQParticles";

function FAQItem({item, index, isOpen, onToggle}) {
  const [tilt, setTilt] = useState({rx: 0, ry: 0});
  const [glow, setGlow] = useState({x: "50%", y: "50%"});
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({rx: -py * 5, ry: px * 5});
    setGlow({x: `${e.clientX - rect.left}px`, y: `${e.clientY - rect.top}px`});
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setTilt({rx: 0, ry: 0});
  };

  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-trigger-${item.id}`;

  return (
    <motion.div
      initial={{opacity: 0, y: 22}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.15}}
      transition={{duration: 0.6, delay: index * 0.08, ease: "easeOut"}}
      onMouseEnter={() => setHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${hovering ? 4 : 0}px)`,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: hovering ? "rgba(234,234,234,0.22)" : "rgba(234,234,234,0.08)",
        transition: hovering ? "border-color .3s ease" : "transform .5s ease, border-color .3s ease",
      }}
      className="relative overflow-hidden rounded bg-[#121212]/70 backdrop-blur-[6px]">
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-[400ms]"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(220px circle at ${glow.x} ${glow.y}, rgba(234,234,234,0.10), transparent 70%)`,
        }}
      />

      <button
        type="button"
        id={buttonId}
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="relative z-10 flex w-full items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-4 sm:py-5 text-left">
        <span className="pr-2 sm:pr-4 text-[0.84rem] sm:text-[0.92rem] leading-snug text-[#eaeaea]">{item.question}</span>
        <motion.span
          animate={{rotate: isOpen ? 45 : 0}}
          transition={{duration: 0.3, ease: "easeOut"}}
          className="shrink-0 text-[#acaba9]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14" strokeLinecap="round" />
            <path d="M5 12h14" strokeLinecap="round" />
          </svg>
        </motion.span>
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        initial={false}
        animate={{height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0}}
        transition={{duration: 0.35, ease: "easeInOut"}}
        className="relative z-10 overflow-hidden">
        <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-[0.8rem] sm:text-[0.85rem] leading-relaxed text-[#acaba9]">{item.answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQ({faqs, onPreloadNext}) {
  const sectionRef = useRef(null);
  const nextPreloadTriggeredRef = useRef(false);
  const [openId, setOpenId] = useState(-1);

  const toggle = (id) => setOpenId((prev) => (prev === id ? -1 : id));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !onPreloadNext) return undefined;

    const checkProgress = () => {
      if (nextPreloadTriggeredRef.current) return;
      const rect = section.getBoundingClientRect();
      if (rect.top > -(rect.height * 0.5)) return;
      nextPreloadTriggeredRef.current = true;
      onPreloadNext();
      window.removeEventListener("scroll", checkProgress);
    };

    window.addEventListener("scroll", checkProgress, {passive: true});
    checkProgress();
    return () => window.removeEventListener("scroll", checkProgress);
  }, [onPreloadNext]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {"@type": "Answer", text: f.answer},
    })),
  };

  return (
    <section ref={sectionRef} id="faq" className="relative w-full overflow-hidden bg-[#080808] px-4 sm:px-10 py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />

      <FAQParticles />

      <motion.div
        className="pointer-events-none absolute -top-44 -left-28 w-[480px] h-[480px] rounded-full"
        style={{background: "rgba(172,171,169,0.10)", filter: "blur(70px)"}}
        animate={{x: [0, 60, 0], y: [0, 40, 0]}}
        transition={{duration: 22, repeat: Infinity, ease: "easeInOut"}}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-40 -right-24 w-[420px] h-[420px] rounded-full"
        style={{background: "rgba(234,234,234,0.05)", filter: "blur(70px)"}}
        animate={{x: [0, -50, 0], y: [0, -30, 0]}}
        transition={{duration: 26, repeat: Infinity, ease: "easeInOut"}}
      />
      <motion.div
        className="pointer-events-none absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full"
        style={{background: "rgba(117,112,111,0.18)", filter: "blur(70px)"}}
        animate={{x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1]}}
        transition={{duration: 18, repeat: Infinity, ease: "easeInOut"}}
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="text-[0.7rem] tracking-[0.3em] uppercase text-[#acaba9]">FAQ</p>
        <h2>
          <BlurTextReveal
            as="span"
            text="Perguntas frequentes (revisar)"
            animationType="words"
            stagger={0.12}
            className="mt-2 font-light text-[1.65rem] sm:text-2xl md:text-3xl text-[#eaeaea]"
          />
        </h2>

        <div className="mt-8 sm:mt-10 flex flex-col gap-3">
          {faqs.map((item, i) => (
            <FAQItem key={item.id} item={item} index={i} isOpen={openId === item.id} onToggle={() => toggle(item.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
