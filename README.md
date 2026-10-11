# Psykologkompasset

Hjemmesider til kandidater ved personvalget i Dansk Psykolog Forening (GF27). Kandidaten bliver ledt gennem
spørgsmål i en guide, vælger sidens opbygning, layout, farver og billeder, og får sine stikord skrevet om til
tekst i sit eget sprog. Forløbet følger Fagspejlets Skitse-vej, men **kodebasen er helt selvstændig**: eget repo,
egen database, eget domæne. Intet deles med Fagspejlet.

Domæne indtil videre: **www.psykologkompasset.dk**. Hosting: Scalingo (EU). Kode: GitHub `MetteDenk/kandidatvalg`. Grundlaget står i `../Flow_skitse_v0.1.md` og `../Spoergsmaal_v0.3.md`.

## Kom i gang lokalt

```bash
npm install
cp .env.example .env
docker compose up -d db          # Postgres på port 5434
npx prisma migrate deploy
npm run dev                      # http://localhost:3100
```

Uden SMTP logges login-links i konsollen. Uden `MISTRAL_API_KEY` vises kandidatens stikord uændret i stedet for
omskrevet tekst.

Testsvarene fra 11/10-2026 kan lægges ind på en bruger: `npm run testsvar -- din@email.dk`.

## Opbygning

| Fil | Indhold |
|---|---|
| `lib/indhold.ts` | Emnerne A-M, spørgsmålene, sektioner, undersider og kandidatens data (`KandidatData`) |
| `lib/design.ts` | 4 layouts, 9 paletter, 4 typografier |
| `components/Guide.tsx` | Guiden med de 13 trin og visningen af den færdige side (ret, offentliggør, del kladde, lad ligge, fjern) |
| `components/KandidatSide.tsx` | Kandidatsiden. Bruges både som forhåndsvisning og som offentlig side |
| `lib/ai/tekster.ts` | Fra stikord til tekst med Mistral. Kun felter med nye eller ændrede stikord skrives om |
| `app/guide/actions.ts` | Autogemning, "Lav min side", rettelser, offentliggørelse, delelink og sletning |
| `app/[slug]/` | Den offentlige side: `/<navn>`, `/<navn>/mine-maerkesager`, `/om-mig`, `/kontakt` |
| `app/kladde/` | Kladden via hemmeligt delelink: `/kladde/<delelink>`. Kun læseadgang, ingen login, ikke i søgemaskiner. Kontaktformularen sender ikke |
| `app/site-actions.ts` | Kontaktformularen. Beskeden sendes til kandidaten og gemmes ikke |

Genbrugt fra Fagspejlet ved kopiering (ikke deling): login med link på mail (`lib/auth.ts`), mailer, Mistral-klienten,
fonte og paletter/typografier. Billeder ligger i databasen (tabellen `Billede`).

## Tekster og rettelser

Hver tekst gemmes med de stikord, den er lavet ud fra (`kilde`). Ændrer kandidaten et stikord, vises stikordet,
indtil "Lav min side" køres igen, og kun det felt skrives om. En rettelse direkte på siden gælder, så længe
stikordet er det samme.

## Drift

Se `docs/DEPLOY.md`.
