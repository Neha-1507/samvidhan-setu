import Link from "next/link";
import { fetchRights } from "../../lib/api";
import { getLang, pick } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";

export const metadata = { title: "Know Your Rights | Samvidhan Setu" };

export default async function RightsPage({ searchParams }) {
  const lang = getLang(searchParams);
  let topics = [];
  let failed = false;
  try {
    topics = (await fetchRights()) ?? [];
  } catch {
    failed = true;
  }
  return (
    <>
      <h1>{lang === "hi" ? "अपने अधिकार जानें" : "Know Your Rights"}</h1>
      <LangToggle path="/rights" lang={lang} />
      {failed && <p className="note">Backend is not running.</p>}
      <ul className="list">
        {topics.map((t) => (
          <li key={t.slug}>
            <h2><Link href={`/rights/${t.slug}?lang=${lang}`}>{pick(t, "title", lang)}</Link></h2>
            <p>{pick(t, "intro", lang)}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
