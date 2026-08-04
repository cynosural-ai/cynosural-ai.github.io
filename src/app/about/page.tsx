"use client";

import { useTranslation } from "@/i18n/LocaleProvider";

export default function About() {
  const t = useTranslation("about");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-12 text-gray-900">{t.title}</h1>

        <div className="space-y-12">
          {/* About Section */}
          <section>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.intro}
            </p>
          </section>

          {/* Vision Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">{t.vision.heading}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.vision.body}
            </p>
          </section>

          {/* Goals Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">{t.goals.heading}</h2>
            <ul className="text-lg text-gray-600 space-y-3 list-none pl-0">
              {t.goals.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#209BD0] flex-shrink-0 leading-[1.75rem]">●</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Funding Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">{t.funding.heading}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.funding.body}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
