# Running and deploying

## Everything at once (Docker)
    docker compose up --build
App: http://localhost:3000   API docs: http://localhost:8000/docs

## Settings
| Name | Where | Meaning | Default |
|---|---|---|---|
| CORS_ORIGINS | backend | websites allowed to call the API from a browser, comma separated | http://localhost:3000,http://127.0.0.1:3000 |
| NEXT_PUBLIC_API_URL | frontend, set at build time | API address used by the browser | http://localhost:8000 |
| API_INTERNAL_URL | frontend, runtime | API address used by the Next.js server (inside Docker: http://backend:8000) | falls back to NEXT_PUBLIC_API_URL |

## Before going public
1. Serve both over HTTPS; set CORS_ORIGINS to your real website address only.
2. Build the frontend with NEXT_PUBLIC_API_URL set to your public API address.
3. Do not log request bodies (users paste FIR text and upload PDFs).
4. Keep the "Not yet verified" badges until content is checked against official sources.
5. Add rate limiting in front of the API (for example in your reverse proxy) before sharing widely.

## Status
The Docker files are written but have not been run by the author of this change. If a build fails, open an issue with the log.
