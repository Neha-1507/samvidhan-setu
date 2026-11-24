import { fetchConvert } from "../../lib/api";
import { getLang, pick } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";

export const metadata = { title: "Old to New Law | Samvidhan Setu" };
const LAWS = ["IPC", "CrPC", "Evidence Act", "BNS", "BNSS", "BSA"];

export default async function ConvertPage({ searchParams }) {
  const lang = getLang(searchParams);
  const law = LAWS.includes(searchParams?.law) ? searchParams.law : "IPC";
  const section = (searchParams?.section ?? "").trim();
  let result = null;
  let failed = false;
  if (section) {
    try { result = await fetchConvert(law, section); } catch { failed = true; }
  }
  const hi = lang === "hi";
  return (
    <>
      <h1>{hi ? "पुराना कानून से नया कानून" : "Old law to new law"}</h1>
      <p className="note">
        {hi ? "IPC, CrPC और Evidence Act की धारा डालें और BNS, BNSS, BSA में उसकी नई धारा देखें।"
            : "Enter an IPC, CrPC or Evidence Act section and see its new section in BNS, BNSS or BSA."}
      </p>
      <LangToggle path="/convert" lang={lang} />
      <form method="get" className="search">
        <input type="hidden" name="lang" value={lang} />
        <select name="law" defaultValue={law} aria-label="Law">
          {LAWS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <input name="section" defaultValue={section} placeholder="302, 420, 498A, 41A..." aria-label="Section" />
        <button className="btn" type="submit">{hi ? "देखें" : "Convert"}</button>
      </form>

      {failed && <p className="note">Backend is not running.</p>}
      {result && result.matches.length === 0 && (
        <p className="note">{hi ? `${result.mention} हमारे डेटाबेस में अभी नहीं है। India Code देखें या वकील से पूछें।`
          : `${result.mention} is not in our database yet. Check India Code or ask an advocate.`}</p>
      )}
      <ul className="list">
        {result?.matches.map((m) => (
          <li key={m.ref}>
            <div className="num">
              {result.mention} &rarr; {hi ? m.ref_hi : m.ref}
              {!m.verified && <span className="badge">{hi ? "सत्यापन बाकी" : "Not yet verified"}</span>}
            </div>
            <h2>{pick(m, "title", lang)}</h2>
            <p>{pick(m, "summary", lang)}</p>
            <a href={m.source} target="_blank" rel="noreferrer">{hi ? "आधिकारिक स्रोत" : "Official source"}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
