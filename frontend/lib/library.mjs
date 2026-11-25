// "My Library": things a person saves. Lives only in this browser (localStorage).
// Pure logic with the storage passed in, so it can be tested without a browser.

export const KEY = "samvidhan-setu:library:v1";
export const KINDS = ["constitution", "act", "case", "term"];
export const MAX_ITEMS = 200;

function clean(item) {
  if (!item || typeof item !== "object") return null;
  const { id, kind, title_en, href } = item;
  const title_hi = typeof item.title_hi === "string" && item.title_hi ? item.title_hi : title_en;
  if (typeof id !== "string" || !id || id.length > 200) return null;
  if (!KINDS.includes(kind)) return null;
  if (typeof title_en !== "string" || !title_en || title_en.length > 300 || title_hi.length > 300) return null;
  // Only links inside this app. Blocks javascript:, https://elsewhere and //host tricks from edited storage.
  if (typeof href !== "string" || !href.startsWith("/") || href.startsWith("//") || href.includes("\\")) return null;
  return { id, kind, title_en, title_hi, href, savedAt: typeof item.savedAt === "string" ? item.savedAt : "" };
}

export function createLibrary(storage, now = () => new Date().toISOString()) {
  function list() {
    try {
      const raw = storage.getItem(KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data.map(clean).filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  function write(items) {
    try {
      storage.setItem(KEY, JSON.stringify(items));
      return true;
    } catch {
      return false;
    }
  }
  const has = (id) => list().some((i) => i.id === id);

  function add(item) {
    const entry = clean({ ...item, savedAt: now() });
    if (!entry) return "invalid";
    const items = list();
    if (items.some((i) => i.id === entry.id)) return "exists";
    if (items.length >= MAX_ITEMS) return "full";
    return write([entry, ...items]) ? "added" : "error";
  }
  function remove(id) {
    const items = list();
    const next = items.filter((i) => i.id !== id);
    if (next.length === items.length) return "missing";
    return write(next) ? "removed" : "error";
  }
  function toggle(item) {
    if (has(item.id)) {
      const status = remove(item.id);
      return { saved: status !== "removed" && status !== "missing" ? true : false, status };
    }
    const status = add(item);
    return { saved: status === "added" || status === "exists", status };
  }
  function clear() {
    try {
      storage.removeItem(KEY);
      return true;
    } catch {
      return false;
    }
  }
  function exportJson() {
    return JSON.stringify({ app: "samvidhan-setu", exportedAt: now(), items: list() }, null, 2);
  }
  return { list, has, add, remove, toggle, clear, exportJson };
}

// Builders: turn what each page already has into one library item.
// ids use the same "<kind>:<ref>" scheme, so a provision saved from Ask and from its own page is one entry.
const stripYear = (ref) => ref.replace(/\s*\(\d{4}\)\s*$/, "");

export const articleItem = (a) => ({
  id: `constitution:Article ${a.number}`, kind: "constitution",
  title_en: `Article ${a.number}: ${a.title_en}`, title_hi: `अनुच्छेद ${a.number}: ${a.title_hi}`,
  href: `/articles/${encodeURIComponent(a.number)}`,
});

export const sectionItem = (s) => ({
  id: `act:${s.act} Section ${s.section}`, kind: "act",
  title_en: `${s.act} Section ${s.section}: ${s.title_en}`, title_hi: `${s.act} धारा ${s.section}: ${s.title_hi}`,
  href: `/laws?act=${encodeURIComponent(s.act)}&q=${encodeURIComponent(s.section)}`,
});

export const caseItem = (c) => ({
  id: `case:${c.name} (${c.year})`, kind: "case",
  title_en: `${c.name} (${c.year})`, title_hi: `${c.name} (${c.year})`,
  href: `/cases?q=${encodeURIComponent(c.name)}`,
});

export const termItem = (t) => ({
  id: `term:${t.slug}`, kind: "term", title_en: t.term_en, title_hi: t.term_hi,
  href: `/glossary?q=${encodeURIComponent(t.term_en)}`,
});

// A result from /api/ask (shape: kind, ref, ref_hi, number, act, title_en, title_hi)
export function askItem(r) {
  const base = { id: `${r.kind}:${r.ref}`, kind: r.kind, title_en: `${r.ref}: ${r.title_en}`, title_hi: `${r.ref_hi}: ${r.title_hi}` };
  if (r.kind === "constitution") return { ...base, href: `/articles/${encodeURIComponent(r.number)}` };
  if (r.kind === "act") return { ...base, href: `/laws?act=${encodeURIComponent(r.act)}&q=${encodeURIComponent(r.number)}` };
  return { ...base, href: `/cases?q=${encodeURIComponent(stripYear(r.ref))}` };
}
