# Commit plan: Document reader + Old-to-new converter   (run from repo root, in this order)

Backend engine
 1. git add backend/app/analyzer.py             && git commit -m "feat(docs): add legal reference finder (sections, articles, dates, FIR no.)"
 2. git add backend/app/analyze.py              && git commit -m "feat(docs): add /api/analyze and /api/convert endpoints"
 3. git add backend/app/main.py                 && git commit -m "feat(backend): register analyze router and allow POST in CORS"
 4. git add backend/tests/test_analyzer.py      && git commit -m "test(docs): add analyzer and converter tests"

Converter page
 5. git add frontend/lib/api.js                 && git commit -m "feat(frontend): add fetchConvert"
 6. git add frontend/app/convert/page.js        && git commit -m "feat(frontend): add old-to-new law converter page"

Document reader page
 7. git add frontend/components/AnalyzerClient.js && git commit -m "feat(frontend): add document reader component"
 8. git add frontend/app/analyze/page.js        && git commit -m "feat(frontend): add document reader page"

Wiring and style
 9. git add frontend/app/layout.js              && git commit -m "feat(frontend): add Convert and Reader to navigation"
10. git add frontend/app/page.js                && git commit -m "feat(frontend): add converter and reader cards on home"
11. git add frontend/app/globals.css            && git commit -m "style(frontend): style document reader and converter"

Docs
12. git add README.md                           && git commit -m "docs: update roadmap for document intelligence"
13. git add TESTING.md                          && git commit -m "docs: add reader and converter checks to testing guide"

Aur commits chahiye to:
- analyzer.py ko git add -p se baant lo: pehle regex patterns, phir find_mentions, phir analyze() (3 commits)
- test_analyzer.py ke 11 tests ko 2-3 commits mein baant lo
