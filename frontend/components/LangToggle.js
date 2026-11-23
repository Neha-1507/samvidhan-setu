import Link from "next/link";

// Server component: switches language through the ?lang= query parameter.
export default function LangToggle({ path, lang, q = "" }) {
  const href = (l) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("lang", l);
    return `${path}?${params.toString()}`;
  };
  return (
    <div className="lang" role="group" aria-label="Language">
      <Link href={href("en")} aria-current={lang === "en" ? "true" : undefined}>English</Link>
      <Link href={href("hi")} aria-current={lang === "hi" ? "true" : undefined}>हिंदी</Link>
    </div>
  );
}
