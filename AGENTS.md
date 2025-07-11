# Project Agents.md Guide for OpenAI Codex

This Agents.md file provides guidance for OpenAI Codex and other AI agents working with this repository. The project contains a collection of browser-based minigames and utilities written in vanilla JavaScript and HTML.

## Project Structure for OpenAI Codex Navigation

- `/` – Root of the project containing HTML files for the different games (`index.html`, `dodge.html`, `tank.html`, etc.) and shared JavaScript (`shared.js`).
- `/cardgen` – Code for the Robot Card Generator. This folder contains `main.js`, `description.js`, `scoreSheet.js`, `storage.js`, and related HTML assets.
  - `/google_cardgen` – Google Apps Script files used for generating PDFs.

There are no `src` or `components` directories and no build system. All files are plain HTML and JavaScript.

## Coding Conventions for OpenAI Codex

- Use modern JavaScript (ES6+) for any new scripts.
- Follow the existing code style: 2‑space indentation, semicolons, and double quotes for strings.
- Provide meaningful variable and function names.
- Add comments to explain complex logic, especially in game logic or DOM manipulation.
- Keep individual files focused on a single concern.
- File names should use `kebab-case` and carry the `.js` or `.html` extension as appropriate.

### DOM Interaction Guidelines

- Use vanilla browser APIs; do not introduce new frameworks unless necessary.
- Attach event listeners with `addEventListener` and keep handlers small.
- Store persistent data in `localStorage` when needed, as seen in `shared.js`.

### CSS/Styling Standards

- Inline styles are used in many HTML files. Keep new styles minimal and consistent with existing markup.
- If larger styling changes are required, create a separate CSS file and reference it from the HTML.

## Testing Requirements for OpenAI Codex

This project does not yet have automated tests or build tooling. Manual testing in a browser is expected for now. If you add Node.js tooling in the future, the typical commands might include:

```bash
npm test         # run unit tests
npm run lint     # check code style
npm run build    # build static assets
```

## Pull Request Guidelines for OpenAI Codex

1. Provide a clear description of the changes and link any relevant issues.
2. Keep PRs focused on a single concern.
3. Ensure all existing functionality continues to work in the browser.
4. Include screenshots or gifs if UI changes are introduced.

## Programmatic Checks for OpenAI Codex

Because there is no current build or test setup, no automated checks are required. If such tooling is added later, ensure it passes before merging changes.
