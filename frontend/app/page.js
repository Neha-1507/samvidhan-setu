import Link from "next/link";
import { getLang } from "../lib/lang";
import LangToggle from "../components/LangToggle";

const FEATURES = [
  { href: "/ask", en: ["Ask a question", "Type it in Hindi, English or Hinglish and get matching laws."], hi: ["सवाल पूछें", "हिंदी, English या Hinglish में लिखें और संबंधित कानून पाएँ।"] },
  { href: "/compare", en: ["Compare cases", "Put two judgments side by side: issue, bench, provisions."], hi: ["फैसलों की तुलना", "दो फैसले आमने-सामने: प्रश्न, पीठ, प्रावधान।"] },
  { href: "/rights", en: ["Know your rights", "Arrest, FIR, bail, legal aid, online fraud, women's safety."], hi: ["अपने अधिकार जानें", "गिरफ्तारी, FIR, जमानत, कानूनी सहायता, ऑनलाइन धोखाधड़ी, महिला सुरक्षा।"] },
  { href: "/articles", en: ["Constitution", "Articles in plain language, with Hindi and English."], hi: ["संविधान", "अनुच्छेद सरल भाषा में, हिंदी और English के साथ।"] },
  { href: "/laws", en: ["New criminal laws", "BNS, BNSS and BSA, with the old IPC/CrPC section."], hi: ["नए आपराधिक कानून", "BNS, BNSS और BSA, पुरानी IPC/CrPC धारा के साथ।"] },
  { href: "/cases", en: ["Landmark cases", "What the Supreme Court decided, and why it matters."], hi: ["महत्वपूर्ण फैसले", "सर्वोच्च न्यायालय ने क्या तय किया और क्यों मायने रखता है।"] },
  { href: "/convert", en: ["Old law to new law", "IPC 302? See its new BNS section in one step."], hi: ["पुराना कानून से नया कानून", "IPC 302? उसकी नई BNS धारा एक ही कदम में देखें।"] },
  { href: "/analyze", en: ["Document reader", "Paste an FIR or notice and see which laws it cites."], hi: ["दस्तावेज़ पढ़ें", "FIR या नोटिस चिपकाएँ और देखें उसमें कौन से कानून लिखे हैं।"] },
  { href: "/glossary", en: ["Legal glossary", "Bail, remand, writ, charge sheet: terms explained simply."], hi: ["कानूनी शब्दकोश", "जमानत, रिमांड, रिट, आरोप पत्र: शब्द आसान भाषा में।"] },
  { href: "/quiz", en: ["Quiz", "Test what you learned in five quick questions."], hi: ["क्विज़", "पाँच छोटे सवालों में परखें कि आपने क्या सीखा।"] },
];

export default function Home({ searchParams }) {
  const lang = getLang(searchParams);
  return (
    <>
      <section className="hero">
        <h1>संविधान सेतु</h1>
        <p>
          {lang === "hi"
            ? "नागरिक और संविधान के बीच एक पुल। अपने अधिकार और कानून सरल भाषा में समझें।"
            : "A bridge between citizens and the Constitution. Understand your rights and the law in plain language."}
        </p>
        <LangToggle path="/" lang={lang} />
        <form action="/ask" method="get" className="search hero-search">
          <input type="hidden" name="lang" value={lang} />
          <input name="q" placeholder={lang === "hi" ? "जैसे: गिरफ्तारी के बाद क्या करें?" : "e.g. anticipatory bail, police arrest ke baad vakil"} aria-label="Ask" />
          <button className="btn" type="submit">{lang === "hi" ? "पूछें" : "Ask"}</button>
        </form>
      </section>

      <section className="cards" aria-label="Features">
        {FEATURES.map((f) => (
          <Link key={f.href} href={`${f.href}?lang=${lang}`} className="card">
            <h2>{f[lang][0]}</h2>
            <p>{f[lang][1]}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
