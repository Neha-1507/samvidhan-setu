import test from "node:test";
import assert from "node:assert/strict";
import { createLibrary, KEY, MAX_ITEMS, articleItem, askItem, sectionItem, caseItem } from "./library.mjs";

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; },
    raw: data,
  };
}
const item = (n = 1) => ({ id: `act:BNS Section ${n}`, kind: "act", title_en: `BNS Section ${n}`, href: `/laws?q=${n}` });
const fixedNow = () => "2026-11-24T10:00:00.000Z";

test("add, has, list, remove (newest first)", () => {
  const lib = createLibrary(memoryStorage(), fixedNow);
  assert.equal(lib.add(item(1)), "added");
  assert.equal(lib.add(item(2)), "added");
  assert.deepEqual(lib.list().map((i) => i.id), ["act:BNS Section 2", "act:BNS Section 1"]);
  assert.equal(lib.has("act:BNS Section 1"), true);
  assert.equal(lib.remove("act:BNS Section 1"), "removed");
  assert.equal(lib.has("act:BNS Section 1"), false);
  assert.equal(lib.remove("nope"), "missing");
});

test("title_hi falls back to title_en", () => {
  const lib = createLibrary(memoryStorage(), fixedNow);
  lib.add(item(1));
  assert.equal(lib.list()[0].title_hi, "BNS Section 1");
});

test("no duplicates", () => {
  const lib = createLibrary(memoryStorage(), fixedNow);
  lib.add(item(1));
  assert.equal(lib.add(item(1)), "exists");
  assert.equal(lib.list().length, 1);
});

test("toggle saves then removes", () => {
  const lib = createLibrary(memoryStorage(), fixedNow);
  assert.deepEqual(lib.toggle(item(1)), { saved: true, status: "added" });
  assert.deepEqual(lib.toggle(item(1)), { saved: false, status: "removed" });
});

test("corrupted storage gives an empty list and does not throw", () => {
  const lib = createLibrary(memoryStorage({ [KEY]: "{not json" }), fixedNow);
  assert.deepEqual(lib.list(), []);
  assert.equal(lib.add(item(1)), "added");
});

test("entries edited by hand into storage are filtered out", () => {
  const bad = [
    { id: "a", kind: "act", title_en: "x", href: "javascript:alert(1)" },
    { id: "b", kind: "act", title_en: "x", href: "//evil.example" },
    { id: "c", kind: "act", title_en: "x", href: "https://evil.example" },
    { id: "d", kind: "hack", title_en: "x", href: "/ok" },
    { id: "e", kind: "act", title_en: "", href: "/ok" },
    "not an object",
    item(9),
  ];
  const lib = createLibrary(memoryStorage({ [KEY]: JSON.stringify(bad) }), fixedNow);
  assert.deepEqual(lib.list().map((i) => i.id), ["act:BNS Section 9"]);
});

test("unsafe links are rejected when adding", () => {
  const lib = createLibrary(memoryStorage(), fixedNow);
  assert.equal(lib.add({ ...item(1), href: "javascript:alert(1)" }), "invalid");
  assert.equal(lib.add({ ...item(1), href: "https://x.example" }), "invalid");
});

test("library is capped", () => {
  const lib = createLibrary(memoryStorage(), fixedNow);
  for (let i = 0; i < MAX_ITEMS; i++) lib.add(item(i));
  assert.equal(lib.add(item(9999)), "full");
  assert.equal(lib.list().length, MAX_ITEMS);
});

test("a full or blocked browser storage reports an error instead of crashing", () => {
  const storage = memoryStorage();
  storage.setItem = () => { throw new Error("QuotaExceededError"); };
  const lib = createLibrary(storage, fixedNow);
  assert.equal(lib.add(item(1)), "error");
});

test("export contains the app name and all items", () => {
  const lib = createLibrary(memoryStorage(), fixedNow);
  lib.add(item(1));
  const out = JSON.parse(lib.exportJson());
  assert.equal(out.app, "samvidhan-setu");
  assert.equal(out.items.length, 1);
  assert.equal(out.exportedAt, "2026-11-24T10:00:00.000Z");
});

test("clear empties the library", () => {
  const lib = createLibrary(memoryStorage(), fixedNow);
  lib.add(item(1));
  assert.equal(lib.clear(), true);
  assert.deepEqual(lib.list(), []);
});

test("the same provision saved from its own page and from Ask is one entry", () => {
  const fromPage = articleItem({ number: "21", title_en: "Protection of life and personal liberty", title_hi: "प्राण और दैहिक स्वतंत्रता का संरक्षण" });
  const fromAsk = askItem({ kind: "constitution", ref: "Article 21", ref_hi: "अनुच्छेद 21", number: "21", title_en: "Protection of life and personal liberty", title_hi: "x" });
  assert.equal(fromPage.id, fromAsk.id);
  const sec = sectionItem({ act: "BNS", section: "103", title_en: "Murder", title_hi: "हत्या" });
  const askSec = askItem({ kind: "act", ref: "BNS Section 103", ref_hi: "BNS धारा 103", number: "103", act: "BNS", title_en: "Murder", title_hi: "हत्या" });
  assert.equal(sec.id, askSec.id);
  const c = caseItem({ name: "D.K. Basu v. State of West Bengal", year: 1997 });
  const askCase = askItem({ kind: "case", ref: "D.K. Basu v. State of West Bengal (1997)", ref_hi: "D.K. Basu v. State of West Bengal (1997)", number: "(1997) 1 SCC 416", title_en: "t", title_hi: "t" });
  assert.equal(c.id, askCase.id);
  assert.equal(askCase.href, "/cases?q=D.K.%20Basu%20v.%20State%20of%20West%20Bengal");
});

test("every builder produces an item the library accepts", () => {
  const lib = createLibrary(memoryStorage(), fixedNow);
  assert.equal(lib.add(articleItem({ number: "21A", title_en: "t", title_hi: "t" })), "added");
  assert.equal(lib.add(sectionItem({ act: "BNSS", section: "482", title_en: "t", title_hi: "t" })), "added");
  assert.equal(lib.add(caseItem({ name: "Maneka Gandhi v. Union of India", year: 1978 })), "added");
});
