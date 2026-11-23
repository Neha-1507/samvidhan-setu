import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchArticle } from "../../../lib/api";
import { getLang, pick, UI } from "../../../lib/lang";
import LangToggle from "../../../components/LangToggle";

export async function generateMetadata({ params }) {
  return { title: `Article ${params.number.toUpperCase()} | Samvidhan Setu` };
}

export default async function ArticleDetail({ params, searchParams }) {
  const lang = getLang(searchParams);
  const t = UI[lang];
  const article = await fetchArticle(params.number);
  if (!article) notFound();

  return (
    <article className="detail">
      <Link href={`/articles?lang=${lang}`}>{t.back}</Link>
      <LangToggle path={`/articles/${article.number}`} lang={lang} />
      <p className="num">{t.article} {article.number}</p>
      <h1>{pick(article, "title", lang)}</h1>
      <p className="part">{article.part}</p>
      <p className="lead">{pick(article, "summary", lang)}</p>
      <p>{article.tags.join(", ")}</p>
      <a href={article.source} target="_blank" rel="noreferrer">{t.official}</a>
    </article>
  );
}
