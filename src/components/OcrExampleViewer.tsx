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

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PROCESSING_DATE = "2026-08-28T12:00:00";

/**
 * Renders the layout data as ALTO XML v3, mirroring the pipeline output:
 * word-level Strings with the paragraph coordinates, SP separators, and
 * OCRProcessing metadata naming our toolkit.
 */
function toAltoXml(data: OcrData): string {
  const pad = (n: number) => String(n).padStart(4, "0");

  let lineCount = 0;
  const blocks = data.blocks
    .map((block, i) => {
      const [x0, y0, x1, y1] = block.bbox;
      const hpos = Math.round(x0);
      const vpos = Math.round(y0);
      const width = Math.round(x1 - x0);
      const height = Math.round(y1 - y0);

      const lines = block.content
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          lineCount += 1;
          const lineId = `PAG001LIN${pad(lineCount)}`;
          const strings = line
            .split(/\s+/)
            .map(
              (word) =>
                `<ns0:String CONTENT="${escapeXml(word)}" HPOS="${hpos}" VPOS="${vpos}" WIDTH="${width}" HEIGHT="${height}" WC="1" STYLEREFS="TEXTSTYLE0001"/>`
            )
            .join(`\n            <ns0:SP HPOS="${hpos}" VPOS="${vpos}" WIDTH="${width}" HEIGHT="${height}"/>\n            `);
          return `          <ns0:TextLine HPOS="${hpos}" VPOS="${vpos}" WIDTH="${width}" HEIGHT="${height}" ID="${lineId}">
            ${strings}
          </ns0:TextLine>`;
        })
        .join("\n");

      return `        <ns0:TextBlock HPOS="${hpos}" VPOS="${vpos}" WIDTH="${width}" HEIGHT="${height}" STYLEREFS="TEXTSTYLE0001" ID="PAG001BLK${pad(i + 1)}">
${lines}
        </ns0:TextBlock>`;
    })
    .join("\n");

  const fileName = data.image.split("/").pop() ?? "page";

  return `<?xml version="1.0" encoding="UTF-8"?>
<ns0:alto xmlns:ns0="http://www.loc.gov/standards/alto/ns-v3#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.loc.gov/standards/alto/ns-v3# http://www.loc.gov/standards/alto/v3/alto-3-1.xsd">
  <ns0:Description>
    <ns0:MeasurementUnit>pixel</ns0:MeasurementUnit>
    <ns0:sourceImageInformation>
      <ns0:fileName>${escapeXml(fileName)}</ns0:fileName>
    </ns0:sourceImageInformation>
    <ns0:OCRProcessing ID="OCRPROC001">
      <ns0:ocrProcessingStep>
        <ns0:processingDateTime>${PROCESSING_DATE}</ns0:processingDateTime>
        <ns0:processingSoftware>
          <ns0:softwareCreator>Cynosural AI</ns0:softwareCreator>
          <ns0:softwareName>ocr-toolkit</ns0:softwareName>
          <ns0:softwareVersion>0.1.0</ns0:softwareVersion>
        </ns0:processingSoftware>
      </ns0:ocrProcessingStep>
    </ns0:OCRProcessing>
  </ns0:Description>
  <ns0:Styles>
    <ns0:TextStyle ID="TEXTSTYLE0001" FONTFAMILY="Times New Roman" FONTTYPE="serif" FONTWIDTH="proportional" FONTSIZE="10"/>
  </ns0:Styles>
  <ns0:Layout>
    <ns0:Page ID="PAG0001" PHYSICAL_IMG_NR="1" HEIGHT="${data.height}" WIDTH="${data.width}" PROCESSING="OCRPROC001">
      <ns0:PrintSpace HEIGHT="${data.height}" WIDTH="${data.width}" HPOS="0" VPOS="0">
${blocks}
      </ns0:PrintSpace>
    </ns0:Page>
  </ns0:Layout>
</ns0:alto>`;
}

export default function OcrExampleViewer({ data }: { data: OcrData }) {
  const t = useTranslation("historicalArchives");
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAlto, setShowAlto] = useState(false);
  const listRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isActive = (i: number) => hovered === i || selected === i;

  // When the active block changes, scroll the matching text card into view.
  useEffect(() => {
    if (hovered === null) return;
    listRefs.current[hovered]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [hovered]);

  const uniqueLabels = Array.from(new Set(data.blocks.map((b) => b.label)));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm max-h-[70vh] flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 min-h-0">
        {/* Image + SVG overlay */}
        <div className="relative bg-gray-100 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto">
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
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              {showAlto ? t.viewer.altoTitle : t.viewer.extractedText}
            </h3>
            <div className="flex items-center gap-3">
              {!showAlto && (
                <span className="text-xs text-gray-400">
                  {data.blocks.length} {t.viewer.regions}
                </span>
              )}
              <button
                onClick={() => setShowAlto((v) => !v)}
                className="text-xs font-medium text-[#147ca6] hover:text-[#209BD0] bg-[#147ca6]/10 hover:bg-[#147ca6]/20 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
              >
                {showAlto ? t.viewer.textView : t.viewer.altoView}
              </button>
            </div>
          </div>
          {showAlto ? (
            <pre className="flex-1 min-h-0 overflow-auto p-5 text-[11px] leading-relaxed text-gray-700 font-mono whitespace-pre">
              {toAltoXml(data)}
            </pre>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
