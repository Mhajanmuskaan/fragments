# fragments# fragments

Fragments back-end API built with Node.js and Express.

## Setup

Install dependencies:

```bash
npm install
Scripts
Lint

Runs ESLint on JavaScript files in the src/ folder.

npm run lint
Start

Starts the server normally on port 8080.

npm start

Open:

http://localhost:8080
Dev

Starts the server in watch mode and restarts automatically when files change.

npm run dev

This uses .env.debug:

FRAGMENTS_LOG_LEVEL=debug
Debug

Starts the server in watch mode with the Node debugger enabled on port 9229.

npm run debug

In VS Code, use:

Debug via npm run debug

Set a breakpoint in src/app.js, then open:

http://localhost:8080
Testing the Server

Check the API response:

curl localhost:8080

Pretty-print JSON:

curl -s localhost:8080 | jq

Check headers:

curl -i localhost:8080

Important headers to confirm:

Access-Control-Allow-Origin: *
Cache-Control: no-cache
Expected Response
{
  "status": "ok",
  "description": "fragments service running normally",
  "author": "Muskaan Mahajan",
  "githubUrl": "https://github.com/Mhajanmuskaan/fragments",
  "version": "0.0.1"
}
WSL Notes

This project should be opened from WSL Ubuntu:

cd ~/CCP555/fragments
code .

VS Code should show:

WSL: Ubuntu
