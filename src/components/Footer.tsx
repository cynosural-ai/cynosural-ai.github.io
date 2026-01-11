import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Trademark - 60% */}
          <div className="flex-1 md:w-[60%]">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Cynosural AI Lab. Open Source Research.
            </p>
          </div>

          {/* Resources and Learn More - 40% */}
          <div className="flex-1 md:w-[40%] grid grid-cols-2 gap-8">
            {/* Resources Column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="https://github.com/cynosural-ai" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-[#209BD0] transition-colors flex items-center gap-2"
                >
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://huggingface.co/cynosural" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-[#209BD0] transition-colors flex items-center gap-2"
                >
                  <span>Hugging Face</span>
                </a>
              </div>
            </div>

            {/* Learn More Column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Learn More
              </h3>
              <div>
                <Link 
                  href="/about"
                  className="text-gray-600 hover:text-[#209BD0] transition-colors"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
