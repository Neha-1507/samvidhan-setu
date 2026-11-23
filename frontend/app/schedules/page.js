import { fetchSchedules } from "../../lib/api";
import { getLang, pick, UI } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";

export const metadata = { title: "Schedules | Samvidhan Setu" };

export default async function SchedulesPage({ searchParams }) {
  const lang = getLang(searchParams);
  let schedules = [];
  let failed = false;
  try {
    schedules = (await fetchSchedules()) ?? [];
  } catch {
    failed = true;
  }
  return (
    <>
      <h1>{lang === "hi" ? "संविधान की अनुसूचियाँ" : "Schedules of the Constitution"}</h1>
      <LangToggle path="/schedules" lang={lang} />
      {failed && <p className="note">Backend is not running.</p>}
      <ul className="list">
        {schedules.map((s) => (
          <li key={s.number}>
            <div className="num">{lang === "hi" ? `अनुसूची ${s.number}` : `Schedule ${s.number}`}</div>
            <h2>{pick(s, "title", lang)}</h2>
            {lang === "en" && <p>{s.about_en}</p>}
          </li>
        ))}
      </ul>
    </>
  );
}
