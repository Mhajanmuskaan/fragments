# fragments

Fragments back-end API built with Node.js and Express.

---

# Setup

Install dependencies:

```bash
npm install
```

---

# Scripts

## Lint

Runs ESLint on JavaScript files in the `src/` folder.

```bash
npm run lint
```

---

## Start

Starts the server normally on port `8080`.

```bash
npm start
```

Open in browser:

```text
http://localhost:8080
```

---

## Dev

Starts the server in watch mode and automatically restarts when files change.

```bash
npm run dev
```

This uses `.env.debug`:

```text
FRAGMENTS_LOG_LEVEL=debug
```

---

## Debug

Starts the server in watch mode with the Node debugger enabled on port `9229`.

```bash
npm run debug
```

In VS Code use:

```text
Debug via npm run debug
```

Set a breakpoint in `src/app.js`, then open:

```text
http://localhost:8080
```

---

# Testing the Server

Check API response:

```bash
curl localhost:8080
```

Pretty-print JSON:

```bash
curl -s localhost:8080 | jq
```

Check response headers:

```bash
curl -i localhost:8080
```

Important headers to confirm:

```text
Access-Control-Allow-Origin: *
Cache-Control: no-cache
```

---

# Expected Response

```json
{
  "status": "ok",
  "description": "fragments service running normally",
  "author": "Muskaan Mahajan",
  "githubUrl": "https://github.com/Mhajanmuskaan/fragments",
  "version": "0.0.1"
}
```

---

# WSL Notes

This project should be opened from WSL Ubuntu:

```bash
cd ~/CCP555/fragments
code .
```

VS Code should display:

```text
WSL: Ubuntu
```

in the bottom-left corner.

---

# Project Structure

```text
fragments/
├── src/
│   ├── app.js
│   ├── logger.js
│   └── server.js
├── .vscode/
│   ├── launch.json
│   └── settings.json
├── .env.debug
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── package.json
├── package-lock.json
└── README.md
```
