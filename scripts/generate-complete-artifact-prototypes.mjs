import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("public/prototypes/complete");

const PORTAL_URL = "/portal";

const variants = [
  {
    slug: "polished-current",
    label: "Polished Current",
    tone: "Keep the familiar sequence, tighten hierarchy, and make each next action obvious.",
    hero: {
      planner: ["Workshop Calendar Planner", "Register in the portal first. Then use this planner to turn your registered sessions into calendar reminders."],
      guide: ["Career Connect Student Guide", "Everything you need to start, complete 7+ live sessions, and know where to get support."],
      catalog: ["Workshop Catalog", "Browse the full Summer 2026 workshop set, prioritize Career Essentials, and take a clear registration list into the portal."],
    },
  },
  {
    slug: "presentation-redesign",
    label: "Presentation Redesign",
    tone: "Same facts, organized around student decisions: start, choose, register, attend, and recover.",
    hero: {
      planner: ["Build Your Registered Schedule", "Mirror the sessions you registered for, choose exact times, and create reminders that help you attend."],
      guide: ["Your Career Connect Journey", "Move from enrollment to completion with a clearer path: register, calendar, attend, get help."],
      catalog: ["Catalog As A Choice Tool", "Compare workshops by priority, add choices to My workshops, and copy a registration list for the portal."],
    },
  },
  {
    slug: "behavioral-redesign",
    label: "Behavioral Content Redesign",
    tone: "Use commitment prompts, prioritization rules, and recovery paths to reduce drop-off.",
    hero: {
      planner: ["Lock In Your Attendance Plan", "Make the plan concrete: I registered, I chose the exact time, and I put the reminder where I will see it."],
      guide: ["Your Next Three Moves", "A low-friction action plan for registering, attending, and recovering if life gets in the way."],
      catalog: ["Pick Your Complete Path", "Choose the workshops that help you complete, recover, and strengthen your career plan."],
    },
  },
];

const workshops = [
  { week: 1, range: "Jun 22-26", name: "Building Confidence", track: "BOOST", headline: "Build Your Confidence, Unlock Your Potential", blurb: "Build confidence, step outside your comfort zone, and recover from setbacks.", use: "Advocate for yourself with more confidence." },
  { week: 1, range: "Jun 22-26", name: "Accountability", track: "BOOST", headline: "Own Your Role, Strengthen Your Team", blurb: "Practice ownership, communication, and collaboration so your team can count on you.", use: "Build trust as a dependable teammate." },
  { week: 2, range: "Jun 29-Jul 3", name: "Goal Setting", track: "CORE", headline: "Set Goals That Drive Your Success", blurb: "Use SMART goals to set clear targets, stay motivated, and plan around obstacles.", use: "Turn a big goal into next steps." },
  { week: 2, range: "Jun 29-Jul 3", name: "Managing Your Manager", track: "BOOST", headline: "Build Strong Relationships With Your Manager", blurb: "Manage up: clarify expectations, communicate well, and support your manager's goals.", use: "Build stronger manager relationships." },
  { week: 3, range: "Jul 6-10", name: "Culture & Belonging", track: "BOOST", headline: "Foster Inclusion and Belonging", blurb: "Spot bias and practice concrete ways to support equity and belonging.", use: "Help build healthier teams." },
  { week: 3, range: "Jul 6-10", name: "AI in the Workplace", track: "CORE", headline: "Understanding AI's Place in the Workplace", blurb: "Learn AI basics, prompt writing, output checks, and ethical use at work.", use: "Use AI more carefully at work." },
  { week: 4, range: "Jul 13-17", name: "Growth Mindset", track: "BOOST", headline: "Unlock Your Potential With a Growth Mindset", blurb: "Shift negative self-talk, handle feedback, and turn challenges into growth.", use: "Keep going when work gets hard." },
  { week: 4, range: "Jul 13-17", name: "Professional Development", track: "CORE", headline: "Plan Your Career With Confidence", blurb: "Research career options, map your strengths and gaps, and choose your next steps.", use: "Know what to build next." },
  { week: 5, range: "Jul 20-24", name: "Resumes / Digital Footprint", track: "CORE", headline: "Craft a Resume That Stands Out", blurb: "Write stronger resume statements that show your skills and accomplishments.", use: "Show employers what you bring." },
  { week: 5, range: "Jul 20-24", name: "LinkedIn Branding", track: "CORE", headline: "Build a Professional Online Presence", blurb: "Shape your digital footprint and build a LinkedIn profile that opens doors.", use: "Make your professional brand clear." },
  { week: 6, range: "Jul 27-31", name: "Interview Preparation", track: "CORE", headline: "Get Ready for a Strong Interview", blurb: "Prepare strong answers, practice common questions, and use the STAR Method.", use: "Turn your experience into a clear story." },
  { week: 6, range: "Jul 27-31", name: "Work/Life Balance", track: "BOOST", headline: "Create Balance, Reduce Stress", blurb: "Set boundaries, manage stressors, and build habits that protect your well-being.", use: "Stay consistent when life gets busy." },
];

const slots = {
  "Building Confidence": [["2026-06-22", "14:00", "https://yearup.zoom.us/j/93742131185"], ["2026-06-22", "18:00", "https://yearup.zoom.us/j/94376045428"], ["2026-06-22", "20:00", "https://yearup.zoom.us/j/91762150062"], ["2026-06-24", "14:00", "https://yearup.zoom.us/j/98366298051"], ["2026-06-24", "18:00", "https://yearup.zoom.us/j/99143491046"], ["2026-06-24", "20:00", "https://yearup.zoom.us/j/94670987741"]],
  "Accountability": [["2026-06-23", "14:00", "https://yearup.zoom.us/j/93085221847"], ["2026-06-23", "18:00", "https://yearup.zoom.us/j/93174772873"], ["2026-06-23", "20:00", "https://yearup.zoom.us/j/98329663806"], ["2026-06-25", "14:00", "https://yearup.zoom.us/j/99035070295"], ["2026-06-25", "18:00", "https://yearup.zoom.us/j/91593219325"], ["2026-06-25", "20:00", "https://yearup.zoom.us/j/95242610632"]],
  "Goal Setting": [["2026-06-29", "14:00", "https://yearup.zoom.us/j/98367357973"], ["2026-06-29", "18:00", "https://yearup.zoom.us/j/91360864011"], ["2026-06-29", "20:00", "https://yearup.zoom.us/j/92866906367"], ["2026-07-01", "14:00", "https://yearup.zoom.us/j/95103944245"], ["2026-07-01", "18:00", "https://yearup.zoom.us/j/95453381601"], ["2026-07-01", "20:00", "https://yearup.zoom.us/j/92033115757"]],
  "Managing Your Manager": [["2026-06-30", "14:00", "https://yearup.zoom.us/j/95268977152"], ["2026-06-30", "18:00", "https://yearup.zoom.us/j/91556461015"], ["2026-06-30", "20:00", "https://yearup.zoom.us/j/96908983602"], ["2026-07-02", "14:00", "https://yearup.zoom.us/j/99684182826"], ["2026-07-02", "18:00", "https://yearup.zoom.us/j/91387129129"], ["2026-07-02", "20:00", "https://yearup.zoom.us/j/94616233222"]],
  "Culture & Belonging": [["2026-07-06", "14:00", "https://yearup.zoom.us/j/92290076671"], ["2026-07-06", "18:00", "https://yearup.zoom.us/j/95976521105"], ["2026-07-06", "20:00", "https://yearup.zoom.us/j/99750440715"], ["2026-07-08", "14:00", "https://yearup.zoom.us/j/93245356421"], ["2026-07-08", "18:00", "https://yearup.zoom.us/j/94930817252"], ["2026-07-08", "20:00", "https://yearup.zoom.us/j/93285357786"]],
  "AI in the Workplace": [["2026-07-07", "14:00", "https://yearup.zoom.us/j/93830726013"], ["2026-07-07", "18:00", "https://yearup.zoom.us/j/91588357671"], ["2026-07-07", "20:00", "https://yearup.zoom.us/j/97053656904"], ["2026-07-09", "14:00", "https://yearup.zoom.us/j/93003524331"], ["2026-07-09", "18:00", "https://yearup.zoom.us/j/93117101572"], ["2026-07-09", "20:00", "https://yearup.zoom.us/j/99067389990"]],
  "Growth Mindset": [["2026-07-13", "14:00", "https://yearup.zoom.us/j/94685454214"], ["2026-07-13", "18:00", "https://yearup.zoom.us/j/94439014595"], ["2026-07-13", "20:00", "https://yearup.zoom.us/j/95250920033"], ["2026-07-15", "14:00", "https://yearup.zoom.us/j/99054427457"], ["2026-07-15", "18:00", "https://yearup.zoom.us/j/93836232714"], ["2026-07-15", "20:00", "https://yearup.zoom.us/j/92112484627"]],
  "Professional Development": [["2026-07-14", "14:00", "https://yearup.zoom.us/j/95004015059"], ["2026-07-14", "18:00", "https://yearup.zoom.us/j/97121399437"], ["2026-07-14", "20:00", "https://yearup.zoom.us/j/94219865553"], ["2026-07-16", "14:00", "https://yearup.zoom.us/j/99483368425"], ["2026-07-16", "18:00", "https://yearup.zoom.us/j/95576005197"], ["2026-07-16", "20:00", "https://yearup.zoom.us/j/94251050603"]],
  "Resumes / Digital Footprint": [["2026-07-20", "14:00", "https://yearup.zoom.us/j/93007746158"], ["2026-07-20", "18:00", "https://yearup.zoom.us/j/92638691400"], ["2026-07-20", "20:00", "https://yearup.zoom.us/j/99412044772"], ["2026-07-22", "14:00", "https://yearup.zoom.us/j/95654732649"], ["2026-07-22", "18:00", "https://yearup.zoom.us/j/94293961209"], ["2026-07-22", "20:00", "https://yearup.zoom.us/j/92983830310"]],
  "LinkedIn Branding": [["2026-07-21", "14:00", "https://yearup.zoom.us/j/91586328169"], ["2026-07-21", "18:00", "https://yearup.zoom.us/j/98529533777"], ["2026-07-21", "20:00", "https://yearup.zoom.us/j/96415722037"], ["2026-07-23", "14:00", "https://yearup.zoom.us/j/93666283569"], ["2026-07-23", "18:00", "https://yearup.zoom.us/j/96081745153"], ["2026-07-23", "20:00", "https://yearup.zoom.us/j/92581054695"]],
  "Interview Preparation": [["2026-07-27", "14:00", "https://yearup.zoom.us/j/96481894483"], ["2026-07-27", "18:00", "https://yearup.zoom.us/j/99492827132"], ["2026-07-27", "20:00", "https://yearup.zoom.us/j/94829280424"], ["2026-07-29", "14:00", "https://yearup.zoom.us/j/95958841546"], ["2026-07-29", "18:00", "https://yearup.zoom.us/j/97029865300"], ["2026-07-29", "20:00", "https://yearup.zoom.us/j/98756144277"]],
  "Work/Life Balance": [["2026-07-28", "14:00", "https://yearup.zoom.us/j/99119933888"], ["2026-07-28", "18:00", "https://yearup.zoom.us/j/94243348176"], ["2026-07-28", "20:00", "https://yearup.zoom.us/j/92119472714"], ["2026-07-30", "14:00", "https://yearup.zoom.us/j/98423469978"], ["2026-07-30", "18:00", "https://yearup.zoom.us/j/92727611515"], ["2026-07-30", "20:00", "https://yearup.zoom.us/j/97028889212"]],
};

const kickoffSlots = [
  ["2026-06-15", "14:00", "https://yearup.zoom.us/j/98381570894"],
  ["2026-06-15", "19:00", "https://yearup.zoom.us/j/91987217167"],
  ["2026-06-16", "14:00", "https://yearup.zoom.us/j/95397331652"],
  ["2026-06-16", "19:00", "https://yearup.zoom.us/j/96132672537"],
  ["2026-06-17", "14:00", "https://yearup.zoom.us/j/93136944796"],
  ["2026-06-17", "19:00", "https://yearup.zoom.us/j/98195013546"],
  ["2026-06-18", "14:00", "https://yearup.zoom.us/j/97497024923"],
  ["2026-06-18", "19:00", "https://yearup.zoom.us/j/96946935576"],
];

const weekThemes = {
  1: "Confidence & Accountability",
  2: "Goal Setting & Managing Your Manager",
  3: "Culture & Belonging + AI",
  4: "Growth Mindset & Professional Development",
  5: "Resumes/Digital Footprint & LinkedIn",
  6: "Interview Preparation & Work/Life Balance",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function scriptData(value) {
  return JSON.stringify(value).replaceAll("</", "<\\/");
}

function pill(track) {
  return `<span class="pill ${track.toLowerCase()}">${track}</span>`;
}

function byWeekHtml(renderItem) {
  return [1, 2, 3, 4, 5, 6].map((week) => {
    const items = workshops.filter((item) => item.week === week).map(renderItem).join("");
    const range = workshops.find((item) => item.week === week).range;
    return `<section class="week"><div class="week-head"><span>Week ${week} - ${range}</span><strong>${esc(weekThemes[week])}</strong></div><div class="week-grid">${items}</div></section>`;
  }).join("");
}

function shell(variant, artifact, body, script = "") {
  const title = variant.hero[artifact][0];
  const nav = ["planner", "guide", "catalog"].map((item) => {
    const label = item === "planner" ? "Planner" : item === "guide" ? "Student Guide" : "Workshop Catalog";
    return `<a class="${item === artifact ? "active" : ""}" href="./${variant.slug}-${item}.html">${label}</a>`;
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${esc(title)} - Career Connect SU26</title>
  <style>${css()}</style>
</head>
<body class="${variant.slug} artifact-${artifact}">
  <header class="topbar">
    <div class="brand"><span class="mark">YU</span><span>Year Up United <small>Career Connect SU26</small></span></div>
    <nav>${nav}</nav>
  </header>
  ${body}
  ${script ? `<script>${script}</script>` : ""}
</body>
</html>
`;
}

function renderHero(variant, artifact, right = "") {
  const [title, lead] = variant.hero[artifact];
  return `<section class="hero">
    <div>
      <p class="eyebrow">Career Connect - Summer 2026</p>
      <h1>${esc(title)}</h1>
      <p>${esc(lead)}</p>
    </div>
    ${right || `<aside class="hero-card"><strong>Good enough for now</strong><p>Register first, then use this page to reduce the chance that planning turns into forgetting.</p></aside>`}
  </section>`;
}

function renderPlanner(variant) {
  const [title, lead] = variant.hero.planner;
  const body = `<main class="planner-shell" data-variant="${esc(variant.slug)}">
    <section class="planner-stage is-active" id="planner-start">
      <div class="planner-card planner-intro-card">
        <p class="eyebrow">Career Connect - Summer 2026</p>
        <h1>${esc(title)}</h1>
        <p class="planner-lead">${esc(lead)} Complete Career Connect by attending <strong>7+ live sessions</strong>. Kickoff counts as 1 if you attend, and all workshops count too. Putting sessions on your calendar with reminders is the best way to make sure you actually show up.</p>
        <div class="portal-callout">
          <p><strong>This tool does not register you for workshops.</strong> First register in the Career Connect student portal. Then use this planner to add those registered sessions to your calendar.</p>
          <a class="button dark" href="${PORTAL_URL}">Go to the student portal to register</a>
        </div>
        <div class="how-card">
          <p><strong>How it works:</strong> select which workshops you registered for, and we'll build the calendar invites for you in one click. The <strong class="orange-text">6 Career Essentials (CORE)</strong> workshops are the recommended path to ensure you complete the program. The <strong>6 Career Edge (BOOST)</strong> workshops count toward completion too - add them for extra practice, more schedule options, and a stronger plan.</p>
        </div>
        <button class="button planner-start-button" id="start-planner">Start - it takes about 2 minutes</button>
        <p class="fineprint"><strong>Privacy note:</strong> this tool does not save or send your information. Your selections stay on this page and are only used to create calendar invites.</p>
      </div>
    </section>
    <section class="planner-stage" id="planner-select" aria-live="polite">
      <div class="step-title"><span class="step-bars"><i></i><i></i></span><h1>Which workshops did you register for?</h1></div>
      <section class="kickoff-card">
        <div class="kickoff-head">${pill("KICKOFF")}<strong>Did you register for a kickoff session?</strong></div>
        <p>Pick the kickoff session you registered for or attended - kickoff counts toward your 7+ live sessions if you attend. If you're not registered for kickoff or missed it, choose the last option.</p>
        <div id="kickoff-options" class="kickoff-options"></div>
      </section>
      <p class="selection-note">Now tap each workshop you registered for, then choose your session time. The <strong class="orange-text">6 Career Essentials (CORE)</strong> workshops are the recommended path; <strong>Career Edge (BOOST)</strong> workshops count too and can give you more schedule options.</p>
      <div id="planner-workshops"></div>
      <div class="planner-nav-row">
        <button class="text-button" id="back-start">Back</button>
        <button class="button" id="go-export" disabled>Add to calendar</button>
      </div>
      <p id="planner-warning" class="planner-warning"></p>
    </section>
    <section class="planner-stage" id="planner-export" aria-live="polite">
      <div class="step-title"><span class="step-bars is-complete"><i></i><i></i></span><h1>Add to calendar</h1></div>
      <section class="progress-card" id="progress-card"></section>
      <section class="one-tap-card">
        <h2>Get everything in one tap</h2>
        <p>Your calendar invite will save the session time, reminders 1 day and 1 hour before, and the Zoom link for that session.</p>
        <button class="button" id="download-ics">Download .ics (all sessions)</button>
        <p>Best for Apple Calendar / phone. Using Google or Outlook on the web? Use the per-session buttons below.</p>
      </section>
      <h2 class="subhead">Or add them one at a time</h2>
      <div id="export-list" class="export-list"></div>
      <p class="fineprint">Each invite includes the workshop description. The full .ics download and Apple / iCal option carry built-in reminders. Google, Outlook, Office 365, and Yahoo apply your calendar's own default reminder when the event opens.</p>
      <section class="completion-card" id="completion-card"></section>
      <div class="planner-nav-row"><button class="text-button" id="back-select">Back to selections</button></div>
      <p id="planner-status" class="status"></p>
    </section>
  </main>`;
  return shell(variant, "planner", body, plannerScript());
}

function renderGuide(variant) {
  const guideTitle = variant.slug === "polished-current" ? "Your Career Connect Guide" : variant.hero.guide[0];
  const body = `<main class="pdf-guide-shell" aria-label="${esc(guideTitle)}">
    <section class="guide-page guide-cover">
      <div class="guide-kicker"><span>6 weeks</span><span>100% virtual</span></div>
      <div>
        <p class="eyebrow">Year Up United</p>
        <h1>${esc(guideTitle)}</h1>
        <p>Everything you need to make the most of the next six weeks - in one place.</p>
      </div>
      <div class="cover-note">A free, 6-week virtual program for students to develop and practice career readiness skills.</div>
      <div class="cover-foot">Year Up United Career Connect | yearupunited.org</div>
    </section>

    <section class="guide-page">
      ${guidePageHead("You're officially in!", "Start here")}
      <p class="guide-lead">Welcome to Year Up United's Career Connect Program - a free, 100% virtual 6-week career readiness program for community college students.</p>
      <p class="guide-lead small">Knock out these three quick tasks and you're set for the next six weeks.</p>
      <div class="start-strip"><span>Start here</span><strong>Do these 3 things now</strong><em>takes about 10 minutes</em></div>
      <div class="action-grid">
        <article><span class="action-num">1</span><h3>Register for all your workshops</h3><p>Register for kickoff, the 6 Career Essentials, and additional Career Edge sessions.</p><a href="${PORTAL_URL}">Go to the portal</a></article>
        <article><span class="action-num">2</span><h3>Add them to your calendar</h3><p>After registering, use the calendar tool to add each session to your calendar.</p><a href="./${variant.slug}-planner.html">Add to calendar</a></article>
        <article><span class="action-num">3</span><h3>Join the Slack Community</h3><p>Sign in and post a quick intro in <strong>#career-connect-summer-2026</strong>.</p><a href="https://yearup.enterprise.slack.com">Go to Slack</a></article>
      </div>
      <div class="goal-band"><div><strong>7</strong><span>/ 12</span><em>Your goal</em></div><p><strong>Attend at least 7 of 12 to unlock your reward.</strong> Kickoff counts as 1. Attend 6 more workshops - about 1-2 hours a week.</p></div>
      <div class="catchup-box"><strong>Missed kickoff or joined late?</strong> Register for at least the 6 Career Essentials and one or more Career Edge workshops that fit your schedule.</div>
      <div class="quick-ref">
        <div><b>Your goal</b><span>Minimum 7 of 12 workshops</span></div>
        <div><b>Portal</b><span>Manage your sessions</span></div>
        <div><b>Slack</b><span>Sign in with Career Connect</span></div>
        <div><b>Program catalog</b><span>Browse all 12 workshops</span></div>
        <div><b>Planner tool</b><span>Add sessions to calendar</span></div>
        <div><b>1:1 coaching</b><span>Email your coach</span></div>
      </div>
      ${guideFooter(2)}
    </section>

    <section class="guide-page">
      ${guidePageHead("Your 6-week journey", "Your workshop timeline")}
      <div class="timeline-intro">
        <p>Aim to attend all 12. Can't make them all? Prioritize Essentials (CORE) over Edge (BOOST).</p>
        <div><span class="pill core">CORE</span><strong>Career Essentials</strong><small>Required to complete</small></div>
        <div><span class="pill boost">BOOST</span><strong>Career Edge</strong><small>Bonus - counts too</small></div>
      </div>
      <div class="startstrong"><strong>Starting strong:</strong> Week 1 BOOST sessions count, especially if you missed kickoff. <a href="./${variant.slug}-catalog.html">Open Workshop Catalog</a></div>
      <div class="pdf-timeline">
        <article class="kickoff"><span>Kickoff - June 15</span><h3>Welcome & Orientation</h3><p>Meet your cohort, set up Slack, and get ready for six weeks of career building.</p></article>
        ${[1, 2, 3, 4, 5, 6].map((week) => renderPdfGuideWeek(week)).join("")}
      </div>
      ${guideFooter(3)}
    </section>

    <section class="guide-page">
      ${guidePageHead("How it all works", "Joining & your tools")}
      <p class="guide-lead">Register for your sessions in the student portal, then use the calendar tool to add those registered session times to your calendar. To join live, use the portal to Brightspace path.</p>
      <div class="tool-grid">
        <article><h3>Student Portal</h3><p>Pick your workshop times, register, and manage your sessions. Most workshops run multiple times a week.</p><a href="${PORTAL_URL}">Go to the portal</a></article>
        <article><h3>Slack Community</h3><p>Announcements, reminders, wins, and peer support. Your main channel is #career-connect-summer-2026.</p><a href="https://yearup.enterprise.slack.com">Go to Slack</a></article>
        <article><h3>Brightspace Library</h3><p>Slides, handouts, resources after each session, the Resume Submission Hub, and async materials.</p><a href="${PORTAL_URL}">Open via the portal</a></article>
        <article><h3>1:1 Coaching</h3><p>Email your coach to book a 15-minute session - resume, interview prep, networking, or your next move.</p><a href="mailto:careerconnect@yearupunited.org">Email your coach</a></article>
      </div>
      <div class="join-flow">
        <h3>How to join a live session</h3>
        <div><span>1</span><strong>Log into your portal</strong><p>Find your session under your registered sessions list.</p></div>
        <div><span>2</span><strong>Launch Brightspace</strong><p>Use the Brightspace button, or click "Log into Brightspace to view workshop details."</p></div>
        <div><span>3</span><strong>Join Zoom</strong><p>Open the event on your Brightspace calendar and click the Zoom link in the description. Use your real name so we can mark you present.</p></div>
      </div>
      ${guideFooter(4)}
    </section>

    <section class="guide-page">
      ${guidePageHead("Make it stick", "Set yourself up for success")}
      <div class="tips-grid">
        <article><span>1</span><h3>Add sessions to your calendar</h3><p>Once you've registered, use <a href="./${variant.slug}-planner.html">the calendar tool</a> to block every session.</p></article>
        <article><span>2</span><h3>Post your plan on Slack</h3><p>Tell your cohort which workshops you picked - a public plan makes it easier to follow through.</p></article>
        <article><span>3</span><h3>Switch slots - don't skip</h3><p>Life gets busy. If something comes up, reschedule to another session - a switch beats a miss.</p></article>
        <article><span>4</span><h3>Front-load Career Essentials</h3><p>Aim for all 12, but if you are short on time, complete the orange-marked CORE workshops first.</p></article>
      </div>
      <div class="commitment-grid">
        <article><h3>Your commitment</h3><p>My goal: I'll complete <span></span> workshops this summer.</p><p>I'll tell <span></span> about this commitment.</p><p>If something comes up, I'll <span></span> instead of skipping.</p><p>My backup plan: <span></span></p></article>
        <article><h3>Your first post on Slack</h3><div class="slack-template"><strong>Hi, I'm [Name]!</strong><br>Location: ...<br>Area of Study: ...<br>Career Aspirations: ...<br>Hoping to get from Career Connect: ...<br>Fun Fact: ...</div></article>
      </div>
      <div class="coaching-box">
        <h3>Meet your 1:1 coaching team</h3>
        <p>Coaching isn't just for when you're stuck - the most successful participants use it proactively. Sessions are 15 minutes, first come first served, and can cover anything career-related.</p>
        <div><span>Sheree Hicks<br><a href="mailto:shicks@yearupunited.org">shicks@yearupunited.org</a></span><span>Rebecca Ferber<br><a href="mailto:rferber@yearupunited.org">rferber@yearupunited.org</a></span><span>Randy Flores<br><a href="mailto:rflores01@yearupunited.org">rflores01@yearupunited.org</a></span></div>
        <p class="fineprint">Questions about the program? Reach out to mlaporte@yearup.org.</p>
      </div>
      ${guideFooter(5)}
    </section>
  </main>`;
  return shell(variant, "guide", body);
}

function guidePageHead(kicker, title) {
  return `<div class="guide-page-head"><span>${esc(kicker)}</span><h2>${esc(title)}</h2></div>`;
}

function guideFooter(page) {
  return `<footer class="guide-foot"><span><strong>Career Connect</strong> - Your Guide - careerconnect@yearupunited.org</span><span>${page}</span></footer>`;
}

function renderPdfGuideWeek(week) {
  const range = workshops.find((item) => item.week === week).range;
  const items = workshops.filter((item) => item.week === week).map((item) => `<p><strong>${esc(item.name)}</strong> ${pill(item.track)}</p>`).join("");
  return `<article><span>Week ${week} - ${range}</span><h3>${esc(weekThemes[week])}</h3>${items}</article>`;
}

function renderTimelineWeek(week) {
  const range = workshops.find((item) => item.week === week).range;
  return `<div class="timeline-week"><div class="week-number">Week ${week}<span>${range}</span></div><div><h3>${esc(weekThemes[week])}</h3>${workshops.filter((item) => item.week === week).map((item) => `<p>${pill(item.track)} ${esc(item.name)}</p>`).join("")}</div></div>`;
}

function renderCatalog(variant) {
  const body = `${renderHero(variant, "catalog", `<aside class="hero-card"><strong>Use this before the portal</strong><p>Add workshops as you read. Copy the list, then open the portal and register there.</p><a class="button dark" href="${PORTAL_URL}">Open student portal</a></aside>`)}
  <main class="catalog-layout">
    <section class="panel catalog-intro">
      <div class="section-head"><div><p class="eyebrow">Priority rule</p><h2>Complete first, strengthen next</h2></div></div>
      <div class="priority-table">
        <div><strong>1. Register for all 6 CORE workshops</strong><span>With kickoff, this is the cleanest 7-session completion path.</span></div>
        <div><strong>2. Add BOOST workshops that fit</strong><span>They count too and give more practice, recovery, and schedule options.</span></div>
        <div><strong>3. Copy your list into the portal</strong><span>This page helps planning. Registration still happens in the student portal.</span></div>
      </div>
    </section>
    <section class="catalog-main">
      <div class="toolbar"><button data-filter="ALL" class="active">All 12</button><button data-filter="CORE">CORE only</button><button data-filter="BOOST">BOOST only</button></div>
      <div id="catalog-cards" class="catalog-cards"></div>
    </section>
    <aside class="panel my-workshops">
      <p class="eyebrow">Use this now</p>
      <div class="section-head"><h2>My workshops</h2><span id="my-count" class="count">0</span></div>
      <p class="fineprint">This list is only kept on this page. It clears if you leave or refresh.</p>
      <div id="my-stats" class="summary-stats"><span><b>0</b> CORE</span><span><b>0</b> BOOST</span></div>
      <div id="my-list" class="selected-list empty">No workshops selected yet.</div>
      <label class="label" for="export-box">Registration list</label>
      <textarea id="export-box" readonly>Select workshops to create a portal registration list.</textarea>
      <button class="button" id="copy-list" disabled>Copy registration list</button>
      <a class="button dark" href="${PORTAL_URL}">Open portal to register</a>
      <p id="copy-status" class="status"></p>
    </aside>
  </main>`;
  return shell(variant, "catalog", body, catalogScript());
}

function plannerScript() {
  return `
const WORKSHOPS=${scriptData(workshops)};
const SLOTS=${scriptData(slots)};
const KICKOFF=${scriptData(kickoffSlots)};
const picked={};
let kickoffIndex=null;
let plannerStep="start";
const COMPLETION_GOAL=7;
function esc(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function prettyDate(date){return new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
function longDate(date){return new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}
function prettyTime(time){let h=Number(time.slice(0,2));let m=time.slice(3);let ap=h>=12?"PM":"AM";h=h%12||12;return h+":"+m+" "+ap}
function pill(track){return '<span class="pill '+track.toLowerCase()+'">'+track+'</span>'}
function stepTo(next){plannerStep=next;document.querySelectorAll(".planner-stage").forEach(function(el){el.classList.toggle("is-active",el.id==="planner-"+next)});window.scrollTo({top:0,behavior:"smooth"});render()}
function toggle(name){if(Object.hasOwn(picked,name)){delete picked[name]}else{picked[name]=null} render()}
function choose(name,index){picked[name]=index; render()}
function renderKickoff(){document.getElementById("kickoff-options").innerHTML=KICKOFF.map(function(slot,i){return '<label class="radio-row"><input type="radio" name="kickoff" '+(kickoffIndex===i?'checked':'')+' data-kickoff="'+i+'"><span><strong>Session '+(i+1)+'</strong> - '+prettyDate(slot[0])+' - '+prettyTime(slot[1])+' ET</span></label>'}).join("")+'<label class="radio-row"><input type="radio" name="kickoff" '+(kickoffIndex==="none"?'checked':'')+' data-kickoff="none"><span>I am not attending / I missed kickoff</span></label>'}
function groupedSlots(name){let groups=[];(SLOTS[name]||[]).forEach(function(slot,i){let group=groups.find(function(g){return g.date===slot[0]});if(!group){group={date:slot[0],slots:[]};groups.push(group)}group.slots.push({slot:slot,index:i})});return groups}
function renderWorkshops(){document.getElementById("planner-workshops").innerHTML=[1,2,3,4,5,6].map(function(week){let group=WORKSHOPS.filter(function(w){return w.week===week});return '<section class="week selection-week"><div class="week-head"><span>Week '+week+'</span><strong>'+group[0].range+'</strong></div><div class="week-list">'+group.map(renderWorkshop).join("")+'</div></section>'}).join("")}
function renderWorkshop(w){let active=Object.hasOwn(picked,w.name);let chosen=picked[w.name];let slotHtml="";if(active){slotHtml='<div class="slot-picker"><p>Which session did you register for?</p>'+groupedSlots(w.name).map(function(day){let dayPicked=day.slots.some(function(item){return item.index===chosen});return '<div class="day-box '+(dayPicked?'is-picked':'')+'"><strong>'+longDate(day.date)+'</strong><div class="time-row">'+day.slots.map(function(item){let selected=item.index===chosen;return '<button class="time-chip '+(selected?'active':'')+'" data-name="'+esc(w.name)+'" data-index="'+item.index+'">'+prettyTime(item.slot[1])+' ET</button>'}).join("")+'</div></div>'}).join("")+'</div>'}return '<article class="workshop-row '+w.track.toLowerCase()+' '+(active?'is-added':'')+'"><button class="workshop-toggle" data-toggle="'+esc(w.name)+'"><span class="checkmark">'+(active?'✓':'')+'</span><span><strong>'+esc(w.name)+'</strong>'+pill(w.track)+'</span></button>'+slotHtml+'</article>'}
function selectedEvents(){let events=[]; if(typeof kickoffIndex==="number"){let s=KICKOFF[kickoffIndex]; events.push({name:"Career Connect Kickoff",track:"KICKOFF",date:s[0],time:s[1],link:s[2],blurb:"Get started, meet the team, and learn how Career Connect works."})} Object.keys(picked).forEach(function(name){if(typeof picked[name]!=="number")return;let w=WORKSHOPS.find(function(x){return x.name===name});let s=SLOTS[name][picked[name]];events.push({name:name,track:w.track,date:s[0],time:s[1],link:s[2],blurb:w.blurb})}); return events}
function incompleteSelections(){return Object.keys(picked).filter(function(name){return typeof picked[name]!=="number"})}
function icsDate(date,time){return date.replaceAll("-","")+"T"+time.replace(":","")+"00"}
function endTime(time){let h=Number(time.slice(0,2))+1;return String(h).padStart(2,"0")+time.slice(2)}
function escapeIcs(s){return String(s||"").replaceAll("\\\\","\\\\\\\\").replaceAll(";","\\\\;").replaceAll(",","\\\\,").replaceAll("\\n","\\\\n")}
function makeIcs(events){events=events||selectedEvents();return "BEGIN:VCALENDAR\\r\\nVERSION:2.0\\r\\nPRODID:-//Career Connect SU26//Workshop Planner//EN\\r\\nCALSCALE:GREGORIAN\\r\\nMETHOD:PUBLISH\\r\\n"+events.map(function(e){let desc="This reminder is for a session you registered for in the Career Connect student portal. Join: "+e.link+(e.blurb?"\\n\\n"+e.blurb:"");return "BEGIN:VEVENT\\r\\nSUMMARY:Career Connect: "+escapeIcs(e.name)+"\\r\\nDTSTART;TZID=America/New_York:"+icsDate(e.date,e.time)+"\\r\\nDTEND;TZID=America/New_York:"+icsDate(e.date,endTime(e.time))+"\\r\\nLOCATION:"+escapeIcs(e.link)+"\\r\\nDESCRIPTION:"+escapeIcs(desc)+"\\r\\nBEGIN:VALARM\\r\\nTRIGGER:-P1D\\r\\nACTION:DISPLAY\\r\\nDESCRIPTION:Reminder: Career Connect workshop tomorrow.\\r\\nEND:VALARM\\r\\nBEGIN:VALARM\\r\\nTRIGGER:-PT1H\\r\\nACTION:DISPLAY\\r\\nDESCRIPTION:Your Career Connect workshop starts in 1 hour.\\r\\nEND:VALARM\\r\\nEND:VEVENT\\r\\n"}).join("")+"END:VCALENDAR\\r\\n"}
window.makeIcs=makeIcs;
function downloadIcs(events,name){let blob=new Blob([makeIcs(events)],{type:"text/calendar;charset=utf-8"});let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name||"Career_Connect_Schedule.ics";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(a.href)}
function utcStamp(date,time){let parts=date.split("-").map(Number);let hm=time.split(":").map(Number);let dt=new Date(Date.UTC(parts[0],parts[1]-1,parts[2],hm[0]+4,hm[1],0));let p=function(n){return String(n).padStart(2,"0")};return dt.getUTCFullYear()+p(dt.getUTCMonth()+1)+p(dt.getUTCDate())+"T"+p(dt.getUTCHours())+p(dt.getUTCMinutes())+"00Z"}
function utcIso(date,time){let parts=date.split("-").map(Number);let hm=time.split(":").map(Number);return new Date(Date.UTC(parts[0],parts[1]-1,parts[2],hm[0]+4,hm[1],0)).toISOString().split(".")[0]+"Z"}
function eventText(e){return "Career Connect: "+e.name}
function eventDesc(e){return "Join here: "+e.link+(e.blurb?"\\n\\n"+e.blurb:"")}
function googleLink(e){let q=new URLSearchParams({action:"TEMPLATE",text:eventText(e),dates:utcStamp(e.date,e.time)+"/"+utcStamp(e.date,endTime(e.time)),details:eventDesc(e),location:e.link});return "https://calendar.google.com/calendar/render?"+q.toString()}
function outlookLink(e,office){let q=new URLSearchParams({path:"/calendar/action/compose",rru:"addevent",subject:eventText(e),startdt:utcIso(e.date,e.time),enddt:utcIso(e.date,endTime(e.time)),body:eventDesc(e),location:e.link});return (office?"https://outlook.office.com":"https://outlook.live.com")+"/calendar/0/deeplink/compose?"+q.toString()}
function yahooLink(e){let q=new URLSearchParams({v:"60",title:eventText(e),st:utcStamp(e.date,e.time),et:utcStamp(e.date,endTime(e.time)),desc:eventDesc(e),in_loc:e.link});return "https://calendar.yahoo.com/?"+q.toString()}
function renderProgress(){let count=selectedEvents().length;let pct=Math.min(count/COMPLETION_GOAL,1)*100;document.getElementById("progress-card").innerHTML='<div class="progress-ring" style="--pct:'+pct+'%"><span>'+count+'</span><small>of '+COMPLETION_GOAL+'</small></div><div><h2>'+(count>=COMPLETION_GOAL?"You are at the finish line.":(COMPLETION_GOAL-count)+" to go to complete")+'</h2><p>Complete Career Connect by attending 7+ live sessions. Kickoff counts as 1 if you attend, and all workshops count too.</p></div>'}
function renderExport(){let events=selectedEvents();renderProgress();document.getElementById("export-list").innerHTML=events.map(function(e,i){return '<article class="session-card">'+pill(e.track)+'<h3>'+esc(e.name)+'</h3><p>'+prettyDate(e.date)+' - '+prettyTime(e.time)+' ET</p><div class="calendar-links"><a href="'+googleLink(e)+'" target="_blank" rel="noopener">Google</a><button data-one-ics="'+i+'">Apple / iCal</button><a href="'+outlookLink(e,false)+'" target="_blank" rel="noopener">Outlook</a><a href="'+outlookLink(e,true)+'" target="_blank" rel="noopener">Office 365</a><a href="'+yahooLink(e)+'" target="_blank" rel="noopener">Yahoo</a></div></article>'}).join("");let remaining=Math.max(COMPLETION_GOAL-events.length,0);document.getElementById("completion-card").innerHTML=events.length>=COMPLETION_GOAL?'<h2>You have scheduled everything you need.</h2><p>Show up to these sessions and you are on track to complete Career Connect.</p>':'<h2>You are not quite at 7 yet</h2><p>You have scheduled <strong>'+events.length+'</strong> of the <strong>7+ live sessions</strong> needed to complete Career Connect. Register for and attend at least <strong>'+remaining+'</strong> more '+(remaining===1?'session':'sessions')+' to finish.</p><a class="button dark" href="${PORTAL_URL}">Go to the student portal</a><p class="fineprint">Your invites above are ready to add now - then come back and register for the rest.</p>'}
function renderControls(){let events=selectedEvents();let missing=incompleteSelections();let canProceed=events.length>0&&missing.length===0;let go=document.getElementById("go-export");go.disabled=!canProceed;go.textContent="Add to calendar"+(events.length?" ("+events.length+")":"");let warning=document.getElementById("planner-warning");if(missing.length){warning.innerHTML="<strong>Pick a session time before continuing.</strong> Still missing: "+missing.map(esc).join(", ")}else if(!events.length){warning.textContent="Choose at least one kickoff or workshop session to continue."}else{warning.textContent=""}}
function render(){renderKickoff();renderWorkshops();renderControls();if(plannerStep==="export")renderExport()}
document.addEventListener("click",function(e){let t=e.target;if(t.id==="start-planner")stepTo("select");if(t.id==="back-start")stepTo("start");if(t.id==="back-select")stepTo("select");if(t.id==="go-export"&&!t.disabled)stepTo("export");if(t.matches("[data-toggle]"))toggle(t.dataset.toggle);if(t.matches("[data-name]"))choose(t.dataset.name,Number(t.dataset.index));if(t.matches("[data-kickoff]")){kickoffIndex=t.dataset.kickoff==="none"?"none":Number(t.dataset.kickoff);render()}if(t.id==="download-ics"){downloadIcs(selectedEvents(),"Career_Connect_Schedule.ics");document.getElementById("planner-status").textContent="Calendar file created."}if(t.matches("[data-one-ics]")){downloadIcs([selectedEvents()[Number(t.dataset.oneIcs)]],"Career_Connect_Session.ics")}})
render();
`;
}

function catalogScript() {
  return `
const WORKSHOPS=${scriptData(workshops)};
let filter="ALL";
let selected=[];
function esc(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function pill(track){return '<span class="pill '+track.toLowerCase()+'">'+track+'</span>'}
function visible(){return filter==="ALL"?WORKSHOPS:WORKSHOPS.filter(w=>w.track===filter)}
function orderedSelected(){return WORKSHOPS.filter(w=>selected.includes(w.name))}
function exportText(){let items=orderedSelected();if(!items.length)return "Select workshops to create a portal registration list.";return ["My Career Connect workshop list","","Use this list in the student portal. This is not registration.",""].concat(items.map(w=>"Week "+w.week+" ("+w.range+") - "+w.track+" - "+w.name),["","Next step: open the student portal and register for these workshops."]).join("\\n")}
function renderCards(){document.getElementById("catalog-cards").innerHTML=visible().map(function(w){let added=selected.includes(w.name);return '<article class="workshop-card '+w.track.toLowerCase()+' '+(added?'is-added':'')+'">'+pill(w.track)+'<h3>'+esc(w.name)+'</h3><p class="headline">'+esc(w.headline)+'</p><p>'+esc(w.blurb)+'</p><div class="use-box"><strong>Use this to</strong><span>'+esc(w.use)+'</span></div><button class="select-workshop '+(added?'is-added':'')+'" data-name="'+esc(w.name)+'">'+(added?'Added to My workshops':'Add to My workshops')+'</button></article>'}).join("")}
function renderTray(){let items=orderedSelected();let core=items.filter(w=>w.track==="CORE").length;let boost=items.filter(w=>w.track==="BOOST").length;document.getElementById("my-count").textContent=items.length;document.getElementById("my-stats").innerHTML='<span><b>'+core+'</b> CORE</span><span><b>'+boost+'</b> BOOST</span>';document.getElementById("my-list").className="selected-list"+(items.length?"":" empty");document.getElementById("my-list").innerHTML=items.length?items.map(w=>'<div><strong>Week '+w.week+': '+esc(w.name)+'</strong><span>'+w.range+' - '+w.track+'</span><button class="remove" data-remove="'+esc(w.name)+'">Remove</button></div>').join(""):"No workshops selected yet.";document.getElementById("export-box").value=exportText();document.getElementById("copy-list").disabled=!items.length}
function render(){document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));renderCards();renderTray()}
document.addEventListener("click",async function(e){let t=e.target;if(t.matches("[data-filter]")){filter=t.dataset.filter;render()} if(t.matches("[data-name]")){let name=t.dataset.name;selected=selected.includes(name)?selected.filter(x=>x!==name):selected.concat(name);document.getElementById("copy-status").textContent="";render()} if(t.matches("[data-remove]")){selected=selected.filter(x=>x!==t.dataset.remove);document.getElementById("copy-status").textContent="";render()} if(t.id==="copy-list"){try{await navigator.clipboard.writeText(exportText());document.getElementById("copy-status").textContent="Copied. Open the portal and register for these workshops."}catch{document.getElementById("copy-status").textContent="Copy from the text box, then open the portal.";document.getElementById("export-box").select()}}})
render();
`;
}

function css() {
  return `
:root{--navy:#170055;--orange:#fe6500;--violet:#6f4af8;--soft:#f5f2fb;--ink:#21194e;--muted:#665d86;--line:#e4def2;--green:#0a7d5d;--shadow:0 18px 48px rgba(23,0,85,.11)}
*{box-sizing:border-box}body{margin:0;background:var(--soft);color:var(--ink);font-family:Figtree,Montserrat,Segoe UI,system-ui,sans-serif;letter-spacing:0}a{color:inherit}.topbar{position:sticky;top:0;z-index:20;background:var(--navy);color:white;min-height:72px;padding:14px clamp(18px,5vw,72px);display:flex;align-items:center;justify-content:space-between;gap:18px;box-shadow:0 10px 30px rgba(23,0,85,.18)}.brand{display:flex;align-items:center;gap:12px;font-weight:950;line-height:1}.mark{width:42px;height:42px;display:grid;place-items:center;background:var(--orange);color:white;border-radius:10px}.brand small{display:block;margin-top:3px;color:rgba(255,255,255,.72);font-size:12px;text-transform:uppercase}.topbar nav{display:flex;gap:8px;flex-wrap:wrap}.topbar nav a{padding:10px 13px;border:1px solid rgba(255,255,255,.26);border-radius:999px;text-decoration:none;font-weight:900;font-size:14px}.topbar nav a.active{background:white;color:var(--navy)}.hero{background:linear-gradient(135deg,var(--navy) 0%,#241064 58%,var(--orange) 58.3%,var(--orange) 100%);color:white;padding:56px clamp(18px,5vw,72px);display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.55fr);gap:32px;align-items:end}.presentation-redesign .hero{background:linear-gradient(135deg,#fff 0%,#fff 50%,#eee8ff 50.2%,#eee8ff 100%);color:var(--navy);border-bottom:1px solid var(--line)}.behavioral-redesign .hero{background:linear-gradient(135deg,#113f34 0%,var(--navy) 72%)}.eyebrow{margin:0 0 8px;color:var(--orange);text-transform:uppercase;font-size:13px;font-weight:950;letter-spacing:.08em}.hero .eyebrow{color:#ffd2b6}.presentation-redesign .hero .eyebrow{color:var(--orange)}h1,h2,h3,p{overflow-wrap:anywhere}h1{font-size:clamp(42px,6vw,76px);line-height:.92;margin:0;max-width:900px}h2{font-size:clamp(25px,3vw,38px);line-height:1;margin:0 0 10px;color:var(--navy)}h3{margin:0 0 7px;color:var(--navy);line-height:1.1}.hero p{font-size:19px;line-height:1.5;max-width:780px;color:rgba(255,255,255,.88)}.presentation-redesign .hero p{color:var(--muted)}.hero-card{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:14px;padding:18px}.presentation-redesign .hero-card{background:white;border-color:var(--line)}.hero-card p{margin:8px 0 0;font-size:15px;line-height:1.4}.hero-card .button{margin-top:12px}main,.layout{padding:32px clamp(18px,5vw,72px) 70px;max-width:1320px;margin:0 auto}.panel,.decision-band article,.support-grid article,.workshop-card{background:white;border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow)}.panel{padding:22px}.intro-panel,.decision-band,.support-grid,.prompt-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-bottom:18px}.intro-panel>div{border-left:4px solid var(--orange);padding-left:14px}.planner-grid,.catalog-layout,.two-col{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,380px);gap:18px;align-items:start}.catalog-layout{grid-template-areas:"intro tray" "main tray";}.catalog-intro{grid-area:intro}.catalog-main{grid-area:main}.my-workshops{grid-area:tray;position:sticky;top:92px}.section-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.badge,.count{display:grid;place-items:center;min-width:40px;height:40px;border-radius:12px;background:var(--navy);color:white;font-weight:950}.button{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:10px;background:var(--orange);color:white;text-decoration:none;padding:12px 16px;font-weight:950;cursor:pointer}.button.dark{background:var(--navy);color:white}.button.ghost{background:white;color:var(--navy);border:1px solid var(--line)}.button:disabled{background:#d6d0e6;color:#706887;cursor:not-allowed}.week{margin-top:18px}.week-head{display:flex;justify-content:space-between;gap:12px;align-items:center;background:var(--navy);color:white;border-radius:12px 12px 0 0;padding:13px 16px}.week-head span{font-weight:900;color:#ffd2b6}.week-grid,.catalog-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.week-grid{background:white;border:1px solid var(--line);border-top:0;border-radius:0 0 12px 12px;padding:14px}.workshop-card{padding:16px;border-top:5px solid var(--orange)}.workshop-card[data-track=BOOST],.workshop-card.boost{border-top-color:var(--violet)}.workshop-card.is-added{border-color:var(--green)}.pill{display:inline-flex;border-radius:999px;padding:6px 9px;font-size:12px;font-weight:950;color:white}.pill.core{background:var(--orange)}.pill.boost{background:var(--violet)}.pill.kickoff{background:var(--navy)}.headline{color:var(--orange);font-weight:900;margin:9px 0}.use-box,.callout{background:#fff4eb;border:1px solid #ffd4ba;border-radius:12px;padding:12px;color:#5f4f83}.use-box span{display:block;margin-top:4px}.select-workshop,.slot{width:100%;border:1px solid var(--line);border-radius:10px;background:white;color:var(--navy);font-weight:950;padding:10px 12px;margin-top:10px;cursor:pointer}.select-workshop{background:var(--orange);color:white;border:0}.select-workshop.is-added,.slot.active{background:var(--green);color:white;border-color:var(--green)}.slot-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.summary-card{position:sticky;top:92px}.summary-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:14px 0}.summary-stats span{background:#fbf9ff;border:1px solid var(--line);border-radius:10px;text-align:center;padding:9px;font-weight:900;color:var(--navy)}.selected-list{display:grid;gap:8px;margin:12px 0}.selected-list.empty{border:1px dashed #c9c0df;border-radius:12px;padding:12px;color:var(--muted)}.selected-list div{border:1px solid var(--line);border-radius:12px;padding:10px}.selected-list strong,.selected-list span{display:block}.selected-list span{color:var(--muted);font-size:13px;margin-top:3px}.fineprint{color:var(--muted);font-size:13px;line-height:1.4}.status{color:var(--green);font-weight:900}.decision-band article,.support-grid article{padding:20px}.num{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:var(--orange);color:white;font-weight:950;margin-bottom:12px}.track-pair,.priority-table{display:grid;gap:12px}.track-pair{grid-template-columns:repeat(2,minmax(0,1fr))}.track-pair>div,.priority-table>div{border:1px solid var(--line);border-radius:12px;padding:14px}.priority-table strong,.priority-table span{display:block}.priority-table span{color:var(--muted);margin-top:4px}.timeline{display:grid;gap:12px}.timeline-week{display:grid;grid-template-columns:130px minmax(0,1fr);gap:14px;border:1px solid var(--line);border-radius:12px;padding:14px}.week-number{background:var(--navy);color:white;border-radius:10px;padding:12px;font-weight:950}.week-number span{display:block;color:#d9ceff;font-size:12px;margin-top:4px}.timeline-week p{margin:8px 0}.support-grid{margin-top:18px}.support-grid a{font-weight:950;color:var(--orange)}.prompt-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.prompt-grid div{background:#fbf9ff;border:1px solid var(--line);border-radius:12px;padding:14px;font-weight:850}.prompt-grid span{display:inline-block;min-width:90px;border-bottom:2px solid var(--orange)}.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.toolbar button{border:1px solid var(--line);border-radius:999px;background:white;color:var(--muted);font-weight:950;padding:10px 13px;cursor:pointer}.toolbar button.active{background:var(--navy);color:white}.my-workshops{border-top:5px solid var(--orange)}textarea{width:100%;min-height:155px;border:1px solid var(--line);border-radius:12px;background:#fbfaff;color:var(--ink);font:800 12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;padding:12px;resize:vertical}.label{display:block;font-weight:950;color:var(--navy);margin:12px 0 7px}.remove{margin-top:8px;border:1px solid var(--line);border-radius:999px;background:white;color:var(--muted);font-weight:900;padding:7px 10px;cursor:pointer}
.planner-shell{max-width:820px;padding:42px 22px 80px}.planner-stage{display:none}.planner-stage.is-active{display:block}.planner-card,.kickoff-card,.selection-week,.progress-card,.session-card,.completion-card{background:white;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 24px rgba(23,0,85,.08)}.planner-intro-card{padding:42px}.planner-intro-card h1{font-size:clamp(38px,5vw,58px);line-height:1.05}.planner-lead{font-size:20px;line-height:1.55;color:#526077;max-width:720px}.portal-callout{border:2px solid var(--navy);border-radius:12px;padding:20px;margin:28px 0 18px}.portal-callout p{margin-top:0;color:var(--navy)}.how-card{background:#fff2e9;border-left:5px solid var(--orange);border-radius:12px;padding:20px;margin-bottom:24px;color:var(--navy)}.orange-text{color:var(--orange)}.planner-start-button{min-width:min(100%,360px);font-size:18px}.step-title{display:flex;align-items:center;gap:14px;margin:0 0 24px}.step-title h1{font-size:30px;line-height:1.1}.step-bars{display:flex;gap:7px}.step-bars i{display:block;height:7px;border-radius:999px;background:#e3dfef}.step-bars i:first-child,.step-bars.is-complete i{width:28px;background:var(--orange)}.step-bars i:last-child{width:14px}.step-bars.is-complete i:last-child{width:28px}.kickoff-card{border:2px solid var(--orange);overflow:hidden}.kickoff-head{display:flex;align-items:center;gap:9px;padding:14px 18px;background:#fff2e9;color:var(--navy)}.kickoff-card>p,.selection-note{color:var(--muted);line-height:1.5}.kickoff-card>p{padding:18px 18px 0;margin:0}.kickoff-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 18px;padding:14px 18px 18px}.radio-row{display:flex;align-items:center;gap:8px;padding:7px 4px;border-radius:8px;color:var(--navy);font-size:14px;cursor:pointer}.radio-row:hover{background:#faf8ff}.radio-row input{accent-color:var(--orange)}.selection-note{margin:18px 0}.selection-week{overflow:hidden;margin-top:16px}.selection-week .week-head{background:#fbfaff;color:var(--navy);border-radius:0;border-bottom:1px solid var(--line)}.selection-week .week-head span{color:var(--navy)}.selection-week .week-head strong{color:#9a94ad;font-size:14px}.week-list{display:grid;gap:12px;padding:14px}.workshop-row{border:1px solid var(--line);border-radius:12px;padding:13px;background:white}.workshop-row.is-added{border-width:2px;box-shadow:0 6px 18px rgba(23,0,85,.06)}.workshop-row.core.is-added{border-color:var(--orange);background:#fffaf6}.workshop-row.boost.is-added{border-color:#b4a1ff;background:#fbf8ff}.workshop-toggle{width:100%;display:flex;align-items:flex-start;gap:12px;border:0;background:transparent;color:var(--navy);text-align:left;cursor:pointer;font:inherit}.workshop-toggle strong{display:block;margin-bottom:6px}.checkmark{display:grid;place-items:center;flex:0 0 22px;width:22px;height:22px;border-radius:6px;background:#ecebf2;color:var(--navy);font-weight:950}.is-added.core .checkmark{background:var(--orange);color:white}.is-added.boost .checkmark{background:#b4a1ff;color:white}.slot-picker{margin:12px 0 0 34px}.slot-picker>p{margin:0 0 8px;text-transform:uppercase;font-size:12px;font-weight:950;letter-spacing:.08em;color:#6e6883}.day-box{border:1px solid #e8e5ef;border-radius:12px;padding:11px;margin-top:8px;background:#fafafa}.day-box.is-picked{border-color:currentColor;background:#f8f3ff}.day-box strong{display:block;color:var(--navy);font-size:13px;margin-bottom:8px}.time-row,.calendar-links{display:flex;gap:8px;flex-wrap:wrap}.time-chip,.calendar-links a,.calendar-links button{border:1px solid var(--line);border-radius:9px;background:white;color:var(--navy);font-weight:950;padding:9px 12px;text-decoration:none;cursor:pointer}.time-chip.active{background:var(--orange);border-color:var(--orange);color:white}.boost .time-chip.active{background:#b4a1ff;border-color:#b4a1ff;color:white}.planner-nav-row{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-top:24px}.text-button{border:0;background:transparent;color:#9a94ad;font-weight:950;cursor:pointer;padding:10px 0}.planner-warning{color:var(--muted);font-size:14px;text-align:right}.planner-warning:empty{display:none}.progress-card{display:flex;align-items:center;gap:22px;padding:22px;margin-bottom:18px}.progress-ring{width:88px;height:88px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--orange) var(--pct),#eeeaf6 0);position:relative;flex:0 0 88px}.progress-ring:before{content:"";position:absolute;inset:9px;background:white;border-radius:50%}.progress-ring span,.progress-ring small{position:relative;color:var(--navy);font-weight:950}.progress-ring span{font-size:24px}.progress-ring small{font-size:11px;align-self:start;margin-top:-28px;color:#9a94ad}.one-tap-card{background:var(--navy);color:white;border-radius:16px;padding:28px;margin:26px 0}.one-tap-card h2{color:white}.one-tap-card p{color:rgba(255,255,255,.76)}.subhead{font-size:18px}.export-list{display:grid;gap:12px}.session-card{padding:16px}.session-card p{color:var(--muted);margin:4px 0 12px}.completion-card{border:2px solid var(--orange);background:#fff2e9;padding:24px;margin-top:26px;color:var(--navy)}
.artifact-guide{background:#eeedf3}.pdf-guide-shell{max-width:900px;padding:30px 18px 72px}.guide-page{position:relative;background:white;min-height:1080px;margin:0 auto 24px;padding:58px 64px 50px;border:1px solid #ddd8ea;border-radius:8px;box-shadow:0 16px 38px rgba(23,0,85,.12);overflow:hidden}.guide-cover{display:flex;flex-direction:column;justify-content:space-between;background:var(--navy);color:white;border:0}.guide-cover h1{max-width:620px;font-size:58px;line-height:.96;color:white}.guide-cover p{font-size:22px;line-height:1.4;max-width:620px;color:rgba(255,255,255,.86)}.guide-cover .eyebrow{color:var(--orange)}.guide-kicker{display:flex;gap:10px;flex-wrap:wrap}.guide-kicker span,.cover-note{border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:8px 12px;font-weight:950;color:white}.cover-note{max-width:520px;border-radius:14px;background:rgba(255,255,255,.08);line-height:1.5}.cover-foot,.guide-foot{font-size:12px;color:#8e88a7}.cover-foot{color:rgba(255,255,255,.72)}.guide-page-head{border-bottom:3px solid var(--orange);padding-bottom:16px;margin-bottom:22px}.guide-page-head span{display:block;color:var(--orange);font-weight:950;text-transform:uppercase;font-size:13px}.guide-page-head h2{font-size:40px;margin-top:5px}.guide-lead{font-size:18px;line-height:1.55;color:#4f5b6d;margin:0 0 12px}.guide-lead.small{font-size:16px}.start-strip{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#fff2e9;border-left:6px solid var(--orange);border-radius:8px;padding:12px 14px;margin:20px 0}.start-strip span{background:var(--orange);color:white;border-radius:999px;padding:6px 10px;font-weight:950}.start-strip strong{color:var(--navy)}.start-strip em{margin-left:auto;color:#706887;font-style:normal;font-weight:800}.action-grid,.tool-grid,.tips-grid,.commitment-grid,.quick-ref{display:grid;gap:12px}.action-grid{grid-template-columns:repeat(3,minmax(0,1fr));margin:16px 0}.action-grid article,.tool-grid article,.tips-grid article,.commitment-grid article,.quick-ref div,.timeline-intro>div,.pdf-timeline article,.join-flow>div,.coaching-box{border:1px solid var(--line);border-radius:8px;background:#fbfaff;padding:14px}.action-grid article{background:white}.action-grid h3,.tool-grid h3,.tips-grid h3,.commitment-grid h3{font-size:17px}.action-grid p,.tool-grid p,.tips-grid p,.commitment-grid p,.pdf-timeline p,.join-flow p{color:#5c6680;line-height:1.42;margin:6px 0 0}.action-grid a,.tool-grid a,.startstrong a,.tips-grid a,.coaching-box a{color:var(--navy);font-weight:950;text-decoration-thickness:2px}.action-num,.tips-grid span,.join-flow span{display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:var(--orange);color:white;font-weight:950;margin-bottom:8px}.goal-band{display:grid;grid-template-columns:100px minmax(0,1fr);gap:18px;align-items:center;margin:18px 0;padding:16px;border-radius:8px;background:var(--navy);color:white}.goal-band strong{font-size:34px}.goal-band span{font-size:18px;color:#cfc5ff}.goal-band em{display:block;font-style:normal;font-size:12px;color:#cfc5ff}.goal-band p{margin:0;line-height:1.5;color:rgba(255,255,255,.84)}.goal-band p strong{font-size:inherit;color:white}.catchup-box{border:2px solid var(--orange);border-radius:8px;padding:14px;color:var(--navy);line-height:1.45}.quick-ref{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:16px}.quick-ref b,.quick-ref span{display:block}.quick-ref span{color:#5c6680;margin-top:3px}.timeline-intro{display:grid;grid-template-columns:minmax(0,1fr) 170px 170px;gap:12px;align-items:stretch;margin-bottom:14px}.timeline-intro p{margin:0;color:#4f5b6d;line-height:1.45}.timeline-intro strong,.timeline-intro small{display:block;margin-top:5px;color:var(--navy)}.timeline-intro small{color:#706887}.startstrong{background:#fff2e9;border-left:6px solid var(--orange);border-radius:8px;padding:13px 14px;margin:0 0 14px;line-height:1.45;color:var(--navy)}.pdf-timeline{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.pdf-timeline article{background:white}.pdf-timeline .kickoff{grid-column:1/-1;background:var(--navy);color:white;border:0}.pdf-timeline .kickoff h3{color:white}.pdf-timeline .kickoff p{color:rgba(255,255,255,.76)}.pdf-timeline article>span{display:block;font-size:12px;font-weight:950;color:var(--orange);margin-bottom:7px}.pdf-timeline h3{font-size:18px}.pdf-timeline p{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px}.tool-grid{grid-template-columns:repeat(2,minmax(0,1fr));margin:18px 0}.join-flow{background:#f7f3ff;border:1px solid var(--line);border-radius:8px;padding:16px}.join-flow h3{margin-bottom:10px}.join-flow>div{display:grid;grid-template-columns:38px minmax(0,1fr);gap:10px;margin-top:10px;background:white}.join-flow span{grid-row:1/3;margin:0;background:var(--navy)}.tips-grid{grid-template-columns:repeat(2,minmax(0,1fr));margin:18px 0}.commitment-grid{grid-template-columns:1fr 1fr}.commitment-grid p span{display:inline-block;min-width:140px;border-bottom:2px solid var(--orange)}.slack-template{background:white;border:1px solid var(--line);border-radius:8px;padding:12px;line-height:1.55;color:#4f5b6d}.coaching-box{margin-top:14px;background:#fffaf6;border-color:#ffd4ba}.coaching-box>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}.coaching-box>div span{background:white;border:1px solid #ffd4ba;border-radius:8px;padding:10px;line-height:1.35}.guide-foot{position:absolute;left:64px;right:64px;bottom:24px;display:flex;justify-content:space-between;gap:12px;border-top:1px solid var(--line);padding-top:10px}.artifact-guide .topbar{position:static}
@media(max-width:900px){.hero,.planner-grid,.catalog-layout,.two-col,.intro-panel,.decision-band,.support-grid,.prompt-grid,.track-pair{grid-template-columns:1fr}.catalog-layout{grid-template-areas:"tray" "intro" "main"}.summary-card,.my-workshops{position:static}.week-grid,.catalog-cards,.slot-list{grid-template-columns:1fr}.topbar{align-items:flex-start;flex-direction:column}.topbar nav{width:100%}.topbar nav a{flex:1;text-align:center}.timeline-week{grid-template-columns:1fr}.guide-page{min-height:auto;padding:44px 42px 72px}.action-grid,.timeline-intro,.tool-grid,.tips-grid,.commitment-grid,.coaching-box>div{grid-template-columns:1fr}.pdf-timeline{grid-template-columns:1fr}.guide-foot{left:42px;right:42px}.start-strip em{margin-left:0}.pdf-timeline p{align-items:flex-start;flex-direction:column}}
@media(max-width:560px){h1{font-size:38px}.hero{padding:32px 16px}main,.layout{padding:22px 14px 48px}.summary-stats{grid-template-columns:1fr}.week-head{align-items:flex-start;flex-direction:column}.topbar nav a{flex-basis:100%}.pdf-guide-shell{padding:12px 10px 38px}.guide-page{border-radius:6px;margin-bottom:14px;padding:26px 18px 24px;box-shadow:0 8px 22px rgba(23,0,85,.1)}.guide-cover{min-height:560px}.guide-cover h1{font-size:38px;line-height:1.02}.guide-cover p{font-size:18px}.guide-page-head h2{font-size:30px}.guide-lead{font-size:16px}.quick-ref,.goal-band{grid-template-columns:1fr}.goal-band{gap:8px}.guide-foot{position:static;margin-top:28px}.join-flow>div{grid-template-columns:1fr}.join-flow span{grid-row:auto}}
`;
}

function renderIndex() {
  const links = variants.map((variant) => {
    return `<section class="panel"><h2>${esc(variant.label)}</h2><p>${esc(variant.tone)}</p><div class="index-links"><a class="button" href="./${variant.slug}-planner.html">Planner</a><a class="button" href="./${variant.slug}-guide.html">Student Guide</a><a class="button" href="./${variant.slug}-catalog.html">Workshop Catalog</a></div></section>`;
  }).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Complete Career Connect Artifact Previews</title><style>${css()}.index-links{display:flex;gap:10px;flex-wrap:wrap}.hero{grid-template-columns:1fr}</style></head><body><header class="topbar"><div class="brand"><span class="mark">YU</span><span>Year Up United <small>Career Connect SU26</small></span></div></header><section class="hero"><div><p class="eyebrow">Complete artifact previews</p><h1>Standalone files per artifact</h1><p>Each link opens a complete student-facing artifact mockup. These files are self-contained and do not depend on the earlier review wrapper.</p></div></section><main>${links}</main></body></html>`;
}

fs.mkdirSync(outDir, { recursive: true });
for (const variant of variants) {
  fs.writeFileSync(path.join(outDir, `${variant.slug}-planner.html`), renderPlanner(variant));
  fs.writeFileSync(path.join(outDir, `${variant.slug}-guide.html`), renderGuide(variant));
  fs.writeFileSync(path.join(outDir, `${variant.slug}-catalog.html`), renderCatalog(variant));
}
fs.writeFileSync(path.join(outDir, "index.html"), renderIndex());
console.log(`Wrote complete artifact previews to ${outDir}`);
