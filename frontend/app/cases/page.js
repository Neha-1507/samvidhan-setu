import Link from "next/link";
import { fetchCases } from "../../lib/api";
import { getLang, pick } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";
import SaveButton from "../../components/SaveButton";
import { caseItem } from "../../lib/library.mjs";

export const metadata = { title: "Case Law | Samvidhan Setu" };

export default async function CasesPage({ searchParams }) {
  const q = searchParams?.q ?? "";
  const lang = getLang(searchParams);
  let items = [];
  let failed = false;
  try {
    items = (await fetchCases(q)) ?? [];
  } catch {
    failed = true;
  }
  return (
    <>
      <h1>{lang === "hi" ? "महत्वपूर्ण फैसले" : "Landmark Cases"}</h1>
      <LangToggle path="/cases" lang={lang} q={q} />
      <form method="get" className="search">
        <input type="hidden" name="lang" value={lang} />
        <input name="q" defaultValue={q} placeholder="privacy, arrest, 66A, FIR..." aria-label="Search cases" />
        <button className="btn" type="submit">{lang === "hi" ? "खोजें" : "Search"}</button>
      </form>
      {failed && <p className="note">Backend is not running.</p>}
      {!failed && items.length === 0 && <p className="note">{lang === "hi" ? "कोई फैसला नहीं मिला" : "No case found"}</p>}
      <ul className="list">
        {items.map((c) => (
          <li key={c.id}>
            <div className="num">
              {c.name} ({c.year})
              {!c.verified && <span className="badge">{lang === "hi" ? "सत्यापन बाकी" : "Not yet verified"}</span>}
            </div>
            <h2>{pick(c, "title", lang)}</h2>
            <p>{pick(c, "summary", lang)}</p>
            <p className="note">{c.court} | {c.citation}</p>
            <a href={c.source} target="_blank" rel="noreferrer">{lang === "hi" ? "आधिकारिक स्रोत" : "Official source"}</a>
            {" | "}
            <Link href={`/compare?a=${c.id}&lang=${lang}`}>{lang === "hi" ? "तुलना करें" : "Compare"}</Link>
            <SaveButton item={caseItem(c)} lang={lang} />
          </li>
        ))}
      </ul>
    </>
  );
}
