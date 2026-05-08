# kela-hr app

Public website at [kela-hr.com](https://kela-hr.com). Vite + React 18 + Ant
Design v5, multi-page (each route is a real `.html` entry — no SPA router).
Builds to plain static files served from GitHub Pages.

## Where this fits in the v2 architecture

KELA HR is three pieces: this website, the [Chrome extension](../chrome-extension/),
and the [serverless backend](../backend/). In v2 the website became the home
of the OTP login flow:

- The user clicks **Login on kela-hr.com** in the extension popup → this site
  opens at `/login.html`.
- After OTP verification the JWT lives in `localStorage`. The site calls
  `chrome.runtime.sendMessage(EXTENSION_ID, {type: 'kela_hr_login', token, email})`.
- The extension's service worker writes the token into `chrome.storage.local`,
  and the popup's `chrome.storage.onChanged` listener advances its UI.
- `/dashboard.html` is a paginated/searchable view powered by
  `GET /contacts/list` on the backend.

## Stack

- Vite multi-page build (one bundle per `.html` entry).
- React 18 + Ant Design v5 (`ConfigProvider` theme).
- TypeScript, strict mode, `@/*` path alias for `src/`.
- No router. Navigation between pages is `<a href="/login.html">`.

## Setup

```bash
cd app
npm install
```

## Develop

```bash
npm run dev
```

Serves at <http://localhost:5173>. Each page is reachable directly:

- `/` (home)
- `/login.html`
- `/dashboard.html`
- `/privacy-policy.html`
- `/terms-of-service.html`
- `/support.html`

## Build

```bash
npm run build       # type-check + Vite build → dist/
npx serve dist      # local preview of the built output
```

`dist/CNAME` is preserved (it lives in `public/CNAME`, which Vite copies
verbatim into the build output) so the custom domain stays bound when GitHub
Pages serves the artifact.

## Deploy

Pushes to `main` trigger [.github/workflows/deploy-app.yml](.github/workflows/deploy-app.yml).
The workflow runs `npm ci && npm run build` and uploads `dist/` to GitHub
Pages. You can also trigger it manually from the Actions tab.

### One-time cutover (when first enabling Actions-based Pages)

The repo currently serves kela-hr.com from a branch-based GitHub Pages
source. Switching to Actions deploy must be sequenced or there's a window
where Pages serves nothing.

1. Commit + push the workflow file. At this point the workflow exists but is
   not yet the active Pages source — Pages still serves the old branch.
2. Verify the workflow ran. Actions → "Deploy app to GitHub Pages" → most
   recent run is green up through `actions/upload-pages-artifact`.
   `actions/deploy-pages` is *expected to fail* on this first run because
   the Pages source is still set to branch — that's fine, we flip it next.
3. Flip the Pages source. Settings → Pages → Source: change from "Deploy
   from a branch" to **GitHub Actions**.
4. Re-run the workflow (Actions → latest run → "Re-run all jobs", or push
   a no-op change). `actions/deploy-pages` now succeeds.
5. Verify https://kela-hr.com/ loads the new site, plus `/login.html` and
   `/dashboard.html`. `dig kela-hr.com` should still resolve.
6. Confirm the custom domain is preserved. Settings → Pages → Custom domain
   should still show `kela-hr.com` with a green check. If it's blank,
   re-enter `kela-hr.com` and save (this writes the CNAME and re-verifies
   HTTPS).

The brief unavailability is between steps 3 and 4 (~1–3 min).

## Configure

[`src/config.ts`](src/config.ts) holds the public constants:

- `API_BASE_URL` — backend HTTP API. Public, can sit in source.
- `EXTENSION_ID` — production Chrome Web Store extension ID; used by
  `session.syncToExtension` to push the JWT into the extension after login.
- `CHROME_WEB_STORE_URL` — install link surfaced on the home page.
- `SUPPORT_FORM_ACCESS_KEY` — `formly.email` access key used by the support
  form. Public per formly's design.

The backend's CORS allows `*`, so the public deploy works without any extra
config.

## Folder layout

```
app/
├── index.html, login.html, dashboard.html,
├── privacy-policy.html, terms-of-service.html, support.html
├── public/             # copied verbatim → dist/
│   ├── CNAME           # custom domain
│   └── images/
├── src/
│   ├── api/            # auth + contacts API clients
│   ├── auth/session.ts # localStorage JWT + syncToExtension
│   ├── components/     # AppLayout, ProtectedPage
│   ├── entries/        # one entry per HTML page
│   ├── pages/          # per-route React components
│   ├── styles/         # ConfigProvider theme + globals.css
│   └── config.ts
└── vite.config.ts
```

## Auth flow

1. User opens `/login.html`, requests an OTP, verifies it.
2. `session.setSession(token, email)` writes to `localStorage` (keys
   `kela_hr_token`, `kela_hr_email`).
3. `session.syncToExtension(token, email)` calls
   `chrome.runtime.sendMessage(extensionId, {type: 'kela_hr_login', token, email})`
   for each ID in `EXTENSION_IDS`. The extension's service worker writes the
   token into its own `chrome.storage.local`. Failures are silent (extension
   not installed, etc).
4. Browser redirects to `/dashboard.html`.
5. `ProtectedPage` gates dashboard access; on a 401 from the API, the API
   client clears the session and redirects to `/login.html`.

## Gotchas

- `CNAME` lives in `public/`, not the project root, so it ends up at
  `dist/CNAME`.
- Hash-routing is **not** used; each page is its own HTML file. Don't add
  `react-router-dom`.
- `localStorage` writes only happen post-login; the home and policy pages
  never touch storage.
- Lighthouse note: the AntD bundle is large. We don't tree-shake icons; if
  bundle size becomes a concern, switch to per-icon imports.
