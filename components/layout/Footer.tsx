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
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
