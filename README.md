# BI & PMO Leadership Portfolio

A static portfolio site: dashboard samples at three organizational levels
(Executive / Department / Project), a clients section, and a "Request a Demo"
form that writes to a Google Sheet — no backend server required.

---

## 1. Personalize the content

Everything is plain HTML/CSS — no build step. Open `index.html` and replace:

| Find | Location |
|---|---|
| `Your Name` | Page `<title>`, nav brand, footer (3 places) |
| `your-profile` | LinkedIn URL in the footer (`href="https://www.linkedin.com/in/your-profile"`) |
| `you@example.com` | Footer email link |
| Hero headline / subhead | `<section class="hero">` |
| The 3 stat numbers | `.hero-stat` blocks in the hero |
| Client names / testimonial | `<section class="clients">` |
| Dashboard captions | Each `.dash-caption h4` under `#dashboards` |

## 2. Swap in your real dashboard screenshots

Placeholder mockups are in:
```
assets/img/dashboards/executive/exec-1.svg   exec-2.svg
assets/img/dashboards/department/dept-1.svg  dept-2.svg
assets/img/dashboards/pm/pm-1.svg            pm-2.svg
```

To use real Power BI screenshots:
1. Export/screenshot your dashboard (Power BI Desktop: File → Export → Export to PDF/Image, or just a clean screen capture at a wide aspect ratio, roughly 1600×1000px works well).
2. Save as `.png` or `.jpg` with the **same filename** (e.g. `exec-1.png`), in the same folder.
3. In `index.html`, update the matching `<img src="...">` path's extension to match.
4. Add more cards by copying a `.dash-card` block and adding another image file — the grid auto-wraps.

## 3. Connect the "Request a Demo" form to Google Sheets

**Step 1 — Create the Sheet**
Create a new Google Sheet (any name). You don't need to add columns manually —
the script creates a "Demo Requests" tab with headers automatically on first submission.

**Step 2 — Add the script**
In the Sheet: `Extensions → Apps Script`. Delete the default code, paste in the
contents of `apps-script/Code.gs` from this folder. Save.

**Step 3 — Deploy as a Web App**
In the Apps Script editor: `Deploy → New deployment` → gear icon → select type **Web app**.
- Description: anything (e.g. "Portfolio demo form")
- Execute as: **Me**
- Who has access: **Anyone**

Click **Deploy**, authorize the permissions Google asks for (this is your own script,
accessing your own sheet), then copy the **Web app URL** it gives you — it looks like:
```
https://script.google.com/macros/s/AKfycb.../exec
```

**Step 4 — Wire it into the site**
Open `assets/js/main.js` and replace:
```js
const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```
with your actual deployment URL.

**Step 5 — Test it**
Submit the form on your live site. A new row should appear in the "Demo Requests"
tab within a few seconds. If you ever edit `Code.gs` later, you must create a
**new deployment version** (`Deploy → Manage deployments → Edit → New version`) —
saving the script alone does not update the live URL.

## 4. Publish on GitHub Pages

1. Create a new GitHub repository, push everything in this folder to it.
2. In the repo: `Settings → Pages` → under "Build and deployment", set
   **Source: Deploy from a branch**, branch: `main`, folder: `/ (root)`.
3. Save. GitHub gives you a URL like `https://yourusername.github.io/reponame/`
   within a minute or two.
4. (Optional) Add a custom domain under the same Pages settings if you own one.

## 5. Folder structure

```
index.html
assets/
  css/style.css
  js/main.js
  img/dashboards/executive/  department/  pm/
apps-script/
  Code.gs          ← paste into Google Apps Script (not part of the deployed site)
README.md
```

## Notes

- The dashboard images are placeholder mockups built to match the site's
  design — swap them for real screenshots per step 2 above before sharing
  the link.
- The form uses `mode: "no-cors"` when calling Apps Script, which is required
  because Apps Script doesn't return CORS headers to browser fetches. This
  means the site can't read the response back, so it shows a success message
  once the request completes rather than confirming the sheet write directly.
  If you want a confirmed round-trip, redirect after submit to a Google Form
  instead, or move the endpoint behind a small serverless function later.
