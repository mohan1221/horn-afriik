# Horn Afriik

Somali secondary courses and exam preparation for Forms 1–4. Students read a lesson, test themselves, then sit timed exams and track their progress.

## Stack

| Layer | What it uses |
|---|---|
| Markup | One HTML page (`index.html`) holding every screen |
| Styling | Plain CSS with custom properties (design tokens), glassmorphism via `backdrop-filter`, light and dark themes |
| Logic | Vanilla JavaScript (ES2020), no framework, no dependencies |
| Build | None. Files are served exactly as they are |
| Fonts | Google Fonts: Fraunces, Plus Jakarta Sans, Noto Naskh Arabic |
| Graphics | Inline SVG, generated in JavaScript (diagrams, charts, icons) |
| Data storage | Browser `localStorage`, on the student's own device only |
| Offline / install | Progressive Web App: `manifest.webmanifest` + service worker (`sw.js`) |
| Backend | None yet |

## Project structure

```
horn-afriik/
├── index.html              Page shell, meta tags, all screen markup
├── assets/css/styles.css   Design tokens, themes, components
├── assets/js/app.js        Course content, question bank, quiz and exam engine, dashboard
├── sw.js                   Offline caching
├── manifest.webmanifest    Install metadata (name, colours, icons)
├── icons/                  App icons (SVG + PNG, maskable)
├── _headers                Security and cache headers for Netlify / Cloudflare Pages
├── vercel.json             Same headers for Vercel
├── firebase.json           Same headers for Firebase Hosting
└── robots.txt
```

## Run locally

The service worker needs an HTTP server; opening the file directly will not register it.

```
cd horn-afriik
python -m http.server 8080
```

Then open http://localhost:8080.

## Deploy

Any static host works. Upload the folder as it is; there is no build command and the output directory is the project root.

- **Netlify** – drag the folder into app.netlify.com/drop, or connect the Git repo (build command empty, publish directory `.`). `_headers` is applied automatically.
- **Cloudflare Pages** – create a project, build command empty, output directory `/`. `_headers` is applied automatically.
- **Vercel** – `npx vercel --prod` from this folder. `vercel.json` is applied automatically.
- **Firebase Hosting** – `firebase init hosting` (keep the existing `firebase.json`), then `firebase deploy --only hosting`.

Serve over HTTPS (every host above does by default); installing and offline mode require it.

## Releasing an update

1. Change the version in `sw.js` (`const VERSION`).
2. Change the same version in the two `?v=` queries in `index.html`.
3. Deploy. Returning students get the new version on their next visit.

## Editing content

- **Lessons**: object `L` in `assets/js/app.js`, one entry per subject and unit.
- **Questions**: the `q` array of each subject in object `S`, as `[question, [options], correctIndex, explanation]`. The correct answer is listed first by convention; options are shuffled at run time.
- **Diagrams**: object `FIG`, one SVG per subject.
- **Contact details**: the `#contact` sheet in `index.html` and the `WA` / `MAIL` constants in `app.js`.

## Before a public launch

These are not done yet and need decisions or a backend:

1. **Real sign-in.** The sign-in form only checks the format of what is typed and stores the name on the device. Any password is accepted. Connect Firebase Authentication (or another auth service) before relying on accounts.
2. **Server-side progress.** Scores and completed lessons live in `localStorage`. They are lost if the student clears the browser and do not follow them to another device. Store them in Firestore or a database once sign-in exists.
3. **Larger question bank.** Each subject has 6 questions, shared by all its units. Unit tests draw from the whole subject.
4. **Content review.** A teacher should check every lesson and question, especially Af Soomaali, Arabic and Islamic Studies.
5. **Privacy policy.** Needed once you collect student names, emails or phone numbers.
6. **Domain.** Point your domain at the host and update `og:image` in `index.html` to a full `https://` URL so link previews show the icon.
