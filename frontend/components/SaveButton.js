"use client";

import { useEffect, useState } from "react";
import { createLibrary } from "../lib/library.mjs";

const L = {
  en: { save: "Save", saved: "Saved", full: "Library is full (200 items).", err: "Could not save in this browser." },
  hi: { save: "सहेजें", saved: "सहेजा गया", full: "लाइब्रेरी भर गई है (200)।", err: "इस ब्राउज़र में सहेज नहीं सके।" },
};

export default function SaveButton({ item, lang = "en" }) {
  const [state, setState] = useState("loading"); // loading | off | saved | unsaved
  const [note, setNote] = useState("");
  const t = L[lang] ?? L.en;

  useEffect(() => {
    try {
      setState(createLibrary(window.localStorage).has(item.id) ? "saved" : "unsaved");
    } catch {
      setState("off"); // storage blocked (for example private mode): hide the button
    }
  }, [item.id]);

  if (state === "loading" || state === "off") return null;

  function toggle() {
    try {
      const result = createLibrary(window.localStorage).toggle(item);
      setNote(result.status === "full" ? t.full : result.status === "error" || result.status === "invalid" ? t.err : "");
      setState(result.saved ? "saved" : "unsaved");
    } catch {
      setState("off");
    }
  }

  return (
    <>
      <button type="button" className="chip save" aria-pressed={state === "saved"} onClick={toggle}>
        {state === "saved" ? `★ ${t.saved}` : `☆ ${t.save}`}
      </button>
      {note && <span className="note" role="alert"> {note}</span>}
    </>
  );
}
