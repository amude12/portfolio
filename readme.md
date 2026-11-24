# Anuradha Mude — Portfolio

React portfolio built from the Figma file *“Anuradha Mude – Portfolio Design System & Homepage”*.
Homepage plus five case studies, with separate desktop and mobile layouts, animated with Framer Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview    # serve the production build
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Homepage: Hero, Selected Work, Case Studies, Beyond Case Studies, Footer |
| `/work/medtigo` | Medtigo Platform Redesign |
| `/work/student-management` | Student Management Platform |
| `/work/one-ecosystem` | One Ecosystem, Five Domains |
| `/work/license-tracking` | Tracking a New License From Application to Approval |
| `/work/role-based-dashboards` | One Platform, Two Dashboards |

## Editing your details

All homepage content lives in **`src/data/site.js`**:

- `email`, `linkedin`, `resume`: your contact links (**set your LinkedIn URL**)
- `resume`: put your resume at `public/resume.pdf`
- `portrait`: the hero shows the animated illustration `public/hero-visual.webp` (a still frame, `hero-visual-still.webp`, is used when *reduce motion* is on). To use a photo instead, put it at `public/portrait.jpg` and set `portrait: '/portrait.jpg'`
- `gallery`: each “Beyond Case Studies” card picks a mosaic `layout` (`feature`, `feature3` or `grid`); every screen is shown uncropped and opens in the lightbox
- `testimonials`: the “Kind Words” section stays hidden until you add real quotes

Case study pages are generated from the Figma layout and stored in `src/data/pages/*.json`
(one desktop and one mobile file per case study). They are rendered by
`src/components/FigmaRenderer.jsx`. Screens below 900px use the mobile layout.

## Animations

- Page transitions, a scroll progress bar, and a header that animates in
- Hero headline revealed word by word, an interactive tilt portrait card, floating skill chips, scroll parallax
- Section content and images reveal on scroll, with hover lifts and zooms on cards
- Animated nav underline, mobile menu, and a swipeable lightbox gallery
- Respects the operating system's *reduce motion* setting

## Deploy (free)

**Vercel**: import the folder or Git repo at vercel.com. `vercel.json` already handles client-side routes.
**Netlify**: drag the `dist/` folder into app.netlify.com/drop. `public/_redirects` handles routes.

## Refreshing images from Figma

`scripts/figma/` contains the converter used to build the case study pages:

1. Download the file JSON: `curl -H "X-Figma-Token: $FIGMA_TOKEN" "https://api.figma.com/v1/files/<key>/nodes?ids=1:5" -o node.json`
2. `python3 scripts/figma/convert.py node.json out`: writes the page JSON and the list of visuals to export
3. `FIGMA_TOKEN=… python3 scripts/figma/fetch.py out/_ids.json raw 2`: downloads 2x PNGs (subject to Figma's API rate limits)
4. `python3 scripts/figma/plan.py`, then `node scripts/figma/build-images.mjs out/_plan.json . public/figma`: converts them to WebP
5. `node scripts/polish-pages.mjs`: sizes every image box to the full image (no cropping), removes author notes such as “To be confirmed”, and puts graphics in placeholder slots

Never commit your Figma token.
