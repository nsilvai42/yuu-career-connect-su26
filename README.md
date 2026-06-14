# Career Connect SU26 — Student Site

One Netlify site, three things students use, one analytics funnel:

| Route | What it is | Source |
|---|---|---|
| `/` | **Workshop Calendar Planner** — turn already-registered sessions into calendar invites with reminders and join access | React app, `src/App.jsx` |
| `/guide/` | **Student Guide** — mobile/PDF-friendly orientation, completion goal, tool roles, and next actions | React app, `src/App.jsx` |
| `/catalog/` | **Workshop Catalog** — mobile/PDF-friendly choice support for all 12 workshops, plus a screen-only scratchpad list | React app, `src/App.jsx` |
| `/guide.pdf`, `/catalog.pdf` | Mobile-sized PDF versions for email attachments/offline review | `public/`, generated from the React routes |
| `/guide.html`, `/catalog.html` | Legacy static URLs | Lightweight handoff pages that redirect/link to the canonical React routes |
| `/privacy` | **Privacy notice** — plain-language disclosure (Clarity analytics, no PII). Linked discreetly from all three pages. ⚠️ Draft — have YUU privacy/legal review wording, retention, and the "Last updated" date before launch. | `public/privacy.html` |

Built by ideas42 for the Year Up United Career Connect Summer 2026 pilot
(Dell Foundation grant). Behavioral design features: endowed progress ring,
step-by-step planner flow, friction-reduced calendar export (ICS with
VTIMEZONE + 1-day/1-hour VALARMs), a registration-first guardrail, and
mobile-readable guide/catalog PDFs.

## Artifact principles

The three student artifacts have different behavioral jobs:

- **Guide = orient and sequence.** Tell students what to do, what counts, what unlocks the reward, and which tool to use next.
- **Catalog = choose.** Help students compare topics and build a registration list without exposing session join links.
- **Planner = follow through.** After students register in the portal, turn their exact registered sessions into calendar reminders and join-ready invites.

Do not merge these jobs accidentally. In particular:

- The guide and catalog should not become alternate registration or join surfaces.
- The planner must keep the registration guardrail visible before exposing calendar exports.
- Mobile/PDF artifacts should use larger type, more whitespace, and fewer decisions per page instead of compressing web-app density into a print format.
- Polishing the interface should not remove the live planner mechanics: landing, kickoff choice, week-by-week selection, session-time chips, progress, all-session `.ics`, and per-session calendar options.

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
```

Deploy: connect this repo to Netlify (build command `npm run build`, publish
directory `dist` — already set in `netlify.toml`).

## Configuration knobs (all in `src/App.jsx` unless noted)

| Knob | Where | Notes |
|---|---|---|
| `WORKSHOP_SLOTS` / `KICKOFF_SLOTS` | top of `App.jsx` | Session dates, times, and Zoom links from YUU's confirmed SU26 schedule. Update here if YUU changes anything mid-cohort — push a commit and the live site updates. |
| `PORTAL_URL` | `App.jsx` | Student portal login. |
| `DIRECT_ZOOM_LINKS_CONFIRMED` | `App.jsx` | Currently `true`, so calendar exports include the direct Zoom link for the selected session. Set to `false` only if YUU reports a passcode/full-link problem after launch. |
| Clarity project ID | `index.html` | **Configured** (project `x4micnma0k`). The React app covers planner, guide, and catalog. To use a different project, swap the ID here. |
| Pretty URLs / headers | `netlify.toml` | `/guide/`, `/catalog/`, legacy `.html` redirects, `noindex` headers. |

## Registration-open flow

The planner assumes Summer 2026 registration is open. Students first register
for sessions in the portal, then use the planner to pick those same sessions
and export calendar invites with reminders and join details. The guide and
catalog are choice/orientation supports; they do not register students and do
not expose session join links.

## How students join sessions (and why the ICS is built this way)

Students still register in the portal first for outcomes tracking. After they
pick the sessions they registered for, each planner-generated invite's
`LOCATION` carries the direct Zoom link from YUU's SU1 schedule so students can
join in one click from their own calendar. If YUU later reports a
passcode/full-link issue, set
`DIRECT_ZOOM_LINKS_CONFIRMED` to `false` to fall back to the portal →
Brightspace → calendar-event path.

Attendance is taken from the Zoom room, not from Brightspace launches, so
direct joins do not affect attendance tracking. Students must still **register
in the portal** for outcomes tracking — the tool gates and repeats this.

## Analytics

`track(eventName)` in `App.jsx` sends custom events to Microsoft Clarity
(no-ops if the snippet is commented out). Instrumented: route/view events
(`welcome`, `select_0`–`select_6`, `plan`, `guide`, `catalog`),
`skip_to_plan`, `download_ics_all`, `download_ics_single`, `cal_google` /
`cal_outlook` / `cal_office365` / `cal_yahoo`, `nav_guide`,
`nav_catalog`, and `portal_click_welcome`. **No student data is collected** —
the tool is fully client-side; selections never leave the browser.

For email attribution, append UTM parameters to links in TargetX sends, e.g.
`https://<site>/?utm_source=targetx&utm_medium=email&utm_campaign=enrollment_confirm&utm_content=step2`.

## Security / privacy posture (agreed for the SU26 pilot)

- URL distributed only via enrolled-student emails (unlisted-link trust model).
- `noindex, nofollow` via meta tags **and** `X-Robots-Tag` header **and**
  `robots.txt` — the site should never appear in search engines.
- Zoom meeting URLs are stored client-side and embedded in exported calendar
  invites for the SU26 pilot, matching YUU's direct schedule-link handoff.
  Revisit (e.g., serverless link endpoint or authenticated host page) before
  any broader rollout.
- No backend, no cookies set by the app, no PII collected.

## PDF generation

`public/guide.pdf` and `public/catalog.pdf` are generated from the React
routes, not from the legacy `.html` files. Current checked-in PDFs use a
mobile-friendly page size (`432 x 922.08 pt`):

```bash
# start or preview the built site first
npm run build
npm run preview -- --host 127.0.0.1 --port 4174

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --print-to-pdf="public/guide.pdf" \
  --print-to-pdf-no-header \
  --virtual-time-budget=5000 \
  http://127.0.0.1:4174/guide/

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox \
  --print-to-pdf="public/catalog.pdf" \
  --print-to-pdf-no-header \
  --virtual-time-budget=5000 \
  http://127.0.0.1:4174/catalog/
```

Verify PDFs after regenerating:

```bash
pdfinfo public/guide.pdf
pdfinfo public/catalog.pdf
pdftotext public/catalog.pdf - | rg -i "zoom"
```

## Known limitations / future iterations

- `public/guide.html` and `public/catalog.html` are no longer full artifacts.
  They are compatibility handoff pages for direct legacy URLs. Canonical HTML
  lives in the React routes.
- The ET→UTC conversion for Google/Outlook/Yahoo deep links assumes US Eastern
  **Daylight** Time (all SU26 sessions fall within DST). Revisit if the program
  ever runs Nov–Mar.
- Catalog content also exists inside the planner's data. Keep route behavior
  aligned whenever workshop names, weeks, blurbs, times, or track labels change.

## Handoff to YUU

Everything needed to run this independently: this repo + a Netlify account
(free tier is sufficient) + a Clarity project. No servers, no databases, no
secrets. To rebuild inside YUU systems (e.g., Brightspace), the durable pieces
are `WORKSHOP_SLOTS` (the schedule data), `buildICS()` (the invite format), the
artifact-role principles above, and the step-flow copy in `App.jsx`.
