# Testing checklist (run it once, then again from a fresh clone)

## 1. Backend automated tests
cd backend && pip install -r requirements-dev.txt && pytest
Expected: 16 tests pass.

## 2. Backend manual (server running)
- http://localhost:8000/health                      -> {"status":"ok",...}
- http://localhost:8000/api/articles?q=arrest       -> Article 22
- http://localhost:8000/api/articles/21a            -> Article 21A
- http://localhost:8000/api/articles/9999           -> 404
- http://localhost:8000/api/schedules               -> 12 items
- http://localhost:8000/api/ask?q=giraftari         -> Article 22, found=true
- http://localhost:8000/api/ask?q=qwertyzzz         -> found=false, no results

## 3. Frontend manual (both servers running)
- /               home loads, brand "संविधान सेतु"
- /articles       list shows 6 articles; search "शिक्षा" -> 21A
- /articles?lang=hi    Hindi titles and summaries
- /articles/21    detail page, English/हिंदी toggle works, back link works
- /articles/999   404 page
- /schedules      12 schedules; toggle to Hindi
- /preamble       Preamble in both languages
- /ask?q=police+arrest+ke+baad+vakil   Article 22 with official source link and disclaimer
- Stop backend -> pages show "Backend is not running" instead of crashing
- Dark mode (OS setting): text stays readable

## 4. Import script
cd backend && cp data/articles.json /tmp/backup.json
python scripts/import_articles.py data/new_articles_template.csv   -> added=1, total=7
Restore: cp /tmp/backup.json data/articles.json
