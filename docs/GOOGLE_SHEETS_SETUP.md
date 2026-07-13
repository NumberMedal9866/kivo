# Google Sheets lead storage — setup

The lead form stores submissions in a private Google Sheet through a service
account. Credentials are server-only; nothing reaches the client bundle.

## 1. Create the spreadsheet

1. Create a Google Sheet (any Google account).
2. Rename the first tab to `Leads` (or set `GOOGLE_SHEET_TAB` to your name).
3. Add the header row (column order is fixed — see below).
4. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`<THIS_PART>`**`/edit`.

Header row (A1:O1):

```
Timestamp | Locale | Name | Business | Phone | Message | Page URL | Referrer | UTM Source | UTM Medium | UTM Campaign | UTM Content | UTM Term | Consent | Status
```

## 2. Create a service account

1. Open [Google Cloud Console](https://console.cloud.google.com/), create or
   pick a project.
2. **APIs & Services → Library** → enable **Google Sheets API**.
3. **IAM & Admin → Service Accounts → Create service account.** No project
   roles are needed.
4. Open the account → **Keys → Add key → JSON.** Download the key file.

## 3. Share the sheet with the service account

Open the spreadsheet → **Share** → paste the service account email
(`…@…iam.gserviceaccount.com`) → role **Editor**.

## 4. Environment variables

From the downloaded JSON key:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email>
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=<spreadsheet id>
GOOGLE_SHEET_TAB=Leads
```

Notes:

- Keep the `\n` escapes if you paste the key as a single line (the code
  converts them back to newlines).
- On Vercel add these in **Project → Settings → Environment Variables**
  (server-side; never prefix with `NEXT_PUBLIC_`).
- **Never commit the JSON key or `.env.local`.**

## 5. Mock mode

- Development without credentials → automatic mock mode: the API accepts the
  lead and logs a note, nothing is stored.
- `LEADS_MOCK_MODE=true` forces mock mode anywhere (useful for tests).
- Production without credentials → the API returns an honest
  "temporarily unavailable" error and the form points visitors to the
  direct contact channels. The site never claims a lead was stored unless
  Google confirmed the append.

## 6. Test

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+998901234567","consent":true,"locale":"ru","startedAt":0,"context":{}}'
```

(The `startedAt` minimum-fill-time check will reject instant submissions with
a 400 — that is expected for curl tests; use the real form for an end-to-end
check.)
