"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Microscope, Leaf } from "lucide-react";
import { UploadDropzone, type PredictionResult } from "./components/UploadDropzone";
import { ResultCard } from "./components/ResultCard";
import { ThemeToggle } from "./components/ThemeToggle";
import { useTheme } from "./components/ThemeProvider";

export default function HomePage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  return (
    <div className={`min-h-screen ${dark ? "text-white" : "text-gray-900"}`}>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 ${dark ? "glass border-b border-white/5" : "glass-light border-b border-black/5"}`}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20">
            <Leaf size={18} className="text-emerald-400" />
          </div>
          <span className="font-bold text-base tracking-tight">
            Plant<span className="text-emerald-400">Guard</span> AI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1 rounded-full border ${dark ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-emerald-500/40 text-emerald-600 bg-emerald-50"}`}>
            CNN v1.0
          </span>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold
              bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
          >
            <Microscope size={12} />
            Biotechnology Mini-Project · CNN + FastAPI + Next.js
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none mb-5">
            Detect{" "}
            <span className="shimmer-text">Plant Disease</span>
            <br />
            Instantly with AI
          </h1>

          <p className={`max-w-xl mx-auto text-lg leading-relaxed mb-10 ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Upload a potato leaf photo. Our CNN model identifies{" "}
            <strong className="text-emerald-400">Early Blight</strong>,{" "}
            <strong className="text-yellow-400">Late Blight</strong>, or a{" "}
            <strong className="text-green-400">Healthy</strong> leaf in
            seconds — with eco-friendly treatment recommendations.
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { label: "Disease Classes", value: "3" },
              { label: "Image Resolution", value: "256px" },
              { label: "Response Time", value: "<1s" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-emerald-400">{s.value}</p>
                <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Upload Zone ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <UploadDropzone onResult={setResult} onLoading={setAnalyzing} />
        </motion.div>
      </section>

      {/* ── Result ──────────────────────────────────────────── */}
      <section className="px-4 pb-16">
        <AnimatePresence>
          {result && !analyzing && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-2xl mx-auto">
                <div className={`text-center mb-6`}>
                  <h2 className="text-xl font-bold">
                    🧪 Analysis Complete
                  </h2>
                  <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    Here are the AI diagnostic results for your leaf sample.
                  </p>
                </div>
                <ResultCard data={result} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className={`text-center py-6 text-xs ${dark ? "text-gray-600 border-t border-white/5" : "text-gray-400 border-t border-black/5"}`}>
        Built for Biotechnology Mini-Project · 2026 ·{" "}
        <span className="text-emerald-500">PlantGuard AI</span>
      </footer>
    </div>
  );
}
