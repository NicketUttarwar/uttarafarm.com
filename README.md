# uttarafarm.com

Static marketing site for Uttara Farm (Vite + React + TypeScript + Tailwind).

## Dependencies

- **Node.js** (18+ recommended) and **npm** — all UI packages are listed in [`package.json`](package.json); lockfile [`package-lock.json`](package-lock.json) pins exact versions.
- **Python 3** — optional; used only by [`scripts/test-local.sh`](scripts/test-local.sh) to create [`.venv/`](.venv/) if missing. There are no pip packages required for the site; see [`requirements.txt`](requirements.txt).

## Development

```bash
npm install
npm run dev
```

### Local dev with browser (script)

Creates or reuses `.venv`, installs `node_modules` if needed, picks a free port, serves the site, opens your browser, and stops the server when you press Ctrl+C (or when the script exits):

```bash
chmod +x scripts/test-local.sh   # once
./scripts/test-local.sh
# or:
npm run test:local
```

Override port: `PORT=5173 ./scripts/test-local.sh`

## Production build

```bash
npm run build
```

Output is in `dist/`. Deploy the contents to static hosting (for example Amazon S3 with CloudFront in front).

**Single-page app routes:** configure the host so unknown paths (such as `/about`) serve `index.html` (S3 website error document, CloudFront custom error response to `/index.html`, or equivalent). Otherwise only `/` will load the app.

**Static images:** place files under [`public/assets/`](public/assets/) (served as `/assets/...`). Replace the illustrative SVG brand marks with official artwork when you have brand approval.

## Preview the build locally

```bash
npm run preview
```
