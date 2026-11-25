import Link from "next/link";
import { fetchGlossary } from "../../lib/api";
import { getLang } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";
import SaveButton from "../../components/SaveButton";
import { termItem } from "../../lib/library.mjs";

export const metadata = { title: "Legal Glossary | Samvidhan Setu" };

export default async function GlossaryPage({ searchParams }) {
  const q = searchParams?.q ?? "";
  const lang = getLang(searchParams);
  const hi = lang === "hi";
  let terms = [];
  let failed = false;
  try {
    terms = (await fetchGlossary(q)) ?? [];
  } catch {
    failed = true;
  }
  return (
    <>
      <h1>{hi ? "कानूनी शब्दकोश" : "Legal Glossary"}</h1>
      <LangToggle path="/glossary" lang={lang} q={q} />
      <form method="get" className="search">
        <input type="hidden" name="lang" value={lang} />
        <input name="q" defaultValue={q} placeholder={hi ? "जैसे: जमानत, warrant, FIR" : "e.g. bail, warrant, रिमांड"} aria-label="Search terms" />
        <button className="btn" type="submit">{hi ? "खोजें" : "Search"}</button>
      </form>
      {failed && <p className="note">Backend is not running.</p>}
      {!failed && terms.length === 0 && <p className="note">{hi ? "कोई शब्द नहीं मिला" : "No term found"}</p>}
      <ul className="list">
        {terms.map((t) => (
          <li key={t.slug} id={t.slug}>
            <h2>{hi ? t.term_hi : t.term_en}</h2>
            <p className="hi">{hi ? t.term_en : t.term_hi}</p>
            <p>{hi ? t.meaning_hi : t.meaning_en}</p>
            {t.related.length > 0 && (
              <p className="note">
                {hi ? "संबंधित: " : "Related: "}
                {t.related.map((r, i) => (
                  <span key={r}>{i > 0 && ", "}<Link href={`/ask?q=${encodeURIComponent(r)}&lang=${lang}`}>{r}</Link></span>
                ))}
              </p>
            )}
            <SaveButton item={termItem(t)} lang={lang} />
          </li>
        ))}
      </ul>
    </>
  );
}
