# Commit plan: Bare Acts (BNS, BNSS, BSA)

 1. backend/scripts/import_acts.py                       feat(data): add Bare Acts CSV import script
 2. backend/data/bare_acts_seed.csv                      feat(data): add seed sections for BNS, BNSS and BSA
 3. backend/data/bare_acts.json                          chore(data): generate bare_acts.json from seed
 4. backend/scripts/mark_verified.py                     feat(data): add script to mark records verified
 5. backend/scripts/import_articles.py + articles.json   feat(data): add verified flag to articles
 6. backend/app/corpus.py                                feat(backend): add unified corpus of articles and sections
 7. backend/app/sections.py                              feat(backend): add /api/sections endpoints
 8. backend/app/retriever.py                             feat(ai): search all laws, add stopwords and more Hinglish words
 9. backend/app/ask.py                                   feat(ai): return Bare Act sections with old-law reference
10. backend/app/main.py                                  feat(backend): register sections router
11. backend/tests/test_sections.py                       test(backend): add sections API tests
12. backend/tests/test_retriever.py                      test(ai): cover Bare Acts, stopwords, Hinglish
13. backend/tests/test_ask.py                            test(ai): cover Bare Act answers
14. frontend/lib/api.js                                  feat(frontend): add fetchSections
15. frontend/app/laws/page.js                            feat(frontend): add Laws page with act tabs
16. frontend/app/ask/page.js                             feat(frontend): show section, old law and verified badge in Ask
17. frontend/app/layout.js                               feat(frontend): add Laws to navigation
18. frontend/app/globals.css                             style(frontend): add tabs and verified badge
19. README.md, TESTING.md                                docs: document Bare Acts workflow
