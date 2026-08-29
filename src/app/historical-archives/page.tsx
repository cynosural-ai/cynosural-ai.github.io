"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, ScanText, FileCode2, Gauge, Mail } from "lucide-react";
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

const HOW_ICONS = [ScanText, FileCode2, Gauge];

export default function HistoricalArchives() {
  const t = useTranslation("historicalArchives");
  const common = useTranslation("common");
  const examples = t.examples;

  const [active, setActive] = useState(0);
  const [data, setData] = useState<OcrData | null>(null);
  const [error, setError] = useState(false);

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
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

          {/* Right Column: Collage — the visual anchor */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-lg w-full lg:ml-auto"
            >
              <figure className="bg-white/5 backdrop-blur-sm rounded-3xl p-3 border border-white/10">
                <Image
                  src="/collage_bne.jpg"
                  alt={t.collageAlt}
                  width={1366}
                  height={911}
                  className="rounded-2xl w-full h-auto"
                />
              </figure>
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
            onClick={scrollToHowItWorks}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer animate-bounce"
            aria-label={t.scrollAriaLabel}
          >
            <ArrowDown className="w-6 h-6 text-blue-100 flex-shrink-0" />
          </button>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 py-20 scroll-mt-16">
        <h2 className="text-3xl md:text-4xl font-bold font-jost text-white mb-10 text-center">
          {t.howItWorks.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.howItWorks.items.map((item, i) => {
            const Icon = HOW_ICONS[i % HOW_ICONS.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#147ca6]/20 border border-[#147ca6]/40 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#5fc2e0]" />
                  </div>
                  <span className="text-4xl font-bold font-jost text-white/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-blue-100/80 leading-relaxed text-sm">{item.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive example */}
      <section id="examples" className="max-w-7xl mx-auto px-4 py-8 scroll-mt-16 flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-bold font-jost text-white mb-3 text-center">
          {t.examplesTitle}
        </h2>
        <p className="text-blue-100/70 text-center max-w-2xl mx-auto mb-8">
          {t.examplesHint}
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5 justify-center">
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

      {/* Call to action */}
      <section id="work-with-us" className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-10 md:p-14 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-jost text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-lg text-blue-100/80 mb-8 max-w-xl mx-auto">
            {t.cta.body}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${t.cta.email}`}
              className="inline-flex items-center gap-2 bg-[#FFD21E] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#FFF0B3] transition-colors text-sm"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              {t.cta.contact}
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
