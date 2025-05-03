"use client";
import { motion } from "framer-motion"; // ✅ Smooth animation effects

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0E0A1F] text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="h-16 w-16 border-t-4 border-b-4 border-[#E5A9FF] rounded-full animate-spin"
      ></motion.div>

      <p className="mt-4 text-lg font-medium text-gray-300 animate-pulse">
        Loading anime magic... ✨
      </p>
    </div>
  );
}
