export default function ShopDiagram() {
  return (
    <figure className="readme-diagram">
      <div className="readme-diagram-scroll" tabIndex={0} role="region" aria-label="Ice cream shop influence diagram. Scroll horizontally on small screens.">
        <svg viewBox="0 -10 760 310" role="img" aria-labelledby="shop-diagram-title shop-diagram-description">
          <title id="shop-diagram-title">Ice cream shop influence diagram</title>
          <desc id="shop-diagram-description">Promotion is chosen before the weather is known. Order observes weather and remembers promotion. Demand depends on weather and promotion. Profit depends on promotion, order, and demand. Dashed arrows show information available to the order decision.</desc>
          <defs>
            <marker id="shop-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7" fill="none" stroke="currentColor" strokeWidth="1.2" /></marker>
          </defs>
          <g className="readme-graph-edges" markerEnd="url(#shop-arrow)">
            <path d="M176 70 H302" strokeDasharray="5 5" />
            <path d="M156 211 C224 211 222 94 302 94" strokeDasharray="5 5" />
            <path d="M159 230 H299" />
            <path d="M134 97 C134 157 276 171 309 210" />
            <path d="M144 43 C195 -3 551 1 601 110" />
            <path d="M438 82 C493 82 507 124 564 145" />
            <path d="M428 221 C499 221 514 184 564 163" />
          </g>
          <g className="readme-graph-decision">
            <rect x="44" y="43" width="132" height="54" rx="6" />
            <rect x="302" y="43" width="136" height="54" rx="6" />
          </g>
          <g className="readme-graph-chance">
            <ellipse cx="110" cy="230" rx="68" ry="30" />
            <ellipse cx="370" cy="230" rx="71" ry="30" />
          </g>
          <path className="readme-graph-utility" d="M620 109 683 154 620 199 557 154Z" />
          <g className="readme-graph-labels" textAnchor="middle">
            <text x="110" y="76">promotion</text>
            <text x="370" y="76">order</text>
            <text x="110" y="236">weather</text>
            <text x="370" y="236">demand</text>
            <text x="620" y="160">profit</text>
          </g>
          <g className="readme-graph-notes" textAnchor="middle">
            <text x="110" y="122">skip / run</text>
            <text x="370" y="122">0-40 kg</text>
            <text x="110" y="283">Cloudy / sunny</text>
            <text x="370" y="283">Uncertain quantity</text>
            <text x="620" y="226">Revenue - costs</text>
          </g>
        </svg>
      </div>
      <figcaption>
        <span><i className="readme-legend-line" /> Dependency</span>
        <span><i className="readme-legend-line readme-legend-dashed" /> Information at decision time</span>
      </figcaption>
    </figure>
  );
}
