# Deploy: Hetzner + Coolify + PostgreSQL

Psykologkompasset kører som en **separat app** i Coolify med egen database. Fagspejlets app, database og
domæne røres ikke.

## 1. Git-repo

Opret et nyt, privat repo (fx `psykologkompasset`) og push denne mappe til det. Ikke Fagspejlets repo.

## 2. DNS for psykologkompasset.dk

| Post | Type | Værdi |
|---|---|---|
| `psykologkompasset.dk` | A | serverens IP |
| `www.psykologkompasset.dk` | A | serverens IP |

Ingen wildcard. Kandidatsiderne ligger som stier: `www.psykologkompasset.dk/<navn>`.
Ingen proxy (fx Cloudflare) foran siden.

## 3. Database

Ny PostgreSQL-ressource i Coolify, kun til denne app. Migrationerne i `prisma/migrations/` køres automatisk ved
opstart (`prisma migrate deploy` i Dockerfilen).

## 4. App i Coolify

- Ny ressource fra repoet, build pack: **Dockerfile**, port 3000.
- Domæner: `https://www.psykologkompasset.dk` med omdirigering fra `https://psykologkompasset.dk`.
- Persistent volume: mount `/data` (billeder).
- Miljøvariabler:
  - `DATABASE_URL` fra trin 3
  - `APP_URL=https://www.psykologkompasset.dk`
  - `MISTRAL_API_KEY` (sættes af ejeren, aldrig i git). Slå træning på data fra i Mistrals konsol
  - `SMTP_HOST/PORT/USER/PASS` hos en EU-udbyder og `MAIL_FROM="Psykologkompasset <noreply@psykologkompasset.dk>"`
  - `UPLOAD_DIR=/data/uploads`
- Afsenderdomænet skal sættes op hos mailudbyderen (SPF og DKIM for psykologkompasset.dk).

## 5. Efter første deploy

- Log ind med din egen e-mail, og kør guiden igennem.
- Testsvarene kan lægges ind fra Coolify-terminalen: `npx tsx scripts/indlaes-testsvar.ts din@email.dk`.
- Slå automatisk backup af databasen og `/data` til i Coolify.
