import { getLang } from "../../lib/lang";
import LangToggle from "../../components/LangToggle";

export const metadata = { title: "Preamble | Samvidhan Setu" };

const TEXT = {
  en: {
    title: "Preamble",
    body: [
      "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:",
      "JUSTICE, social, economic and political;",
      "LIBERTY of thought, expression, belief, faith and worship;",
      "EQUALITY of status and of opportunity;",
      "and to promote among them all",
      "FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation;",
      "IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.",
    ],
  },
  hi: {
    title: "उद्देशिका",
    body: [
      "हम, भारत के लोग, भारत को एक संपूर्ण प्रभुत्व-संपन्न समाजवादी पंथनिरपेक्ष लोकतंत्रात्मक गणराज्य बनाने के लिए, तथा उसके समस्त नागरिकों को:",
      "सामाजिक, आर्थिक और राजनैतिक न्याय,",
      "विचार, अभिव्यक्ति, विश्वास, धर्म और उपासना की स्वतंत्रता,",
      "प्रतिष्ठा और अवसर की समता प्राप्त कराने के लिए,",
      "तथा उन सब में",
      "व्यक्ति की गरिमा और राष्ट्र की एकता और अखंडता सुनिश्चित करने वाली बंधुता बढ़ाने के लिए",
      "दृढ़संकल्प होकर अपनी इस संविधान सभा में आज तारीख 26 नवम्बर, 1949 ई. को एतद्द्वारा इस संविधान को अंगीकृत, अधिनियमित और आत्मार्पित करते हैं।",
    ],
  },
};

export default function PreamblePage({ searchParams }) {
  const lang = getLang(searchParams);
  const t = TEXT[lang];
  return (
    <>
      <h1>{t.title}</h1>
      <LangToggle path="/preamble" lang={lang} />
      <div className="preamble">
        {t.body.map((line, i) => <p key={i}>{line}</p>)}
      </div>
    </>
  );
}
