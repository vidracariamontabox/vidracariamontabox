"use client";

import { motion } from "framer-motion";

const navVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 26,
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 26,
    },
  },
};

export default function Navbar() {
  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={[
        "absolute top-0 left-0 w-full z-50",
        "flex items-center justify-between",
        "px-8 sm:px-12 py-5",
        "backdrop-blur-md bg-[#121212]/65 border-b border-white/5",
      ].join(" ")}>
      <motion.a
        variants={itemVariants}
        href="#"
        className="text-sm font-light tracking-widest uppercase text-[#acaba9] hover:text-[#eaeaea] transition-colors duration-300">
        Montabox (em desenvolvimento)
      </motion.a>

      <motion.a
        variants={itemVariants}
        href="https://wa.me/5516981984000"
        target="_blank"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={[
          "text-[0.72rem] font-light tracking-widest uppercase",
          "border border-[#acaba9]/50 text-[#eaeaea]",
          "px-5 py-2",
          "hover:bg-[#eaeaea] hover:text-[#121212] hover:border-[#eaeaea]",
          "transition-colors duration-300",
        ].join(" ")}>
        Orçamento
      </motion.a>
    </motion.nav>
  );
}
