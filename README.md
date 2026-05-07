# fragments

Backend API project built using Node.js and Express.

## Install Dependencies

```bash
npm install
```

## Run ESLint

```bash
npm run lint
```

Checks JavaScript files inside the `src` folder for linting errors.

## Start the Server

```bash
npm start
```

Runs the server normally on port 8080.

Open in browser:

```text
http://localhost:8080
```

## Development Mode

```bash
npm run dev
```

Starts the server in watch mode and automatically restarts when files are changed.

Uses environment variables from `.env.debug`.

## Debug Mode

```bash
npm run debug
```

Starts the server in debug mode using the Node inspector.

To debug in VS Code:
- open Run and Debug
- select `Debug via npm run debug`
- add breakpoints in `src/app.js`

## Test API

Basic test:

```bash
curl localhost:8080
```

Check headers:

```bash
curl -i localhost:8080
```

Pretty-print JSON response:

```bash
curl -s localhost:8080 | jq
```

## Notes

Project is developed using WSL Ubuntu.

Open project using:

```bash
cd ~/CCP555/fragments
code .
```

VS Code should show `WSL: Ubuntu` in the bottom-left corner.
