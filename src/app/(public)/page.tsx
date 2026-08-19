import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { Clock, BookOpenText, HandCoins, LibraryBig } from 'lucide-react';

const FEATURES = [
  {
    href: '/prayer-times',
    icon: Clock,
    title: 'Prayer Times',
    arabic: 'أوقات الصلاة',
    description:
      'Prayer times for your location with the method and rules that suit you.',
    accent: 'primary' as const,
  },
  {
    href: '/quran',
    icon: BookOpenText,
    title: 'The Holy Quran',
    arabic: 'القرآن الكريم',
    description:
      'Read the Quran in Arabic with translations and tafsir alongside each verse.',
    accent: 'primary' as const,
  },
  {
    href: '/library',
    icon: LibraryBig,
    title: 'Islamic Library',
    arabic: 'المكتبة',
    description:
      'Articles and videos on the Quran, Hadith and Fiqh, arranged by topic.',
    accent: 'secondary' as const,
  },
  {
    href: '/zakat',
    icon: HandCoins,
    title: 'Zakat Calculator',
    arabic: 'الزكاة',
    description:
      'A simple estimate of your Zakat on cash, gold, silver and other assets.',
    accent: 'secondary' as const,
  },
];

export default function Home() {
  return (
    <PageContainer className="space-y-14 py-14 md:py-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime/10 border border-lime/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <span className="font-arabic font-bold text-sm" dir="rtl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text max-w-4xl leading-tight mb-6">
          Everything for your daily worship,{" "}
          <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
            in one place
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed mx-auto mb-8">
          Mawaqit brings together accurate prayer times, the Quran, a library of trusted
          reading and a Zakat calculator so you can focus on your worship.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/prayer-times"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-semibold text-text hover:border-lime/50 hover:text-primary hover:bg-surface transition-colors"
          >
            <Clock className="w-4 h-4" />
            Prayer Times
          </Link>
          <Link
            href="/quran"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-semibold text-text hover:border-lime/50 hover:text-primary hover:bg-surface transition-colors"
          >
            <BookOpenText className="w-4 h-4" />
            Quran
          </Link>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-semibold text-text hover:border-lime/50 hover:text-primary hover:bg-surface transition-colors"
          >
            <LibraryBig className="w-4 h-4" />
            Library
          </Link>
          <Link
            href="/zakat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-semibold text-text hover:border-lime/50 hover:text-primary hover:bg-surface transition-colors"
          >
            <HandCoins className="w-4 h-4" />
            Zakat
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        {FEATURES.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl"
          >
            <div
              className={`h-full p-6 rounded-2xl bg-surface-elevated border border-border/40 shadow-sm hover:shadow-md transition-all duration-150 ${
                feature.accent === 'secondary'
                  ? 'group-hover:border-secondary/40'
                  : 'group-hover:border-primary/40'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-4 ${
                  feature.accent === 'secondary'
                    ? 'bg-secondary/10 text-secondary border-secondary/25'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text flex items-center gap-2">
                {feature.title}
                <span
                  className={`font-arabic text-sm font-semibold ${
                    feature.accent === 'secondary' ? 'text-secondary' : 'text-primary'
                  }`}
                  dir="rtl"
                >
                  {feature.arabic}
                </span>
              </h3>
              <p className="text-xs text-text-muted leading-relaxed mt-1.5">{feature.description}</p>
              <p
                className={`text-xs font-semibold mt-4 ${
                  feature.accent === 'secondary' ? 'text-secondary' : 'text-primary'
                }`}
              >
                Visit {feature.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}