# Commit plan (one small commit each, in this order)

1.  .gitignore                                  chore: add .gitignore
2.  README.md                                   docs: add project README and roadmap
3.  backend/requirements.txt                    chore(backend): add FastAPI dependencies
4.  backend/app/__init__.py                     chore(backend): create app package
5.  backend/data/articles.json                  feat(data): add sample Constitution articles (Part III)
6.  backend/app/articles.py                     feat(backend): add article loader and search
7.  backend/app/main.py (articles part only)    feat(backend): expose /api/articles endpoints with CORS
8.  backend/requirements-dev.txt, pytest.ini    chore(backend): add pytest setup
9.  backend/tests/test_api.py                   test(backend): add article API tests
10. backend/scripts/import_articles.py          feat(data): add CSV import script for articles
11. backend/data/new_articles_template.csv      docs(data): add CSV template for new articles
12. backend/data/schedules.json                 feat(data): add 12 Schedules of the Constitution
13. backend/app/schedules.py                    feat(backend): add schedules router
14. backend/tests/test_schedules.py             test(backend): add schedules tests
15. backend/app/retriever.py                    feat(ai): add BM25 retriever with Hinglish bridge
16. backend/tests/test_retriever.py             test(ai): add retriever tests
17. backend/app/ask.py                          feat(ai): add grounded /api/ask endpoint
18. backend/tests/test_ask.py                   test(ai): add ask endpoint tests
19. backend/app/main.py (final)                 feat(backend): register schedules and ask routers
20. frontend/package.json, .env.example         chore(frontend): init Next.js project
21. frontend/app/globals.css                    style(frontend): add global theme with dark mode
22. frontend/lib/lang.js                        feat(frontend): add language helper (en/hi)
23. frontend/components/LangToggle.js           feat(frontend): add language toggle component
24. frontend/lib/api.js                         feat(frontend): add API client
25. frontend/app/layout.js                      feat(frontend): add layout with navigation
26. frontend/app/page.js                        feat(frontend): add home page
27. frontend/app/articles/page.js               feat(frontend): add articles search page
28. frontend/app/articles/[number]/page.js      feat(frontend): add article detail page
29. frontend/app/schedules/page.js              feat(frontend): add schedules page
30. frontend/app/preamble/page.js               feat(frontend): add Preamble page
31. frontend/app/ask/page.js                    feat(frontend): add Ask page
32. ARCHITECTURE_PHASE2.md                      docs: add Phase 2 architecture plan
33. TESTING.md                                  docs: add testing checklist
