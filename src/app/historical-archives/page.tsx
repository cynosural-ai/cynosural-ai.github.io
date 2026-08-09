"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, ArrowDown } from "lucide-react";
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

  const scrollToExamples = () => {
    document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" });
  };

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
    <div className="min-h-screen">
      {/* Full-viewport night sky behind everything (transparent navbar/footer) */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-b from-[#040a16] via-[#0a1f3d] to-[#0d2b4e]"
        aria-hidden
      />
      {/* Main Initiative Section */}
      <section id="main-initiative" className="w-full min-h-[calc(100vh-80px)] text-white relative flex flex-col">
        <div className="max-w-7xl mx-auto px-4 w-full flex-grow flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 md:py-20">

          {/* Left Column: Narrative */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-jost mb-6 text-white">
                {t.initiative.title}
              </h2>

              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                {t.initiative.p1}
              </p>

              <p className="text-lg text-blue-100 leading-relaxed">
                {t.initiative.p2}
              </p>
            </motion.div>
          </div>

          {/* Right Column: Dataset card — the visual anchor */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-lg w-full lg:ml-auto"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-3xl font-semibold mb-5 text-white">
                  {t.initiative.datasetTitle}
                </h3>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-7">
                  <div>
                    <div className="text-2xl font-bold text-white">830K+</div>
                    <div className="text-xs text-blue-200/70 uppercase tracking-wide">{t.stats.pages}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">800M+</div>
                    <div className="text-xs text-blue-200/70 uppercase tracking-wide">{t.stats.tokens}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">20</div>
                    <div className="text-xs text-blue-200/70 uppercase tracking-wide">{t.stats.collections}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://huggingface.co/datasets/ferjorosa/bne-hemeroteca-ocr-xix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FFD21E] text-gray-900 px-5 py-3 rounded-lg font-semibold hover:bg-[#FFF0B3] transition-colors text-sm"
                  >
                    <span role="img" aria-label={t.actions.datasetAriaLabel}>🤗</span>
                    {t.actions.dataset}
                  </a>
                  <a
                    href="https://github.com/ferjorosa/bne-hemeroteca-data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#24292e] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#2f363d] transition-colors text-sm"
                  >
                    <Github className="w-4 h-4 flex-shrink-0" />
                    {t.actions.code}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={scrollToExamples}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer animate-bounce"
            aria-label={t.scrollAriaLabel}
          >
            <ArrowDown className="w-6 h-6 text-blue-100 flex-shrink-0" />
          </button>
        </motion.div>
      </section>

      {/* Interactive example */}
      <section id="examples" className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)] scroll-mt-16 flex flex-col justify-center">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {examples.map((ex, i) => (
            <button
              key={ex.src}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                active === i
                  ? "bg-[#147ca6] text-white"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
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
            <div className="rounded-2xl border border-white/10 bg-white/5 h-96 flex items-center justify-center text-white/50">
              {common.loadingExample}
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-white/10 bg-white/5 h-96 flex items-center justify-center text-white/50">
              {common.errorExample}
            </div>
          )}
        </motion.div>

        <p className="mt-4 text-sm text-white/60 text-center">
          {t.imageSourcePrefix}{" "}
          <a
            href="https://bvpb.mcu.es/es/inicio/inicio.do"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            {t.imageSource}
          </a>
        </p>
      </section>
    </div>
  );
}
