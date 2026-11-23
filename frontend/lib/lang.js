export function getLang(searchParams) {
  return searchParams?.lang === "hi" ? "hi" : "en";
}

export function pick(article, field, lang) {
  return article[`${field}_${lang}`];
}

export const UI = {
  en: { search: "Search", official: "Official source", article: "Article", back: "All articles", empty: "No article matches" },
  hi: { search: "खोजें", official: "आधिकारिक स्रोत", article: "अनुच्छेद", back: "सभी अनुच्छेद", empty: "कोई अनुच्छेद नहीं मिला" },
};
