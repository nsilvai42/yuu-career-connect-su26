# Career Connect SU26 — Student Site

One Netlify site, three things students use, one analytics funnel:

| Route | What it is | Source |
|---|---|---|
| `/` | **Workshop Calendar Planner** — pick registered sessions, export calendar invites with reminders and one-click Zoom join links | React app, `src/App.jsx` |
| `/guide` | **Student Guide** — program overview, completion goal, tools, coaching | Static HTML, `public/guide.html` (print-layout source of `guide.pdf`) |
| `/catalog` | **Workshop Catalog** — all 12 workshops, CORE vs. BOOST tracks | Static HTML, `public/catalog.html` |
| `/guide.pdf`, `/catalog.pdf` | PDF versions for email attachments | `public/` |

Built by ideas42 for the Year Up United Career Connect Summer 2026 pilot
(Dell Foundation grant). Behavioral design features: endowed progress ring,
3-step guided flow, friction-reduced calendar export (ICS with VTIMEZONE +
1-day/1-hour VALARMs), prefilled Zoom links, plan-ahead mode for the
pre-registration window.

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
| `REGISTRATION_OPENS` | top of `App.jsx` | ⚠️ **Placeholder — confirm with YUU before launch.** Before this date the planner runs in plan-ahead mode (see below). Test with `?regopen=0` / `?regopen=1`. |
| `WORKSHOP_SLOTS` / `KICKOFF_SLOTS` | top of `App.jsx` | Session dates, times, and Zoom links from YUU's confirmed SU26 schedule. Update here if YUU changes anything mid-cohort — push a commit and the live site updates. |
| `PORTAL_URL` | `App.jsx` | Student portal login. |
| Clarity project ID | `index.html`, `public/guide.html`, `public/catalog.html` | **Configured** (project `x4micnma0k`). The Clarity snippet is active in all three pages. To use a different project, swap the ID in those three spots. |
| Pretty URLs / headers | `netlify.toml` | `/guide`, `/catalog`, `noindex` headers. |

## Plan-ahead (pre-registration) mode

Newly enrolled students can register for **kickoff** immediately, but workshop
registration may not open until `REGISTRATION_OPENS`. Before that date:

- Kickoff exports as a normal confirmed invite (students are registered for it).
- Workshop picks export as **TENTATIVE** holds titled `[Register first] …`,
  with a "PLAN ONLY — register in the portal" note leading the description.
- The `.ics` bundle adds a **"Register for your workshops"** event at 9:00 AM ET
  on opening day, listing the student's planned workshops with the portal link,
  with same-day reminders.

After the date (or with `?regopen=1`), the tool behaves as the standard
"register first, then add to calendar" flow.

## How students join sessions (and why the ICS is built this way)

Zoom links normally live **inside Brightspace calendar events**, reachable only
via portal login → Brightspace SSO → course → calendar widget → event. Direct
Brightspace URLs **fail for unauthenticated users**. The planner short-circuits
this: each invite's `LOCATION` carries the direct Zoom link so students join in
one click from their own calendar. The fallback instructions in each invite
mirror the real navigation path (portal → Brightspace button → Calendar widget
→ event → Zoom link).

Attendance is taken from the Zoom room, not from Brightspace launches, so
direct joins do not affect attendance tracking. Students must still **register
in the portal** for outcomes tracking — the tool gates and repeats this.

## Analytics

`track(eventName)` in `App.jsx` sends custom events to Microsoft Clarity
(no-ops if the snippet is commented out). Instrumented: step transitions
(`step_0`–`step_3`), `download_ics_all`, `download_ics_all_planahead`,
`download_ics_single`, `cal_google` / `cal_outlook` / `cal_office365` /
`cal_yahoo`, `portal_click_step0`. **No student data is collected** — the tool
is fully client-side; selections never leave the browser.

For email attribution, append UTM parameters to links in TargetX sends, e.g.
`https://<site>/?utm_source=targetx&utm_medium=email&utm_campaign=enrollment_confirm&utm_content=step2`.

## Security / privacy posture (agreed for the SU26 pilot)

- URL distributed only via enrolled-student emails (unlisted-link trust model).
- `noindex, nofollow` via meta tags **and** `X-Robots-Tag` header **and**
  `robots.txt` — the site should never appear in search engines.
- Zoom links are embedded client-side and therefore readable by anyone with
  the URL. Accepted for the pilot because all SU26 Zoom meetings use waiting
  rooms; revisit (e.g., serverless link endpoint) before any broader rollout.
- No backend, no cookies set by the app, no PII collected.

## Known limitations / future iterations

- `public/guide.html` and `public/catalog.html` are print-layout (fixed
  8.5×11in pages — they are the PDF sources). A `width=816` viewport meta makes
  phones auto-fit the page width; a truly responsive guide is a fall-cycle
  candidate. Scroll-depth analytics on these pages should be read with that in
  mind.
- The ET→UTC conversion for Google/Outlook/Yahoo deep links assumes US Eastern
  **Daylight** Time (all SU26 sessions fall within DST). Revisit if the program
  ever runs Nov–Mar.
- Catalog content also exists inside the planner's data; merging the catalog
  page into the planner as a browsable view is a candidate for fall.

## Handoff to YUU

Everything needed to run this independently: this repo + a Netlify account
(free tier is sufficient) + a Clarity project. No servers, no databases, no
secrets. To rebuild inside YUU systems (e.g., Brightspace), the durable pieces
are `WORKSHOP_SLOTS` (the schedule data), `buildICS()` (the invite format), and
the step-flow copy in `App.jsx`.
