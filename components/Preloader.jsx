"use client";

import {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {usePathname} from "next/navigation";

export default function Preloader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const progressRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (pathname === "/privacidade") return;

    let isMounted = true;
    const MIN_TIME = 1800; 
    const start = performance.now();

    const tick = () => {
      if (!isMounted || isExiting) return;

      const elapsed = performance.now() - start;
      const target = Math.min(90, (elapsed / MIN_TIME) * 90);

      progressRef.current += (target - progressRef.current) * 0.08;
      setProgress(Math.floor(progressRef.current));

      if (progressRef.current < 89.5) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    const finish = () => {
      if (!isMounted) return;

      
      let current = progressRef.current;
      const step = () => {
        if (!isMounted) return;
        current += (100 - current) * 0.15;
        setProgress(Math.floor(current));

        if (current < 99.5) {
          requestAnimationFrame(step);
        } else {
          setProgress(100);
          setTimeout(() => {
            if (isMounted) setIsExiting(true);
          }, 200);
        }
      };
      requestAnimationFrame(step);
    };

    const onLoad = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_TIME - elapsed);
      setTimeout(finish, remaining);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("load", onLoad);
    };
  }, [isExiting, pathname]);

  if (pathname === "/privacidade" || done) return null;

  return (
    <AnimatePresence onExitComplete={() => setDone(true)}>
      {!isExiting && (
        <motion.div
          initial={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.7, ease: "easeInOut"}}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#e8e6e3]"
        >
          <div
            style={{
              fontFamily: "var(--font-neuehaas), serif",
              fontSize: "clamp(8rem, 22vw, 16rem)",
              fontWeight: 300,
              color: "#1a1a1a",
              lineHeight: 0.85,
              letterSpacing: "-0.02em",
              marginBottom: "2.5rem",
              userSelect: "none",
            }}>
            M
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.75rem",
              marginBottom: "1.25rem",
              color: "#3a3a3a",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}>
            <span>Carregando</span>
            <span style={{fontVariantNumeric: "tabular-nums", minWidth: "3.2ch"}}>{progress}%</span>
          </div>

          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "rgba(0,0,0,0.12)",
              borderRadius: "99px",
              overflow: "hidden",
            }}>
            <motion.div
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "#1a1a1a",
                borderRadius: "99px",
              }}
              transition={{type: "spring", stiffness: 300, damping: 30}}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
