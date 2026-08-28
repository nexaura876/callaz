# Korrekturlæsning af den danske tekst

Tak fordi du vil læse det igennem. Du behøver ikke røre ved kode, og du kan ikke
komme til at ødelægge noget.

Al teksten står i filen **`da-korrektur.csv`**. Åbn den i Excel, Numbers eller
Google Sheets.

---

## Sådan gør du

Arket har seks kolonner:

| Kolonne | Hvad den er til |
| ------- | --------------- |
| **NR** | Løbenummer. Brug det, hvis du vil skrive en kommentar om en bestemt linje. |
| **SIDE** | Hvor på hjemmesiden teksten står. |
| **URL** | Adressen på den side, så du kan se teksten i sin sammenhæng. |
| **NUVÆRENDE TEKST** | Sådan står der i dag. |
| **RETTELSE (skriv her)** | **Den eneste kolonne, du skal skrive i.** |
| **NØGLE** | Teknisk reference. Lad den være. |

1. Læs kolonnen **NUVÆRENDE TEKST**.
2. Er sætningen i orden, så lad **RETTELSE** stå tom.
3. Er den ikke, så skriv hele den rettede sætning i **RETTELSE**. Ikke kun det
   ord, der er galt — hele sætningen, som den bør lyde.
4. Gem filen som CSV, og send den tilbage.

Det er alt. Tomme felter betyder "den er fin", så du behøver kun røre de linjer,
der faktisk fejler noget.

---

## To ting, der er værd at vide

**Skriv hele sætningen.** Hvis der står

> I ved hvem der ringer for jer

så skriv i RETTELSE-kolonnen:

> I ved, hvem der ringer for jer

og ikke bare "der mangler et komma". Så kan rettelsen sættes direkte ind uden at
nogen skal gætte.

**Teksten er skrevet af en, der ikke har dansk som modersmål.** Der er allerede
rettet et par hundrede kommafejl, men tonen kan stadig være skæv nogle steder.
Skriv gerne om en sætning, hvis den er korrekt men lyder forkert. Det er
mindst lige så nyttigt som stavefejlene.

---

## Hvis du hellere vil se siden først

Adresserne i URL-kolonnen er relative. Sæt dem efter adressen på testsiden, du
har fået, altså for eksempel `.../loesninger/moedebooking`.

Teksterne på tværs af flere sider — menuen, sidefoden, formularen, cookiebanneret
— står øverst i arket under SIDE-navne som "Menuen" og "Sidefoden".

---

## Til den, der skal sætte rettelserne ind

Læg den udfyldte fil tilbage som `da-korrektur.csv` i projektmappen, og kør:

```bash
node scripts/apply-review.mjs
```

Det viser, hvad der vil blive ændret, uden at ændre noget. Ser det rigtigt ud:

```bash
node scripts/apply-review.mjs --write
npm run verify
```

Scriptet nægter at skrive, hvis en tekst er blevet ændret på siden, efter arket
blev eksporteret, så to personer ikke kan komme til at overskrive hinanden. Skulle
det ske, så eksportér på ny med `node scripts/export-review.mjs` og indsæt
rettelserne i det friske ark.
