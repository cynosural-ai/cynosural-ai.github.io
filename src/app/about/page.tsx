export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-12 text-gray-900">About</h1>
        
        <div className="space-y-12">
          {/* About Section */}
          <section>
            <p className="text-lg text-gray-600 leading-relaxed">
              We are an independent AI research lab based in Madrid, Spain. Our work focuses on the development of open AI research projects that have a positive impact on society. We are currently focused on making Spanish historical archives more accessible.
            </p>
          </section>

          {/* Vision Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">Our Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe the best way to advance AI research is through openness. By releasing datasets, models, and code as open-source, people can use them, improve them, and push the field forward together.
            </p>
          </section>

          {/* Goals Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">Our Goals</h2>
            <ul className="text-lg text-gray-600 space-y-3 list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="text-[#209BD0] flex-shrink-0 leading-[1.75rem]">●</span>
                <span className="leading-relaxed">Contribute to AI research through open datasets, tools, and models that serve the public good</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#209BD0] flex-shrink-0 leading-[1.75rem]">●</span>
                <span className="leading-relaxed">Contribute to Spain's growing role in the global AI landscape</span>
              </li>
            </ul>
          </section>

          {/* Funding Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">Funding</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We are currently self-funded, using our own resources to bootstrap this initiative.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

