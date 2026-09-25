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
| Data storage | Supabase (Postgres) for accounts, scores, courses and feedback; `localStorage` keeps an offline copy |
| Offline / install | Progressive Web App: `manifest.webmanifest` + service worker (`sw.js`) |
| Backend | Supabase: email sign-in, database with row-level security, `media` storage bucket for lesson images and videos |

## Project structure

```
horn-afriik/
├── index.html              Page shell, meta tags, all screen markup
├── admin.html              Admin dashboard (students, courses, feedback, settings)
├── assets/css/styles.css   Design tokens, themes, components
├── assets/js/app.js        Built-in starter content, quiz and exam engine, dashboard, sign-in and sync
├── assets/js/sb.js         Small Supabase client (auth, database, storage) using fetch
├── assets/js/admin.js      Admin dashboard logic
├── assets/css/admin.css    Admin dashboard styles
├── supabase/schema.sql     Database tables, security rules, storage bucket and starter courses
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

1. ~~Real sign-in~~ Done in v1.1 (Supabase email and password). Phone-number sign-in needs an SMS provider and is hidden for now. Password reset is not built yet: an admin can help from Supabase > Authentication.
2. ~~Server-side progress~~ Done in v1.1.
3. **Larger question bank.** Each subject has 6 questions, shared by all its units. Unit tests draw from the whole subject.
4. **Content review.** A teacher should check every lesson and question, especially Af Soomaali, Arabic and Islamic Studies.
5. **Privacy policy.** Needed once you collect student names, emails or phone numbers.
6. **Domain.** Point your domain at the host and update `og:image` in `index.html` to a full `https://` URL so link previews show the icon.

## Backend and admin (v1.1)

The app talks to the Supabase project `kbvvxcsmpqcddwlmgdnl`. The URL and publishable key are at the top of `assets/js/sb.js`. The publishable key is meant to be public; the row-level security rules in `supabase/schema.sql` decide who can read and change what.

### One-time setup

1. Supabase > SQL Editor > New query: paste all of `supabase/schema.sql` and run it. It is safe to run again.
2. Supabase > Authentication > Sign In / Providers > Email: turn **Confirm email** off. The free plan only sends a few emails per hour, so confirmation would block most sign-ups.
3. In the app, register with the admin email (`alamiin177@gmail.com`). That account becomes admin automatically. Change the list later in the dashboard under Settings.

### Admin dashboard

Open `admin.html` (or Menu > Admin dashboard in the app when signed in as an admin).

- **Overview**: students, weekly activity, quizzes per day, scores by subject, latest quizzes, sign-ups waiting for approval.
- **Students**: search and filter, per-student scores, approve, block, make admin, edit name and class, delete account, CSV export.
- **Courses**: add and edit courses, lessons (key ideas, a picture, a video upload or YouTube link, show or hide, reorder) and questions (2–6 answers, explanation, optional picture, linked to a lesson or the whole course).
- **Feedback**: messages from the Support page, marked new, read or done.
- **Settings**: require approval for new students, admin emails.

### How content reaches students

The app ships with the 12 starter subjects built in, so it works on first open even offline. When online, it loads the published courses from Supabase, saves a copy on the phone, and uses that from then on. A lesson test uses the lesson's own questions when it has 3 or more; otherwise it uses the whole course's questions.

Signed-in students' quiz scores and completed lessons are saved on the phone first and sent to Supabase when online, so they follow the student to any device. Guests keep progress on their phone only.
