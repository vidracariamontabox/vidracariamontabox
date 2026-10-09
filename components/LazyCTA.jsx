"use client";

import dynamic from "next/dynamic";
import SectionLoadGate from "./SectionLoadGate";

const CTA = dynamic(() => import("./CTA"), {ssr: false});

export default function LazyCTA({load = false}) {
  return (
    <SectionLoadGate load={load} minHeight="auto" rootMargin="100vh 0px">
      <CTA />
    </SectionLoadGate>
  );
}
