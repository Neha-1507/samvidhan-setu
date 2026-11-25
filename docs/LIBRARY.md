# My Library

Saved items live in the browser's localStorage under `samvidhan-setu:library:v1`. Nothing is sent to the server.

- Save button on Articles, Laws, Cases, Ask results and Glossary terms
- `/library` groups them, lets you remove, export as JSON, or clear all
- Same provision saved from two pages is one entry (ids are `<kind>:<ref>`)
- Limits: 200 items; links must start with `/` (edited storage cannot inject outside links)
- Private mode or blocked storage: Save buttons hide and the Library page explains why

Logic is in `frontend/lib/library.mjs` and tested with `npm test` (no install needed, plain Node).
Adding a new kind of saved item: add a builder in `library.mjs`, add the kind to `KINDS`, add a test.
