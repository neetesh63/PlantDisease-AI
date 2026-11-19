"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        relative p-2.5 rounded-xl border transition-all duration-300
        ${
          theme === "dark"
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-emerald-400"
            : "bg-black/5 border-black/10 hover:bg-black/10 text-emerald-600"
        }
      `}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </motion.div>
    </motion.button>
  );
}
