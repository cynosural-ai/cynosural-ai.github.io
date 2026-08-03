import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import enCommon from "@/dictionaries/en/common.json";

const inter = Inter({ subsets: ["latin"] });
export const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

// Build-time default metadata (default locale). The LocaleProvider updates the
// document title/description at runtime once the user's locale is resolved.
export const metadata: Metadata = {
  title: enCommon.metadata.title,
  description: enCommon.metadata.description,
  icons: {
    icon: [
      { url: "/cynosural_logo.ico", sizes: "any" },
      { url: "/cynosural_logo.ico", type: "image/x-icon" },
    ],
    shortcut: "/cynosural_logo.ico",
    apple: "/cynosural_logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${jost.variable}`}>
        <LocaleProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
