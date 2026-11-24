import { getLang, pick } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";

export const metadata = { title: "Ask | Samvidhan Setu" };
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function ask(q) {
  const res = await fetch(`${API}/api/ask?q=${encodeURIComponent(q)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("ask failed");
  return res.json();
}

export default async function AskPage({ searchParams }) {
  const q = (searchParams?.q ?? "").trim();
  const lang = getLang(searchParams);
  let data = null;
  let failed = false;
  if (q.length >= 2) {
    try { data = await ask(q); } catch { failed = true; }
  }

  return (
    <>
      <h1>{lang === "hi" ? "अपना सवाल पूछें" : "Ask a question"}</h1>
      <LangToggle path="/ask" lang={lang} q={q} />
      <form method="get" className="search">
        <input type="hidden" name="lang" value={lang} />
        <input name="q" defaultValue={q} placeholder="anticipatory bail, police arrest ke baad vakil, chori..." aria-label="Question" />
        <button className="btn" type="submit">{lang === "hi" ? "पूछें" : "Ask"}</button>
      </form>

      {failed && <p className="note">Backend is not running.</p>}
      {data && !data.found && <p className="note">{data.message}</p>}
      {data?.found && (
        <ul className="list">
          {data.results.map((r) => (
            <li key={r.ref}>
              <div className="num">
                {lang === "hi" ? r.ref_hi : r.ref}
                {!r.verified && <span className="badge">{lang === "hi" ? "सत्यापन बाकी" : "Not yet verified"}</span>}
              </div>
              <h2>{pick(r, "title", lang)}</h2>
              <p>{pick(r, "summary", lang)}</p>
              {r.citation && <p className="note">{r.citation}</p>}
              {r.replaces && <p className="note">{lang === "hi" ? "पुराना कानून" : "Earlier law"}: {r.replaces}</p>}
              <a href={r.source} target="_blank" rel="noreferrer">{lang === "hi" ? "आधिकारिक स्रोत" : "Official source"}</a>
            </li>
          ))}
        </ul>
      )}
      {data && <p className="note">{data.disclaimer}</p>}
    </>
  );
}
