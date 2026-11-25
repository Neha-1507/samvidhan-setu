"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createLibrary } from "../lib/library.mjs";

const T = {
  en: {
    title: "My Library", intro: "Things you saved. They stay in this browser only; nothing is sent to our server.",
    empty: "Nothing saved yet. Use the Save button on any Article, section, case or glossary term.",
    constitution: "Constitution", act: "Laws", case: "Cases", term: "Glossary",
    remove: "Remove", export: "Export (JSON)", clear: "Clear all", confirm: "Remove everything from your library?",
    blocked: "This browser is blocking storage, so the library cannot work here.", count: "saved",
  },
  hi: {
    title: "मेरी लाइब्रेरी", intro: "आपके सहेजे हुए आइटम। ये केवल इसी ब्राउज़र में रहते हैं; हमारे सर्वर पर कुछ नहीं भेजा जाता।",
    empty: "अभी कुछ नहीं सहेजा। किसी अनुच्छेद, धारा, फैसले या शब्द पर सहेजें बटन दबाएँ।",
    constitution: "संविधान", act: "कानून", case: "फैसले", term: "शब्दकोश",
    remove: "हटाएँ", export: "निर्यात (JSON)", clear: "सब हटाएँ", confirm: "क्या आप लाइब्रेरी से सब कुछ हटाना चाहते हैं?",
    blocked: "यह ब्राउज़र स्टोरेज रोक रहा है, इसलिए लाइब्रेरी यहाँ काम नहीं करेगी।", count: "सहेजे गए",
  },
};
const ORDER = ["constitution", "act", "case", "term"];

export default function LibraryClient() {
  const [lang, setLang] = useState("en");
  const [items, setItems] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const t = T[lang];

  const refresh = useCallback(() => {
    try {
      setItems(createLibrary(window.localStorage).list());
    } catch {
      setBlocked(true);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh); // keeps two open tabs in sync
    return () => window.removeEventListener("storage", refresh);
  }, [refresh]);

  function remove(id) {
    createLibrary(window.localStorage).remove(id);
    refresh();
  }
  function clearAll() {
    if (!window.confirm(t.confirm)) return;
    createLibrary(window.localStorage).clear();
    refresh();
  }
  function exportJson() {
    const blob = new Blob([createLibrary(window.localStorage).exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "samvidhan-setu-library.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h1>{t.title}</h1>
      <div className="lang" role="group" aria-label="Language">
        <button type="button" onClick={() => setLang("en")} aria-current={lang === "en" ? "true" : undefined}>English</button>
        <button type="button" onClick={() => setLang("hi")} aria-current={lang === "hi" ? "true" : undefined}>हिंदी</button>
      </div>
      <p className="note">{t.intro}</p>
      {blocked && <p className="warn" role="alert">{t.blocked}</p>}

      {items && items.length === 0 && !blocked && <p>{t.empty}</p>}

      {items && items.length > 0 && (
        <>
          <p className="note">{items.length} {t.count}</p>
          {ORDER.map((kind) => {
            const group = items.filter((i) => i.kind === kind);
            if (group.length === 0) return null;
            return (
              <section key={kind}>
                <h2>{t[kind]}</h2>
                <ul className="list">
                  {group.map((i) => (
                    <li key={i.id}>
                      <Link href={`${i.href}${i.href.includes("?") ? "&" : "?"}lang=${lang}`}>{lang === "hi" ? i.title_hi : i.title_en}</Link>
                      <div><button type="button" className="chip" onClick={() => remove(i.id)}>{t.remove}</button></div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          <div className="row">
            <button type="button" className="chip" onClick={exportJson}>{t.export}</button>
            <button type="button" className="chip" onClick={clearAll}>{t.clear}</button>
          </div>
        </>
      )}
    </>
  );
}
