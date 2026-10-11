# Deploy: Scalingo + Brevo + Simply

Psykologkompasset kører hos **Scalingo** (Frankrig, EU) som en selvstændig app med egen database.
Intet deles med Fagspejlet. Kode: GitHub `MetteDenk/kandidatvalg`, gren `main`.

## 1. App og database hos Scalingo

1. Ny app i regionen **osc-fr1** (Paris), fx med navnet `psykologkompasset`.
2. *Resources*: tilføj **PostgreSQL**, mindste plan. Scalingo sætter selv `SCALINGO_POSTGRESQL_URL`.
3. *Code*: forbind GitHub-repoet `MetteDenk/kandidatvalg`, gren `main`, og slå automatisk udrulning til.
4. *Environment*: tilføj variablerne herunder.
5. Udrul. `Procfile` starter appen (`npm start`) og kører migrationerne efter hver udrulning
   (`postdeploy: npx prisma migrate deploy`).

| Variabel | Værdi |
|---|---|
| `DATABASE_URL` | `$SCALINGO_POSTGRESQL_URL` |
| `APP_URL` | `https://www.psykologkompasset.dk` |
| `MISTRAL_API_KEY` | ny nøgle fra console.mistral.ai, kun til denne app |
| `SMTP_HOST` | `smtp-relay.brevo.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | SMTP-login fra Brevo (*SMTP & API*) |
| `SMTP_PASS` | SMTP-nøgle fra Brevo (*SMTP & API*), kun til denne app |
| `MAIL_FROM` | `Psykologkompasset <noreply@psykologkompasset.dk>` |

Nøglerne indsættes kun i Scalingo, aldrig i git eller i en chat. Slå træning på data fra i Mistrals konsol.

## 2. Domæne hos Scalingo

*Settings > Domains*: tilføj `www.psykologkompasset.dk`. Scalingo udsteder selv certifikatet, når DNS peger rigtigt.

## 3. Afsenderdomæne hos Brevo

*Senders, Domains & Dedicated IPs > Domains*: tilføj `psykologkompasset.dk`. Brevo viser de DNS-poster, der skal
oprettes hos Simply (typisk en `brevo-code`-TXT, DKIM og DMARC). Når de er på plads, trykker man *Verify* hos Brevo.

## 4. DNS hos Simply

| Navn | Type | Værdi |
|---|---|---|
| `www` | CNAME | `<appnavn>.osc-fr1.scalingo.io` |
| `@` (psykologkompasset.dk) | Webomdirigering | til `https://www.psykologkompasset.dk` |
| Brevos poster | TXT/CNAME | som Brevo viser dem i trin 3 |

Ingen proxy foran siden.

## 5. Efter første udrulning

- Log ind med din egen e-mail, og gå guiden igennem.
- Testsvarene kan lægges ind fra Scalingos konsol (`scalingo run`): `npx tsx scripts/indlaes-testsvar.ts din@email.dk`.
- Slå backup af databasen til (følger med Scalingos PostgreSQL-planer).

## Alternativ: container

`Dockerfile` bygger en standalone-container, hvis appen en dag skal køre et andet sted (fx Coolify).
Billederne ligger i databasen, så der skal ikke bruges en fast disk.
