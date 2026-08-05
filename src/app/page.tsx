import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <PageContainer className="flex flex-col items-center justify-center text-center py-16 md:py-24">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
        <span className="font-arabic font-bold text-sm">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text max-w-4xl leading-tight mb-6">
        Precise Prayer Times,{" "}
        <span className="text-primary bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
          Tailored to You
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed mb-8">
        Calculate accurate obligatory and Nafl prayer times using world-standard authorities, custom high-latitude rules, and exact geolocation.
      </p>

      {/* CTA Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
        <Link href="/prayer-times">
          <Button size="lg" className="px-8 font-semibold shadow-md shadow-primary/20">
            View Today's Prayer Times →
          </Button>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl text-left mt-8">
        <div className="p-6 rounded-2xl bg-surface border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
            📍
          </div>
          <h3 className="text-base font-semibold text-text mb-2">Exact Geolocation</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Automatic location detection with precise latitude, longitude, and IANA timezone resolution.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl mb-4">
            📐
          </div>
          <h3 className="text-base font-semibold text-text mb-2">12+ Calculation Methods</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Muslim World League, ISNA, Umm al-Qura, Egyptian, Karachi, Dubai, and custom high-latitude rules.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
            🌅
          </div>
          <h3 className="text-base font-semibold text-text mb-2">Nafl & Elevation</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Detailed Ishraq, Duha start/end, Awwabin, and solar elevation angles computed in real time.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl mb-4">
            🌙
          </div>
          <h3 className="text-base font-semibold text-text mb-2">Islamic Aesthetics</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Calm, serene interface with first-class Arabic typography, smooth dark mode, and zero clutter.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

