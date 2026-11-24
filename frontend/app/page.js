import Link from "next/link";

export default function Home() {
  return (
    <section className="hero">
      <h1>संविधान सेतु</h1>
      <p>
        Search the Constitution of India in Hindi and English. Know which Article protects you,
        in plain language.
      </p>
      <Link href="/articles" className="btn">Browse Articles</Link>{" "}
      <Link href="/rights" className="btn">Know Your Rights</Link>
    </section>
  );
}
