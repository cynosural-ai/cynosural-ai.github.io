import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight, Github } from "lucide-react";
import Workflow from "./Workflow";
import Reasoning from "./Reasoning";
import "./workflow.css";
import "./reasoning.css";

export const metadata: Metadata = {
  title: "PyLIMID | Cynosural AI Lab",
  description: "A Python library for modeling decisions under uncertainty.",
};

const repositoryUrl = "https://github.com/cynosural-ai/pylimid";
const docsUrl = "https://pylimid.readthedocs.io/";

export default function PyLIMIDPage() {
  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#040a16] via-[#0a1f3d] to-[#0d2b4e]" aria-hidden />

      <section className="max-w-7xl mx-auto px-4 w-full min-h-[calc(100vh-160px)] flex items-center py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16 w-full">
          <div className="max-w-xl">
            <h1 className="font-jost flex items-center gap-3 md:gap-4 text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              <Image src="/pylimid/pylimid-mark.svg" alt="" width={64} height={64} priority className="h-12 w-12 shrink-0 md:h-16 md:w-16" />
              PyLIMID
            </h1>
            <p className="text-lg text-blue-100/90 leading-relaxed mb-5">
              PyLIMID is a Python library for building and solving limited memory influence diagrams. It brings uncertainty, decisions, and their consequences together in an explicit model.
            </p>
            <p className="text-lg text-blue-100/90 leading-relaxed">
              Using simulation and policy gradients, PyLIMID fits decision rules and estimates their outcomes. Our research explores how agents can use models like these to reason and act under uncertainty.
            </p>
          </div>

          <aside className="w-full max-w-xl mx-auto rounded-2xl border border-white/10 bg-[#07182d]/70 shadow-2xl shadow-black/20 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="text-sm font-medium text-blue-100">Install PyLIMID</span>
              <span className="font-mono text-xs text-blue-200/55">pip</span>
            </div>
            <div className="px-5 py-5 md:px-6">
              <pre className="overflow-x-auto rounded-lg bg-[#040a16]/80 px-4 py-4 font-mono text-sm text-blue-50"><code>pip install pylimid</code></pre>
              <p className="mt-4 text-sm text-blue-200/60">Python 3.12 · CUDA support</p>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-white/10 px-5 py-4 md:px-6">
              <a href={repositoryUrl} className="inline-flex items-center gap-2 rounded-lg bg-[#7cc7e8] px-4 py-2.5 text-sm font-semibold text-[#06172a] transition-colors hover:bg-[#a9ddf1]">
                <Github className="h-4 w-4" aria-hidden /> Code
              </a>
              <a href={docsUrl} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Read the docs <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section id="agent-reasoning" className="border-t border-white/10 bg-[#07182d]/25 py-20" aria-labelledby="agent-decisions-heading">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 items-start gap-12 lg:gap-16">
          <div className="max-w-xl">
            <h2 id="agent-decisions-heading" className="font-jost text-3xl md:text-4xl font-semibold text-white mb-5">A tool for agent reasoning</h2>
            <p className="text-lg text-blue-100/85 leading-relaxed mb-5">
              Consider an agent deciding whether to run a promotion before demand is known. PyLIMID represents the choice, its effect on demand, and the resulting profit. The model can then be simulated and used to fit a decision rule.
            </p>
            <p className="text-lg text-blue-100/85 leading-relaxed">
              PyLIMID is one tool toward our broader goal of training agents that reason about consequences and make meaningful decisions in uncertain environments.
            </p>
          </div>
          <Workflow />
        </div>
      </section>

      <section id="reasoning-capabilities" className="border-t border-white/10 py-20" aria-labelledby="reasoning-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <h2 id="reasoning-heading" className="font-jost text-3xl md:text-4xl font-semibold text-white mb-5">Reason under uncertainty</h2>
            <p className="text-lg text-blue-100/85 leading-relaxed">
              A decision rule is only part of the problem. An agent also needs to represent what it does not know, use observations when they become available, and choose actions that fit the situation.
            </p>
          </div>
          <Reasoning />
        </div>
      </section>

      <section id="technical-foundations" className="border-t border-white/10 py-20 md:py-28" aria-labelledby="foundations-heading">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          <div className="max-w-xl">
            <h2 id="foundations-heading" className="font-jost text-3xl md:text-4xl font-semibold text-white mb-5">Technical foundations</h2>
            <p className="text-lg text-blue-100/85 leading-relaxed">
              NumPyro distributions let PyLIMID represent discrete and continuous uncertainty in one influence diagram. JAX functions define relationships and utilities, then compile and vectorize the simulations used to estimate outcomes and fit decision rules with policy gradients. PyLIMID runs on CPU by default, with optional CUDA support for compatible NVIDIA GPUs on Linux.
            </p>
          </div>

          <div className="grid grid-cols-2 items-center gap-8">
            <a href="https://num.pyro.ai/" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 text-sm font-medium text-blue-100/80 transition-opacity hover:opacity-80">
              <Image src="/pylimid/pyro_logo.png" alt="" width={128} height={108} className="h-20 w-24 object-contain md:h-[108px] md:w-32" />
              <span>NumPyro</span>
            </a>
            <a href="https://docs.jax.dev/" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 text-sm font-medium text-blue-100/80 transition-opacity hover:opacity-80">
              <Image src="/pylimid/jax_logo.svg" alt="" width={184} height={108} className="h-20 w-32 object-contain md:h-[108px] md:w-[184px]" />
              <span>JAX</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
