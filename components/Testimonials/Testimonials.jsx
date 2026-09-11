"use client";
import {useCallback, useEffect, useRef, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import BlurTextReveal from "../ui/BlurTextReveal";
import DividerPlus from "../ui/DividerPlus";
import TestimonialCard from "./TestimonialCard";
import {TestimonialsData} from "../../data/TestimonialsData";
import WordShiftButton from "../ui/WordShiftButton";

export default function Testimonials({customClass = "", showBottomLine = false, onPreloadNext}) {
  const sectionRef = useRef(null);
  const nextPreloadTriggeredRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setActiveIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = TestimonialsData.length - 1;
      if (nextIndex >= TestimonialsData.length) nextIndex = 0;
      return nextIndex;
    });
  }, []);

  const handleCompanyClick = useCallback(
    (companyName) => {
      const targetIndex = TestimonialsData.findIndex((item) => item.companyName === companyName);
      if (targetIndex !== -1 && targetIndex !== activeIndex) {
        setDirection(targetIndex > activeIndex ? 1 : -1);
        setActiveIndex(targetIndex);
      }
    },
    [activeIndex],
  );

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

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [paginate]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <section ref={sectionRef} id="testimonials" className={`testimonials-section ${customClass}`.trim()}>
      <div className="testimonials-section__container">
        <div className="testimonials-section__header">
          <BlurTextReveal
            as="h2"
            text="História.dos.clientes"
            animationType="chars"
            stagger={0.03}
            className="testimonials-section__title"
          />

          <div className="testimonials-section__introWrap">
            <p className="testimonials-section__intro">
              Pequenos ou grandes projetos.
              <br /> A qualidade é a mesma.
            </p>
          </div>
        </div>

        <div className="testimonials-section__divider">
          <DividerPlus
            customClass="testimonials-section__dividerInner"
            lineClass="testimonials-section__dividerLine"
            plusClass="testimonials-section__dividerPlus"
            iconColor="#272727"
          />
        </div>

        <div className="testimonials-section__main">
          <div className="testimonials-section__left">
            <div className="testimonial-company-list">
              {[...new Set(TestimonialsData.map((item) => item.companyName))].map((companyName) => {
                const isActive = TestimonialsData[activeIndex]?.companyName === companyName;
                return (
                  <button
                    key={companyName}
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    className={`testimonial-company-button ${isActive ? "is-active" : ""}`}
                    onClick={() => handleCompanyClick(companyName)}>
                    <span className="title">{companyName}</span>
                    <span className={`icon ${isActive ? "is-visible" : ""}`} aria-hidden="true">
                      →
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="testimonial-nav">
              <button
                type="button"
                className="custom-arrow left"
                onClick={() => paginate(-1)}
                aria-label="Previous testimonial">
                <span className="arrow-icon">←</span>
              </button>
              <button
                type="button"
                className="custom-arrow right"
                onClick={() => paginate(1)}
                aria-label="Next testimonial">
                <span className="arrow-icon">→</span>
              </button>
            </div>
          </div>

          <div className="testimonials-section__swiperWrap">
            <div className="testimonials-swiper-container relative overflow-hidden min-h-[300px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: {duration: 0.6, ease: [0.16, 1, 0.3, 1]},
                    opacity: {duration: 0.4},
                    filter: {duration: 0.4},
                  }}
                  drag="x"
                  dragConstraints={{left: 0, right: 0}}
                  dragElastic={1}
                  onDragEnd={(e, {offset}) => {
                    const swipe = Math.abs(offset.x) > 50;
                    if (swipe) {
                      paginate(offset.x > 0 ? -1 : 1);
                    }
                  }}
                  className="w-full">
                  <TestimonialCard item={TestimonialsData[activeIndex]} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="testimonials-section__cta">
              <WordShiftButton text="Traga o seu projeto →" target="_blank" href="https://wa.me/5516981984000" />
            </div>
          </div>
        </div>
      </div>

      {showBottomLine && (
        <div className="testimonials-section__bottomLine">
          <DividerPlus
            customClass="testimonials-section__dividerInner"
            lineClass="testimonials-section__dividerLine"
            plusClass="testimonials-section__dividerPlus"
            iconColor="#272727"
          />
        </div>
      )}
    </section>
  );
}
