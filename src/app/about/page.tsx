"use client";

import { useTranslation } from "@/i18n/LocaleProvider";

export default function About() {
  const t = useTranslation("about");

  return (
    <div className="min-h-screen">
      {/* Full-viewport night sky: a fixed layer behind everything, so it also
          shows through the transparent navbar and footer instead of the white
          body background. */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-b from-[#040a16] via-[#0a1f3d] to-[#0d2b4e]"
        aria-hidden
      />

      <div className="max-w-4xl mx-auto px-4 py-20 md:py-28">
        <h1 className="font-jost text-4xl md:text-5xl font-bold tracking-tight text-white mb-5">
          {t.title}
        </h1>
        <p className="text-lg md:text-xl text-blue-100/90 leading-relaxed max-w-2xl mb-16">
          {t.intro}
        </p>

        <div className="space-y-12">
          {/* Vision Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-blue-200/60 uppercase mb-4">{t.vision.heading}</h2>
            <p className="text-lg text-blue-100/90 leading-relaxed">
              {t.vision.body}
            </p>
          </section>

          {/* Goals Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-blue-200/60 uppercase mb-4">{t.goals.heading}</h2>
            <ul className="text-lg text-blue-100/90 space-y-3 list-none pl-0">
              {t.goals.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#7cc7e8] flex-shrink-0 leading-[1.75rem]">●</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Funding Section */}
          <section>
            <h2 className="text-sm font-semibold tracking-wider text-blue-200/60 uppercase mb-4">{t.funding.heading}</h2>
            <p className="text-lg text-blue-100/90 leading-relaxed">
              {t.funding.body}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
