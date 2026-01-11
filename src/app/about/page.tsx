export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-12 text-gray-900">About</h1>
        
        <div className="space-y-12">
          {/* About Section */}
          <section>
            <p className="text-lg text-gray-600 leading-relaxed">
              We are a newly created independent AI research lab based in Madrid, Spain. Our work focuses on applying AI to projects that benefit the public—starting with cultural heritage and open datasets.
            </p>
          </section>

          {/* Vision Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">Our Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe AI research should serve the public interest. By releasing open datasets, code, and tools, we aim to democratize access to AI capabilities and preserve cultural knowledge for future generations.
            </p>
          </section>

          {/* Goals Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">Our Goals</h2>
            <ul className="text-lg text-gray-600 space-y-3 list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="text-[#209BD0] flex-shrink-0 leading-[1.75rem]">●</span>
                <span className="leading-relaxed">Release open datasets and tools for research and AI training</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#209BD0] flex-shrink-0 leading-[1.75rem]">●</span>
                <span className="leading-relaxed">Make historical archives searchable and accessible</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#209BD0] flex-shrink-0 leading-[1.75rem]">●</span>
                <span className="leading-relaxed">Collaborate with cultural institutions and the open-source community</span>
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

