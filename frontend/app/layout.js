import "./globals.css";
import Link from "next/link";
import MoreMenu from "../components/MoreMenu";

export const metadata = {
  title: "Samvidhan Setu | संविधान सेतु",
  description: "A bridge between citizens and the Constitution of India, in Hindi and English.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bar">
          <Link href="/" className="brand">संविधान सेतु</Link>
          <nav aria-label="Main">
            <Link href="/ask">Ask</Link>
            <Link href="/articles">Constitution</Link>
            <Link href="/laws">Laws</Link>
            <Link href="/cases">Cases</Link>
            <Link href="/rights">Rights</Link>
            <Link href="/library">Library</Link>
            <MoreMenu
              label="More"
              links={[
                { href: "/compare", label: "Compare cases" },
                { href: "/convert", label: "Old to new law" },
                { href: "/analyze", label: "Document reader" },
                { href: "/glossary", label: "Glossary" },
                { href: "/quiz", label: "Quiz" },
                { href: "/schedules", label: "Schedules" },
                { href: "/preamble", label: "Preamble" },
              ]}
            />
          </nav>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">
          Legal information only. For your case, consult a qualified advocate.
        </footer>
      </body>
    </html>
  );
}
