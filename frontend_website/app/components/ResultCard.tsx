"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Skull,
  FlaskConical,
  Stethoscope,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import type { PredictionResult } from "./UploadDropzone";
import { useTheme } from "./ThemeProvider";

interface Props {
  data: PredictionResult;
}

/* ── Progress Bar ─────────────────────────────────────────── */
function AnimatedBar({ label, value, color }: { label: string; value: number; color: string }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className={dark ? "text-gray-300" : "text-gray-600"}>{label}</span>
        <span className="font-bold" style={{ color }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-black/10"}`}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ── Severity badge ──────────────────────────────────────── */
function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { color: string; bg: string; Icon: any }> = {
    "None":               { color: "#34d399", bg: "rgba(52,211,153,0.15)", Icon: CheckCircle2 },
    "Moderate":           { color: "#fbbf24", bg: "rgba(251,191,36,0.15)",  Icon: AlertTriangle },
    "High – Epidemic Risk": { color: "#f87171", bg: "rgba(248,113,113,0.15)", Icon: Skull },
  };
  const cfg = map[severity] ?? map["Moderate"];
  const { Icon } = cfg;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <Icon size={12} />
      {severity}
    </span>
  );
}

/* ── Main Result Card ────────────────────────────────────── */
export function ResultCard({ data }: Props) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { cls, pathogen, confidence, severity, treatment, all_scores, imageUrl } = data;

  const isHealthy = cls === "Healthy";
  const headerColor = isHealthy ? "#34d399" : severity === "Moderate" ? "#fbbf24" : "#f87171";

  const barColors: Record<string, string> = {
    "Early Blight": "#fbbf24",
    "Late Blight":  "#f87171",
    "Healthy":      "#34d399",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className={`rounded-2xl overflow-hidden border ${dark ? "glass border-white/10" : "glass-light border-black/10"} shadow-2xl`}>

        {/* ── Header ──────────────────────────────────────── */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${headerColor}18, transparent)` }}
        >
          <div className="flex items-center gap-3">
            {isHealthy
              ? <ShieldCheck size={28} style={{ color: headerColor }} />
              : <FlaskConical size={28} style={{ color: headerColor }} />
            }
            <div>
              <p className={`text-xs font-medium uppercase tracking-widest mb-0.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                Diagnosis
              </p>
              <h3 className="text-xl font-extrabold" style={{ color: headerColor }}>
                {cls}
              </h3>
            </div>
          </div>
          <SeverityBadge severity={severity} />
        </div>

        {/* ── Body ────────────────────────────────────────── */}
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="shrink-0">
              <img
                src={imageUrl}
                alt="Analyzed leaf"
                className="w-24 h-24 object-cover rounded-xl border border-white/10"
              />
            </div>

            {/* Meta */}
            <div className="flex-1 space-y-2">
              <div className={`flex items-center gap-2 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
                <Leaf size={14} className="text-emerald-400 shrink-0" />
                <span className="font-medium">Pathogen:</span>
                <span className="italic">{pathogen}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
                <Stethoscope size={14} className="text-emerald-400 shrink-0" />
                <span className="font-medium">Confidence:</span>
                <span className="font-bold" style={{ color: headerColor }}>
                  {confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Confidence bars for all classes */}
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${dark ? "text-gray-500" : "text-gray-400"}`}>
              Model Confidence Scores
            </p>
            {Object.entries(all_scores).map(([label, val]) => (
              <AnimatedBar
                key={label}
                label={label}
                value={val}
                color={barColors[label] ?? "#94a3b8"}
              />
            ))}
          </div>

          {/* Treatment Report */}
          <div
            className={`rounded-xl p-5 border ${
              dark
                ? "bg-emerald-950/40 border-emerald-800/30"
                : "bg-emerald-50/80 border-emerald-200/60"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical size={16} className="text-emerald-400" />
              <p className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-emerald-400" : "text-emerald-700"}`}>
                Recommended Treatment Protocol
              </p>
            </div>
            <div className={`space-y-1.5 text-sm leading-relaxed ${dark ? "text-gray-300" : "text-gray-700"}`}>
              {treatment.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className={`mt-4 text-[10px] ${dark ? "text-gray-600" : "text-gray-400"}`}>
              * AI-generated recommendations. Always consult a certified agronomist for field-level decisions.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
