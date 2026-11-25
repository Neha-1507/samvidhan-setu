import Link from "next/link";
import { fetchCases, fetchCompare } from "../../lib/api";
import { getLang } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";

export const metadata = { title: "Compare Cases | Samvidhan Setu" };

const L = {
  en: { title: "Compare two cases", pick: "Choose two Supreme Court cases to see them side by side.", a: "First case", b: "Second case", go: "Compare",
    issue: "Question the court decided", held: "What the court held", bench: "Bench", judges: "judges", unknown: "not recorded", prov: "Provisions involved",
    none: "none listed", relate: "How they relate", earlier: "Decided earlier", shared: "Provisions in both", themes: "Themes in both", only: "Only in",
    same: "Please choose two different cases.", noBackend: "Backend is not running.", verify: "Not yet verified", src: "Official source" },
  hi: { title: "दो फैसलों की तुलना", pick: "दो सर्वोच्च न्यायालय के फैसले चुनें और उन्हें आमने-सामने देखें।", a: "पहला फैसला", b: "दूसरा फैसला", go: "तुलना करें",
    issue: "अदालत ने कौन सा प्रश्न तय किया", held: "अदालत ने क्या कहा", bench: "पीठ", judges: "न्यायाधीश", unknown: "दर्ज नहीं", prov: "संबंधित प्रावधान",
    none: "कोई नहीं", relate: "दोनों में संबंध", earlier: "पहले तय हुआ", shared: "दोनों में समान प्रावधान", themes: "दोनों में समान विषय", only: "केवल इसमें",
    same: "कृपया दो अलग फैसले चुनें।", noBackend: "बैकएंड चालू नहीं है।", verify: "सत्यापन बाकी", src: "आधिकारिक स्रोत" },
};

function CaseColumn({ c, lang, t }) {
  const hi = lang === "hi";
  return (
    <section className="case-col">
      <h2>{c.name} ({c.year})</h2>
      <p className="note">{c.court} | {c.citation}</p>
      {!c.verified && <span className="badge">{t.verify}</span>}
      <h3>{t.issue}</h3>
      <p>{hi ? c.legal_issue_hi : c.legal_issue_en}</p>
      <h3>{t.held}</h3>
      <p>{hi ? c.summary_hi : c.summary_en}</p>
      <p><strong>{t.bench}:</strong> {c.bench_size ? `${c.bench_size} ${t.judges}` : t.unknown}</p>
      <p><strong>{t.prov}:</strong> {c.provisions.length ? c.provisions.join(", ") : t.none}</p>
      <a href={c.source} target="_blank" rel="noreferrer">{t.src}</a>
    </section>
  );
}

export default async function ComparePage({ searchParams }) {
  const lang = getLang(searchParams);
  const t = L[lang];
  const a = searchParams?.a ?? "";
  const b = searchParams?.b ?? "";
  let cases = [];
  let result = null;
  let failed = false;
  let sameChoice = false;
  try {
    cases = (await fetchCases("")) ?? [];
    if (a && b) {
      if (a === b) sameChoice = true;
      else result = await fetchCompare(a, b);
    }
  } catch {
    failed = true;
  }
  const nameOf = (id) => cases.find((c) => c.id === id)?.name ?? id;

  return (
    <>
      <h1>{t.title}</h1>
      <LangToggle path="/compare" lang={lang} />
      <p className="note">{t.pick}</p>
      <form method="get" className="compare-form">
        <input type="hidden" name="lang" value={lang} />
        <label>{t.a}
          <select name="a" defaultValue={a}>
            <option value="">-</option>
            {cases.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.year})</option>)}
          </select>
        </label>
        <label>{t.b}
          <select name="b" defaultValue={b}>
            <option value="">-</option>
            {cases.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.year})</option>)}
          </select>
        </label>
        <button className="btn" type="submit">{t.go}</button>
      </form>

      {failed && <p className="note">{t.noBackend}</p>}
      {sameChoice && <p className="note">{t.same}</p>}

      {result && (
        <>
          <div className="compare-grid">
            <CaseColumn c={result.a} lang={lang} t={t} />
            <CaseColumn c={result.b} lang={lang} t={t} />
          </div>
          <section className="quiz-card">
            <h2>{t.relate}</h2>
            <ul className="plain">
              {result.earlier && <li>{t.earlier}: {nameOf(result.earlier)} ({result.years_apart})</li>}
              <li>{t.shared}: {result.shared_provisions.length ? result.shared_provisions.join(", ") : t.none}</li>
              <li>{t.themes}: {result.shared_tags.length ? result.shared_tags.join(", ") : t.none}</li>
              {result.only_a_tags.length > 0 && <li>{t.only} {result.a.name}: {result.only_a_tags.join(", ")}</li>}
              {result.only_b_tags.length > 0 && <li>{t.only} {result.b.name}: {result.only_b_tags.join(", ")}</li>}
              {result.bench_note && <li>{result.bench_note}</li>}
              <li>{result.binding_note}</li>
            </ul>
            <p className="warn">{result.caution}</p>
          </section>
        </>
      )}
      <p><Link href={`/cases?lang=${lang}`}>{lang === "hi" ? "सभी फैसले" : "All cases"}</Link></p>
    </>
  );
}
