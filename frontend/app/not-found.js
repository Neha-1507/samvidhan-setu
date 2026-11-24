import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <h1>404</h1>
      <p>यह पन्ना नहीं मिला। This page does not exist.</p>
      <Link href="/" className="btn">संविधान सेतु home</Link>
    </section>
  );
}
