"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SAMPLE =
  "SAMPLE (fictional) FIR No. 45/2024 dated 12/08/2024. Complaint registered under Sections 420, 406 and 34 IPC. " +
  "Accused may seek anticipatory bail under Section 438 CrPC. Fundamental rights under Article 21 and Article 22 apply.";

const T = {
  en: {
    title: "Document reader", intro: "Paste the text of an FIR, notice or order. We find the laws it cites and show their new sections.",
    placeholder: "Paste text here...", sample: "Use sample text", clear: "Clear", analyze: "Read document", working: "Reading...",
    privacy: "Your text is sent to this app's server only to find section numbers, and it is not stored.",
    provisions: "Laws found", unmatched: "Cited but not in our database yet", dates: "Dates", fir: "FIR numbers",
    earlier: "Earlier law", unverified: "Not yet verified", source: "Official source", none: "No section or article numbers were found.",
    error: "Could not read the text. Is the backend running?", tooShort: "Please paste at least 10 characters.",
    upload: "Upload a PDF", pdfHint: "Text-based PDFs up to 5 MB. Scanned PDFs (photos of pages) are not supported yet; paste the text instead.",
    notPdf: "Please choose a PDF file.", bigFile: "The file is larger than 5 MB.", pagesRead: "pages read", truncated: "Only the first part was read.",
  },
  hi: {
    title: "दस्तावेज़ पढ़ें", intro: "FIR, नोटिस या आदेश का टेक्स्ट चिपकाएँ। हम उसमें लिखे कानून ढूँढकर उनकी नई धाराएँ दिखाएँगे।",
    placeholder: "टेक्स्ट यहाँ चिपकाएँ...", sample: "नमूना टेक्स्ट", clear: "साफ़ करें", analyze: "दस्तावेज़ पढ़ें", working: "पढ़ रहे हैं...",
    privacy: "आपका टेक्स्ट केवल धारा नंबर ढूँढने के लिए इस ऐप के सर्वर पर भेजा जाता है, और सहेजा नहीं जाता।",
    provisions: "मिले हुए कानून", unmatched: "लिखे हैं पर हमारे डेटाबेस में अभी नहीं", dates: "तारीख़ें", fir: "FIR नंबर",
    earlier: "पुराना कानून", unverified: "सत्यापन बाकी", source: "आधिकारिक स्रोत", none: "कोई धारा या अनुच्छेद नंबर नहीं मिला।",
    error: "टेक्स्ट पढ़ा नहीं जा सका। क्या बैकएंड चालू है?", tooShort: "कृपया कम से कम 10 अक्षर चिपकाएँ।",
    upload: "PDF अपलोड करें", pdfHint: "5 MB तक की टेक्स्ट वाली PDF। स्कैन की हुई PDF (पन्नों की फ़ोटो) अभी समर्थित नहीं; टेक्स्ट चिपकाएँ।",
    notPdf: "कृपया PDF फ़ाइल चुनें।", bigFile: "फ़ाइल 5 MB से बड़ी है।", pagesRead: "पन्ने पढ़े गए", truncated: "केवल शुरुआती हिस्सा पढ़ा गया।",
  },
};

export default function AnalyzerClient() {
  const [lang, setLang] = useState("en");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pdfInfo, setPdfInfo] = useState(null);
  const t = T[lang];

  async function run() {
    if (text.trim().length < 10) { setMessage(t.tooShort); return; }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("bad response");
      setResult(await res.json());
    } catch {
      setResult(null);
      setMessage(t.error);
    } finally {
      setLoading(false);
    }
  }

  async function uploadPdf(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) { setMessage(t.notPdf); return; }
    if (file.size > 5 * 1024 * 1024) { setMessage(t.bigFile); return; }
    setLoading(true);
    setMessage("");
    setPdfInfo(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/api/analyze/pdf`, { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok) { setResult(null); setMessage(data?.detail?.message || t.error); return; }
      setResult(data);
      setPdfInfo(data.pdf);
    } catch {
      setResult(null);
      setMessage(t.error);
    } finally {
      setLoading(false);
    }
  }

  const found = result ? result.mentions.filter((m) => m.matches.length) : [];

  return (
    <>
      <h1>{t.title}</h1>
      <div className="lang" role="group" aria-label="Language">
        <button type="button" onClick={() => setLang("en")} aria-current={lang === "en" ? "true" : undefined}>English</button>
        <button type="button" onClick={() => setLang("hi")} aria-current={lang === "hi" ? "true" : undefined}>हिंदी</button>
      </div>
      <p className="note">{t.intro}</p>

      <textarea className="doc-input" rows={8} value={text} onChange={(e) => setText(e.target.value)}
        placeholder={t.placeholder} aria-label={t.title} maxLength={20000} />
      <div className="row">
        <button type="button" className="btn" onClick={run} disabled={loading}>{loading ? t.working : t.analyze}</button>
        <button type="button" className="chip" onClick={() => setText(SAMPLE)}>{t.sample}</button>
        <button type="button" className="chip" onClick={() => { setText(""); setResult(null); setMessage(""); setPdfInfo(null); }}>{t.clear}</button>
      </div>
      <div className="row">
        <label className="chip upload">
          {t.upload}
          <input type="file" accept="application/pdf,.pdf" onChange={uploadPdf} disabled={loading} />
        </label>
      </div>
      <p className="note">{t.pdfHint}</p>
      <p className="note">{t.privacy}</p>
      {message && <p className="note" role="alert">{message}</p>}

      {result && (
        <div aria-live="polite">
          {pdfInfo && <p className="note">{pdfInfo.pages_read} / {pdfInfo.pages} {t.pagesRead}. {pdfInfo.truncated ? t.truncated : ""}</p>}
          {result.warnings.map((w) => <p key={w} className="warn" role="note">{w}</p>)}
          {result.mentions.length === 0 && <p className="note">{t.none}</p>}

          {found.length > 0 && <h2>{t.provisions}</h2>}
          <ul className="list">
            {found.map((m) => m.matches.map((x) => (
              <li key={`${m.mention}-${x.ref}`}>
                <div className="num">
                  {m.mention} {m.type === "old" ? "→ " + (lang === "hi" ? x.ref_hi : x.ref) : ""}
                  {m.type !== "old" && <span>{lang === "hi" ? x.ref_hi : x.ref}</span>}
                  {!x.verified && <span className="badge">{t.unverified}</span>}
                </div>
                <h3>{lang === "hi" ? x.title_hi : x.title_en}</h3>
                <p>{lang === "hi" ? x.summary_hi : x.summary_en}</p>
                {m.type === "old" && <p className="note">{t.earlier}: {m.mention}</p>}
                <a href={x.source} target="_blank" rel="noreferrer">{t.source}</a>
              </li>
            )))}
          </ul>

          {result.unmatched.length > 0 && (
            <>
              <h2>{t.unmatched}</h2>
              <p>{result.unmatched.join(", ")}</p>
            </>
          )}
          {result.dates.length > 0 && <p><strong>{t.dates}:</strong> {result.dates.map((d) => d.text).join(", ")}</p>}
          {result.fir_numbers.length > 0 && <p><strong>{t.fir}:</strong> {result.fir_numbers.join(", ")}</p>}
          <p className="note">{result.note}</p>
          <p className="note">{result.disclaimer}</p>
        </div>
      )}
    </>
  );
}
