import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic, Noto_Naskh_Arabic } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { ThemeProvider } from '@/components/ui/theme-provider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Mawaqit مواقيت — Precise Islamic Prayer Times",
  description: "Accurate Islamic prayer times based on your exact location, calculation methods, and madhab preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansArabic.variable} ${notoNaskhArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-text selection:bg-primary/20 selection:text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme={false}>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}