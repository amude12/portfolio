// Post-processes the Figma page data (src/data/pages/*.json). Safe to run more than once.
//  1. Images: show every image complete — box proportions follow the real image file.
//  2. Placeholders: author notes ("To be confirmed", "Draft…") are removed, and empty
//     placeholder cards / slots are replaced with designed graphics on desktop.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = 'src/data/pages';
const dims = new Map();
async function size(src) {
  if (!dims.has(src)) {
    const m = await sharp(path.join('public', src)).metadata();
    dims.set(src, [m.width, m.height]);
  }
  return dims.get(src);
}

const TEXT_FIX = {
  // Disclaimer-style captions reworded (no 'sample data' / 'illustrative' / 'not claimed' notes)
  "Admin View first, then the provider view. All screens are shown with sample data.":
    "Admin View first, then the provider view.",
  "Admin View first, then the provider view. Sample data. Swipe each screen sideways.":
    "Admin View first, then the provider view. Swipe each screen sideways.",
  "Refined Admin dashboard, shown with sample data.":
    "Refined Admin dashboard.",
  "One set of foundations and components shared by the Admin View and the provider view. Colours are approximated from the final screens.":
    "One set of foundations and components shared by the Admin View and the provider view.",
  "Illustrative profiles based on the product structure. They are not research findings.":
    "How each role uses the platform, and what they need from it.",
  "Illustrative profiles based on the product structure. Not research findings.":
    "How each role uses the platform, and what they need from it.",
  "Four proto-personas show how needs differ by role. They are illustrative and were not created from validated research participants.":
    "Four proto-personas show how needs differ by role.",
  "Needs below are assumptions, not research findings.":
    "What each role needs from it.",
  "Reconstructed from the final screens. Swipe sideways.":
    "Swipe sideways.",
  "Reconstructed wireframes explain the layout logic behind the final screens. They are not the original project wireframes.":
    "Wireframes that explain the layout logic behind the final screens.",
  "Reconstructed wireframes. Not the original project wireframes. Swipe sideways.":
    "Wireframes that explain the layout logic. Swipe sideways.",
  "No launch status, usage data or metrics are recorded for this study, so none are claimed.":
    "What the work delivered, and what I learned from it.",
  "Design intent. No formal conformance is claimed.":
    "Accessibility built into the header from the start.",
  "Design outcomes and the lessons behind them. No metrics are claimed.":
    "Design outcomes and the lessons behind them.",
  "Shared header — recreated illustration of the shared header, shown on Home":
    "Shared header, shown on Home",
  "The provider acquisition flow was the most complex journey. The Admin View flows build on the same modules. Reconstructed from the final screens.":
    "The provider acquisition flow was the most complex journey. The Admin View flows build on the same modules.",
  "No results are claimed. Test with people who use more than one product. Success: no URL searching, correct “where am I” answers, easy recovery from a wrong turn.":
    "Test with people who use more than one product. Success: no URL searching, correct “where am I” answers, easy recovery from a wrong turn.",
  'Figma · others to be confirmed': 'Figma',
  'Progress shows In Renewal (to confirm)': 'Progress shows In Renewal',
  // Medtigo hero intro (desktop is one paragraph; mobile had it split in two)
  'From a single-provider tool to one platform where hospitals manage every provider’s credentials, and providers follow every license application. Medtigo’s platform helps healthcare providers, and the hospitals that work with them, manage licenses, certificates, renewals and new license applications. I redesigned the existing provider experience and designed a new Admin View for hospitals and organisations.':
    'Evolving Medtigo from a single-provider tool into a unified platform for hospitals and healthcare providers to manage credentials, licenses, certificates, renewals, and new license applications. I redesigned the existing Provider View and created a new Admin View for hospitals and organisations.',
  'From a single-provider tool to one platform where hospitals manage every provider’s credentials, and providers follow every license application.':
    'Evolving Medtigo from a single-provider tool into a unified platform for hospitals and healthcare providers to manage credentials, licenses, certificates, renewals, and new license applications. I redesigned the existing Provider View and created a new Admin View for hospitals and organisations.',
  'Medtigo supports healthcare providers with licensing services, including new license applications and renewals. The platform brings credential monitoring, license acquisition, compliance, billing and education into one application.':
    'Medtigo simplifies provider management by bringing licensing, credential monitoring, compliance, billing, and education into one unified platform.',
  'It is used by providers and by the hospitals and organisations that work with Medtigo. What each person can see depends on permissions Medtigo provides.':
    'Used by providers, hospitals, and organisations working with Medtigo, with access based on assigned permissions.',
};
const NOTE_PREFIX = 'To confirm: ';
const REMOVE_TAGS = new Set(['To confirm this review took place']);
// Text removed outright (merged into another paragraph)
const REMOVE_TEXT = new Set([
  "Sample data for illustration.",
  "Note: steps after Start Renewal, and work done by Medtigo’s analyst team, are not shown in the screens.",
  "Reconstructed from the app structure in the student app’s visual style. Amounts are sample data.",
  "Both dashboards answer one question first: what needs attention now? “At risk” means a credential expires within 90 days, and billing is kept off the dashboards.",
  'Challenge framing is a proposal written for this case study.',
  "Medtigo helps US hospitals manage their providers’ licenses, certificates, renewals and new license applications. This study covers the acquisition flow: the list of applications, the application detail, and ordering a service.",
  "Medtigo’s products were built separately, on different technology, each on its own domain. Merging them was not an option. I designed one shared header that binds them into a single ecosystem while every domain stays where it is.",
  'A student management platform designed to bring essential academic and institutional activities into one organized experience. The platform supports students, teachers, parents and administrators in managing everyday tasks such as attendance, timetables, fees, examinations and communication.',
  'Provider navigation: Dashboard, Monitoring, Acquisition, Compliance, Tools, Education, Staffing. Reconstructed from the final screens.',
  'Provider navigation: Dashboard, Monitoring, Acquisition, Compliance, Tools, Education, Staffing. Reconstructed from the final screens. Swipe sideways.',
  'Medtigo’s platform helps healthcare providers, and the hospitals that work with them, manage licenses, certificates, renewals and new license applications. I redesigned the provider experience and designed a new Admin View.',
]);
const SLOT_TAGS = { 'Draft: confirm activities': 'medtigo-approach', 'Launch status and results: to confirm': 'medtigo-outcome' };
// Sections whose empty column under the title gets an illustration (desktop)
const SECTION_ART = { medtigo: { Overview: 'medtigo-platform', Challenge: 'medtigo-challenge' } };
const ART_STYLE = { alignSelf: 'stretch', marginTop: 40, width: '100%', maxWidth: 480 };
// Illustrations under a section title sit closer to it (52px → 28px including the heading gap)
const TITLE_ART_STYLE = { ...ART_STYLE, marginTop: 16 };
// Desktop hero intro on every project page: full container width, closer to the title (Container gap 24 → 12)
const HERO_INTRO = { full: true, marginTop: -12 };
// Page-specific text replacements
// Paragraphs that span the full container width (no reading-measure cap), by page and opening words
const FULL_WIDTH = { medtigo: ['One dashboard answers'], 'student-management': ['A student management platform designed'] };
const PAGE_TEXT = {
  medtigo: {
    'Understanding the Challenge': 'Challenge',
    'Colours are approximated from the supplied screens. Typography is Poppins.':
      'One set of foundations and components shared by the Admin View and the provider view. Colours are approximated from the final screens.',
    'What the business needed was larger than the old platform.': 'Understanding that the business needed more than the existing platform.',
  },
  'one-ecosystem': {
    "What the design changed, and what I took from it. No metrics are claimed.":
      "Design outcomes and the lessons behind them. No metrics are claimed.",
    "Illustrative approach. Replace with the steps you actually took.":
      "Five steps, from walking the products as a user to studying how other organisations solve it.",
    "Illustrative paths. Add real evidence if you have it.":
      "How a user reaches another product, before and after the shared header.",
    "No numbers are claimed.":
      "Design outcomes and the lessons behind them. No metrics are claimed.",
    "Each product keeps its own domain and technology. Dashed boundaries mark technical limits that stay.":
      "Each product keeps its own domain and technology. Only the header is shared.",
    'Domains marked “seen on the public site” were checked at medtigo.com. The others are still to be confirmed.':
      'Each product runs on its own domain and its own technology.',
    // hero: one intro paragraph, as on the projects
    "Designing a cross-product navigation system without technically merging independently built platforms.":
      "Medtigo’s products were built independently using different technologies and separate domains, making a technical merger impractical. I designed a shared header and navigation system to connect them into one cohesive ecosystem while allowing each platform to operate independently.",
  },
  'role-based-dashboards': {
    'One Platform, Two Dashboards: Admin and Provider Views': 'One Platform, Two Dashboards',
    // hero: one intro paragraph, as on the other pages
    "Hospital admins and individual providers need different answers from the same credential data. I designed an Admin dashboard for the whole organisation and refined the Provider dashboard for one person.":
      "Hospital admins and individual providers need different answers from the same credential data. I designed an Admin dashboard for the whole organisation and refined the Provider dashboard for one person. Both answer one question first: what needs attention now?",
  },
  'license-tracking': {
    'Tracking a New License From Application to Approval': 'Tracking From Application to Approval',
    // hero: one intro paragraph, as on the other pages
    "Applying for a license involves many tasks across several stages. I designed how providers and hospital admins see where an application stands, what is overdue and what to do next.":
      "Medtigo helps US hospitals manage their providers’ licenses, certificates, renewals and new license applications. Applying for a license involves many tasks across several stages, so I designed how providers and hospital admins see where an application stands, what is overdue and what to do next.",
  },
  'student-management': {
    'Understanding the Challenge': 'Challenge',
    // hero: one intro paragraph, as on Medtigo
    'Simplifying academic and administrative workflows through a connected digital experience.':
      'A student management platform that simplifies academic and administrative workflows by bringing essential institutional activities into one connected experience. It helps students, teachers, parents, and administrators manage everyday tasks such as attendance, timetables, fees, examinations, and communication.',
  },
};
// Sections removed outright (they only held "diagram not found" placeholders); later section numbers close the gap
const REMOVE_SECTIONS = {};
// Final-design groups removed for the same reason
const REMOVE_GROUPS = {};
// Image files replaced by a cleaned copy
// New file names for re-exported 2× images, so browsers never show a cached low-res copy
const SRC_SWAP = {
  // Medtigo screens re-exported from the updated Figma file (mbnss6JPOsqU3f9QinMILF), 2× with overlays
  'figma/61-2102.webp': 'figma/m2-57-1399.webp',
  'figma/77-443.webp': 'figma/m2-57-1399.webp',
  'figma/68-4443.webp': 'figma/m2-57-1399.webp',
  'figma/68-4495.webp': 'figma/m2-57-1399.webp',
  'figma/61-1724.webp': 'figma/m2-38-1207.webp',
  'figma/61-2152.webp': 'figma/m2-38-1207.webp',
  'figma/68-4311.webp': 'figma/m2-38-1207.webp',
  'figma/68-4504.webp': 'figma/m2-38-1207.webp',
  'figma/61-2110.webp': 'figma/m2-2-256.webp',
  'figma/61-1727.webp': 'figma/m2-2-256.webp',
  'figma/61-2113.webp': 'figma/m2-2-537.webp',
  'figma/61-2121.webp': 'figma/m2-3-210.webp',
  'figma/61-2124.webp': 'figma/m2-3-653.webp',
  'figma/61-2132.webp': 'figma/m2-3-991.webp',
  'figma/61-2135.webp': 'figma/m2-3-1251.webp',
  'figma/61-2142.webp': 'figma/m2-3-1381.webp',
  'figma/61-2145.webp': 'figma/m2-3-1658.webp',
  'figma/61-2159.webp': 'figma/m2-7-1110.webp',
  'figma/68-4233.webp': 'figma/m2-7-1110.webp',
  'figma/68-4320.webp': 'figma/m2-7-1110.webp',
  'figma/61-2162.webp': 'figma/m2-7-1307.webp',
  'figma/68-4329.webp': 'figma/m2-7-1307.webp',
  'figma/61-2170.webp': 'figma/m2-7-1493.webp',
  'figma/68-4338.webp': 'figma/m2-7-1493.webp',
  'figma/61-2173.webp': 'figma/m2-7-1548.webp',
  'figma/61-1814.webp': 'figma/m2-27-766.webp',
  'figma/61-2000.webp': 'figma/m2-17-1704.webp',
  'figma/61-1892.webp': 'figma/m2-27-837.webp',
  'figma/61-1696.webp': 'figma/m2-24-2071-r2.webp',
  'figma/m2-24-2071.webp': 'figma/m2-24-2071-r2.webp',
  'figma/m2-24-2071-r.webp': 'figma/m2-24-2071-r2.webp',
  'figma/m2-24-2071-t.webp': 'figma/m2-24-2071-r2.webp',
  'figma/42-2315.webp': 'figma/42-2315-hd.webp',
  'figma/42-2315-clean.webp': 'figma/42-2315-hd.webp',
  'figma/42-2244.webp': 'figma/42-2244-hd.webp',
  'figma/42-2386.webp': 'figma/42-2386-hd.webp',
  'figma/42-2461.webp': 'figma/42-2461-hd.webp',
  'figma/42-2464.webp': 'figma/42-2464-hd.webp',
  'figma/42-2466.webp': 'figma/42-2466-hd.webp',
  'figma/42-2468.webp': 'figma/42-2468-hd.webp',
  'figma/42-2483.webp': 'figma/42-2483-hd.webp',
  'figma/42-1711.webp': 'figma/42-1711-hd.webp',
  'figma/42-1864.webp': 'figma/42-1864-hd.webp',
  'figma/42-1824.webp': 'figma/42-1824-v4.webp',
  'figma/42-1824-hd.webp': 'figma/42-1824-v4.webp',
  'figma/42-1824-v2.webp': 'figma/42-1824-v4.webp',
  'figma/42-1824-v3.webp': 'figma/42-1824-v4.webp',
  'figma/42-1649.webp': 'figma/42-1649-hd.webp',
  'figma/42-1937.webp': 'figma/42-1937-hd.webp',
  'figma/42-2079.webp': 'figma/42-2079-hd.webp',
  'figma/42-1767.webp': 'figma/42-1767-hd.webp',
  'figma/42-1777.webp': 'figma/42-1777-hd.webp',
  'figma/42-1787.webp': 'figma/42-1787-hd.webp',
  'figma/42-1798.webp': 'figma/42-1798-hd.webp',
};
// Pages whose section intro paragraphs run the full container width
const FULL_INTROS = new Set(['student-management', 'one-ecosystem', 'license-tracking', 'role-based-dashboards']);
// Pages whose section subtitles move up to the projects' intro size (16px → 20px on desktop)
const INTRO_20 = new Set(['one-ecosystem', 'license-tracking', 'role-based-dashboards']);
// Pages whose section labels get numbers ("01 — Overview"), as on the projects
const NUMBERED = new Set(['one-ecosystem', 'license-tracking', 'role-based-dashboards']);
// Pages whose card labels follow the shared rule: a label repeated on every card in a section is dropped,
// "To validate" reads "Expected", and labels are solid pills (Chosen stands out, Ruled out recedes)
const LABEL_RULES = new Set(['license-tracking', 'role-based-dashboards']);
// Pages that get the Medtigo layout refinements (section heading spacing, users grid, leftover heights)
const REFINED = new Set(['medtigo', 'student-management', 'one-ecosystem', 'license-tracking', 'role-based-dashboards']);
// Hero order: title, intro, details, then the image (as on Medtigo)
const HERO_DETAILS_FIRST = new Set(['student-management']);
// Pages whose hero drops the "Case study · …" label above the title
const NO_HERO_EYEBROW = new Set(['medtigo', 'student-management', 'one-ecosystem', 'license-tracking', 'role-based-dashboards']);
// One Ecosystem overview: domains for every product, no confirmation tags
const OE_DOMAINS = {
  'Card · Home': 'medtigo.com', 'Card · Courses': 'courses.medtigo.com', 'Card · Staffing': 'staffing.medtigo.com',
  'Card · Journal': 'journal.medtigo.com', 'Card · Platform': 'connect.medtigo.com',
};
// Pages whose "Home / Case studies / …" breadcrumb becomes the "← Back to Work" link used on the projects
const BACK_LINK = new Set(['one-ecosystem', 'license-tracking', 'role-based-dashboards']);
// Case studies link back to the Case Studies section; projects go back to Selected Work
const CASE_STUDIES = new Set(['one-ecosystem', 'license-tracking', 'role-based-dashboards']);
const BACK_STYLE = { color: '#125bfb', fontSize: 15, fontWeight: 600, lineHeight: '20.0px', whiteSpace: 'nowrap' };
const HERO_IMAGE_PULL = { medtigo: -14, 'student-management': -14, 'one-ecosystem': -14, 'license-tracking': -14, 'role-based-dashboards': -14 }; // also spaces the details row (36px) below the intro
// Tidy values typed into Figma
const VALUE_FIX = { 'Figma , Balsamiq , Miro': 'Figma, Balsamiq, Miro', 'UI / UX': 'UI/UX', 'B2B and B2C healthcare SaaS · Web application': 'B2B and B2C healthcare SaaS',
  'UI UX designer': 'UI/UX Designer', 'Product design · Web and mobile': 'Product design' };
// Values placed over the Medtigo hero in Figma as loose layers (not inside their columns)
const META_INJECT = { medtigo: { Duration: '6 months', Team: 'UI/UX', Tools: 'Figma, Balsamiq, Miro' } };
const VALUE_STYLE = { alignSelf: 'stretch', color: '#0f1222', fontSize: 14, fontWeight: 400, lineHeight: '22.0px' };

const texts = (n) => (n.t === 'x' ? [n.v] : (n.c || []).flatMap(texts));
const flatTexts = (n) => (n.t === 'x' ? [n] : (n.c || []).flatMap(flatTexts));
const isDashed = (n) => n.t === 'f' && /dashed/.test(n.s.border || '');

function polish(node, ctx) {
  if (node.t === 'x') {
    if (ctx.section === 'Hero' && NO_HERO_EYEBROW.has(ctx.page) && node.v.startsWith('Case study ·')) return null;
    if (ctx.section === 'Hero' && CASE_STUDIES.has(ctx.page) && node.v === '← Back to Work') {
      node.v = '← Back to Case Studies';
      node.href = '/#case-studies';
    }
    if (ctx.section === 'Hero' && BACK_LINK.has(ctx.page) && /^Home\s+\/\s+Case studies/.test(node.v)) {
      return CASE_STUDIES.has(ctx.page)
        ? { t: 'x', v: '← Back to Case Studies', href: '/#case-studies', s: { ...BACK_STYLE } }
        : { t: 'x', v: '← Back to Work', href: '/#work', s: { ...BACK_STYLE } };
    }
    if (REMOVE_TEXT.has(node.v)) return null;
    if (PAGE_TEXT[ctx.page]?.[node.v]) node.v = PAGE_TEXT[ctx.page][node.v];
    if (!ctx.mobile && FULL_WIDTH[ctx.page]?.some((w) => node.v.startsWith(w))) {
      node.full = true;
      const { maxWidth, ...rest } = node.s;
      node.s = { ...rest, alignSelf: 'stretch' };
    }
    if (TEXT_FIX[node.v]) node.v = TEXT_FIX[node.v];
    const trimmed = node.v.trim();
    if (VALUE_FIX[trimmed]) node.v = VALUE_FIX[trimmed];
    else if (trimmed !== node.v && !node.v.includes('\n')) node.v = trimmed;
    if (node.v.startsWith(NOTE_PREFIX)) node.v = 'Note: ' + node.v.slice(NOTE_PREFIX.length);
    return node;
  }
  if (node.t === 'i' && SRC_SWAP[node.src]) node.src = SRC_SWAP[node.src];
  if (node.t === 'i' && node.alt) node.alt = node.alt.replace(/\s*[–-]\s*recreated from photo/i, '');
  if (node.t !== 'f') return node;
  if (REMOVE_GROUPS[ctx.page]?.has(node.n)) return null;
  if (node.n === 'Tag · Assumption') return null; // no 'Assumption' labels on cards
  if (ctx.page === 'one-ecosystem' && ctx.section === 'Overview' && /^Tag · /.test(node.n || '')) return null;
  // Approach steps are the real process: no "Illustrative" tags
  if (ctx.page === 'one-ecosystem' && ['Approach', 'Journey'].includes(ctx.section) && node.n === 'Tag · Illustrative') return null;
  // One Ecosystem labels: only where they tell cards apart; solid pills, never dashed
  if (ctx.page === 'one-ecosystem' && /^Tag · /.test(node.n || '')) {
    if (node.n === 'Tag · Design' && ['Accessibility', 'Header principles'].includes(ctx.section)) return null;
    if (['The problem', 'Journey'].includes(ctx.section)) return null; // phone-only labels that desktop doesn't show
    const txt = node.c?.find((c) => c.t === 'x');
    if (txt) {
      if (ctx.section === 'Validation' && node.n === 'Tag · To validate') { ctx.taskN = (ctx.taskN || 0) + 1; txt.v = `Task ${ctx.taskN}`; }
      if (ctx.section === 'Outcome' && node.n === 'Tag · To validate') txt.v = 'Expected';
      // tone: the chosen option stands out, ruled-out options recede, everything else is a soft blue
      const tone = txt.v === 'Chosen' ? ['#125bfb', '#ffffff'] : txt.v === 'Ruled out' ? ['#eef1f6', '#5b6275'] : ['#e0e8ff', '#3048c8'];
      const { border, backgroundColor, ...rest } = node.s;
      node.s = { ...rest, backgroundColor: tone[0], padding: '4.0px 10.0px' };
      txt.s = { ...txt.s, color: tone[1], fontWeight: 600 };
    }
  }
  // Header mockups: a readable page (product title, intro line, three cards) instead of bare bars
  if (ctx.page === 'one-ecosystem' && node.n === 'Browser' && !node.paged) {
    const url = flatTexts(node).find((x) => /medtigo\.com/.test(x.v))?.v || '';
    const product = { 'medtigo.com': 'Home', 'courses.medtigo.com': 'Courses', 'staffing.medtigo.com': 'Staffing', 'journal.medtigo.com': 'Journal', 'connect.medtigo.com': 'Platform' }[url.trim()];
    const area = (node.c || []).find((c) => c.n === 'Page area');
    if (product && area) {
      const bar = (w) => ({ t: 'r', s: { width: w, maxWidth: '100%', height: 8, backgroundColor: '#c9d6ee', borderRadius: '4px' } });
      const card = { t: 'f', n: 'Page card', s: { flex: '1 1 0', minWidth: 0, height: 48, backgroundColor: '#ffffff', border: '1px solid #d2deeb', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 12px' }, c: [bar('70%'), bar('45%')] };
      area.s = { ...area.s, height: 'auto', minHeight: area.s.height };
      area.c = [
        { t: 'x', s: { color: '#0f1222', fontSize: 15, fontWeight: 600, lineHeight: '22px' }, v: product },
        bar('55%'),
        { t: 'f', n: 'Page cards', s: { alignSelf: 'stretch', display: 'flex', flexDirection: 'row', gap: 10, marginTop: 4 }, c: [card, { ...card }, { ...card }] },
      ];
      node.paged = true;
    }
  }
  const t = texts(node);

  // Dashed author-note tags
  if (isDashed(node) && t.length === 1) {
    if (REMOVE_TAGS.has(t[0])) return null;
    if (SLOT_TAGS[t[0]]) {
      return ctx.mobile ? null : { t: 'g', kind: SLOT_TAGS[t[0]], s: ART_STYLE };
    }
  }
  // Hero meta columns whose value is only "To be confirmed"
  if (ctx.section === 'Hero' && t.length === 2 && t.includes('To be confirmed')) {
    const label = t.find((x) => x !== 'To be confirmed');
    if (!(ctx.mobile && ctx.metaIn?.[label])) return null;
    // mobile: replace the dashed tag with a plain value that the meta pass fills in
    const tag = node.c.find((c) => c.t === 'f');
    if (tag) node.c[node.c.indexOf(tag)] = { ...flatTexts(tag)[0], s: { ...flatTexts(tag)[0].s } };
  }
  // Instruction cards ("To be confirmed" + "Add … here")
  if (node.s.padding && t.length <= 4 && t.includes('To be confirmed') && t.some((x) => /^Add .*here/.test(x))) {
    if (ctx.mobile) return null;
    const { display, flexDirection, gap, alignItems, justifyContent, ...box } = node.s;
    return { t: 'g', kind: 'outcome-card', s: box };
  }
  node.c = (node.c || []).map((c) => polish(c, ctx)).filter(Boolean);
  // License Tracking: the same five details as the other case studies
  const DETAIL_ROWS = {
    'license-tracking': [['Category', 'B2B healthcare SaaS'], ['My role', 'Lead UI/UX Designer'], ['Duration', '2 weeks'], ['Platform', 'Web, Provider and Admin views'], ['Scope', 'Application list, detail, ordering']],
    'role-based-dashboards': [['Category', 'B2B healthcare SaaS'], ['My role', 'Lead UI/UX Designer'], ['Duration', '2 weeks'], ['Platform', 'Web, Admin and Provider views'], ['Scope', 'Admin and Provider dashboards']],
  };
  if (DETAIL_ROWS[ctx.page] && ctx.section === 'Hero' && node.n === 'Project details') {
    const DETAILS = DETAIL_ROWS[ctx.page];
    const tpl = node.c[0];
    node.c = DETAILS.map(([label, value]) => {
      const col = JSON.parse(JSON.stringify(tpl));
      const [l, v] = col.c.filter((c) => c.t === 'x');
      l.v = label; v.v = value; col.n = label;
      if (!ctx.mobile) col.s = { ...col.s, flex: '1 1 0' };
      return col;
    });
  }
  // Mobile hero row (label + value): use the desktop value and the standard value style
  if (ctx.section === 'Hero' && ctx.mobile && node.c.length === 2 && node.c.every((c) => c.t === 'x') && ctx.metaIn?.[node.c[0].v]) {
    const v = node.c[1];
    v.v = ctx.metaIn[node.c[0].v];
    const { color, fontSize, fontWeight, lineHeight, letterSpacing, whiteSpace, ...rest } = v.s;
    v.s = { ...rest, color: VALUE_STYLE.color, fontSize: 14, fontWeight: 400, lineHeight: VALUE_STYLE.lineHeight };
  }
  // Hero column holding only a label: attach its value
  if (ctx.section === 'Hero' && !ctx.mobile && node.c.length === 1 && node.c[0].t === 'x' && META_INJECT[ctx.page]?.[node.c[0].v]) {
    node.c.push({ t: 'x', s: { ...VALUE_STYLE }, v: META_INJECT[ctx.page][node.c[0].v] });
  }
  // Hero meta columns: label + value. Values share one style; mobile takes desktop's values.
  if (ctx.section === 'Hero' && node.c.length > 1 && node.c.every((c) => c.t === 'f' && texts(c).length === 2)) {
    const valueOf = (col) => flatTexts(col)[1];
    const labelOf = (col) => flatTexts(col)[0];
    const ref = node.c.map(valueOf).find((v) => v.s.fontSize === 14) || valueOf(node.c[0]);
    for (const col of node.c) {
      const v = valueOf(col);
      if (!ctx.mobile && ctx.metaOut) ctx.metaOut[labelOf(col).v] = v.v;
      if (ctx.mobile && ctx.metaIn?.[labelOf(col).v]) v.v = ctx.metaIn[labelOf(col).v];
      if (v !== ref && v.v !== 'To be confirmed') {
        const { color, fontSize, fontWeight, lineHeight, letterSpacing, ...rest } = v.s;
        v.s = { ...rest, color: ref.s.color, fontSize: ref.s.fontSize, fontWeight: ref.s.fontWeight, lineHeight: ref.s.lineHeight };
      }
    }
  }
  // Illustration under the section title (desktop)
  const art = !ctx.mobile && SECTION_ART[ctx.page]?.[ctx.section];
  if (art && !ctx.artDone && node.c.some((c) => c.t === 'x' && c.s.fontSize >= 28)) {
    // Keep exactly one illustration, so re-running the script never stacks copies
    const first = node.c.findIndex((c) => c.t === 'g' && c.kind === art);
    node.c = node.c.filter((c, i) => !(c.t === 'g' && c.kind === art) || i === first);
    if (first < 0) node.c.push({ t: 'g', kind: art, s: TITLE_ART_STYLE });
    else node.c[first].s = TITLE_ART_STYLE;
    ctx.artDone = true;
  }
  // Desktop breadcrumb: "← Back to Work" sits on the left, as in Figma
  if (!ctx.mobile && ctx.section === 'Breadcrumb' && node.n === 'Container' && t.some((x) => x.includes('Back to Work'))) {
    node.s = { ...node.s, alignItems: 'flex-start' };
  }
  // Hero intro paragraph directly after the page title
  const intro = !ctx.mobile && ctx.section === 'Hero' && HERO_INTRO;
  if (intro) {
    const k = node.c.findIndex((c) => c.t === 'x' && c.s.fontSize >= 56);
    if (k === 0 && NO_HERO_EYEBROW.has(ctx.page)) node.c[0].s = { ...node.c[0].s, marginTop: 16 };
    // License Tracking: the title fits one line at 62px (72px needs 1358px of a 1200px container)
    if (k >= 0 && ctx.page === 'license-tracking') node.c[k].cls = 'fg-h1--long';
    const p = node.c[k + 1];
    if (k >= 0 && p?.t === 'x' && p.s.fontSize === 20) {
      p.full = intro.full;
      p.s = { ...p.s, marginTop: intro.marginTop };
    }
  }
  // Hero: details row before the image; the second intro paragraph sits close to the first
  if (!ctx.mobile && ctx.section === 'Hero' && HERO_DETAILS_FIRST.has(ctx.page)) {
    const d = node.c.findIndex((c) => c.t === 'f' && c.n === 'Project details');
    if (d > 0 && node.c[d - 1].t === 'i') [node.c[d - 1], node.c[d]] = [node.c[d], node.c[d - 1]];
    const k = node.c.findIndex((c) => c.t === 'x' && c.s.fontSize >= 56);
    const second = node.c[k + 2];
    if (k >= 0 && second?.t === 'x' && second.s.fontSize === 16) second.s = { ...second.s, marginTop: -8 };
  }
  // Desktop hero image sits closer to the details row above it (gap 24 → 10)
  if (!ctx.mobile && ctx.section === 'Hero' && HERO_IMAGE_PULL[ctx.page]) {
    const k = node.c.findIndex((c) => c.t === 'f' && c.n === 'Project details');
    const img = node.c[k + 1];
    if (k >= 0 && img && img.t === 'i') img.s = { ...img.s, marginTop: HERO_IMAGE_PULL[ctx.page] };
    // and the details row sits further from the intro paragraph (gap 24 → 36)
    if (k >= 0) node.c[k].s = { ...node.c[k].s, marginTop: 12 };
  }
  // Medtigo Overview: more air between the text columns and the two screens below (gap 64 → 84)
  if (!ctx.mobile && ctx.page === 'medtigo' && ctx.section === 'Overview' && node.n === 'Container') {
    const two = node.c.find((c) => c.t === 'f' && c.n === 'Two-up');
    if (two) two.s = { ...two.s, marginTop: 20 };
  }
  // Medtigo Overview: the two dashboards as an equal pair, each captioned
  if (!ctx.mobile && ctx.page === 'medtigo' && ctx.section === 'Overview' && node.n === 'Two-up') {
    const imgs = [];
    const collect = (n) => { if (n.t === 'i') imgs.push(n); (n.c || []).forEach(collect); };
    collect(node);
    const provider = imgs.find((i) => /61-1724|m2-38-1207/.test(i.src));
    const admin = imgs.find((i) => /77-443|m2-57-1399/.test(i.src));
    if (provider && admin) {
      const caption = { width: '100%', color: '#4a5068', fontSize: 14, fontWeight: 400, lineHeight: '22.0px' };
      // Same box for both (the taller admin screen's ratio). The provider screen is anchored to the top and
      // continues below in its own colours: sidebar (exactly 1/6 of the width) and page background.
      const box = { width: '100%', aspectRatio: '2400 / 2657' };
      const figure = (img, label, extra = {}) => ({
        t: 'f', n: 'Figure',
        s: { flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' },
        c: [{ ...img, box: true, s: { ...box, ...extra }, imgStyle: { objectFit: 'contain', objectPosition: 'top' } }, { t: 'x', s: caption, v: label }],
      });
      node.c = [
        figure(provider, 'Provider Dashboard', { background: 'linear-gradient(90deg, #1b3c87 16.667%, #f4f6fa 16.667%)' }),
        figure(admin, 'Admin Dashboard'),
      ];
      node.s = { ...node.s, alignItems: 'stretch' };
    }
  }
  // Medtigo Users: the profile columns sit closer to their heading (gap 64 → 32)
  if (!ctx.mobile && REFINED.has(ctx.page) && ctx.section === 'Users' && node.n === 'Container') {
    const cols = node.c.find((c) => c.t === 'f' && c.n === 'Columns');
    if (cols) cols.s = { ...cols.s, marginTop: -32 };
  }
  // Medtigo section headings: subtitle closer to its title (gap 12 → 5), as on the homepage
  if (!ctx.mobile && REFINED.has(ctx.page) && /^section heading$/i.test(node.n || '')) {
    const k = node.c.findIndex((c) => c.t === 'x' && c.s.fontSize >= 28);
    const sub = node.c[k + 1];
    if (k >= 0 && sub?.t === 'x') sub.s = { ...sub.s, marginTop: -7 };
  }
  // Medtigo user flows: each flow in its own blue card instead of one shared panel
  if (!ctx.mobile && ctx.page === 'medtigo' && ctx.section === 'User Flows' && node.n === 'Flow panel') {
    const card = { backgroundColor: '#3f4fc6', borderRadius: '12.0px', padding: '40.0px', alignSelf: 'stretch' };
    const { backgroundColor, borderRadius, padding, overflow, ...rest } = node.s;
    node.s = { ...rest, gap: 24, alignItems: 'stretch' };
    node.c.forEach((c) => {
      if (c.t === 'f') c.s = { ...c.s, ...card };
      // the closing note now sits on the light section background
      else if (c.t === 'x') c.s = { ...c.s, color: '#4a5068', marginTop: 4 };
    });
  }
  // Medtigo Final Designs: drop fixed heights left over from Figma (they added ~330px of empty space at the end)
  if (REFINED.has(ctx.page) && ['Final Designs', 'Design Approach'].includes(ctx.section) && ['Two-up', 'Figure', 'Container'].includes(node.n) && 'minHeight' in node.s) {
    const { minHeight, ...rest } = node.s;
    node.s = rest;
  }
  // Medtigo Final Designs: each group intro sits close to its own screens (64 → 26); groups stay 64 apart
  if (!ctx.mobile && ctx.page === 'medtigo' && ctx.section === 'Final Designs' && node.n === 'Container') {
    node.c.forEach((c, i) => {
      const next = node.c[i + 1];
      if (c.n === 'Group intro' && next && next.n !== 'Group intro') next.s = { ...next.s, marginTop: -38 };
      // group intro text runs the full container width
      if (c.n === 'Group intro') c.c.forEach((x) => {
        if (x.t !== 'x') return;
        x.full = true;
        const { maxWidth, ...rest } = x.s;
        x.s = { ...rest, alignSelf: 'stretch' };
      });
    });
  }
  // Medtigo Design System: heading, then the live design-system component (replaces swatches + screenshots)
  if (ctx.page === 'medtigo' && ctx.section === 'Design System') {
    const ds = { t: 'g', kind: 'medtigo-design-system', s: { alignSelf: 'stretch', width: '100%' } };
    const heading = (n) => (n.n === 'Section heading' ? n : (n.c || []).map(heading).find(Boolean));
    if (!ctx.mobile && node.n === 'Container' && !node.c.some((c) => c.kind === ds.kind)) {
      const h = heading(node);
      if (h) {
        const { maxWidth, ...hs } = h.s;
        node.c = [{ ...h, s: { ...hs, maxWidth: 760 } }, ds];
        node.s = { ...node.s, gap: 32 };
      }
    }
    if (ctx.mobile && node.n === 'Design System' && !node.c.some((c) => c.kind === ds.kind)) {
      const h = heading(node);
      if (h) node.c = [h, ds];
    }
  }
  // Medtigo Key Design Decisions: first decision closer to the heading (64 → 26)
  if (!ctx.mobile && ctx.page === 'medtigo' && ctx.section === 'Key Design Decisions' && node.n === 'Container') {
    const k = node.c.findIndex((c) => c.n === 'Section heading');
    if (k >= 0 && node.c[k + 1]) node.c[k + 1].s = { ...node.c[k + 1].s, marginTop: -38 };
  }
  // Medtigo Outcome: a "What I learned" graphic under the "What I delivered" one
  if (!ctx.mobile && ctx.page === 'medtigo' && ctx.section === 'Outcome and Learnings') {
    const k = node.c.findIndex((c) => c.t === 'g' && c.kind === 'medtigo-outcome');
    // closer to the section title: 56px → 11px (heading gap 16 + margin −5)
    if (k >= 0) node.c[k].s = { ...node.c[k].s, marginTop: -5 };
    if (k >= 0 && !node.c.some((c) => c.t === 'g' && c.kind === 'medtigo-learned')) {
      node.c.splice(k + 1, 0, { t: 'g', kind: 'medtigo-learned', s: { ...node.c[k].s, marginTop: 24 } });
    }
  }
  // Medtigo Outcome: "What I learned" starts a new group, so it gets more space above it (+80%)
  if (!ctx.mobile && ctx.page === 'medtigo' && ctx.section === 'Outcome and Learnings' && node.n === 'Content') {
    const h = node.c.find((c) => c.t === 'x' && c.v === 'What I learned');
    if (h) h.s = { ...h.s, marginTop: 26 };
    // "What I delivered" lines up with the section title on the left:
    // eyebrow 16 + gap 12 puts the 44px title line at 28–72; centre this 26px line on it (top 37)
    const d = node.c.find((c) => c.t === 'x' && c.v === 'What I delivered');
    if (d) d.s = { ...d.s, marginTop: 37 };
  }
  // Full-width section intros: stacked headings (not the two-column ones) and the comparison intro
  if (!ctx.mobile && FULL_INTROS.has(ctx.page) && (
    (/^section heading$/i.test(node.n || '') && (node.s.maxWidth || 1200) >= 700) || node.n === 'Comparison intro')) {
    const { maxWidth, ...rest } = node.s;
    node.s = { ...rest, width: '100%', alignSelf: 'stretch' };
    node.c.forEach((x) => {
      if (x.t !== 'x') return;
      x.full = true;
      const { maxWidth: m, ...r } = x.s;
      x.s = { ...r, alignSelf: 'stretch' };
      if (INTRO_20.has(ctx.page) && x.s.fontSize === 16) x.s = { ...x.s, fontSize: 20, lineHeight: '32.0px', color: '#4a5068' };
    });
  }
  // License Tracking: a project-specific illustration instead of the generic checklist card
  if (['license-tracking', 'role-based-dashboards'].includes(ctx.page) && ctx.section === 'Outcome') {
    const kind = ctx.page === 'license-tracking' ? 'lt-outcome' : 'rb-outcome';
    node.c = node.c.map((c) => (c.t === 'g' && ['outcome-card', 'lt-outcome', 'rb-outcome'].includes(c.kind)
      ? { ...c, kind, s: { ...c.s, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center' } } : c));
  }
  // One Ecosystem: project-specific illustrations instead of the generic checklist card
  if (ctx.page === 'one-ecosystem' && ['Validation', 'Outcome'].includes(ctx.section)) {
    node.c = node.c.map((c) => (c.t === 'g' && ['outcome-card', 'oe-test', 'oe-outcome'].includes(c.kind)
      ? { ...c, kind: ctx.section === 'Validation' ? 'oe-test' : 'oe-outcome', s: { ...c.s, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center' } }
      : c));
  }
  // One Ecosystem overview cards: the domain under each product name
  if (ctx.page === 'one-ecosystem' && ctx.section === 'Overview' && OE_DOMAINS[node.n]) {
    const body = node.c.filter((c) => c.t === 'x').slice(-1)[0];
    if (body && body.s.fontSize <= 16) body.v = OE_DOMAINS[node.n];
  }
  // Hero meta row with fewer than five items: keep items compact instead of stretching across.
  if (ctx.section === 'Hero' && !ctx.mobile && node.s.flexDirection === 'row' && node.c.length && node.c.length < 5 &&
      node.c.every((c) => c.t === 'f' && texts(c).length === 2)) {
    node.c.forEach((c) => { c.s = { ...c.s, flex: '0 1 220px' }; });
    node.s = { ...node.s, gap: 48 };
  }
  return node;
}

async function fixImages(node) {
  if (node.t === 'i' && !node.box) {
    const [w, h] = await size(node.src);
    if (node.hs) node.ar = `${w} / ${h}`;
    else if (Math.abs(w / h - node.w / node.h) / (node.w / node.h) > 0.02) {
      node.h = Math.round((node.w * h) / w);
      node.s.aspectRatio = `${w} / ${h}`;
    }
  }
  for (const c of node.c || []) await fixImages(c);
}

const meta = {};
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort((a, b) => a.includes('.mobile.') - b.includes('.mobile.'));
for (const f of files) {
  const file = path.join(dir, f);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const mobile = f.includes('.mobile.');
  const page = f.split('.')[0];
  meta[page] ??= {};
  data.sections = data.sections
    .filter((s) => !REMOVE_SECTIONS[page]?.has(s.n))
    .map((s) => polish(s, { mobile, page, section: s.n, metaOut: mobile ? null : meta[page], metaIn: mobile ? meta[page] : null }))
    .filter(Boolean);
  if (LABEL_RULES.has(page)) {
    for (const sec of data.sections) {
      const tags = [];
      const find = (node, parent) => { if (/^Tag · /.test(node.n || '')) tags.push([node, parent]); (node.c || []).forEach((c) => find(c, node)); };
      find(sec, null);
      const words = tags.map(([t]) => flatTexts(t)[0]?.v);
      const uniform = tags.length > 1 && words.every((w) => w === words[0]);
      for (const [t, parent] of tags) {
        if (uniform) { parent.c = parent.c.filter((c) => c !== t); continue; }
        const txt = flatTexts(t)[0];
        if (!txt) continue;
        // a card that asks a question is something to test; a stated benefit is expected
        if (['To validate', 'Expected', 'To test'].includes(txt.v)) txt.v = /\?$/.test(flatTexts(parent).slice(-1)[0]?.v || '') ? 'To test' : 'Expected';
        const tone = txt.v === 'Chosen' ? ['#125bfb', '#ffffff'] : txt.v === 'Ruled out' ? ['#eef1f6', '#5b6275'] : ['#e0e8ff', '#3048c8'];
        const { border, backgroundColor, ...rest } = t.s;
        t.s = { ...rest, backgroundColor: tone[0], padding: '4.0px 10.0px' };
        txt.s = { ...txt.s, color: tone[1], fontWeight: 600 };
      }
    }
  }
  // Numbered section labels: the first small label of each section heading
  if (NUMBERED.has(page)) {
    let n = 0;
    const heading = (node) => (/^section heading$/i.test(node.n || '') ? node : (node.c || []).map(heading).find(Boolean));
    for (const sec of data.sections) {
      const h = heading(sec);
      const label = h?.c.find((c) => c.t === 'x' && c.s.fontSize <= 12);
      if (!label) continue;
      n++;
      label.v = String(n).padStart(2, '0') + ' — ' + label.v.replace(/^\d{2} — /, '').replace(/^Step \d+ · /, '');
    }
  }
  // Section numbers ("06 — …") run in order, so removed sections leave no gap
  if (REMOVE_SECTIONS[page]) {
    let n = 0;
    const renumber = (node) => {
      if (node.t === 'x' && /^\d{2} — /.test(node.v)) node.v = String(++n).padStart(2, '0') + node.v.slice(2);
      (node.c || []).forEach(renumber);
    };
    data.sections.forEach(renumber);
  }
  for (const s of data.sections) await fixImages(s);
  fs.writeFileSync(file, JSON.stringify(data));
  console.log('polished', f);
}
