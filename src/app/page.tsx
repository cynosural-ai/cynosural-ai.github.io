"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Github, ArrowDown } from "lucide-react";

export default function Home() {
  const scrollToInitiative = () => {
    const element = document.getElementById('main-initiative');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-jost tracking-tight text-gray-900 mb-8">
          <span className="text-[#003366]">AI research for </span><span className="text-[#209BD0]">public benefit</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Independent research · Open source · From Madrid
          </p>
        </motion.div>

        {/* Scroll Down Arrow */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-12"
        >
          <button 
            onClick={scrollToInitiative}
            className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer animate-bounce"
            aria-label="Scroll to content"
          >
            <ArrowDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
          </button>
        </motion.div>
      </section>

      {/* Main Initiative Section */}
      <section id="main-initiative" className="w-full bg-gradient-to-br from-[#003366] to-[#002244] text-white min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row flex-grow">
          
          {/* Left Column: Image Collage (40% width on desktop) */}
          <div className="w-full md:w-[40%] relative min-h-[300px] md:min-h-auto">
            <Image 
              src="/collage_bne.png" 
              alt="Historical Newspaper Collage" 
              fill
              className="object-cover"
              priority
            />
            {/* Optional overlay for better integration if needed */}
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
          </div>

          {/* Right Column: Content (60% width on desktop) */}
          <div className="w-full md:w-[60%] p-8 md:p-16 lg:p-20 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-200 uppercase bg-blue-900/30 rounded-full border border-blue-500/30">
                Current Initiative
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold font-jost mb-6 text-white">
                Opening Historical Archives
              </h2>
              
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              Libraries and museums contain vast collections of scanned documents that are searchable by metadata but not by text. We are working on changing that by applying state-of-the-art OCR models to extract the full text from these archives, opening them up for research, exploration, and AI training.
              </p>

              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Our first release covers over 830,000 pages from the <a href="https://hemerotecadigital.bne.es/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline decoration-blue-300/30 underline-offset-4">Biblioteca Nacional de España</a>, drawn from 19th-century publications in science, medicine, literature, and more. Next, we plan to expand to other archives across Spain.
              </p>

              {/* Specific Project Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  BNE Hemeroteca OCR Dataset
                </h3>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold text-white">830K+</div>
                    <div className="text-xs text-blue-200/70 uppercase tracking-wide">Pages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">800M+</div>
                    <div className="text-xs text-blue-200/70 uppercase tracking-wide">Tokens</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">20</div>
                    <div className="text-xs text-blue-200/70 uppercase tracking-wide">Collections</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://huggingface.co/datasets/ferjorosa/bne-hemeroteca-ocr-xix" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FFD21E] text-gray-900 px-4 py-2.5 rounded-lg font-semibold hover:bg-[#F5C518] transition-colors text-sm"
                  >
                    <span role="img" aria-label="hugging face">🤗</span>
                    Dataset
                  </a>
                  <a 
                    href="https://github.com/ferjorosa/bne-hemeroteca-data" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#24292e] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#2f363d] transition-colors text-sm"
                  >
                    <Github className="w-4 h-4 flex-shrink-0" />
                    Code
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
      
    </div>
  );
}