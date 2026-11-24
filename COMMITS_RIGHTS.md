# Commit plan: Know Your Rights   (run from repo root, in this order)

 1. git add backend/data/rights/arrest.json       && git commit -m "feat(data): add rights guide for arrest"
 2. git add backend/data/rights/fir.json          && git commit -m "feat(data): add rights guide for FIR"
 3. git add backend/data/rights/bail.json         && git commit -m "feat(data): add rights guide for bail"
 4. git add backend/data/rights/legal-aid.json    && git commit -m "feat(data): add rights guide for free legal aid"
 5. git add backend/data/rights/cyber-fraud.json  && git commit -m "feat(data): add rights guide for cyber fraud"
 6. git add backend/data/rights/women-safety.json && git commit -m "feat(data): add rights guide for women's safety"
 7. git add backend/app/corpus.py                 && git commit -m "feat(backend): load rights topics"
 8. git add backend/app/rights.py                 && git commit -m "feat(backend): add /api/rights endpoints"
 9. git add backend/app/main.py                   && git commit -m "feat(backend): register rights router"
10. git add backend/tests/test_rights.py          && git commit -m "test(backend): add rights tests incl. reference check"
11. git add frontend/lib/api.js                   && git commit -m "feat(frontend): add rights API calls"
12. git add frontend/app/rights/page.js           && git commit -m "feat(frontend): add Know Your Rights list page"
13. git add "frontend/app/rights/[slug]/page.js"  && git commit -m "feat(frontend): add rights topic page with helplines"
14. git add frontend/app/globals.css              && git commit -m "style(frontend): style steps and helplines"
15. git add frontend/app/layout.js                && git commit -m "feat(frontend): add Rights to navigation"
16. git add frontend/app/page.js                  && git commit -m "feat(frontend): add Know Your Rights button on home"
17. git add README.md                             && git commit -m "docs: update roadmap with rights guides"
18. git add TESTING.md                            && git commit -m "docs: add rights checks to testing guide"

Zip mein kuch files pehle ke commits se bhi badli hain (corpus.py, main.py, api.js, globals.css, layout.js): unhe isi tarah commit karna, git diff apne aap sirf naya hissa dikhayega.
After you verify a topic on official sources, set "verified": true in its JSON and commit it separately: "docs(data): verify arrest rights guide".
