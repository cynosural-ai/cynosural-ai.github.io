"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FlowPath, PulseGroup } from "@/components/diagrams/motion";

type WorkflowArtProps = {
  viewBox: string;
  prefix: string;
  label: string;
};

const steps = [
  { label: "Model", viewBox: "20 92 194 242" },
  { label: "Simulate", viewBox: "233 92 194 242" },
  { label: "Policy", viewBox: "446 92 194 242" },
];

function WorkflowArt({ viewBox, prefix, label }: WorkflowArtProps) {
  return (
      <svg viewBox={viewBox} className={`w-full h-auto ${prefix.startsWith("mobile") ? "workflow-mobile" : ""}`} role="img" aria-label={label}>
        <title>{label}</title>
        <desc>Chance, decision, and utility nodes form a model. Simulated scenarios are used to fit a decision policy.</desc>
        <defs>
          <linearGradient id={`${prefix}-panel`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#132f50" stopOpacity=".8" />
            <stop offset="1" stopColor="#07182d" stopOpacity=".8" />
          </linearGradient>
          <linearGradient id={`${prefix}-policy-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#7cc7e8" stopOpacity=".3" />
            <stop offset="1" stopColor="#7cc7e8" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="1" y="1" width="658" height="398" rx="24" fill="#07182d" fillOpacity=".48" stroke="#9ac9eb" strokeOpacity=".13" />
        <text x="32" y="42" className="workflow-eyebrow">HOW PYLIMID WORKS</text>
        <text x="32" y="70" className="workflow-subtitle">From a decision model to a policy</text>

        <rect x="28" y="100" width="178" height="226" rx="16" fill={`url(#${prefix}-panel)`} stroke="#7cc7e8" strokeOpacity=".18" />
        <rect x="241" y="100" width="178" height="226" rx="16" fill={`url(#${prefix}-panel)`} stroke="#7cc7e8" strokeOpacity=".18" />
        <rect x="454" y="100" width="178" height="226" rx="16" fill={`url(#${prefix}-panel)`} stroke="#7cc7e8" strokeOpacity=".18" />

        <text x="48" y="132" className="workflow-step">01</text>
        <text x="48" y="155" className="workflow-title">Model</text>
        <path d="M 88 204 L 137 204 M 87 215 L 111 253 M 137 215 L 113 253" className="workflow-graph-line" />
        <circle cx="81" cy="204" r="15" fill="#102e4c" stroke="#7cc7e8" strokeWidth="1.5" />
        <rect x="127" y="189" width="30" height="30" rx="4" fill="#102e4c" stroke="#7cc7e8" strokeWidth="1.5" />
        <path d="M 111 246 L 127 262 L 111 278 L 95 262 Z" fill="#293735" stroke="#e5ce8e" strokeWidth="1.5" />
        <text x="48" y="301" className="workflow-caption">Chance · decisions · utility</text>

        <text x="261" y="132" className="workflow-step">02</text>
        <text x="261" y="155" className="workflow-title">Simulate</text>
        <PulseGroup className="workflow-scenario">
          <rect x="271" y="183" width="118" height="25" rx="6" fill="#173a58" stroke="#7cc7e8" strokeOpacity=".18" />
          <circle cx="284" cy="195.5" r="3" fill="#7cc7e8" />
          <path d="M 296 195.5 H 336 M 344 195.5 H 371" stroke="#a9c6e2" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
        </PulseGroup>
        <PulseGroup className="workflow-scenario" delay={0.45}>
          <rect x="271" y="217" width="118" height="25" rx="6" fill="#173a58" stroke="#7cc7e8" strokeOpacity=".18" />
          <circle cx="284" cy="229.5" r="3" fill="#7cc7e8" />
          <path d="M 296 229.5 H 324 M 332 229.5 H 371" stroke="#a9c6e2" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
        </PulseGroup>
        <PulseGroup className="workflow-scenario" delay={0.9}>
          <rect x="271" y="251" width="118" height="25" rx="6" fill="#173a58" stroke="#7cc7e8" strokeOpacity=".18" />
          <circle cx="284" cy="263.5" r="3" fill="#7cc7e8" />
          <path d="M 296 263.5 H 342 M 350 263.5 H 371" stroke="#a9c6e2" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
        </PulseGroup>
        <text x="261" y="301" className="workflow-caption">Sample possible outcomes</text>

        <text x="474" y="132" className="workflow-step">03</text>
        <text x="474" y="155" className="workflow-title">Policy</text>
        <path d="M 482 270 H 600 M 482 270 V 186" stroke="#a9c6e2" strokeOpacity=".3" strokeWidth="1" />
        <path d="M 484 267 C 501 264 505 250 513 230 C 521 210 530 193 540 195 C 553 196 556 219 566 240 C 575 259 587 265 598 267 L 598 270 L 484 270 Z" fill={`url(#${prefix}-policy-fill)`} />
        <path d="M 484 267 C 501 264 505 250 513 230 C 521 210 530 193 540 195 C 553 196 556 219 566 240 C 575 259 587 265 598 267" className="workflow-policy" />
        <text x="474" y="301" className="workflow-caption">Fit a decision rule</text>

        <g className="workflow-connectors">
        <path d="M 207 213 H 240 M 420 213 H 453" stroke="#7cc7e8" strokeOpacity=".3" strokeWidth="1.5" />
        <FlowPath d="M 207 213 H 240 M 420 213 H 453" className="workflow-flow" />
        </g>
        <text x="32" y="368" className="workflow-footnote">An illustrative view of the modeling process</text>
      </svg>
  );
}

export default function Workflow() {
  const [current, setCurrent] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  function goTo(index: number) {
    const container = track.current;
    if (container) container.scrollTo({ left: index * container.clientWidth });
  }

  return (
    <figure className="w-full min-w-0 max-w-[650px] mx-auto" aria-label="An illustrative workflow from a decision model to a policy">
      <div className="hidden sm:block">
        <WorkflowArt viewBox="0 0 660 400" prefix="desktop" label="From a decision model to a policy" />
      </div>
      <div className="sm:hidden rounded-3xl border border-white/10 bg-[#07182d]/50 p-5">
        <p className="text-xs font-semibold tracking-wider text-[#7cc7e8] uppercase mb-2">How PyLIMID works</p>
        <p className="font-jost text-blue-100 mb-4">From a decision model to a policy</p>
        <div
          ref={track}
          className="workflow-carousel flex overflow-x-auto snap-x snap-mandatory scroll-smooth motion-reduce:scroll-auto"
          aria-label="Workflow steps"
          tabIndex={0}
          onScroll={(event) => {
            const element = event.currentTarget;
            setCurrent(Math.round(element.scrollLeft / element.clientWidth));
          }}
        >
          {steps.map((step, index) => (
            <div key={step.label} className="w-full shrink-0 snap-center" role="group" aria-label={`${index + 1} of ${steps.length}: ${step.label}`}>
              <WorkflowArt viewBox={step.viewBox} prefix={`mobile-${index}`} label={`${step.label}, step ${index + 1} of ${steps.length}`} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Previous step" className="rounded-full p-2 text-blue-100 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <span className="text-sm text-blue-200/70" aria-live="polite">{current + 1} / {steps.length}</span>
          <button type="button" onClick={() => goTo(current + 1)} disabled={current === steps.length - 1} aria-label="Next step" className="rounded-full p-2 text-blue-100 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <p className="mt-2 text-xs text-blue-200/60 text-center">Swipe to explore the diagram</p>
        <p className="mt-2 text-xs text-blue-200/60 text-center">An illustrative view of the modeling process</p>
      </div>
    </figure>
  );
}
