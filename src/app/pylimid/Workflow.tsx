"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const modelDiagram = `flowchart LR
  promotion["promotion"]
  demand(("demand"))
  profit{"profit"}
  promotion e1@--> demand
  promotion e2@--> profit
  demand e3@--> profit
  e1@{ animation: fast }
  e2@{ animation: fast }
  e3@{ animation: fast }
  classDef decision fill:#102e4c,stroke:#7cc7e8,stroke-width:1.5px,color:#dcecfb
  classDef chance fill:#102e4c,stroke:#7cc7e8,stroke-width:1.5px,color:#dcecfb
  classDef utility fill:#293735,stroke:#e5ce8e,stroke-width:1.5px,color:#fff3c6
  class promotion decision
  class demand chance
  class profit utility`;

const policyData = [
  { action: "Skip", before: 0.5, after: 0.3 },
  { action: "Run", before: 0.5, after: 0.7 },
];

const scenarioSamples = [
  { id: "01", action: "Skip", demand: "8 kg", utility: "$700" },
  { id: "02", action: "Run", demand: "12 kg", utility: "$840" },
  { id: "03", action: "Run", demand: "5 kg", utility: "$340" },
];

type StepPanelProps = {
  number: string;
  title: string;
  summary: string;
  children: ReactNode;
  className?: string;
};

function StepPanel({ number, title, summary, children, className = "" }: StepPanelProps) {
  const reduceMotion = useReducedMotion();
  const headingId = `workflow-step-${number}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <motion.section
      className={`workflow-panel ${className}`}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-labelledby={headingId}
    >
      <div className="workflow-panel-heading">
        <span className="workflow-panel-number">{number}</span>
        <h3 id={headingId} className="workflow-panel-title">{title}</h3>
      </div>
      <p className="workflow-panel-summary">{summary}</p>
      {children}
    </motion.section>
  );
}

function ModelGraph() {
  const container = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const diagramId = `pylimid-model-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        flowchart: { htmlLabels: true, curve: "basis", diagramPadding: 8, minNodeWidth: 0, nodeSpacing: 24, rankSpacing: 36 },
        themeVariables: {
          background: "#07182d",
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: "14px",
          lineColor: "#7cc7e8",
          edgeLabelBackground: "#0a1f3d",
        },
      });

      const { svg, bindFunctions } = await mermaid.render(diagramId, modelDiagram);
      if (cancelled || !container.current) return;

      container.current.innerHTML = svg;
      bindFunctions?.(container.current);
    }

    void renderDiagram().catch((error: unknown) => {
      if (!cancelled && container.current) {
        container.current.textContent = "The model diagram could not be rendered.";
      }
      console.error("Could not render the PyLIMID model diagram.", error);
    });

    return () => {
      cancelled = true;
    };
  }, [diagramId]);

  return (
    <div
      ref={container}
      className="workflow-mermaid"
      role="img"
      aria-label="Promotion decision changes uncertain demand and profit in an influence diagram"
    />
  );
}

function CodeStep() {
  return (
    <pre className="workflow-code" aria-label="Selected PyLIMID model declarations">
      <code>
        <span className="workflow-code-line">
          <span className="workflow-code-type">DecisionNode</span>
          <span className="workflow-code-punctuation">(</span>
          <span className="workflow-code-string">"promotion"</span>
          <span className="workflow-code-punctuation">, </span>
          <span className="workflow-code-parameter">states</span>
          <span className="workflow-code-punctuation">=(</span>
          <span className="workflow-code-string">"skip"</span>
          <span className="workflow-code-punctuation">, </span>
          <span className="workflow-code-string">"run"</span>
          <span className="workflow-code-punctuation">), </span>
          <span className="workflow-code-ellipsis">...</span>
          <span className="workflow-code-punctuation">)</span>
        </span>
        <span className="workflow-code-line">
          <span className="workflow-code-type">ChanceNode</span>
          <span className="workflow-code-punctuation">(</span>
          <span className="workflow-code-string">"demand"</span>
          <span className="workflow-code-punctuation">, </span>
          <span className="workflow-code-parameter">parents</span>
          <span className="workflow-code-punctuation">=(</span>
          <span className="workflow-code-string">"promotion"</span>
          <span className="workflow-code-punctuation">,), </span>
          <span className="workflow-code-ellipsis">...</span>
          <span className="workflow-code-punctuation">)</span>
        </span>
        <span className="workflow-code-line">
          <span className="workflow-code-type">UtilityNode</span>
          <span className="workflow-code-punctuation">(</span>
          <span className="workflow-code-string">"profit"</span>
          <span className="workflow-code-punctuation">, </span>
          <span className="workflow-code-parameter">parents</span>
          <span className="workflow-code-punctuation">=(</span>
          <span className="workflow-code-string">"promotion"</span>
          <span className="workflow-code-punctuation">, </span>
          <span className="workflow-code-string">"demand"</span>
          <span className="workflow-code-punctuation">), </span>
          <span className="workflow-code-ellipsis">...</span>
          <span className="workflow-code-punctuation">)</span>
        </span>
      </code>
    </pre>
  );
}

function ModelStep() {
  return <ModelGraph />;
}

function SimulationStep() {
  return (
    <div className="workflow-samples" aria-label="Illustrative sampled outcomes">
      {scenarioSamples.map((sample) => (
        <div key={sample.id} className="workflow-sample">
          <span className="workflow-sample-id">{sample.id}</span>
          <span className="workflow-sample-action">{sample.action} · {sample.demand}</span>
          <span className="workflow-sample-utility">{sample.utility}</span>
        </div>
      ))}
    </div>
  );
}

function PolicyStep() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="workflow-policy-chart" role="img" aria-label="Illustrative probabilities for running or skipping a promotion before and after policy fitting">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={policyData} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#9ac9eb" strokeOpacity={0.12} strokeDasharray="3 5" vertical={false} />
          <XAxis
            dataKey="action"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a9c6e2", fontSize: 11 }}
          />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 0.5, 1]}
            tickFormatter={(value: number) => `${Math.round(value * 100)}%`}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a9c6e2", fontSize: 10 }}
            width={40}
          />
          <Tooltip
            formatter={(value) => `${Math.round(Number(value) * 100)}%`}
            contentStyle={{ background: "#07182d", border: "1px solid #31506e", borderRadius: 8 }}
            labelStyle={{ color: "#dcecfb" }}
            itemStyle={{ color: "#dcecfb" }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ color: "#a9c6e2", fontSize: 11, paddingBottom: 6 }}
          />
          <Bar dataKey="before" name="Before" fill="#55718e" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={!reduceMotion} />
          <Bar dataKey="after" name="After" fill="#7cc7e8" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={!reduceMotion} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const steps = [
  {
    number: "01",
    title: "Define",
    summary: "Write uncertainty, actions and utility as a model.",
    content: <CodeStep />,
  },
  {
    number: "02",
    title: "Inspect",
    summary: "See which choices affect uncertain outcomes.",
    content: <ModelStep />,
  },
  {
    number: "03",
    title: "Simulate",
    summary: "Sample outcomes under a decision rule.",
    content: <SimulationStep />,
  },
  {
    number: "04",
    title: "Fit a policy",
    summary: "Use estimated utility to update the rule.",
    content: <PolicyStep />,
  },
];

export default function Workflow() {
  const [current, setCurrent] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  function goTo(index: number) {
    const container = track.current;
    if (container) container.scrollTo({ left: index * container.clientWidth });
  }

  return (
    <figure className="workflow-figure" aria-label="A four step example from a PyLIMID model to a fitted promotion policy">
      <div className="workflow-heading">
        <p className="workflow-heading-eyebrow">How it works</p>
        <h2 className="workflow-heading-title">From code to a decision rule</h2>
      </div>
      <div
        ref={track}
        className="workflow-steps"
        aria-label="Workflow steps"
        tabIndex={0}
        onScroll={(event) => {
          const element = event.currentTarget;
          setCurrent(Math.round(element.scrollLeft / element.clientWidth));
        }}
      >
        {steps.map((step) => (
          <div key={step.number} className="workflow-carousel-slide">
            <StepPanel {...step}>{step.content}</StepPanel>
          </div>
        ))}
      </div>
      <div className="workflow-carousel-controls">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          aria-label="Previous step"
        >
          <ChevronLeft aria-hidden />
        </button>
        <span aria-live="polite">{current + 1} / {steps.length}</span>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === steps.length - 1}
          aria-label="Next step"
        >
          <ChevronRight aria-hidden />
        </button>
      </div>
      <p className="workflow-swipe-hint">Swipe or use the arrows to explore each step.</p>
      <figcaption className="workflow-disclaimer">
        A simple business example. Samples and probabilities are illustrative.
      </figcaption>
    </figure>
  );
}
