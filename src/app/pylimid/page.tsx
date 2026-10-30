import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import CodeBlock from "./CodeBlock";
import CopyButton from "./CopyButton";
import ReadmeSidebar from "./ReadmeSidebar";
import ArticleLayout from "@/components/ArticleLayout";
import ShopDiagram from "./ShopDiagram";
import { functionsCode, modelCode, setupCode, solveCode } from "./example";
import "./pylimid.css";

export const metadata: Metadata = {
  title: "PyLIMID: limited-memory influence diagrams in Python | Cynosural AI Lab",
  description: "Build and solve limited-memory influence diagrams in Python. Model uncertainty with NumPyro, define utilities with JAX, and fit decision policies with PyLIMID.",
};

const docs = "https://pylimid.readthedocs.io/en/latest";
const repository = "https://github.com/cynosural-ai/pylimid";
const features: { title: string; body: string; code?: string }[] = [
  { title: "Flexible distributions", body: "Combine discrete and continuous chance nodes in one model. Describe uncertainty with NumPyro distributions whose parameters depend on their parents.", code: "dist.Gamma(concentration=4.0, rate=4.0 / mean)" },
  { title: "Bayesian priors", body: "Express uncertainty about the model itself. Give unknown parameters prior distributions, then update beliefs from observations.", code: "dist.LogNormal(loc, scale)" },
  { title: "Utilities as functions", body: "Write utilities with JAX. Express costs, thresholds, nonlinear returns, and risk preferences directly as functions of the model's variables.", code: "revenue - stock_cost - promotion_cost" },
  { title: "Discrete and continuous decisions", body: "Choose between named actions or a scalar quantity. Policy gradients jointly fit the decision rules within the policy families you declare.", code: "TabularSoftmax() · DistributionPolicy(...)" },
];

export default function PyLIMIDPage() {
  return (
    <div className="article-page pylimid-readme">
      <ArticleLayout sidebar={<ReadmeSidebar />}>
        <header className="readme-intro">
          <h1><Image src="/pylimid/pylimid-mark.svg" alt="" width={58} height={58} priority />PyLIMID</h1>
          <p className="readme-description"><a href="https://github.com/cynosural-ai/pylimid">PyLIMID</a> is a Python library for building and solving <strong>limited-memory influence diagrams</strong>. Chance nodes can be discrete, continuous, or both in the same model. Combine them with decisions and utility functions, then fit policies to maximize expected utility.</p>
        </header>

        <section id="installation" className="readme-section readme-install" aria-labelledby="install-title">
          <h2 id="install-title">Installation</h2>
          <p>Install PyLIMID with the following command in a Python 3.12 environment. The default installation uses the CPU. To run on an NVIDIA GPU on Linux, follow the <a className="readme-install-link" href={`${docs}/getting_started/installation.html`}>CUDA installation instructions <ArrowUpRight size={13} aria-hidden /></a>.</p>
          <div className="readme-install-command"><code><span aria-hidden>$ </span>pip install pylimid</code><CopyButton value="pip install pylimid" label="Copy install command" /></div>
        </section>

        <section id="features" className="readme-section" aria-labelledby="features-title">
          <h2 id="features-title">Features</h2>
          <div className="readme-features">
            {features.map((feature) => (
              <div className="readme-feature" key={feature.title}>
                <h3>{feature.title}</h3><p>{feature.body}</p>{feature.code && <code>{feature.code}</code>}
              </div>
            ))}
          </div>
        </section>

        <div className="readme-stack">
          <div className="readme-stack-logos">
            <a href="https://num.pyro.ai/"><Image src="/pylimid/pyro_logo.png" alt="NumPyro" width={85} height={72} /></a>
            <a href="https://docs.jax.dev/"><Image src="/pylimid/jax_logo.svg" alt="JAX" width={125} height={72} /></a>
          </div>
          <p className="readme-stack-label">Built on top of NumPyro and JAX</p>
        </div>

        <section id="example" className="readme-section readme-example" aria-labelledby="example-title">
          <h2 id="example-title">Example: promotion and stock decisions</h2>
          <p>This example models an ice cream shop that chooses whether to run a promotion and how much stock to order. Each kilogram costs $10 and sells for $100, and anything left at closing is thrown away.</p>
          <p>The owner has daily sales records and a weather log. From them, the shop estimates a 0.7 probability of a cloudy day and a 0.3 probability of a sunny day, with mean demand of 4 kg on cloudy days and 12 kg on sunny days.</p>
          <p>Demand is modeled as a Gamma distribution with concentration 4.0 and rate 4.0 / mean. The concentration gives a coefficient of variation of 0.5. A $60 promotion is expected to raise mean demand by 20%.</p>
          <p>The owner announces the promotion the evening before, when tomorrow’s weather is still unknown. In the morning, the owner checks the weather and decides how much to order, remembering whether the promotion is running. The freezer holds up to 40 kg.</p>

          <p>The problem can be modeled with the following influence diagram.</p>
          <ShopDiagram />
          <p>The shop is a small example. The same node types and policy families apply to other sequential decisions where the available information and objective can be written down.</p>

          <h3>Define uncertainty and profit</h3>
          <p>Demand follows a Gamma distribution whose mean depends on weather and promotion. Profit is revenue from what sells, minus stock and promotion costs.</p>
          <CodeBlock source={setupCode} title="Imports and parameters" />
          <CodeBlock source={functionsCode} title="Distributions and utility" />

          <h3>Build the influence diagram</h3>
          <p>Add the five nodes and connect their dependencies. The promotion chooses between two actions. The order chooses a quantity between 0 and 40 kilograms.</p>
          <CodeBlock source={modelCode} title="The model" />

          <h3>Fit the policies</h3>
          <p>Fit both policies together, then inspect their estimated expected utility.</p>
          <CodeBlock source={solveCode} title="Solve" />

          <h3 id="results-title">Fitted policies</h3>
          <p>In this quickstart run, the fitted promotion policy puts more than 99.9% probability on running the promotion. When it runs, mean orders are about <strong>7.2 kg on cloudy days</strong> and <strong>21.0 kg on sunny days</strong>.</p>
          <figure className="readme-policy-figure">
            <div className="readme-policy-scroll" tabIndex={0} role="region" aria-label="Fitted promotion and order policies. Scroll horizontally on small screens.">
              <Image src="/pylimid/order_policy.png" alt="The promotion is run with 99.972% probability. When it runs, order distributions have means of 7.2 kilograms on cloudy days and 21.0 kilograms on sunny days." width={2000} height={760} sizes="(max-width: 700px) 650px, 880px" />
            </div>
            <figcaption>Fitted policies from the quickstart. Order distributions are shown with the promotion running.</figcaption>
          </figure>
          <p>The estimated expected profit is about <strong>$542.6 per day</strong>. Both fitted policies remain stochastic. Results are approximate, and training does not guarantee the optimal policy.</p>
          <a className="readme-text-link" href={`${docs}/getting_started/quickstart.html#adding-a-bayesian-prior`}>Continue this example and explore more in the documentation, where the next step adds a Bayesian prior for a busier season <ArrowRight size={16} aria-hidden /></a>
        </section>

        <section id="next-steps" className="readme-section readme-next" aria-labelledby="next-title">
          <h2 id="next-title">Documentation</h2>
          <div className="readme-resource-links">
            <a href={`${docs}/getting_started/quickstart.html`}><span><strong>Quickstart</strong><span>Builds and solves the shop’s model, step by step.</span></span><ArrowUpRight size={20} aria-hidden /></a>
            <a href={`${docs}/user_guide/building_a_diagram.html`}><span><strong>User guide</strong><span>Explains each part of the model in depth.</span></span><ArrowUpRight size={20} aria-hidden /></a>
            <a href={`${docs}/api/index.html`}><span><strong>API reference</strong><span>Reference for the model classes and functions.</span></span><ArrowUpRight size={20} aria-hidden /></a>
          </div>
          <p className="readme-project-note">Open source under the <a href={`${repository}/blob/main/LICENSE.md`}>Apache 2.0 license</a>.</p>
        </section>
      </ArticleLayout>
    </div>
  );
}
