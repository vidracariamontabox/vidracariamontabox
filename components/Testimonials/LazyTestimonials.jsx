"use client";

import dynamic from "next/dynamic";
import SectionLoadGate from "../SectionLoadGate";

const Testimonials = dynamic(() => import("./Testimonials"), {ssr: false});

export default function LazyTestimonials({load = false, onPreloadNext}) {
  return (
    <SectionLoadGate load={load} minHeight="auto" rootMargin="100vh 0px">
      <Testimonials onPreloadNext={onPreloadNext} />
    </SectionLoadGate>
  );
}
