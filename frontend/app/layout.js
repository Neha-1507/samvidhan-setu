import "./globals.css";
import Link from "next/link";

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
          <nav>
            <Link href="/articles">Constitution</Link>
            <Link href="/laws">Laws</Link>
            <Link href="/cases">Cases</Link>
            <Link href="/rights">Rights</Link>
            <Link href="/schedules">Schedules</Link>
            <Link href="/preamble">Preamble</Link>
            <Link href="/ask">Ask</Link>
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
