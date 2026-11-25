# Contributing to Samvidhan Setu

## Small commits
One idea per commit. Message format: `type(area): what changed`
Types: feat, fix, docs, test, style, chore, data. Examples:
- `data(bns): add section 111 organised crime`
- `fix(frontend): keep language when searching`

## Accuracy rules (this is a legal app)
1. Never paste Act text. Write plain-language summaries in your own words.
2. Check every section number, old section and citation on an official source (India Code, sci.gov.in).
3. New content starts as `verified: false`. After checking, run `python scripts/mark_verified.py ...` in its own commit.
4. If you are unsure, leave it out. A missing entry is better than a wrong one.

## Before you push
    cd backend && pytest
    cd frontend && npm run build
