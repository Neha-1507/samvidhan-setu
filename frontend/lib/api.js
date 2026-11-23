const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function get(path) {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request failed: ${path}`);
  return res.json();
}

export const fetchArticles = (q = "") => get(`/api/articles?q=${encodeURIComponent(q)}`);
export const fetchArticle = (number) => get(`/api/articles/${encodeURIComponent(number)}`);
export const fetchSchedules = () => get("/api/schedules");
