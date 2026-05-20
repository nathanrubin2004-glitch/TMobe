# Tyrell Mosley / NGUNQ — Personal Website

Single-page personal website for Tyrell Mosley — Boston-based basketball trainer, coach, and founder of NGUNQ (Never Give Up, Never Quit).

Built with plain HTML, CSS, and JavaScript. No build step, no framework, no backend.

---

## Run it

Open `index.html` in a browser. That's it.

For local development with live-reload, run any static server from this directory:

```bash
# Option 1 — Python
python3 -m http.server 8000

# Option 2 — Node (npx)
npx serve .

# Option 3 — VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then visit `http://localhost:8000`.

---

## Project structure

```
T Mobe/
├── index.html              ← all page content
├── styles/
│   └── main.css            ← all styles (commented by section)
├── scripts/
│   └── main.js             ← nav, reveal animation, form handler
├── README.md
│
├── Headshot.jpeg           ← hero image
├── Career/                 ← playing-days photos
├── Coaching/               ← coaching/training action shots
└── NGUNQ/                  ← brand/apparel photos
```

---

## Editing the site

### Swap an image

1. Drop a new image into the matching folder (`Career/`, `Coaching/`, or `NGUNQ/`).
2. Open `index.html` and find the `<img src="...">` you want to replace.
3. Change the `src=` to point at your new file.

The hero image is the top-level `Headshot.jpeg` — replace it in place (keep the filename) and you're done.

### Update bio text or copy

All page text lives in `index.html`. Each section is clearly labeled with an HTML comment block, e.g.:

```html
<!-- ==========================================================
     ABOUT / BIO
     =========================================================== -->
```

Find the section and edit the text directly.

### Update contact info

In `index.html`:

1. `<a class="contact__line" href="sms:+18574249647">` — text link, update the phone number
2. `<a class="contact__line" href="https://instagram.com/coach_t_mobe" ...>` — Coach's Instagram
3. `<a class="contact__line" href="https://instagram.com/never_give_up_never_quit" ...>` — NGUNQ brand Instagram
4. `<a class="contact__line" href="tel:+18574249647">` — call link, update the phone number

In `scripts/main.js`:

- Update the `COACH_PHONE` constant near the top of the contact-form section. Use E.164 format (e.g. `+18574249647`).

### How the contact form works

The form submits as a **text message**. When someone hits "Text Coach":

1. The site builds a prefilled SMS containing their name, age/level, and message.
2. The user's phone opens their default messages app with that text drafted and addressed to Coach Tyrell.
3. They tap "Send" in their own messages app to deliver it.

This means **no backend, no third-party service, no inbox to monitor** — every inquiry shows up as a normal text on Coach's phone.

> Note: `sms:` links work on iPhone, Android, and macOS (Messages app). On a desktop browser without an SMS handler, nothing will open — which is why the side panel also shows tap-to-text and tap-to-call links for direct contact.

### Tweak colors

All colors are CSS variables at the top of `styles/main.css`:

```css
:root {
  --black:        #0a0a0a;
  --gold:         #C9A84C;   ← main accent
  --gold-bright:  #E5C46B;   ← hover state
  ...
}
```

Change `--gold` to swap the accent color across the entire site.

### Tweak fonts

Fonts load from Google Fonts in `index.html` (`<link href="https://fonts.googleapis.com/...">`). The site uses:

- **Oswald** — bold athletic headlines
- **Inter** — body copy

To change a font, update the Google Fonts `<link>` and the `font-family` rules in `styles/main.css`.

---

## Design notes

- **Color palette:** Deep black base with a championship-gold accent (`#C9A84C`)
- **Typography:** Oswald (condensed, athletic) for headlines; Inter for body
- **Animations:** `IntersectionObserver` drives scroll-reveal — no external library needed. Respects `prefers-reduced-motion`.
- **Responsive:** Mobile-first. Breakpoints at 960px (tablet) and 720px (phone).
- **Performance:** All images use `loading="lazy"` except the hero background.

---

## Browser support

Modern evergreen browsers (Chrome, Safari, Firefox, Edge). IntersectionObserver and CSS custom properties are required — both supported everywhere since ~2018.

---

## Hand-off checklist

- [ ] Confirm the phone number (`857-424-9647`) in `index.html` (sms/tel links) and `COACH_PHONE` in `scripts/main.js`
- [ ] Confirm Instagram handles `@coach_t_mobe` and `@never_give_up_never_quit`
- [ ] (Optional) Update the SEO `<title>` and `<meta description>` in `index.html`
- [ ] Deploy: any static host works (Netlify, Vercel, GitHub Pages, Cloudflare Pages)

---

**NEVER GIVE UP. NEVER QUIT.**
