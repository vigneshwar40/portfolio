# Portfolio Project

A standalone React portfolio built with Vite, TypeScript, Tailwind CSS, and Framer Motion.

## Local development

```sh
npm install
cp .env.example .env
npm run dev
```

## Admin editing (creator only)

In-app editing is disabled for visitors. Only the portfolio owner can unlock the admin panel after entering a passcode.

1. Copy `.env.example` to `.env`
2. Set `VITE_ADMIN_PASSCODE_HASH` to the SHA-256 hash of your passcode:

```sh
node -e "const c=require('crypto'); console.log(c.createHash('sha256').update('your-secret-passcode').digest('hex'))"
```

3. Restart the dev server after changing `.env`

**Unlock admin:**

- Press `Ctrl+Shift+A`, or
- Click the navbar logo five times within two seconds

After signing in, use the settings button to edit portfolio content. Sessions last 24 hours.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
- `npm test` — run tests

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion
- React Three Fiber (skills sphere)
- React Router

## Default content

Edit `src/config/portfolio.ts` for baseline content, or use the admin panel after unlocking creator access.
