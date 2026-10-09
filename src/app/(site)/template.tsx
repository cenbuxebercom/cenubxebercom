"use client";
import { useEffect } from "react";
import { motion } from "motion/react";

// İlk açılışda animasiya yoxdur; səhifələr arası keçiddə yumşaq giriş var.
let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const skip = firstLoad;
  useEffect(() => { firstLoad = false; }, []);
  return (
    <motion.div
      initial={skip ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
