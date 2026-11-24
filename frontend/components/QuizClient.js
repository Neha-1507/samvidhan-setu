"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const T = {
  en: {
    title: "Test yourself", intro: "Five questions made from the laws in this app.",
    all: "Everything", constitution: "Constitution", act: "New criminal laws", case: "Landmark cases",
    start: "Start quiz", next: "Next question", finish: "See result", again: "Play again",
    correct: "Correct", wrong: "Not quite", score: "Your score", of: "of", question: "Question",
    error: "Could not load the quiz. Is the backend running?", loading: "Loading...",
    unverified: "Based on records not yet verified.", source: "Official source",
  },
  hi: {
    title: "खुद को परखें", intro: "इस ऐप के कानूनों से बने पाँच सवाल।",
    all: "सब कुछ", constitution: "संविधान", act: "नए आपराधिक कानून", case: "महत्वपूर्ण फैसले",
    start: "क्विज़ शुरू करें", next: "अगला सवाल", finish: "नतीजा देखें", again: "फिर खेलें",
    correct: "सही", wrong: "सही नहीं", score: "आपका स्कोर", of: "में से", question: "सवाल",
    error: "क्विज़ लोड नहीं हो सका। क्या बैकएंड चालू है?", loading: "लोड हो रहा है...",
    unverified: "ये जानकारी अभी सत्यापित नहीं है।", source: "आधिकारिक स्रोत",
  },
};

export default function QuizClient() {
  const [lang, setLang] = useState("en");
  const [kind, setKind] = useState("all");
  const [qs, setQs] = useState(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const t = T[lang];

  async function start() {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch(`${API}/api/quiz?n=5&kind=${kind}`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      if (!data.length) throw new Error("empty quiz");
      setQs(data); setI(0); setPicked(null); setScore(0); setDone(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function choose(index) {
    if (picked !== null) return;
    setPicked(index);
    if (index === qs[i].answer_index) setScore((s) => s + 1);
  }

  function next() {
    if (i + 1 >= qs.length) { setDone(true); return; }
    setI(i + 1);
    setPicked(null);
  }

  const q = qs && qs[i];
  const answered = picked !== null;

  return (
    <>
      <h1>{t.title}</h1>
      <div className="lang" role="group" aria-label="Language">
        <button type="button" onClick={() => setLang("en")} aria-current={lang === "en" ? "true" : undefined}>English</button>
        <button type="button" onClick={() => setLang("hi")} aria-current={lang === "hi" ? "true" : undefined}>हिंदी</button>
      </div>

      {(!qs || done) && (
        <section className="quiz-card">
          {done ? (
            <>
              <p className="quiz-score">{t.score}: {score} {t.of} {qs.length}</p>
            </>
          ) : (
            <p>{t.intro}</p>
          )}
          <div className="chips" role="group">
            {["all", "constitution", "act", "case"].map((k) => (
              <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>
                {t[k]}
              </button>
            ))}
          </div>
          <button type="button" className="btn" onClick={start} disabled={loading}>
            {loading ? t.loading : done ? t.again : t.start}
          </button>
          {failed && <p className="note" role="alert">{t.error}</p>}
        </section>
      )}

      {q && !done && (
        <section className="quiz-card" aria-live="polite">
          <p className="num">{t.question} {i + 1} {t.of} {qs.length}</p>
          <h2>{lang === "hi" ? q.question_hi : q.question_en}</h2>
          <div className="options">
            {q.options.map((o, idx) => {
              const isAnswer = idx === q.answer_index;
              const state = !answered ? "" : isAnswer ? "right" : idx === picked ? "wrong" : "";
              return (
                <button key={idx} type="button" className={`opt ${state}`} onClick={() => choose(idx)} disabled={answered && state === ""}>
                  <span>{answered && isAnswer ? "✓ " : answered && idx === picked ? "✗ " : ""}{lang === "hi" ? o.hi : o.en}</span>
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="explain">
              <p><strong>{picked === q.answer_index ? t.correct : t.wrong}.</strong> {lang === "hi" ? q.explanation_hi : q.explanation_en}</p>
              {!q.verified && <p className="note">{t.unverified}</p>}
              <a href={q.source} target="_blank" rel="noreferrer">{t.source}</a>
              <div><button type="button" className="btn" onClick={next}>{i + 1 >= qs.length ? t.finish : t.next}</button></div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
