# Varun Velhankar — Portfolio

Static site built from the "Portfolio V03" design canvas (Site — v1). No build step.

- `index.html`: landing page (hero with the animated lead-to-lease transcript, outcomes, work, principles, contact)
- `about.html`, `writing.html`, `how-i-think.html`
- `assets/css/tokens.css`: Warm Editorial tokens. Light by default; dark follows the OS, or set `<html data-theme="light|dark">`.
- `assets/css/site.css`: layout and components
- `assets/js/transcript.js`: hero chat demo (shows the whole thread at once under reduced motion)

Run locally:

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321.

Placeholders to fill: the case-study anchors (`#lead-to-lease`, `#oaken`, …), `#advisory`, `#adplist`, "[Launch outcome]" and "[Weekly critique, …]".
