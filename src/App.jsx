import React, { useState, useEffect, useMemo } from "react";

/* =============================================================================
   CAREER CONNECT — WORKSHOP CALENDAR TOOL  (Year Up United, SU26)
   -----------------------------------------------------------------------------
   Turns the workshops a student registered for into calendar events (with
   reminders) so they actually attend.

   HOW IT WORKS  : a guided questionnaire — students pick the workshops they
                   registered for, choose the session time for each, then export
                   calendar invites (with reminders). Runs entirely in the
                   browser; no sign-in and no data leaves the page.

   WORKSHOP_SLOTS holds every workshop's offered session times AND Zoom links, from
   YUU's confirmed SU1 2026 schedule. Each workshop runs twice in its week (Mon/Wed or
   Tue/Thu) at 2 PM / 6 PM / 8 PM ET. Picking a session in the guided flow auto-fills
   that session's Zoom link into the calendar invite. Key = exact workshop name; value =
   array of { date "YYYY-MM-DD", startTime 24h "HH:MM", joinLink }.
   ========================================================================== */
const WORKSHOP_SLOTS = {
  "Building Your Confidence": [
    { date: "2026-06-22", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/93742131185" },
    { date: "2026-06-22", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/94376045428" },
    { date: "2026-06-22", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/91762150062" },
    { date: "2026-06-24", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/98366298051" },
    { date: "2026-06-24", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/99143491046" },
    { date: "2026-06-24", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/94670987741" },
  ],
  "Owning Your Role": [
    { date: "2026-06-23", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/93085221847" },
    { date: "2026-06-23", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/93174772873" },
    { date: "2026-06-23", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/98329663806" },
    { date: "2026-06-25", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/99035070295" },
    { date: "2026-06-25", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/91593219325" },
    { date: "2026-06-25", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/95242610632" },
  ],
  "Setting Success Goals": [
    { date: "2026-06-29", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/98367357973" },
    { date: "2026-06-29", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/91360864011" },
    { date: "2026-06-29", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/92866906367" },
    { date: "2026-07-01", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/95103944245" },
    { date: "2026-07-01", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/95453381601" },
    { date: "2026-07-01", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/92033115757" },
  ],
  "Managing Your Manager": [
    { date: "2026-06-30", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/95268977152" },
    { date: "2026-06-30", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/91556461015" },
    { date: "2026-06-30", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/96908983602" },
    { date: "2026-07-02", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/99684182826" },
    { date: "2026-07-02", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/91387129129" },
    { date: "2026-07-02", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/94616233222" },
  ],
  "Fostering Inclusion": [
    { date: "2026-07-06", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/92290076671" },
    { date: "2026-07-06", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/95976521105" },
    { date: "2026-07-06", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/99750440715" },
    { date: "2026-07-08", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/93245356421" },
    { date: "2026-07-08", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/94930817252" },
    { date: "2026-07-08", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/93285357786" },
  ],
  "AI in the Workplace": [
    { date: "2026-07-07", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/93830726013" },
    { date: "2026-07-07", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/91588357671" },
    { date: "2026-07-07", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/97053656904" },
    { date: "2026-07-09", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/93003524331" },
    { date: "2026-07-09", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/93117101572" },
    { date: "2026-07-09", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/99067389990" },
  ],
  "Unlocking a Growth Mindset": [
    { date: "2026-07-13", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/94685454214" },
    { date: "2026-07-13", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/94439014595" },
    { date: "2026-07-13", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/95250920033" },
    { date: "2026-07-15", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/99054427457" },
    { date: "2026-07-15", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/93836232714" },
    { date: "2026-07-15", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/92112484627" },
  ],
  "Professional Development": [
    { date: "2026-07-14", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/95004015059" },
    { date: "2026-07-14", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/97121399437" },
    { date: "2026-07-14", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/94219865553" },
    { date: "2026-07-16", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/99483368425" },
    { date: "2026-07-16", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/95576005197" },
    { date: "2026-07-16", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/94251050603" },
  ],
  "Crafting a Strong Resume": [
    { date: "2026-07-20", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/93007746158" },
    { date: "2026-07-20", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/92638691400" },
    { date: "2026-07-20", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/99412044772" },
    { date: "2026-07-22", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/95654732649" },
    { date: "2026-07-22", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/94293961209" },
    { date: "2026-07-22", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/92983830310" },
  ],
  "Building a Professional LinkedIn": [
    { date: "2026-07-21", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/91586328169" },
    { date: "2026-07-21", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/98529533777" },
    { date: "2026-07-21", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/96415722037" },
    { date: "2026-07-23", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/93666283569" },
    { date: "2026-07-23", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/96081745153" },
    { date: "2026-07-23", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/92581054695" },
  ],
  "Creating Balance": [
    { date: "2026-07-27", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/96481894483" },
    { date: "2026-07-27", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/99492827132" },
    { date: "2026-07-27", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/94829280424" },
    { date: "2026-07-29", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/95958841546" },
    { date: "2026-07-29", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/97029865300" },
    { date: "2026-07-29", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/98756144277" },
  ],
  "Interview Workshop": [
    { date: "2026-07-28", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/99119933888" },
    { date: "2026-07-28", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/94243348176" },
    { date: "2026-07-28", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/92119472714" },
    { date: "2026-07-30", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/98423469978" },
    { date: "2026-07-30", startTime: "18:00", joinLink: "https://yearup.zoom.us/j/92727611515" },
    { date: "2026-07-30", startTime: "20:00", joinLink: "https://yearup.zoom.us/j/97028889212" },
  ],
};

/* ----------------------------- PROGRAM DATA (SU26) ----------------------------- */
const TZ = "America/New_York";

const KICKOFF = {
  id: "kickoff",
  name: "Career Connect Kickoff", // counts as 1 live session if attended; times in KICKOFF_SLOTS
};

// Each workshop: week + that week's Mon/Fri window (used to bound the date
// picker to the correct program week).
const WORKSHOPS = [
  { id: "w1a", name: "Building Your Confidence",          track: "BOOST", week: 1, range: "Jun 22–26",    monday: "2026-06-22", friday: "2026-06-26" },
  { id: "w1b", name: "Owning Your Role",               track: "BOOST", week: 1, range: "Jun 22–26",    monday: "2026-06-22", friday: "2026-06-26" },
  { id: "w2a", name: "Setting Success Goals",                 track: "CORE", week: 2, range: "Jun 29–Jul 3", monday: "2026-06-29", friday: "2026-07-03" },
  { id: "w2b", name: "Managing Your Manager",        track: "BOOST", week: 2, range: "Jun 29–Jul 3", monday: "2026-06-29", friday: "2026-07-03" },
  { id: "w3a", name: "Fostering Inclusion",                         track: "BOOST", week: 3, range: "Jul 6–10",     monday: "2026-07-06", friday: "2026-07-10" },
  { id: "w3b", name: "AI in the Workplace",          track: "CORE", week: 3, range: "Jul 6–10",     monday: "2026-07-06", friday: "2026-07-10" },
  { id: "w4a", name: "Unlocking a Growth Mindset",               track: "BOOST", week: 4, range: "Jul 13–17",    monday: "2026-07-13", friday: "2026-07-17" },
  { id: "w4b", name: "Professional Development",      track: "CORE", week: 4, range: "Jul 13–17",    monday: "2026-07-13", friday: "2026-07-17" },
  { id: "w5a", name: "Crafting a Strong Resume",               track: "CORE", week: 5, range: "Jul 20–24",    monday: "2026-07-20", friday: "2026-07-24" },
  { id: "w5b", name: "Building a Professional LinkedIn", track: "CORE", week: 5, range: "Jul 20–24",    monday: "2026-07-20", friday: "2026-07-24" },
  { id: "w6a", name: "Creating Balance",            track: "BOOST", week: 6, range: "Jul 27–31",    monday: "2026-07-27", friday: "2026-07-31" },
  { id: "w6b", name: "Interview Workshop",           track: "CORE", week: 6, range: "Jul 27–31",    monday: "2026-07-27", friday: "2026-07-31" },
];

const WEEK_RANGES = {
  1: "Jun 22–26", 2: "Jun 29–Jul 3", 3: "Jul 6–10",
  4: "Jul 13–17", 5: "Jul 20–24", 6: "Jul 27–31",
};

const COMPLETION_GOAL = 7; // kickoff + any 6 more workshops (CORE recommended)

// Kickoff session options (YUU-confirmed SU1 2026 schedule). Students pick the ONE
// they registered for / attended. 2:00 PM = 14:00, 7:00 PM = 19:00 (America/New_York).
// Each entry carries its own Zoom join link.
const KICKOFF_SLOTS = [
  { label: "Session 1", date: "2026-06-15", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/98381570894" },
  { label: "Session 2", date: "2026-06-15", startTime: "19:00", joinLink: "https://yearup.zoom.us/j/91987217167" },
  { label: "Session 3", date: "2026-06-16", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/95397331652" },
  { label: "Session 4", date: "2026-06-16", startTime: "19:00", joinLink: "https://yearup.zoom.us/j/96132672537" },
  { label: "Session 5", date: "2026-06-17", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/93136944796" },
  { label: "Session 6", date: "2026-06-17", startTime: "19:00", joinLink: "https://yearup.zoom.us/j/98195013546" },
  { label: "Session 7", date: "2026-06-18", startTime: "14:00", joinLink: "https://yearup.zoom.us/j/97497024923" },
  { label: "Session 8", date: "2026-06-18", startTime: "19:00", joinLink: "https://yearup.zoom.us/j/96946935576" },
];

// Workshop descriptions (shown in the calendar invite), keyed by workshop name.
const BLURBS = {
  "Career Connect Kickoff":
    "Get started, meet the team, and learn how Career Connect works. Only one kickoff session is needed.",
  "Building Your Confidence":
    "Confidence shapes how we show up in school, work, and life. In this interactive workshop, you will explore what confidence really means, practice strategies to strengthen it, and learn how to overcome common pitfalls that hold you back. Walk away with practical tools to step outside your comfort zone, advocate for yourself, and face challenges with resilience.",
  "Owning Your Role":
    "Accountability is one of the most sought-after skills in any workplace. In this engaging workshop, you will explore how strong communication and collaboration build trust and drive results. Through interactive activities, you will practice strategies to take ownership of your work, contribute to shared goals, and support your team's success.",
  "Setting Success Goals":
    "Achieving your dreams starts with setting clear, actionable goals. In this hands-on workshop, you will learn how to use the SMART goal framework to create realistic, meaningful goals and develop strategies to stay motivated. You will leave with a personalized plan to overcome obstacles and move confidently toward your next milestone.",
  "Managing Your Manager":
    "Your relationship with your manager can shape your career success. In this workshop, you will learn how to manage up by understanding expectations, communicating effectively, and supporting your manager's goals. Through real-world scenarios, you will practice strategies to build trust, navigate challenges, and create a positive, productive working relationship.",
  "Fostering Inclusion":
    "Creating inclusive spaces begins with understanding and action. In this workshop, you will explore real-world examples of bias, privilege, and discrimination while learning strategies to promote equity and belonging. Through discussion and group activities, you will gain tools to advocate for inclusive practices in your school, workplace, and community.",
  "AI in the Workplace":
    "The use of AI in the workplace is changing the way we do work efficiently. This lesson develops foundational knowledge and skills in artificial intelligence, generative AI, prompt engineering and output validation, and ethical uses of AI relevant to a variety of business and technology workplace environments.",
  "Unlocking a Growth Mindset":
    "How you think about challenges shapes your success. In this workshop, you will explore the difference between a fixed and growth mindset, practice shifting negative self-talk, and learn strategies to embrace challenges as opportunities. Walk away with tools to build resilience and keep growing personally and professionally.",
  "Professional Development":
    "Understanding the job market is key to making informed career decisions. In this workshop, you will learn how to research industry trends, analyze opportunities, and conduct a personal SWOT analysis to identify your strengths, gaps, and next steps. Leave with a clear plan to build the skills and experiences you need to reach your career goals.",
  "Crafting a Strong Resume":
    "Your resume is your first impression with employers - make it count. In this workshop, you will learn how to create a strong, professional resume that highlights your skills and accomplishments. Through guided practice, you will write powerful statements that capture your value and leave ready to showcase your experience with confidence.",
  "Building a Professional LinkedIn":
    "Your online presence can open doors - or close them. In this workshop, you will explore how to manage your digital footprint and create a strong professional brand. You will also learn how to build a standout LinkedIn profile and use the platform to grow your network, connect with opportunities, and take the next step in your career journey.",
  "Interview Workshop":
    "Strong interviews require preparation. This lesson develops foundational knowledge and skills in interviewing, including preparing effectively to showcase your strengths, practicing responses to common interview questions, and leveraging the STAR Method to confidently answer behavioral interview questions with structured and impactful responses.",
  "Creating Balance":
    "Taking care of yourself is essential to thriving at work and in life. In this workshop, you will explore practical self-care strategies and learn how to manage common stressors that can throw you off balance. Walk away with tools to set boundaries, prioritize what matters, and build habits that support your overall well-being.",
};

// Student portal (registration + Brightspace access). Used as the calendar
// LOCATION and in join instructions whenever a student hasn't pasted a Zoom link.
const PORTAL_URL = "https://yuprogram.my.site.com/CareerConnect/";

/* -------------------- REGISTRATION WINDOW (pre-reg mode) --------------------
   The registration-open planner lives at /. The pre-registration planner lives
   at /pre-registration and uses "plan ahead" language without naming an open
   date:
     - kickoff exports normally,
     - planned workshops export as TENTATIVE holds with a "register first" note,
     - the visible copy says registrations will open soon.
   Testing override: append ?regopen=0 (force pre-reg) or ?regopen=1 (force open)
   to the URL. */
const currentPath =
  typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") || "/" : "/";
const IS_PRE_REG_ROUTE = currentPath === "/pre-registration";
const regOverride =
  typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("regopen") : null;
const REGISTRATION_IS_OPEN =
  regOverride === "1" ? true : regOverride === "0" ? false : !IS_PRE_REG_ROUTE;
const PLANNER_PATH = REGISTRATION_IS_OPEN ? "/" : "/pre-registration";
const GUIDE_PATH = REGISTRATION_IS_OPEN ? "/guide" : "/guide-pre-registration";
const CATALOG_PATH = REGISTRATION_IS_OPEN ? "/catalog" : "/catalog-pre-registration";

/* --------------------------------- ANALYTICS ---------------------------------
   Thin wrapper over Microsoft Clarity custom events (snippet lives in
   index.html). No-ops safely if the snippet is commented out. Event names only —
   never student data; the tool collects none. */
const track = (name) => {
  try {
    if (typeof window !== "undefined" && typeof window.clarity === "function") {
      window.clarity("event", name);
    }
  } catch (_) {
    /* analytics must never break the tool */
  }
};

// Join instructions shown when no direct Zoom/join link is available.
// Mirrors the REAL navigation path (the Zoom link lives inside the Brightspace
// calendar EVENT, not on the course page). Brightspace can only be reached
// while logged into the portal — direct Brightspace links fail unauthenticated.
const PORTAL_JOIN_STEPS =
  "To join this session:\n" +
  `1. Log into the Career Connect student portal: ${PORTAL_URL}\n` +
  '2. Click "Log into Brightspace to view workshop details" (or the Brightspace button).\n' +
  "3. In your Brightspace course, find the Calendar on the right side of the page.\n" +
  "4. Open this session's calendar event and click the Zoom link inside it.";

// Prefixed to plan-ahead (pre-registration) workshop invites.
const PLAN_ONLY_NOTE =
  `PLAN ONLY — registrations will open soon. ` +
  `You must register for this session in the student portal before attending: ${PORTAL_URL}`;

// One description for every invite (ICS + deep links).
// With a pasted link: "Join here: <link>" goes FIRST, then the blurb.
// Without a link: blurb first, then the portal/Brightspace join steps.
// In plan-ahead mode, non-kickoff events lead with a "register first" note.
const eventDesc = (s) => {
  const blurb = BLURBS[s.name];
  const planOnly = !REGISTRATION_IS_OPEN && s.source !== "kickoff";
  let body;
  if (s.joinLink) {
    const join = `Join here: ${s.joinLink}`;
    body = blurb ? `${join}\n\n${blurb}` : join;
  } else {
    body = blurb ? `${blurb}\n\n${PORTAL_JOIN_STEPS}` : PORTAL_JOIN_STEPS;
  }
  return planOnly ? `${PLAN_ONLY_NOTE}\n\n${body}` : body;
};

// Calendar LOCATION: the pasted link if present, otherwise the portal URL.
const eventLocation = (s) => s.joinLink || PORTAL_URL;

/* ------------------------------- BRAND TOKENS -------------------------------
   Orange = the main accent (Core / recommended / progress / highlights).
   Violet (brand Purple #B4A1FF) = the Career Edge (BOOST) track, used functionally only.
   Navy = primary structure + buttons. Accent fills always carry navy text. */
const NAVY = "#170055";
const ORANGE = "#FE6500";
const VIOLET = "#B4A1FF"; // brand Purple — Career Edge (BOOST) track
const ORANGE_TINT = "#FFF4EC";
const VIOLET_TINT = "#F3F0FF";
const GRAY = "#EEEEEE";
const YUU_LOGO_WHITE = "data:image/png;base64,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";

/* ------------------------------ DATE / ICS HELPERS ------------------------------ */
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const slotsFor = (name) => WORKSHOP_SLOTS[name] || null;

const addOneHour = (hhmm) => {
  if (!hhmm || !hhmm.includes(":")) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const eh = (h + 1) % 24;
  return `${String(eh).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const prettyDate = (ymd) => {
  if (!ymd) return "Date not set";
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const pretty12h = (hhmm) => {
  if (!hhmm || !hhmm.includes(":")) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
};

const compactDate = (ymd) => (ymd || "").replace(/-/g, "");
const compactTime = (hhmm) => (hhmm || "").replace(":", "") + "00";
const escapeICS = (s) => (s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

const buildICS = (sessions) => {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  let ics =
    "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Year Up United//Career Connect Calendar//EN\r\n" +
    "CALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:Career Connect Workshops\r\n" +
    "X-WR-TIMEZONE:America/New_York\r\n" +
    "BEGIN:VTIMEZONE\r\nTZID:America/New_York\r\nX-LIC-LOCATION:America/New_York\r\n" +
    "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\n" +
    "DTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT\r\n" +
    "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\n" +
    "DTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD\r\n" +
    "END:VTIMEZONE\r\n";

  sessions.forEach((s) => {
    if (!s.date || !s.startTime) return;
    const end = s.endTime || addOneHour(s.startTime);
    const dtStart = `${compactDate(s.date)}T${compactTime(s.startTime)}`;
    const dtEnd = `${compactDate(s.date)}T${compactTime(end)}`;
    const uid = `cc-${s.uid || norm(s.name)}-${compactDate(s.date)}@yearupunited.org`;
    const planOnly = !REGISTRATION_IS_OPEN && s.source !== "kickoff";
    ics +=
      "BEGIN:VEVENT\r\n" +
      `UID:${uid}\r\nDTSTAMP:${stamp}\r\n` +
      `DTSTART;TZID=America/New_York:${dtStart}\r\n` +
      `DTEND;TZID=America/New_York:${dtEnd}\r\n` +
      `SUMMARY:${planOnly ? "[Register first] " : ""}Career Connect: ${escapeICS(s.name)}\r\n` +
      `DESCRIPTION:${escapeICS(eventDesc(s))}\r\n` +
      `LOCATION:${escapeICS(eventLocation(s))}\r\nSTATUS:${planOnly ? "TENTATIVE" : "CONFIRMED"}\r\n` +
      "BEGIN:VALARM\r\nTRIGGER:-P1D\r\nACTION:DISPLAY\r\n" +
      `DESCRIPTION:Reminder: you have a Career Connect workshop tomorrow — ${escapeICS(s.name)}.\r\nEND:VALARM\r\n` +
      "BEGIN:VALARM\r\nTRIGGER:-PT1H\r\nACTION:DISPLAY\r\n" +
      "DESCRIPTION:Your Career Connect workshop starts in 1 hour!\r\nEND:VALARM\r\n" +
      "END:VEVENT\r\n";
  });

  return ics + "END:VCALENDAR\r\n";
};

/* --------------------- PER-EVENT "ADD TO CALENDAR" LINKS ---------------------
   Self-contained: builds Google / Outlook / Office 365 / Yahoo deep links and a
   per-event .ics download — no external script or web component. (We avoid the
   add-to-calendar-button web component here because the published-artifact
   sandbox blocks its CDN; native links render reliably and stay on-brand.)
   NOTE: every SU26 session falls within US Eastern Daylight Time (UTC−4), so we
   convert ET→UTC by adding 4 hours. Revisit if the program ever runs outside DST. */
const ET_TO_UTC_HOURS = 4;

const utcStamp = (ymd, hhmm) => {
  const [Y, M, D] = ymd.split("-").map(Number);
  const [h, m] = hhmm.split(":").map(Number);
  const dt = new Date(Date.UTC(Y, M - 1, D, h + ET_TO_UTC_HOURS, m, 0));
  const p = (n) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}${p(dt.getUTCMonth() + 1)}${p(dt.getUTCDate())}T${p(dt.getUTCHours())}${p(dt.getUTCMinutes())}00Z`;
};
const utcISO = (ymd, hhmm) => {
  const [Y, M, D] = ymd.split("-").map(Number);
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(Y, M - 1, D, h + ET_TO_UTC_HOURS, m, 0)).toISOString().split(".")[0] + "Z";
};

const googleLink = (s) => {
  const end = s.endTime || addOneHour(s.startTime);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `Career Connect: ${s.name}`,
    dates: `${utcStamp(s.date, s.startTime)}/${utcStamp(s.date, end)}`,
    details: eventDesc(s),
    location: eventLocation(s),
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
};
const outlookLink = (s, office) => {
  const end = s.endTime || addOneHour(s.startTime);
  const base = office ? "https://outlook.office.com" : "https://outlook.live.com";
  const q = new URLSearchParams({
    path: "/calendar/action/compose", rru: "addevent",
    subject: `Career Connect: ${s.name}`,
    startdt: utcISO(s.date, s.startTime), enddt: utcISO(s.date, end),
    body: eventDesc(s), location: eventLocation(s),
  });
  return `${base}/calendar/0/deeplink/compose?${q.toString()}`;
};
const yahooLink = (s) => {
  const end = s.endTime || addOneHour(s.startTime);
  const q = new URLSearchParams({
    v: "60", title: `Career Connect: ${s.name}`,
    st: utcStamp(s.date, s.startTime), et: utcStamp(s.date, end),
    desc: eventDesc(s), in_loc: eventLocation(s),
  });
  return `https://calendar.yahoo.com/?${q.toString()}`;
};
const downloadOneICS = (s) => {
  track("download_ics_single");
  const blob = new Blob([buildICS([s])], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = `Career_Connect_${(s.name || "session").replace(/[^a-z0-9]+/gi, "_")}.ics`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
};

/* --------------------------------- UI PIECES --------------------------------- */
function TrackBadge({ track }) {
  if (track === "CORE")
    return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: ORANGE, color: "#FFFFFF" }}>CORE</span>;
  if (track === "BOOST")
    return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: VIOLET, color: "#FFFFFF" }}>BOOST</span>;
  if (track === "KICKOFF")
    return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white" style={{ background: NAVY }}>Kickoff</span>;
  return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Other</span>;
}

function ProgressRing({ count, goal }) {
  const pct = Math.min(count / goal, 1);
  const R = 34, C = 2 * Math.PI * R;
  const done = count >= goal;
  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: 84, height: 84 }}>
        <svg width="84" height="84" className="-rotate-90">
          <circle cx="42" cy="42" r={R} fill="none" stroke={GRAY} strokeWidth="8" />
          <circle cx="42" cy="42" r={R} fill="none" stroke={ORANGE} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 0.5s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold leading-none" style={{ color: NAVY }}>{count}</span>
          <span className="text-[10px] text-gray-400 font-semibold">of {goal}</span>
        </div>
      </div>
      <div>
        <div className="font-bold" style={{ color: NAVY }}>
          {done ? "You're at the finish line! 🎉" : `${goal - count} to go to complete`}
        </div>
        <div className="text-sm text-gray-500">
          {done
            ? "You've planned 7+ live sessions. Anything extra is a bonus."
            : "Complete Career Connect by attending 7+ live sessions. Kickoff counts as 1 if you attend, and all workshops count too."}
        </div>
      </div>
    </div>
  );
}

function StepHeader({ n, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === n ? 28 : 12, background: i <= n ? ORANGE : "#E3E1EA" }} />
        ))}
      </div>
      <h2 className="text-2xl font-extrabold" style={{ color: NAVY }}>{title}</h2>
    </div>
  );
}

/* ----------------------------------- APP ----------------------------------- */
export default function App() {
  const [step, setStep] = useState(0);
  const [sessions, setSessions] = useState([]);
  // kickoffChoice: null = not answered yet, "none" = didn't / won't attend,
  // a number = index into KICKOFF_SLOTS. Kickoff is NOT counted until a slot is chosen.
  const [kickoffChoice, setKickoffChoice] = useState(null);

  useEffect(() => {
    if (!document.getElementById("cc-figtree")) {
      const l = document.createElement("link");
      l.id = "cc-figtree"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(l);
    }
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); track(`step_${step}`); }, [step]);

  const scheduledCount = sessions.filter((s) => s.date && s.startTime).length;
  const kickoffCounts = typeof kickoffChoice === "number"; // only a chosen slot counts
  const totalCount = (kickoffCounts ? 1 : 0) + scheduledCount;

  // Selected workshops still missing a date or start time — block export until fixed.
  const incompleteSessions = sessions.filter((s) => !s.date || !s.startTime);
  const allComplete = incompleteSessions.length === 0;

  const isPicked = (id) => sessions.some((s) => s.uid === id);
  const toggleWorkshop = (w) => {
    if (isPicked(w.id)) { setSessions((prev) => prev.filter((s) => s.uid !== w.id)); return; }
    // Start blank — no fake Monday/6 PM default, and no auto-selected slot.
    setSessions((prev) => [...prev, {
      uid: w.id, name: w.name, track: w.track, week: w.week,
      date: "", startTime: "", endTime: "",
      joinLink: "", slotKey: null, source: "guided",
      minDate: w.monday, maxDate: w.friday,
    }]);
  };

  const updateSession = (uid, patch) =>
    setSessions((prev) => prev.map((s) => {
      if (s.uid !== uid) return s;
      const next = { ...s, ...patch };
      if (patch.startTime !== undefined) next.endTime = addOneHour(patch.startTime);
      return next;
    }));
  const removeSession = (uid) => setSessions((prev) => prev.filter((s) => s.uid !== uid));

  const exportList = useMemo(() => {
    const out = sessions.filter((s) => s.date && s.startTime);
    if (typeof kickoffChoice === "number") {
      const k = KICKOFF_SLOTS[kickoffChoice];
      out.unshift({ uid: "kickoff", name: KICKOFF.name, track: "KICKOFF", week: 0,
        date: k.date, startTime: k.startTime, endTime: addOneHour(k.startTime), joinLink: k.joinLink || "", source: "kickoff" });
    }
    return out;
  }, [sessions, kickoffChoice]);

  const hasExportable = exportList.length > 0;

  const downloadICS = () => {
    track(REGISTRATION_IS_OPEN ? "download_ics_all" : "download_ics_all_planahead");
    const blob = new Blob([buildICS(exportList)], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob); a.download = "Career_Connect_Schedule.ics";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const grouped = useMemo(() => {
    const g = {};
    sessions.forEach((s) => { const k = s.week || "Other"; (g[k] = g[k] || []).push(s); });
    return g;
  }, [sessions]);

  const font = { fontFamily: "Figtree, Verdana, system-ui, sans-serif" };
  const btnPrimary = "text-white font-bold py-3.5 px-7 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2";
  const calBtn = "inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors hover:bg-gray-50";
  const calBtnStyle = { borderColor: "#E3E1EA", color: NAVY };

  return (
    <div style={{ ...font, background: "#FAFAFB" }} className="min-h-screen text-gray-900 pb-24">
      {/* Header */}
      <header style={{ background: NAVY }} className="text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20" aria-hidden>
          <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="none">
            <path d="M40 0 L120 0 L80 100 L120 200 L40 200 L80 100 Z" fill={ORANGE} />
          </svg>
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-6 flex items-center justify-between gap-3">
          <img src={YUU_LOGO_WHITE} alt="Year Up United" className="h-8 sm:h-9 object-contain" />
          <span className="text-sm font-semibold uppercase tracking-wider text-white/80">Workshop Calendar</span>
        </div>
        <div style={{ background: ORANGE }} className="h-1 w-full" />
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* STEP 0 — WELCOME */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-10 space-y-7">
            <div>
              <p className="font-bold text-sm uppercase tracking-wider" style={{ color: ORANGE }}>Career Connect · Summer 2026</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold mt-1" style={{ color: NAVY }}>Let's get your workshops on the calendar.</h1>
              <p className="text-lg text-gray-600 mt-3 leading-relaxed">
                Complete Career Connect by attending <strong>7+ live sessions</strong>. Kickoff counts as 1 if you
                attend, and all workshops count too. Putting your sessions on your calendar (with reminders) is the
                single best way to make sure you actually show up.
              </p>
            </div>
            {REGISTRATION_IS_OPEN ? (
              <div className="rounded-xl p-5 border-2" style={{ background: "#FFFFFF", borderColor: NAVY }}>
                <p className="text-sm leading-relaxed" style={{ color: NAVY }}>
                  <strong>This tool does not register you for workshops.</strong> First register in the Career Connect
                  student portal. Then use this planner to add those registered sessions to your calendar.
                </p>
                <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => track("portal_click_step0")}
                  className="mt-3 inline-flex items-center gap-2 font-bold py-2.5 px-5 rounded-xl text-white" style={{ background: NAVY }}>
                  Go to the student portal to register
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
              </div>
            ) : (
              <div className="rounded-xl p-5 border-2" style={{ background: "#FFFFFF", borderColor: NAVY }}>
                <p className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: ORANGE }}>
                  Registrations will open soon
                </p>
                <p className="text-sm leading-relaxed" style={{ color: NAVY }}>
                  You're officially a Career Connect student, and you can get a head start now. Pick the workshops you
                  plan to take, put tentative holds on your calendar, and we'll remind you the moment registrations open.
                  Holds aren't registrations; you'll still register in the portal when it opens.
                </p>
              </div>
            )}
            <div className="rounded-xl p-5 border-l-4" style={{ background: ORANGE_TINT, borderColor: ORANGE }}>
              <p className="text-sm leading-relaxed" style={{ color: NAVY }}>
                <strong>How it works:</strong> {REGISTRATION_IS_OPEN
                  ? "select which workshops you registered for, and we'll build the calendar invites for you in one click."
                  : "browse the catalog, choose the workshops you plan to take, and we'll build tentative calendar holds for you."} The <strong style={{ color: ORANGE }}>6 Career Essentials (CORE)</strong> workshops
                are the recommended path to ensure you complete the program. The <strong style={{ color: NAVY }}>6 Career Edge (BOOST)</strong> workshops
                count toward completion too - add them to give yourself an edge, boost your chances with extra practice, get more schedule options, and stay on track.
              </p>
            </div>
            <button onClick={() => setStep(1)} className={btnPrimary} style={{ background: ORANGE, color: "#FFFFFF" }}>
              Start — it takes about 2 minutes
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <p className="text-xs text-gray-400">
              <strong>Privacy note:</strong> this tool does not save or send your information. Your selections stay on
              this page and are only used to create calendar invites.
            </p>
          </div>
        )}

        {/* STEP 1 — BUILD YOUR SCHEDULE */}
        {step === 1 && (
          <div className="space-y-6">
            <StepHeader n={1} title={REGISTRATION_IS_OPEN ? "Which workshops did you register for?" : "Which workshops do you plan to take?"} />

            <div className="space-y-5">
                {/* Kickoff session picker — counts as 1 of 7 */}
                <div className="bg-white rounded-2xl shadow-sm border-2 overflow-hidden" style={{ borderColor: ORANGE }}>
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{ background: ORANGE_TINT }}>
                    <TrackBadge track="KICKOFF" />
                    <span className="font-bold" style={{ color: NAVY }}>{REGISTRATION_IS_OPEN ? "Did you register for a kickoff session?" : "Which kickoff session will you attend?"}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-3">
                      {REGISTRATION_IS_OPEN
                        ? "Pick the kickoff session you registered for or attended - kickoff counts toward your 7+ live sessions if you attend. If you're not registered for kickoff or missed it, choose the last option."
                        : "Pick the kickoff session you plan to attend - kickoff counts toward your 7+ live sessions if you attend. If you missed kickoff or are not attending, choose the last option."}
                    </p>
                    <div role="radiogroup" className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                      {KICKOFF_SLOTS.map((sl, i) => (
                        <label key={i} className="flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1.5 hover:bg-gray-50">
                          <input type="radio" name="kickoff-guided" checked={kickoffChoice === i}
                            onChange={() => setKickoffChoice(i)} style={{ accentColor: ORANGE }} />
                          <span style={{ color: NAVY }}><strong>{sl.label}</strong> · {prettyDate(sl.date)} · {pretty12h(sl.startTime)} ET</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1.5 hover:bg-gray-50">
                        <input type="radio" name="kickoff-guided" checked={kickoffChoice === "none"}
                          onChange={() => setKickoffChoice("none")} style={{ accentColor: ORANGE }} />
                        <span className="text-gray-500">I'm not attending / I missed kickoff</span>
                      </label>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  Now tap each workshop you {REGISTRATION_IS_OPEN ? "registered for" : "plan to take"}, then {REGISTRATION_IS_OPEN ? "enter your session time" : "pick the session time that fits your schedule"}. The
                  <span style={{ color: ORANGE, fontWeight: 700 }}> 6 Career Essentials (CORE)</span> workshops are the
                  recommended path; <span style={{ color: NAVY, fontWeight: 700 }}>Career Edge (BOOST)</span> workshops count too and can boost your chances with extra practice.
                </p>

                {[1, 2, 3, 4, 5, 6].map((wk) => (
                  <div key={wk} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center" style={{ background: "#FBFAFC" }}>
                      <span className="font-bold" style={{ color: NAVY }}>Week {wk}</span>
                      <span className="text-sm text-gray-400">{WEEK_RANGES[wk]}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {WORKSHOPS.filter((w) => w.week === wk).map((w) => {
                        const picked = isPicked(w.id);
                        const sess = sessions.find((s) => s.uid === w.id);
                        const slots = slotsFor(w.name);
                        const accent = w.track === "CORE" ? ORANGE : VIOLET;
                        return (
                          <div key={w.id} className={`rounded-xl border-2 p-4 transition-all ${picked ? "shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                            style={picked ? { borderColor: accent } : {}}>
                            <button onClick={() => toggleWorkshop(w)} className="w-full text-left flex items-start gap-3">
                              <span className="mt-0.5 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold"
                                style={picked ? { background: accent, color: NAVY } : { background: "#E5E7EB" }}>{picked ? "✓" : ""}</span>
                              <span className="flex-1">
                                <span className="block font-bold leading-tight" style={{ color: NAVY }}>{w.name}</span>
                                <span className="mt-1 inline-block"><TrackBadge track={w.track} /></span>
                              </span>
                            </button>

                            {picked && (
                              <div className="mt-4 pl-8">
                                {slots ? (() => {
                                  // Group slots by date into day-cards
                                  const days = [];
                                  slots.forEach((sl) => {
                                    let day = days.find((d) => d.date === sl.date);
                                    if (!day) { day = { date: sl.date, slots: [] }; days.push(day); }
                                    day.slots.push(sl);
                                  });
                                  return (
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{REGISTRATION_IS_OPEN ? "Which session did you register for?" : "Which session will you attend?"}</p>
                                      <div className="space-y-2">
                                        {days.map((day, di) => {
                                          const dayLabel = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
                                          const anyPicked = day.slots.some((sl, i) => sess.slotKey === slots.indexOf(sl));
                                          return (
                                            <div key={di} className="rounded-xl border px-3 py-2.5"
                                              style={{ borderColor: anyPicked ? accent : "#E5E7EB", background: anyPicked ? (w.track === "CORE" ? ORANGE_TINT : VIOLET_TINT) : "#FAFAFA" }}>
                                              <p className="text-xs font-bold mb-2" style={{ color: NAVY }}>{dayLabel}</p>
                                              <div className="flex flex-wrap gap-2">
                                                {day.slots.map((sl) => {
                                                  const globalIdx = slots.indexOf(sl);
                                                  const chosen = sess.slotKey === globalIdx;
                                                  return (
                                                    <button key={globalIdx} onClick={() => updateSession(w.id, { date: sl.date, startTime: sl.startTime, slotKey: globalIdx, joinLink: sl.joinLink || "" })}
                                                      className="text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all"
                                                      style={{ borderColor: chosen ? accent : "#D1D5DB", background: chosen ? accent : "#FFFFFF", color: chosen ? (w.track === "CORE" ? NAVY : NAVY) : "#6B7280" }}>
                                                      {pretty12h(sl.startTime)} ET
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })() : (
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{REGISTRATION_IS_OPEN ? "What day and time did you register for?" : "What day and time fits your schedule?"}</p>
                                    <div className="grid grid-cols-2 gap-2 max-w-xs">
                                      <input type="date" value={sess.date} min={w.monday} max={w.friday}
                                        onChange={(e) => updateSession(w.id, { date: e.target.value })}
                                        className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm" />
                                      <input type="time" value={sess.startTime}
                                        onChange={(e) => updateSession(w.id, { startTime: e.target.value })}
                                        className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm" />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{REGISTRATION_IS_OPEN ? "Copy the exact date and time from your student portal." : "Choose the session time you plan to take."}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setStep(0)} className="font-semibold text-gray-400 hover:text-gray-600">← Back</button>
              {(() => {
                const canProceed = sessions.length > 0 || kickoffChoice !== null;
                return (
                  <button onClick={() => setStep(2)} disabled={!canProceed} className={btnPrimary}
                    style={{ background: !canProceed ? "#C9C7D1" : ORANGE, color: !canProceed ? "white" : NAVY }}>
                    Next: review {sessions.length > 0 ? `(${sessions.length})` : ""} →
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* STEP 2 — REVIEW & EDIT */}
        {step === 2 && (
          <div className="space-y-6">
            <StepHeader n={2} title="Review & edit" />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><ProgressRing count={totalCount} goal={COMPLETION_GOAL} /></div>

            {/* Kickoff */}
            <div className="rounded-2xl border-2 p-5" style={{ borderColor: ORANGE, background: ORANGE_TINT }}>
              <div className="flex items-center gap-2"><TrackBadge track="KICKOFF" /><span className="font-bold" style={{ color: NAVY }}>Career Connect Kickoff</span></div>
              <p className="text-sm text-gray-500 mt-1">
                {REGISTRATION_IS_OPEN
                  ? "Kickoff counts toward your 7+ live sessions if you attend. Pick the session you registered for or attended, or note that you're not attending."
                  : "Kickoff counts toward your 7+ live sessions if you attend. Pick the session you plan to attend, or note that you're not attending."}
              </p>
              <div className="mt-3" role="radiogroup">
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                  {KICKOFF_SLOTS.map((sl, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1.5 hover:bg-white/60">
                      <input type="radio" name="kickoff-review" checked={kickoffChoice === i}
                        onChange={() => setKickoffChoice(i)} style={{ accentColor: ORANGE }} />
                      <span style={{ color: NAVY }}><strong>{sl.label}</strong> · {prettyDate(sl.date)} · {pretty12h(sl.startTime)} ET</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1.5 hover:bg-white/60">
                    <input type="radio" name="kickoff-review" checked={kickoffChoice === "none"}
                      onChange={() => setKickoffChoice("none")} style={{ accentColor: ORANGE }} />
                    <span className="text-gray-500">I'm not attending / I missed kickoff</span>
                  </label>
                </div>
                {kickoffChoice === null && <p className="text-xs text-gray-400 mt-2">Choose a kickoff session to count it, or select the last option.</p>}
              </div>
            </div>

            {sessions.length === 0 && (
              <p className="text-center text-gray-500 py-6">No workshops added yet. <button onClick={() => setStep(1)} className="font-semibold" style={{ color: NAVY }}>Add some →</button></p>
            )}

            {sessions.length > 0 && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: ORANGE_TINT, color: NAVY }}>
                {REGISTRATION_IS_OPEN ? (
                  <>We've pre-filled the <strong>Zoom link</strong> for each session you picked (you can also find these in <strong>Brightspace</strong> on your course calendar). Edit it if yours is different, or clear it to point the invite to the portal instead.</>
                ) : (
                  <>We've pre-filled the <strong>Zoom link</strong> for each session time you picked. Once registrations open, confirm your session in the portal and Brightspace.</>
                )}
              </div>
            )}

            {!allComplete && (
              <div className="rounded-xl px-4 py-3 text-sm border-2" style={{ borderColor: ORANGE, background: "#FFF7F0", color: NAVY }}>
                <strong>Add a date and time to every workshop before you continue.</strong> Still missing: {incompleteSessions.map((s) => s.name).join(", ")}. {REGISTRATION_IS_OPEN ? "Copy the exact date and time from your student portal." : "Use the session time you plan to attend."}
              </div>
            )}

            {Object.keys(grouped).sort().map((wk) => (
              <div key={wk} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-bold" style={{ color: NAVY, background: "#FBFAFC" }}>
                  {wk === "Other" ? "Other sessions" : `Week ${wk}`}{WEEK_RANGES[wk] ? <span className="text-gray-400 font-normal ml-2">{WEEK_RANGES[wk]}</span> : null}
                </div>
                <div className="divide-y divide-gray-50">
                  {grouped[wk].map((s) => {
                    const missing = !s.date || !s.startTime;
                    return (
                    <div key={s.uid} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <TrackBadge track={s.track} /><span className="font-bold" style={{ color: NAVY }}>{s.name}</span>
                          {missing && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white" style={{ background: ORANGE }}>Needs date &amp; time</span>}
                        </div>
                        <button onClick={() => removeSession(s.uid)} className="text-gray-300 hover:text-red-500 text-sm font-semibold">Remove</button>
                      </div>
                      <div className="mt-3 grid sm:grid-cols-3 gap-2">
                        <input type="date" value={s.date} min={s.minDate} max={s.maxDate} onChange={(e) => updateSession(s.uid, { date: e.target.value })} className="rounded-lg border px-2 py-1.5 text-sm" style={{ borderColor: !s.date ? ORANGE : "#E5E7EB" }} />
                        <input type="time" value={s.startTime} onChange={(e) => updateSession(s.uid, { startTime: e.target.value })} className="rounded-lg border px-2 py-1.5 text-sm" style={{ borderColor: !s.startTime ? ORANGE : "#E5E7EB" }} />
                        <input type="text" value={s.joinLink} placeholder="Paste Zoom / join link (optional)" onChange={(e) => updateSession(s.uid, { joinLink: e.target.value })} className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm" />
                      </div>
                      {missing && <p className="text-xs mt-2" style={{ color: ORANGE }}>{REGISTRATION_IS_OPEN ? "Copy the exact date and time from your student portal." : "Use the session time you plan to attend."}</p>}
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setStep(1)} className="font-semibold text-gray-400 hover:text-gray-600">← Add more</button>
              {(() => {
                const blocked = !allComplete || !hasExportable;
                return (
                  <button onClick={() => setStep(3)} disabled={blocked} className={btnPrimary}
                    style={{ background: blocked ? "#C9C7D1" : ORANGE, color: blocked ? "white" : NAVY }}>
                    Add to my calendar →
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* STEP 3 — ADD TO CALENDAR */}
        {step === 3 && (
          <div className="space-y-6">
            <StepHeader n={3} title="Add to calendar" />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><ProgressRing count={totalCount} goal={COMPLETION_GOAL} /></div>

            <div className="rounded-2xl p-6 text-white" style={{ background: NAVY }}>
              <h3 className="font-extrabold text-lg">Get everything in one tap</h3>
              <p className="text-white/80 text-sm mt-1 mb-4">
                {REGISTRATION_IS_OPEN
                  ? "Your calendar invite will save the session time and reminders (1 day and 1 hour before). If you pasted a Zoom link, it will include that link too. If not, the invite will point you back to the student portal and Brightspace."
                  : `Your kickoff invite is ready to go. Your workshop picks export as tentative holds marked "Register first." We'll remind you the moment registrations open. Once you've registered, come back here to refresh your invites with your confirmed sessions.`}
              </p>
              <button onClick={downloadICS} disabled={!hasExportable} className="font-bold py-3 px-6 rounded-xl inline-flex items-center gap-2"
                style={{ background: hasExportable ? ORANGE : "#6B6480", color: hasExportable ? NAVY : "rgba(255,255,255,0.7)" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download .ics (all sessions)
              </button>
              {!hasExportable && <p className="text-white/70 text-xs mt-3">Add at least one session with a date and time first — go back to review.</p>}
              <p className="text-white/60 text-xs mt-3">Best for Apple Calendar / phone. Using Google or Outlook on the web? Use the per-session buttons below.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold" style={{ color: NAVY }}>Or add them one at a time</h3>
              {exportList.filter((s) => s.date && s.startTime).length === 0 && (
                <p className="text-sm text-gray-500">No sessions have a time yet — go back and set times to enable calendar buttons.</p>
              )}
              {exportList.filter((s) => s.date && s.startTime).map((s) => (
                <div key={s.uid} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center gap-2 flex-wrap"><TrackBadge track={s.track} /><span className="font-bold" style={{ color: NAVY }}>{s.name}</span></div>
                  <div className="text-sm text-gray-500 mt-1 mb-3">{prettyDate(s.date)} · {pretty12h(s.startTime)} ET</div>
                  <div className="flex flex-wrap gap-2">
                    <a href={googleLink(s)} target="_blank" rel="noopener noreferrer" onClick={() => track("cal_google")} className={calBtn} style={calBtnStyle}>Google</a>
                    <button onClick={() => downloadOneICS(s)} className={calBtn} style={calBtnStyle}>Apple / iCal</button>
                    <a href={outlookLink(s, false)} target="_blank" rel="noopener noreferrer" onClick={() => track("cal_outlook")} className={calBtn} style={calBtnStyle}>Outlook</a>
                    <a href={outlookLink(s, true)} target="_blank" rel="noopener noreferrer" onClick={() => track("cal_office365")} className={calBtn} style={calBtnStyle}>Office 365</a>
                    <a href={yahooLink(s)} target="_blank" rel="noopener noreferrer" onClick={() => track("cal_yahoo")} className={calBtn} style={calBtnStyle}>Yahoo</a>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500 pt-1">
                Each invite includes the workshop description. The full <strong>.ics</strong> download and the
                <strong> Apple / iCal</strong> option also carry built-in reminders (1 day and 1 hour before). Google,
                Outlook, and Yahoo apply your calendar's own default reminder when the event opens.
              </p>
            </div>

            {totalCount >= COMPLETION_GOAL ? (
              <div className="rounded-xl p-5 border-l-4" style={{ background: ORANGE_TINT, borderColor: ORANGE }}>
                <p className="text-sm leading-relaxed" style={{ color: NAVY }}>
                  You've scheduled everything you need to complete the program. Show up, and you'll unlock 8 additional
                  weeks of individualized career and job placement support, plus a YUPRO Placement connection.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl p-6 border-2" style={{ background: ORANGE_TINT, borderColor: ORANGE }}>
                <h3 className="font-extrabold text-lg" style={{ color: NAVY }}>You're not quite at 7 yet</h3>
                <p className="text-sm leading-relaxed mt-2" style={{ color: NAVY }}>
                  You've planned <strong>{totalCount}</strong> of the <strong>7+ live sessions</strong> needed to complete
                  Career Connect. Kickoff counts as 1 if you attend, and all workshops count too. {REGISTRATION_IS_OPEN ? "Register for and attend" : "Plan to attend"}
                  at least <strong>{COMPLETION_GOAL - totalCount}</strong> more {COMPLETION_GOAL - totalCount === 1 ? "session" : "sessions"} to
                  finish and unlock 8 additional weeks of individualized career and job placement support.
                </p>
                <a href={REGISTRATION_IS_OPEN ? PORTAL_URL : CATALOG_PATH} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl text-white" style={{ background: NAVY }}>
                  {REGISTRATION_IS_OPEN ? "Go to the student portal" : "Browse the workshop catalog"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
                <p className="text-xs text-gray-500 mt-3">{REGISTRATION_IS_OPEN ? "Your invites above are ready to add now - then come back and register for the rest." : "Your tentative holds above are ready to add now - then come back once registrations open."}</p>
              </div>
            )}

            <div className="flex justify-start pt-2"><button onClick={() => setStep(2)} className="font-semibold text-gray-400 hover:text-gray-600">← Back to review</button></div>
          </div>
        )}
      </main>
      <footer className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 pt-2 text-center">
        <p className="text-xs text-gray-400">
          Year Up United · Career Connect · Summer 2026 &nbsp;·&nbsp;
          <a href={GUIDE_PATH} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
            Guide
          </a>
          &nbsp;·&nbsp;
          <a href={CATALOG_PATH} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
            Catalog
          </a>
          &nbsp;·&nbsp;
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
            Privacy notice
          </a>
        </p>
      </footer>
    </div>
  );
}
