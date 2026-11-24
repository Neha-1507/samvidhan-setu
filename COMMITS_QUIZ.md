# Commit plan: Quiz + app polish   (run from repo root, in this order)

Backend
 1. git add backend/app/quizgen.py            && git commit -m "feat(learning): add quiz question generator"
 2. git add backend/app/quiz.py               && git commit -m "feat(learning): add /api/quiz endpoint"
 3. git add backend/app/main.py               && git commit -m "feat(backend): register quiz router"
 4. git add backend/tests/test_quiz.py        && git commit -m "test(learning): add quiz tests"

Quiz page
 5. git add frontend/components/QuizClient.js && git commit -m "feat(frontend): add interactive quiz component"
 6. git add frontend/app/quiz/page.js         && git commit -m "feat(frontend): add quiz page"

Polish (each is its own small commit)
 7. git add frontend/app/icon.svg             && git commit -m "feat(frontend): add app icon"
 8. git add frontend/app/manifest.js          && git commit -m "feat(frontend): add web app manifest"
 9. git add frontend/app/not-found.js         && git commit -m "feat(frontend): add friendly 404 page"
10. git add frontend/app/page.js              && git commit -m "feat(frontend): redesign home with search and feature cards"
11. git add frontend/app/layout.js            && git commit -m "feat(frontend): add Quiz to navigation"
12. git add frontend/app/globals.css          && git commit -m "style(frontend): style quiz, home cards and mobile nav"

Docs
13. git add README.md                         && git commit -m "docs: update roadmap with quiz"
14. git add TESTING.md                        && git commit -m "docs: add quiz and polish checks to testing guide"

Zyada commits chahiye to globals.css ko 3 hisson mein baant lo (quiz / home / mobile nav, file mein comments se alag hain)
aur har hisse ko alag commit karo: git add -p frontend/app/globals.css
