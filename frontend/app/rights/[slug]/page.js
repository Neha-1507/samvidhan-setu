import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchRight } from "../../../lib/api";
import { getLang, pick } from "../../../lib/lang";
import LangToggle from "../../../components/LangToggle";

export default async function RightDetail({ params, searchParams }) {
  const lang = getLang(searchParams);
  const topic = await fetchRight(params.slug);
  if (!topic) notFound();

  return (
    <article className="detail">
      <Link href={`/rights?lang=${lang}`}>{lang === "hi" ? "सभी विषय" : "All topics"}</Link>
      <LangToggle path={`/rights/${topic.slug}`} lang={lang} />
      <h1>{pick(topic, "title", lang)}</h1>
      <p className="lead">{pick(topic, "intro", lang)}</p>

      <ol className="steps">
        {topic.steps.map((s, i) => <li key={i}>{s[lang]}</li>)}
      </ol>

      <h2>{lang === "hi" ? "सहायता नंबर" : "Helplines"}</h2>
      <ul className="helplines">
        {topic.helplines.map((h) => (
          <li key={h.number}>{h.name}: <a href={`tel:${h.number}`}>{h.number}</a></li>
        ))}
      </ul>

      <h2>{lang === "hi" ? "संबंधित प्रावधान" : "Related provisions"}</h2>
      <ul className="helplines">
        {topic.related.map((r) => (
          <li key={r}><Link href={`/ask?q=${encodeURIComponent(r)}&lang=${lang}`}>{r}</Link></li>
        ))}
      </ul>
      {!topic.verified && <p className="note">{lang === "hi" ? "सत्यापन बाकी। यह कानूनी सलाह नहीं है।" : "Not yet verified. This is information, not legal advice."}</p>}
    </article>
  );
}
