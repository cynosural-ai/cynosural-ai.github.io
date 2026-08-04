<!--
General notes:

 * Dont break lines at 80 characters, let lines flow and the viewer will adjust

-->

## Summary

Introduces a Historical Archives page with an interactive OCR example viewer, adds full English/Spanish internationalization across the site, and remakes the home page into a minimal single-viewport hero with a route-aware navbar and a streamlined footer.

## What changed

### Historical Archives feature (new)
- **`src/app/historical-archives/page.tsx` (new).** A dedicated page presenting the lab's initiative to open Spanish historical archives via large-scale OCR, with a navy hero section, the BNE dataset overview, and the interactive example viewer.
- **`src/components/OcrExampleViewer.tsx` (new).** An interactive component that displays a scanned historical document image alongside its OCR-extracted text, letting visitors compare the source scan against the transcribed output side by side.
- **Sample data and images.** Adds three worked examples under `public/historical-archives/` — `co_0079`, `img_0317`, `le_0011` — each as a compressed `.jpg` scan plus its OCR `.json` transcription. Original uncompressed scans are preserved under `public/historical-archives/originals/`. Also adds the BNE and BVdP archive logos (`logo_bne.svg`, `logo_bvpb.png`) and a `.jpg` collage variant.

### Internationalization (new)
- **i18n system.** Adds `src/i18n/` with a client-side `LocaleProvider` (built on `useSyncExternalStore` to avoid SSR hydration mismatches), locale config, and a typed dictionary registry. Per-locale string files live under `src/dictionaries/{en,es}/` for every page: `common`, `navbar`, `home`, `about`, `projects`, `historicalArchives`, `footer`. English is the source of truth; TypeScript enforces key-for-key parity with Spanish at build time. Document `<title>`, `<meta description>`, and `<html lang>` are synced at runtime.
- **All pages migrated** to read their copy from the dictionaries — About, Projects, Home, Navbar, Footer, and Historical Archives.

### Home page remake (`src/app/page.tsx`)
- Collapsed the multi-section layout (hero + "current initiative" section + dataset card + scroll-down arrow) into a single centered hero: "Cynosural" wordmark + logo icon in the `#003366` brand navy, plus a localized subtitle. The hero now `flex-grow`s to fill the space between navbar and footer, so the page fits one viewport with no scrollbar. Removed the dead `scrollToInitiative` handler (its target `id="main-initiative"` didn't exist on the home route).

### Layout and shared chrome
- **Layout flex chain (`src/app/layout.tsx`).** `<main>` is now `flex-grow flex flex-col min-h-0` so the home hero can absorb the remaining viewport height; other pages scroll normally since the wrapper stays `min-h-screen`. Root layout wrapped in `LocaleProvider`.
- **Navbar (`src/components/Navbar.tsx`).** Route-aware via `usePathname`: on `/` the brand is hidden and links are centered (Sakana-style); on other pages the brand (logo icon + "Cynosural" in `#003366`) shows left, links right. Locale switcher removed from the navbar (moved to the footer). Fixed the mobile hamburger's `aria-label`, which previously (mis)used the language-switcher label.
- **Footer (`src/components/Footer.tsx`).** Collapsed from a 2-column grid (Resources / Learn More) into a single thin row: copyright on the left, GitHub + Hugging Face + locale switcher on the right. The redundant "About" link was removed (already in the navbar). Footer copy is now just `© <year> Cynosural AI Lab`.
- **LocaleSwitcher (`src/components/LocaleSwitcher.tsx`, new).** The `EN | ES` button group extracted into its own reusable component, consumed by the Footer.
- **Projects page (`src/app/projects/page.tsx`).** Converted to a client component using the dictionary; placeholder "Project Alpha / Vision for Good / Ethics First" content replaced with localized strings; background changed from `bg-gray-50` to `bg-white`.

### Bug fixes
- Removed the leftover `@media (prefers-color-scheme: dark)` block in `globals.css` that turned the body near-black under OS dark mode (the translucent navbar was compositing grey over it). Navbar is now solid `bg-white` so it stays pure white on every page, including the dark-navy Historical Archives hero. Replaced the home hero's `from-slate-50` gradient (also grey at the top) with solid `bg-white`.

### Repo housekeeping
- Adds a `.gitignore` and the pull-request template under `.github/`.

## Why

This branch combines the lab's two main front-end efforts. First, showcasing the Historical Archives work — the OCR viewer makes the value of large-scale transcription tangible by showing real scanned pages next to their extracted text. Second, first-class English/Spanish support, since the Spanish archives audience is core to the lab's mission. The front-page redesign aims for a focused, minimal landing (no scroll) in the style of sakana.ai, while keeping all secondary content one click away via the navbar.

## Testing

- `npm run build` passes with no TypeScript errors; the dictionary type system confirms EN/ES key-for-key parity across all seven namespaces. All routes (`/`, `/about`, `/projects`, `/historical-archives`, `/_not-found`) prerender as static content.
- Manual checks: home page fits a single viewport with no scrollbar on desktop and mobile; navbar is pure white on every route; locale switcher in the footer toggles EN/ES and updates visible copy, `<html lang>`, and document title; non-home pages show the logo + "Cynosural" brand on the left with links on the right; Historical Archives page renders the hero, dataset overview, and OCR viewer with the three sample examples; OCR viewer displays scan and transcription side by side; mobile hamburger opens/closes and is correctly labelled.
