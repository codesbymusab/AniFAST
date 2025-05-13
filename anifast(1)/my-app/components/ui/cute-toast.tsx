"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
}

export function CuteToast({ message, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-pink-500 text-white rounded-lg shadow-lg text-sm font-semibold"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
