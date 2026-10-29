"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

const beliefData = Array.from({ length: 41 }, (_, index) => {
  const demand = index / 4;
  return {
    demand,
    prior: Math.exp(-0.5 * ((demand - 4.5) / 1.8) ** 2),
    posterior: Math.exp(-0.5 * ((demand - 6.2) / 1.15) ** 2),
  };
});

const quantityData = Array.from({ length: 41 }, (_, quantity) => ({
  quantity,
  density: Math.exp(-0.5 * ((quantity - 23) / 5) ** 2),
}));

export default function Reasoning() {
  return (
    <div className="reasoning-grid">
      <article className="reasoning-item">
        <span className="reasoning-index">01 / BELIEFS</span>
        <h3>Update what is known</h3>
        <p>Represent uncertain conditions with prior distributions. As observations arrive, infer how those beliefs change.</p>
        <div className="reasoning-visual" role="img" aria-label="Illustrative prior and posterior distributions over demand">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={beliefData} margin={{ top: 10, right: 4, bottom: 0, left: 4 }}>
              <Area dataKey="prior" type="monotone" stroke="#607b9b" fill="#607b9b" fillOpacity={0.12} strokeWidth={2} isAnimationActive={false} />
              <Area dataKey="posterior" type="monotone" stroke="#7cc7e8" fill="#7cc7e8" fillOpacity={0.16} strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="reasoning-legend"><span><i className="reasoning-key reasoning-key-prior" /> Prior</span><span><i className="reasoning-key reasoning-key-posterior" /> After observation</span></div>
      </article>

      <article className="reasoning-item">
        <span className="reasoning-index">02 / ACTIONS</span>
        <h3>Choose across action spaces</h3>
        <p>A decision can select a named action or a scalar quantity. A policy gives the agent a rule for choosing each.</p>
        <div className="reasoning-actions">
          <div className="reasoning-action-label"><span>Discrete</span><span>Skip / run</span></div>
          <div className="reasoning-categorical"><span>Skip</span><span>Run</span></div>
          <div className="reasoning-action-label reasoning-quantity-label"><span>Continuous</span><span>Order quantity</span></div>
          <div className="reasoning-quantity" role="img" aria-label="Illustrative continuous policy distribution over order quantity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quantityData} margin={{ top: 0, right: 2, bottom: 0, left: 2 }}>
                <Area dataKey="density" type="monotone" stroke="#e5ce8e" fill="#e5ce8e" fillOpacity={0.18} strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </article>

      <article className="reasoning-item">
        <span className="reasoning-index">03 / INFORMATION</span>
        <h3>Ask what more information changes</h3>
        <p>Specify what an agent knows before each decision. Give it another observation, refit the policy, and compare estimated outcomes.</p>
        <div className="reasoning-information" aria-label="Compare decisions without and with an additional report">
          <div><span>Without report</span><strong>Known conditions</strong></div>
          <div className="reasoning-information-arrow" aria-hidden>↓</div>
          <div><span>With report</span><strong>Known conditions + report</strong></div>
        </div>
        <p className="reasoning-note">The comparison requires evaluating both policies across possible outcomes.</p>
      </article>
      <p className="reasoning-disclaimer">Visual distributions illustrate the concepts and are not fitted PyLIMID output.</p>
    </div>
  );
}
