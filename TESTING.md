# Testing checklist (run it once, then again from a fresh clone)

## 1. Backend automated tests
cd backend && pip install -r requirements-dev.txt && pytest
Expected: 79 tests pass (reportlab and cryptography are in requirements-dev) (nothing fails).

## 2. Backend manual (server running)
- http://localhost:8000/health                      -> {"status":"ok",...}
- http://localhost:8000/api/articles?q=arrest       -> Article 22
- http://localhost:8000/api/articles/21a            -> Article 21A
- http://localhost:8000/api/articles/9999           -> 404
- http://localhost:8000/api/schedules               -> 12 items
- http://localhost:8000/api/ask?q=giraftari         -> Article 22, found=true
- http://localhost:8000/api/ask?q=qwertyzzz         -> found=false, no results

- http://localhost:8000/api/sections?act=BNSS       -> BNSS sections only
- http://localhost:8000/api/sections?q=IPC%20302    -> BNS 103
- http://localhost:8000/api/sections/BNSS/482       -> anticipatory bail, replaces CrPC 438
- http://localhost:8000/api/ask?q=anticipatory+bail -> BNSS Section 482 first
- http://localhost:8000/api/ask?q=chori             -> BNS Section 303

## 3. Frontend manual (both servers running)
- /               home loads, brand "संविधान सेतु"
- /articles       list shows 6 articles; search "शिक्षा" -> 21A
- /articles?lang=hi    Hindi titles and summaries
- /articles/21    detail page, English/हिंदी toggle works, back link works
- /articles/999   404 page
- /laws           22 sections; tabs All/BNS/BNSS/BSA; search 'IPC 302' -> BNS 103; 'Not yet verified' badge shows
- /schedules      12 schedules; toggle to Hindi
- /preamble       Preamble in both languages
- /ask?q=police+arrest+ke+baad+vakil   Article 22 with official source link and disclaimer
- Stop backend -> pages show "Backend is not running" instead of crashing
- Dark mode (OS setting): text stays readable

## 4. Import script
cd backend && cp data/articles.json /tmp/backup.json
python scripts/import_articles.py data/new_articles_template.csv   -> added=1, total=7
Restore: cp /tmp/backup.json data/articles.json

## 5. Bare Acts scripts
cd backend && cp data/bare_acts.json /tmp/acts.json
python scripts/import_acts.py data/bare_acts_seed.csv     -> added=0 updated=22 total=22
python scripts/mark_verified.py acts BNSS-35              -> Marked verified: ['BNSS-35']
Restore: cp /tmp/acts.json data/bare_acts.json

## Case law (added in part 3)
- /api/cases                      -> 8 cases
- /api/cases/DKBASU-1997          -> D.K. Basu, citation (1997) 1 SCC 416
- /api/ask?q=custody+torture+guidelines   -> D.K. Basu first
- Frontend /cases: search "privacy", toggle Hindi, "Not yet verified" badge shows
- Verify a case after checking sci.gov.in:  python scripts/mark_verified.py cases DKBASU-1997

## Know Your Rights (added in part 4)
- /api/rights                  -> 6 topics
- /api/rights/arrest           -> 6 steps, 2 helplines
- Frontend /rights, open "arrest", toggle Hindi, tap a helpline (tel: link), tap a related provision (opens Ask)
- Every "related" item must exist in the database: pytest checks this, so no fake citations

## Quiz and app polish (added in part 5)
- /api/quiz?n=5&seed=1             -> 5 questions, same output every time with the same seed
- /api/quiz?kind=case              -> only case-law questions
- Frontend /quiz: pick a topic, answer, see explanation, finish, play again; switch to Hindi mid-quiz
- Stop the backend -> Start shows an error message instead of breaking
- Home page: 6 feature cards, search box sends you to Ask, Hindi/English toggle
- Open /nonexistent -> friendly 404 page
- Phone width (about 380px): nav wraps, no sideways scrolling
- Browser tab shows the new icon

## Document reader and converter (added in part 6)
- /api/convert?law=IPC&section=302          -> BNS Section 103
- /api/convert?law=CrPC&section=41A         -> BNSS Section 35
- /api/convert?law=IPC&section=999          -> matches: [] (not guessed)
- Frontend /convert: try IPC 420, CrPC 438, Evidence Act 65B; unknown section shows "not in our database"
- Frontend /analyze: click "Use sample text" then "Read document"
    expect: IPC 420 -> BNS 318, CrPC 438 -> BNSS 482, Articles 21 and 22, IPC 406 and 34 in "not in our database",
            date 12/08/2024, FIR 45/2024, and a yellow warning about 1 July 2024
- Paste "5 IPC cases in 2024" -> no sections found (no false alarms)
- Text over 20000 characters is cut by the box; under 10 characters shows a message

## More sections + glossary (added in part 7)
- /api/sections                         -> 53 sections
- /api/convert?law=CrPC&section=482     -> BNSS Section 528 (inherent powers)
- /api/convert?law=IPC&section=354D     -> BNS Section 78 (stalking)
- /api/glossary?q=bail                  -> Bail, Bailable offence, Anticipatory bail...
- Frontend /glossary: search "रिमांड", toggle Hindi, click a Related link (opens Ask)
- /analyze with "Petition under Section 482 CrPC" -> BNSS 528, not BNSS 482

## PDF upload (added in part 8)
- pip install -r requirements-dev.txt  (adds pypdf, python-multipart, reportlab)
- Frontend /analyze -> "Upload a PDF": choose a text-based PDF that mentions "Section 302 IPC"
    expect: IPC 302 -> BNS 103, and "1 / 1 pages read"
- Upload a .txt renamed to .pdf -> "does not look like a PDF" message
- Upload a scanned PDF -> message asking you to paste the text instead
- Upload a file over 5 MB -> rejected before upload
- Stop backend -> clear error message

## Case comparison (added in part 9)
- /api/cases/compare?a=DKBASU-1997&b=JOGINDER-1994   -> shared provisions Article 21, Article 22; Joginder Kumar earlier
- /api/cases/compare?a=PUTTASWAMY-2017&b=SHREYA-2015 -> bench note: 9 judges vs 2 judges
- same id twice -> 422, unknown id -> 404
- /api/cases/DKBASU-1997 still works (compare route is above it)
- Frontend /compare: pick two cases, two columns appear, "How they relate" box and the caution
- Frontend /cases: each case has a "Compare" link that pre-selects the first case
- Phone width: the two columns stack
