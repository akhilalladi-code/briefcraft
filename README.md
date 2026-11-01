# Briefcraft

**Turn loose ideas into clear creative direction.** Briefcraft is a lightweight, local-first creative brief builder for freelance designers, in-house creative teams, and marketing partners.

It helps a team agree on the objective, audience, message, deliverables, channels, visual direction, and project guardrails before production begins.

## Why it exists

Creative work often starts with scattered messages and incomplete requests. Briefcraft turns those inputs into a structured brief that can be reviewed, shared, and used as a practical source of truth. It is deliberately separate from a full design workspace: it focuses on the handoff between an idea and the actual creative work.

## Features

- **Four starter templates:** social campaign, brand identity, print design, and video / motion.
- **Live document preview:** see the brief take shape while editing.
- **Useful validation:** checks for project name, objective, audience, and deliverables before Markdown export.
- **Markdown export:** create a readable brief for GitHub, Notion, documentation, or a project folder.
- **JSON export and import:** back up a brief or move it between browsers.
- **Print / PDF:** use the browser's print dialog to save a clean document.
- **Local autosave:** drafts stay in the current browser using `localStorage`.
- **Responsive and dependency-light:** plain HTML, CSS, and JavaScript; no account or API key required.

## Quick start

Requirements: Node.js 18 or newer.

```bash
git clone https://github.com/akhilalladi-code/briefcraft.git
cd briefcraft
npm run dev
```

Open [http://localhost:4173](http://localhost:4173).

You can also serve the folder with any static web server. The app is a static site and does not need a backend.

## Quality checks

```bash
npm test
npm run check
```

The test suite uses Node's built-in test runner; no test dependencies are required.

## How to use

1. Choose a starter template or begin with the social campaign template.
2. Add the project name, objective, audience, and deliverables.
3. Complete the creative direction and guardrails.
4. Review the live preview.
5. Export Markdown, export JSON, or print to PDF.

Use **Import JSON brief** to reopen a JSON file previously exported from Briefcraft.

## Privacy and data

- Briefcraft does not send brief content to a server.
- Autosave uses browser `localStorage` on the current device and browser profile.
- Clearing browser site data can remove saved drafts. Export JSON when you need a portable backup.
- Imported JSON is normalized to known fields; unknown properties are ignored.

## Project structure

```text
briefcraft/
├── index.html
├── src/
│   ├── app.js          # UI, autosave, import and export
│   ├── core.js         # presets, validation and Markdown serialization
│   └── styles.css      # responsive interface and print styles
├── tests/
│   └── core.test.js    # built-in Node tests
├── server.mjs          # tiny local development server
├── package.json
├── LICENSE
└── README.md
```

## Roadmap

- [ ] Multiple named briefs in one workspace
- [ ] Shareable read-only links with an optional hosted backend
- [ ] More specialized templates for packaging, presentations, and event campaigns
- [ ] Custom brand voice and reusable client profiles

## Contributing

Issues and pull requests are welcome. Keep the app lightweight, preserve the local-first default, and add tests for new core behavior.

## License

MIT. See [LICENSE](./LICENSE).
