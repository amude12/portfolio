// ─────────────────────────────────────────────────────────────
//  Edit this file to update your details. Everything on the
//  homepage reads from here.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Anuradha Mude',
  role: 'Lead UI/UX Designer',
  experience: '5+ years of experience',
  email: 'anuradhamude9@gmail.com',
  // TODO: paste your LinkedIn profile URL here
  linkedin: 'https://www.linkedin.com/in/anuradha-mude-b225a0230/',
  instagram: 'https://www.instagram.com/mudeanuradha/',
  // Drop your resume PDF into /public as resume.pdf
  resume: '/Anuradha_Mude_UI_UX_Resume.pdf',
  // Optional: put a portrait at /public/portrait.jpg and set this to '/portrait.jpg'
  portrait: null,
};

export const hero = {
  greeting: 'Hi, I’m Anuradha.',
  headline: 'Senior UI/UX Designer crafting intuitive digital experiences.',
  intro: 'I design intuitive web and mobile experiences, simplifying complex problems through thoughtful UX and UI.',
};

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'My Work', to: '/#work' },
  { label: 'About Me', to: '/about' },
  { label: 'Resume', href: site.resume },
];

export const featured = [
  {
    slug: 'medtigo',
    eyebrow: 'Platform redesign',
    title: 'Medtigo Platform Redesign',
    summary:
      'Evolving Medtigo from a single-provider tool into a unified platform where providers manage credentials and hospitals oversee licenses, certificates, renewals, and applications.',
    role: 'Lead UI/UX Designer',
    tags: ['UX strategy', 'Information architecture', 'Design systems'],
    image: '/figma/m2-24-2071-t2.webp',
    tint: '#efe9f2', // card colours: soft lavender, peach, yellow, mint, blue
  },
  {
    slug: 'student-management',
    eyebrow: 'Product design · Conceptual rebuild',
    title: 'Student Management Platform',
    summary:
      'Bringing students, parents, teachers, and administrators together through one connected platform that simplifies everyday school operations.',
    role: 'Senior UI UX Designer',
    tags: ['UX strategy', 'Interaction design', 'Accessibility'],
    image: '/figma/I5-71_4-22-t.webp',
    tint: '#fff2ee',
  },
];

export const caseStudies = [
  {
    slug: 'one-ecosystem',
    eyebrow: 'Navigation system · Web',
    title: 'One Ecosystem, Five Domains',
    summary:
      'A shared header that connects separate Medtigo domains into one ecosystem, without merging.',
    image: '/figma/68-5041-t.webp',
    tint: '#f5f2dc',
  },
  {
    slug: 'license-tracking',
    eyebrow: 'Complex flow · B2B SaaS',
    title: 'Tracking From Application to Approval',
    summary:
      'Helping providers and hospital admins see where a license application stands and what to do next.',
    image: '/figma/m2-7-1110.webp',
    tint: '#dff0ec',
  },
  {
    slug: 'role-based-dashboards',
    eyebrow: 'Dashboards · B2B SaaS',
    title: 'One Platform, Two Dashboards',
    summary:
      'Admin and Provider dashboards that answer one question first: what needs attention now?',
    image: '/figma/m2-57-1399.webp',
    tint: '#e4dbea',
  },
];

// "Beyond Case Studies" gallery. Each card shows its screens as an uncropped mosaic
// (layout: 'feature' = 1 large + 2, 'feature3' = 1 large + 3, 'grid' = 2 × 2). Artwork: scripts/gallery-art.mjs.
// "View Design" opens the card's Figma link when set, otherwise the lightbox.
export const gallery = [
  {
    title: 'Dashboards & Web Interfaces',
    tint: '#f0f3fb',
    span: 'wide',
    layout: 'feature',
    figma: '', // add the Figma link: "View Design" then opens it in a new tab
    // Medtigo: Admin dashboard, Provider dashboard, Acquisition Reports, Application details (scripts/gallery-screens.mjs)
    images: ['/gallery/dash-admin.webp', '/gallery/dash-provider.webp', '/gallery/dash-acquisition.webp', '/gallery/dash-application.webp'],
  },
  {
    title: 'Mobile App Interfaces',
    tint: '#ecf6f4',
    span: 'narrow',
    layout: 'grid',
    figma: '',
    // Student Management app screens
    images: ['/gallery/mobile-schedule.webp', '/gallery/mobile-home.webp', '/gallery/mobile-contact.webp', '/gallery/mobile-settings.webp'],
  },
  {
    title: 'Design Systems & Components',
    tint: '#fff2ee',
    span: 'narrow',
    layout: 'feature3',
    figma: '',
    // tall colour scale first, then type, buttons and form controls
    images: ['/gallery/ds-colour.svg', '/gallery/ds-type.svg', '/gallery/ds-buttons.svg', '/gallery/ds-forms.svg'],
  },
  {
    title: 'Wireframes, Flows & Prototypes',
    tint: '#f9f7ea',
    span: 'wide',
    layout: 'grid',
    figma: '',
    images: ['/gallery/wire-lofi.svg', '/gallery/flow-checkout.svg', '/gallery/flow-sitemap.svg', '/gallery/flow-prototype.svg'],
  },
];

// Genuine testimonials (from the Webflow portfolio). Shown three at a time in a carousel.
// The section stays hidden while empty.
export const testimonials = [
  {
    quote: 'The collaboration was memorable, marked by standout design skills and impactful creativity. A deep grasp of design principles ensured project success, consistently impressing clients. Your commitment and proactive approach showcased a true passion for the craft.',
    name: 'Nitin Agrawal',
    title: 'Team Lead, Proctur',
    avatar: '/testimonials/nitin.webp',
  },
  {
    quote: 'I’m thoroughly impressed with Anuradha’s design process. A focus on user needs and a knack for clarity have greatly enhanced our product’s user experience, bringing consistency across interfaces and innovative solutions to challenges.',
    name: 'Bikanksha Juneja',
    title: 'Team Lead, Technical Team',
    avatar: '/testimonials/bikanksha.webp',
  },
  {
    quote: 'I want to commend you for your excellent work in UI/UX. Your dedication to creating intuitive and impactful designs has significantly improved our projects. Your creativity and attention to detail have not gone unnoticed. Keep up the fantastic work!',
    name: 'Ashish Zanzane',
    title: 'Senior UI/UX Designer',
    avatar: '/testimonials/ashish.webp',
  },
  {
    quote: 'I want to express my sincere appreciation for your incredible work. Your designs have not only enhanced the user experience but have also made collaboration effortless. Working with you has been a pleasure. Thank you for your exceptional work!',
    name: 'Aditya Parihar',
    title: 'React JS Developer',
    avatar: '/testimonials/aditya.webp',
  },
];

export const allProjects = [...featured, ...caseStudies];
