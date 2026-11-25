# Case comparison: how it works and what it does not do

Each case in `backend/data/cases.json` has: the legal question (`legal_issue_*`), what the court held (`summary_*`),
the provisions involved (`provisions`, must exist in the database) and the bench size (`bench_size`, or null if unsure).

`/api/cases/compare?a=ID&b=ID` shows:
- shared provisions and shared themes (tags)
- which case came first
- if both bench sizes are known: the larger bench generally prevails on a conflict
- all cases here are Supreme Court judgments, so their principles bind all courts (Article 141)

It does NOT say whether a later case overruled, limited or distinguished an earlier one.
That needs reading the judgments and later cases. The page says so in a warning.

Adding a case: add the full record with all fields, then `pytest`. Leave `bench_size` as null if you are not sure.
