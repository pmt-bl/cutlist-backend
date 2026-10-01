# Cutlist Backend — Setup Guide

You already have PostgreSQL and VS Code, so this walks through everything
between "empty folder" and "server running locally," explaining what each
piece does as you go.

## 1. Put the files in place

Open this `cutlist-backend` folder in VS Code. It already contains:

```
cutlist-backend/
├─ package.json        ← lists the project's dependencies and scripts
├─ tsconfig.json        ← tells TypeScript how to compile your code
├─ .env.example          ← template for secrets (copy, don't commit)
├─ .gitignore
├─ prisma/
│   └─ schema.prisma    ← your database tables, in Prisma's schema language
└─ src/
    ├─ index.ts          ← the Express server entry point
    └─ lib/prisma.ts     ← shared database client
```

**Why this matters:** Separating `src/` (your code) from config files at the
root is a convention, not a requirement — but following common conventions
makes any project instantly navigable to another developer (or to you, in six
months).

## 2. Install Node.js dependencies

In the VS Code terminal (`` Ctrl+` `` / `` Cmd+` ``), from inside the folder:

```bash
npm install
```

**What this does:** Reads `package.json` and downloads every listed library
into a `node_modules` folder. This is why `node_modules` is in `.gitignore` —
it's regenerated from `package.json` on any machine, so it never needs to be
committed.

## 3. Create the database

You already have PostgreSQL running. Create an empty database for this
project:

```bash
createdb cutlist
```

(If `createdb` isn't on your PATH, you can do the equivalent from `psql`:
`CREATE DATABASE cutlist;`)

**Why this matters:** Prisma will manage *tables* inside this database for
you, but it expects the database itself to already exist.

## 4. Configure your secrets

```bash
cp .env.example .env
```

Then open `.env` and:
- Update `DATABASE_URL` with your actual Postgres username/password if they
  differ from the default (`postgres`/`postgres`).
- Replace `JWT_SECRET` with a real random value. You can generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Why this matters:** This is the step from the design doc's "secrets"
section made concrete. `.env` is already in `.gitignore` — double check with
`git status` later that it never shows up as a file to be committed.

## 5. Create the database tables

```bash
npx prisma migrate dev --name init
```

**What this does:** Reads `prisma/schema.prisma`, generates the SQL needed to
create matching tables in your `cutlist` database, runs it, and also
generates Prisma's type-safe query client based on the schema. Every time you
change `schema.prisma` later, you'll re-run this command with a new
`--name` describing the change (e.g. `--name add-skills-field`).

You can visually confirm it worked with:

```bash
npx prisma studio
```

This opens a browser-based table viewer — a good way to get comfortable with
what your schema actually produced.

## 6. Run the server

```bash
npm run dev
```

You should see `Cutlist backend listening on http://localhost:4000`. Visit
`http://localhost:4000/health` in a browser or with `curl` — you should get
back `{"status":"ok"}`.

**Why this matters:** This route has no database calls and no auth — it
exists purely so you can confirm the server itself starts correctly, isolated
from any other moving part. Whenever something breaks later, checking
`/health` first tells you whether the problem is "the server won't start" or
"something inside a specific route."

## What's next

With this running, the next step is section 4 of the design doc: building
`POST /auth/register` and `POST /auth/login`, and the `requireAuth`
middleware. Say the word when you're ready and we'll write those together,
one piece at a time.
