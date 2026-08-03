"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function HistoricalArchives() {
  const [data, setData] = useState<OcrData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/historical-archives/le_0011.json")
      .then((r) => {
        if (!r.ok) throw new Error("not ok");
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Historical Archives</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Spain&apos;s libraries and archives hold vast collections of scanned
          historical documents that are searchable by metadata, but not by what
          they actually say. We apply OCR to extract the full text and make these
          collections explorable by content. The example below shows one page
          from the output — each region is detected automatically, and the
          extracted text appears beside it.
        </p>
      </div>

      {/* Interactive example */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
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

        <p className="mt-4 text-sm text-gray-400 text-center">
          Hover or tap a region to highlight its text. Table of contents page,
          early 19th-century publication ·{" "}
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
