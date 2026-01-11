export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">About Cynosural AI Lab</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">
            Cynosural AI Lab is a recently founded non-profit organization focused on the intersection of artificial intelligence and human advancement. 
            Our name, "Cynosural," refers to something that serves as a focal point or a guiding star—reflecting our mission to guide the development of AI towards a beneficial future.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Mission</h2>
          <p className="mb-6">
            To conduct cutting-edge research in artificial intelligence while ensuring that the benefits of these technologies are accessible to all. 
            We believe in open science, ethical development, and the power of community collaboration.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-gray-900">What We Do</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Open Source AI Model Development</li>
            <li>Research into AI Safety and Alignment</li>
            <li>Educational Workshops and Resources</li>
            <li>Collaborative Projects with other Non-Profits</li>
          </ul>

          <p>
            We are just getting started. Join us on our journey to shape the future of AI.
          </p>
        </div>
      </div>
    </div>
  );
}

