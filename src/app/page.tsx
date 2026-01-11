"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Guiding the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Artificial Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Cynosural AI Lab is a non-profit dedicated to ethical AI research, 
            open-source development, and democratizing access to advanced technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              View Our Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              Learn About Us
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Globe className="h-8 w-8 text-blue-600" />,
                title: "Global Impact",
                description: "Researching AI solutions that address critical global challenges in healthcare, environment, and education."
              },
              {
                icon: <Users className="h-8 w-8 text-indigo-600" />,
                title: "Community Driven",
                description: "Building an open community of researchers, developers, and ethicists working together."
              },
              {
                icon: <Zap className="h-8 w-8 text-purple-600" />,
                title: "Rapid Innovation",
                description: "Accelerating the development of safe and accessible AI tools for the public good."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="mb-4 p-3 bg-white rounded-xl inline-block shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
