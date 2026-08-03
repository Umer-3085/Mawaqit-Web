import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { ThemeProvider } from '../../components/ui/theme-provider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin","latin-ext"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Mawaqit - Prayer Times",
  description: "Accurate prayer times based on your location and calculation method.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme={false}><Providers>{children}</Providers></ThemeProvider></body>
    </html>
  );
}
