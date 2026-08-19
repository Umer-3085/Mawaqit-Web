import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-surface/50 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text">Mawaqit مواقيت</span>
          <span>© {new Date().getFullYear()} — Islamic Prayer Calculation Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/prayer-times" className="hover:text-primary transition-colors">
            Prayer Times
          </Link>
          <Link href="/quran" className="hover:text-primary transition-colors">
            Quran
          </Link>
          <Link href="/library" className="hover:text-primary transition-colors">
            Library
          </Link>
          <Link href="/zakat" className="hover:text-primary transition-colors">
            Zakat
          </Link>
        </div>
      </div>
    </footer>
  );
}