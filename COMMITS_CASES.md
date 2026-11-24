# Commit plan: Case law (Phase 3 start)   (run from repo root)

 1. git add backend/data/cases.json            && git commit -m "feat(data): add 8 landmark Supreme Court cases"
 2. git add backend/app/corpus.py              && git commit -m "feat(backend): load cases into the corpus"
 3. git add backend/app/cases.py               && git commit -m "feat(backend): add /api/cases endpoints"
 4. git add backend/app/main.py                && git commit -m "feat(backend): register cases router"
 5. git add backend/app/ask.py                 && git commit -m "feat(ai): return case citation in Ask"
 6. git add backend/scripts/mark_verified.py   && git commit -m "feat(data): allow verifying cases"
 7. git add backend/tests/test_cases.py        && git commit -m "test(backend): add cases API tests"
 8. git add backend/tests/test_case_search.py  && git commit -m "test(ai): cover case law retrieval"
 9. git add backend/tests/test_ask.py          && git commit -m "test(ai): cover case citation in Ask"
10. git add frontend/lib/api.js                && git commit -m "feat(frontend): add fetchCases"
11. git add frontend/app/cases/page.js         && git commit -m "feat(frontend): add Cases page"
12. git add frontend/app/layout.js             && git commit -m "feat(frontend): add Cases to navigation"
13. git add frontend/app/ask/page.js           && git commit -m "feat(frontend): show case citation in Ask"
14. git add README.md TESTING.md               && git commit -m "docs: document case law layer"

Tip: files 2, 4, 5 in the list above were edited, not new: commit them as they are in this folder.
