"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OcrExampleViewer from "@/components/OcrExampleViewer";

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

const EXAMPLES = [
  {
    label: "Table of contents",
    caption:
      "Table of contents from an early 19th-century publication. Headers, list entries, and page numbers detected as distinct region types.",
    src: "/historical-archives/le_0011.json",
  },
  {
    label: "Legal text (16th c.)",
    caption:
      "A 16th-century tax-law page in archaic Spanish — note spellings like \u201calcaualas\u201d and \u201couieren\u201d. Dense two-column prose.",
    src: "/historical-archives/co_0079.json",
  },
  {
    label: "Heraldic encyclopedia",
    caption:
      "An article from a noble-lineage encyclopedia, with structured Text regions plus Footnote regions detected separately.",
    src: "/historical-archives/img_0317.json",
  },
];

export default function HistoricalArchives() {
  const [active, setActive] = useState(0);
  const [data, setData] = useState<OcrData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(null);
    setError(false);
    fetch(EXAMPLES[active].src)
      .then((r) => {
        if (!r.ok) throw new Error("not ok");
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [active]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Historical Archives</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Spain&apos;s libraries and archives hold vast collections of scanned
          historical documents that are searchable by metadata, but not by what
          they actually say. We apply OCR to extract the full text and make these
          collections explorable by content. The examples below show pages from
          across the output — each region is detected automatically, and the
          extracted text appears beside it.
        </p>
      </div>

      {/* Interactive example */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {EXAMPLES.map((ex, i) => (
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
              Loading example…
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 h-96 flex items-center justify-center text-gray-400">
              Could not load example.
            </div>
          )}
        </motion.div>

        <p className="mt-4 text-sm text-gray-400 text-center max-w-2xl mx-auto">
          {EXAMPLES[active].caption} Hover or tap a region to highlight its
          text ·{" "}
          <a
            href="https://hemerotecadigital.bne.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            Biblioteca Nacional de España
          </a>
        </p>
      </section>
    </div>
  );
}
