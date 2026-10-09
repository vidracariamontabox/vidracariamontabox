"use client";

import dynamic from "next/dynamic";
import SectionLoadGate from "./SectionLoadGate";

const FAQ = dynamic(() => import("./FAQ"), {ssr: false});

export default function LazyFAQ({faqs, load = false, onPreloadNext}) {
  return (
    <SectionLoadGate load={load} minHeight="auto" rootMargin="100vh 0px">
      <FAQ faqs={faqs} onPreloadNext={onPreloadNext} />
    </SectionLoadGate>
  );
}
