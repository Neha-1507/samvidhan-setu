import Link from "next/link";
import { fetchSections } from "../../lib/api";
import { getLang, pick } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";
import SaveButton from "../../components/SaveButton";
import { sectionItem } from "../../lib/library.mjs";

export const metadata = { title: "Laws | Samvidhan Setu" };

const ACTS = ["BNS", "BNSS", "BSA"];
const ACT_NOTE = {
  BNS: { en: "Bharatiya Nyaya Sanhita (replaces IPC)", hi: "भारतीय न्याय संहिता (IPC की जगह)" },
  BNSS: { en: "Bharatiya Nagarik Suraksha Sanhita (replaces CrPC)", hi: "भारतीय नागरिक सुरक्षा संहिता (CrPC की जगह)" },
  BSA: { en: "Bharatiya Sakshya Adhiniyam (replaces Evidence Act)", hi: "भारतीय साक्ष्य अधिनियम (साक्ष्य अधिनियम की जगह)" },
};

export default async function LawsPage({ searchParams }) {
  const lang = getLang(searchParams);
  const act = ACTS.includes(searchParams?.act) ? searchParams.act : "";
  const q = (searchParams?.q ?? "").trim();
  let items = [];
  let failed = false;
  try {
    items = (await fetchSections(act, q)) ?? [];
  } catch {
    failed = true;
  }
  const tab = (a) => `/laws?lang=${lang}${a ? `&act=${a}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <>
      <h1>{lang === "hi" ? "नए आपराधिक कानून" : "New criminal laws"}</h1>
      <LangToggle path="/laws" lang={lang} q={q} />
      <nav className="tabs" aria-label="Act">
        <Link href={tab("")} aria-current={!act ? "true" : undefined}>{lang === "hi" ? "सभी" : "All"}</Link>
        {ACTS.map((a) => (
          <Link key={a} href={tab(a)} aria-current={act === a ? "true" : undefined}>{a}</Link>
        ))}
      </nav>
      {act && <p className="note">{ACT_NOTE[act][lang]}</p>}

      <form method="get" className="search">
        <input type="hidden" name="lang" value={lang} />
        {act && <input type="hidden" name="act" value={act} />}
        <input name="q" defaultValue={q} placeholder="bail, IPC 302, FIR, चोरी..." aria-label="Search sections" />
        <button className="btn" type="submit">{lang === "hi" ? "खोजें" : "Search"}</button>
      </form>

      {failed && <p className="note">Backend is not running.</p>}
      {!failed && items.length === 0 && <p className="note">{lang === "hi" ? "कोई धारा नहीं मिली" : "No section found"}: "{q}"</p>}

      <ul className="list">
        {items.map((s) => (
          <li key={s.id}>
            <div className="num">
              {s.act} {lang === "hi" ? "धारा" : "Section"} {s.section}
              {!s.verified && <span className="badge">{lang === "hi" ? "सत्यापन बाकी" : "Not yet verified"}</span>}
            </div>
            <h2>{pick(s, "title", lang)}</h2>
            <p>{pick(s, "summary", lang)}</p>
            {s.replaces && <p className="note">{lang === "hi" ? "पुराना कानून" : "Earlier law"}: {s.replaces}</p>}
            <a href={s.source} target="_blank" rel="noreferrer">{lang === "hi" ? "आधिकारिक स्रोत" : "Official source"}</a>
            <SaveButton item={sectionItem(s)} lang={lang} />
          </li>
        ))}
      </ul>
    </>
  );
}
