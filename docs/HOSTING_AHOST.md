# Hosting on ahost (cPanel Node.js)

The production site runs on ahost's TAS-IX hosting in Tashkent as a cPanel
**Node.js application** (Phusion Passenger). GitHub Actions builds it on every
push to `main` and uploads it over FTPS —
[`.github/workflows/deploy-ahost.yml`](../.github/workflows/deploy-ahost.yml).

```
/home/<cpanel-user>/kiyo/        ← Application root (FTP account root)
  app.js                         ← startup file (scripts/ahost/app.js)
  site/                          ← Next.js standalone server + assets
  tmp/restart.txt                ← rewritten each deploy → app restarts
/home/<cpanel-user>/public_html/ ← keep empty (cPanel adds .htaccess)
```

DNS stays on ahost's default zone (apex, `www`, `mail` → the hosting server).
The app 308-redirects `kiyo.uz` to the canonical `www.kiyo.uz`.

## One-time setup

1. **cPanel → Software → Setup Node.js App → Create Application**
   - Node.js version: **24.x** (must match `node-version` in the workflow)
   - Application mode: **Production**
   - Application root: `kiyo`
   - Application URL: `kiyo.uz` (path empty)
   - Application startup file: `app.js`
   - Environment variables (lead form → Google Sheets):
     `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (single line, keep
     the `\n` escapes), `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB` = `Leads`
   - Never press **Run NPM Install** — the bundle ships its own
     `node_modules` inside `site/`.
2. **cPanel → Files → FTP Accounts → Add FTP Account**: log in `deploy`,
   directory **`kiyo`** (replace the suggested `public_html/deploy`).
3. **GitHub → repo → Settings → Secrets and variables → Actions → New
   repository secret** ×3: `FTP_SERVER` = `ftp.kiyo.uz`, `FTP_USERNAME` =
   `deploy@kiyo.uz`, `FTP_PASSWORD`.
4. Run the workflow (Actions → Deploy to ahost → Run workflow) or push.
5. **cPanel → Security → SSL/TLS Status** → select the kiyo.uz domains →
   **Run AutoSSL**; then **cPanel → Domains** → enable **Force HTTPS
   Redirect** for `kiyo.uz`.

## Troubleshooting

- App won't start: cPanel → Setup Node.js App → the app → check the
  Passenger log / press **Restart**.
- Lead form says "temporarily unavailable": the four `GOOGLE_*` variables are
  missing in the cPanel app — add them and restart.
- Upload fails: re-check the three FTP secrets; the FTP account's directory
  must be the application root.
- Deploys without secrets still build (the upload step is skipped with a
  notice), so CI keeps validating every push.

Vercel (`kivo-beige-omega.vercel.app`) keeps building from the same repo and
can serve as a fallback: point DNS back per [DEPLOYMENT.md](DEPLOYMENT.md).
