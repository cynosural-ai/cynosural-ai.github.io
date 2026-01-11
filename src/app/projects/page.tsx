import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Projects() {
  const projects = [
    {
      title: "Project Alpha",
      description: "An open-source initiative to improve natural language understanding in low-resource languages.",
      tags: ["NLP", "Open Source", "Research"],
      link: "#"
    },
    {
      title: "Vision for Good",
      description: "Computer vision models designed to assist in environmental monitoring and wildlife conservation.",
      tags: ["Computer Vision", "Environment", "AI"],
      link: "#"
    },
    {
      title: "Ethics First",
      description: "A comprehensive framework and toolkit for evaluating bias in machine learning datasets.",
      tags: ["Ethics", "Tooling", "Safety"],
      link: "#"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Projects</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Exploring the frontiers of AI with a focus on utility, safety, and accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{project.description}</p>
              <Link 
                href={project.link}
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Learn more <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

