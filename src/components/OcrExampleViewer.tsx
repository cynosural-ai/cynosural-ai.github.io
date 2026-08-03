"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/LocaleProvider";

type Block = {
  id: string;
  bbox: [number, number, number, number];
  label: string;
  content: string;
};

type OcrData = {
  image: string;
  width: number;
  height: number;
  blocks: Block[];
};

// Colors keyed by block label, mirroring the visualizer palette.
const COLOR_BY_LABEL: Record<string, { fill: string; stroke: string }> = {
  "Page-header": { fill: "rgba(255, 193, 7, 0.18)", stroke: "#f59e0b" },
  "Section-header": { fill: "rgba(244, 63, 94, 0.16)", stroke: "#f43f5e" },
  Title: { fill: "rgba(217, 70, 239, 0.16)", stroke: "#d946ef" },
  Text: { fill: "rgba(59, 130, 246, 0.14)", stroke: "#3b82f6" },
  "List-item": { fill: "rgba(16, 185, 129, 0.14)", stroke: "#10b981" },
  Footnote: { fill: "rgba(139, 92, 246, 0.16)", stroke: "#8b5cf6" },
  Picture: { fill: "rgba(236, 72, 153, 0.16)", stroke: "#ec4899" },
  Figure: { fill: "rgba(236, 72, 153, 0.16)", stroke: "#ec4899" },
  Illustration: { fill: "rgba(236, 72, 153, 0.16)", stroke: "#ec4899" },
  "Page-footer": { fill: "rgba(148, 163, 184, 0.18)", stroke: "#94a3b8" },
  default: { fill: "rgba(128, 128, 128, 0.14)", stroke: "#808080" },
};

const HIGHLIGHT = { fill: "rgba(250, 204, 21, 0.35)", stroke: "#eab308" };

function colorsFor(label: string) {
  return COLOR_BY_LABEL[label] ?? COLOR_BY_LABEL.default;
}

export default function OcrExampleViewer({ data }: { data: OcrData }) {
  const t = useTranslation("historicalArchives");
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const listRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isActive = (i: number) => hovered === i || selected === i;

  // When the active block changes, scroll the matching text card into view.
  useEffect(() => {
    if (hovered === null) return;
    listRefs.current[hovered]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [hovered]);

  const uniqueLabels = Array.from(new Set(data.blocks.map((b) => b.label)));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image + SVG overlay */}
        <div className="relative bg-gray-100 border-b lg:border-b-0 lg:border-r border-gray-200">
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt={t.viewer.imgAlt}
              className="block w-full h-auto select-none"
              draggable={false}
            />
            <svg
              viewBox={`0 0 ${data.width} ${data.height}`}
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              {data.blocks.map((block, i) => {
                const [x0, y0, x1, y1] = block.bbox;
                const active = isActive(i);
                const c = active ? HIGHLIGHT : colorsFor(block.label);
                return (
                  <rect
                    key={block.id}
                    x={x0}
                    y={y0}
                    width={x1 - x0}
                    height={y1 - y0}
                    fill={c.fill}
                    stroke={c.stroke}
                    strokeWidth={active ? 6 : 3}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(selected === i ? null : i)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 p-4 border-t border-gray-200 bg-white">
            {uniqueLabels.map((label) => {
              const c = colorsFor(label);
              return (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-sm border"
                    style={{ backgroundColor: c.fill, borderColor: c.stroke }}
                  />
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Text panel */}
        <div className="flex flex-col max-h-[640px] lg:max-h-[720px]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">{t.viewer.extractedText}</h3>
            <span className="text-xs text-gray-400">{data.blocks.length} {t.viewer.regions}</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {data.blocks.map((block, i) => {
              const active = isActive(i);
              return (
                <div
                  key={block.id}
                  ref={(el) => {
                    listRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(selected === i ? null : i)}
                  className={`px-5 py-3 cursor-pointer transition-colors ${
                    active ? "bg-yellow-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 uppercase tracking-wide"
                    >
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-sm border"
                        style={{
                          backgroundColor: colorsFor(block.label).fill,
                          borderColor: colorsFor(block.label).stroke,
                        }}
                      />
                      {block.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {block.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
