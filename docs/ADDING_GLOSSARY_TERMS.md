# Adding glossary terms

Edit a file in `backend/data/glossary/` (a-f, g-n, o-z) and add an object:

    { "slug": "bail", "term_en": "Bail", "term_hi": "जमानत",
      "meaning_en": "...", "meaning_hi": "...", "related": ["BNSS Section 480"] }

- Meanings: plain language, your own words, one or two sentences.
- `related` must match an existing provision exactly (for example "Article 21" or "BNSS Section 480").
  `pytest` fails if a related item does not exist, so no fake citations get in.
- One term per commit keeps history easy to review: `docs(glossary): add term "bail bond"`.
