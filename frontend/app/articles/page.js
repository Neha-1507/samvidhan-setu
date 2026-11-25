import Link from "next/link";
import { fetchArticles } from "../../lib/api";
import { getLang, pick, UI } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";
import SaveButton from "../../components/SaveButton";
import { articleItem } from "../../lib/library.mjs";

export const metadata = { title: "Articles | Samvidhan Setu" };

export default async function ArticlesPage({ searchParams }) {
  const q = searchParams?.q ?? "";
  const lang = getLang(searchParams);
  const t = UI[lang];
  let articles = [];
  let failed = false;
  try {
    articles = await fetchArticles(q);
  } catch {
    failed = true;
  }

  return (
    <>
      <h1>{lang === "hi" ? "भारत का संविधान" : "Constitution of India"}</h1>
      <LangToggle path="/articles" lang={lang} q={q} />
      <form method="get" className="search">
        <input type="hidden" name="lang" value={lang} />
        <input name="q" defaultValue={q} placeholder="arrest, 21, शिक्षा, equality..." aria-label={t.search} />
        <button className="btn" type="submit">{t.search}</button>
      </form>

      {failed && <p className="note">Backend is not running. Start it with: uvicorn app.main:app --reload</p>}
      {!failed && articles.length === 0 && <p className="note">{t.empty}: "{q}"</p>}

      <ul className="list">
        {articles.map((a) => (
          <li key={a.number}>
            <div className="num">{t.article} {a.number}</div>
            <h2><Link href={`/articles/${a.number}?lang=${lang}`}>{pick(a, "title", lang)}</Link></h2>
            <p>{pick(a, "summary", lang)}</p>
            <SaveButton item={articleItem(a)} lang={lang} />
          </li>
        ))}
      </ul>
    </>
  );
}
