# cynosural-ai.github.io

Cynosural AI Lab website.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/cynosural-ai/cynosural-ai.github.io.git
   cd cynosural-ai.github.io
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all required packages including Next.js, React, Tailwind CSS, and other dependencies.

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

The development server uses Next.js with Turbopack for fast hot-reloading. Any changes you make to the code will automatically refresh in the browser.

## Project Structure

- `src/app/` - Next.js app router pages and layouts
- `src/components/` - React components
- `public/` - Static assets (images, icons, etc.)
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS
- `next.config.ts` - Next.js configuration

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons