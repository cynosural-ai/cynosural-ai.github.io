"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OcrExampleViewer from "@/components/OcrExampleViewer";
import { useTranslation } from "@/i18n/LocaleProvider";

type OcrData = {
  image: string;
  width: number;
  height: number;
  blocks: {
    id: string;
    bbox: [number, number, number, number];
    label: string;
    content: string;
  }[];
};

export default function HistoricalArchives() {
  const t = useTranslation("historicalArchives");
  const common = useTranslation("common");
  const examples = t.examples;

  const [active, setActive] = useState(0);
  const [data, setData] = useState<OcrData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    // Clear stale state for the new selection. Wrapped in the async path so we
    // don't call setState synchronously at the top of the effect body.
    (async () => {
      setData(null);
      setError(false);
      try {
        const r = await fetch(examples[active].src, { signal: controller.signal });
        if (!r.ok) throw new Error("not ok");
        const json = await r.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [active, examples]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">{t.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t.intro}
        </p>
      </div>

      {/* Interactive example */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {examples.map((ex, i) => (
            <button
              key={ex.src}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                active === i
                  ? "bg-[#003366] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {data && <OcrExampleViewer data={data} />}
          {!data && !error && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 h-96 flex items-center justify-center text-gray-400">
              {common.loadingExample}
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 h-96 flex items-center justify-center text-gray-400">
              {common.errorExample}
            </div>
          )}
        </motion.div>

        <p className="mt-4 text-sm text-gray-400 text-center max-w-2xl mx-auto">
          {examples[active].caption} {t.captionPrefix} ·{" "}
          <a
            href="https://hemerotecadigital.bne.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            {t.bneLink}
          </a>
        </p>
      </section>
    </div>
  );
}
