/**
 * One-shot: brings the copy back in line with what Callaz actually offers.
 *
 * The first draft claimed six European markets and six languages. The owner
 * confirmed neither is true: it is Denmark, in Danish and English. Every sentence
 * built on the wider claim is rewritten here, and the metric labels change with
 * them, because "1 market" as a headline figure argues against itself.
 *
 * Idempotent: each pair is an exact string, so a second run is a no-op.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/messages/", import.meta.url));

const edits = {
  da: {
    site: [
      ["Callaz — callcenter til Norden og DACH", "Callaz — callcenter i Kolding"],
      [
        "Callaz laver de opkald, din egen afdeling ikke når: mødebooking, telefonsalg, kundeservice og leadgenerering på seks europæiske markeder og seks sprog.",
        "Callaz laver de opkald, din egen afdeling ikke når: mødebooking, telefonsalg, kundeservice og leadgenerering til danske virksomheder, på dansk og engelsk.",
      ],
      [
        "Indgående opkald og opfølgning på seks sprog, fra overløb til hele frontlinjen, uden at I skal ansætte flere.",
        "Indgående opkald og opfølgning på dansk og engelsk, fra overløb til hele frontlinjen, uden at I skal ansætte flere.",
      ],
      [
        "Et callcenter stiftet i Kolding, bygget til udgående arbejde i Norden og DACH. Registrerede oplysninger, værdier og adresser.",
        "Et callcenter stiftet i Kolding, bygget til udgående arbejde på det danske marked. Registrerede oplysninger, værdier og adresse.",
      ],
      ["Indgående opkald på seks sprog", "Indgående opkald på dansk og engelsk"],
      [
        "Et callcenter bygget i Danmark, som ringer i Norden og DACH på det sprog, kunden svarer på.",
        "Et callcenter i Kolding, som ringer til danske virksomheder på dansk og engelsk.",
      ],
      // Coverage section, rewritten around depth rather than breadth.
      ["Dækning", "Marked og sprog"],
      [
        "Seks markeder og det sprog, kunden svarer på",
        "Ét marked, og vi kender det",
      ],
      [
        "En dansker tager telefonen for en dansker, og en tysker for en tysker. Det er hele pointen i at drive en flersproget afdeling frem for en engelsk, og derfor skriver vi kun et marked på, når vi rent faktisk kan bemande det.",
        "Vi ringer i Danmark, på dansk og engelsk. Det er et bevidst valg frem for at sprede sig tyndt: vi kender kundetyperne, indvendingerne og reglerne her, og vi skriver ikke et marked på hjemmesiden, som vi ikke kan bemande.",
      ],
      ["Sprog i afdelingen", "Sprog vi ringer på"],
      // Metric labels for the two figures that replaced the counts.
      ["Markeder vi ringer til", "Af samtaler optages"],
      ["Sprog vi leverer på", "Opsigelsesvarsel"],
    ],
    home: [
      [
        "Callaz laver de opkald, jeres eget team ikke når. Mødebooking, telefonsalg, kundeservice og leadgenerering på seks europæiske markeder, leveret af mennesker, der taler det sprog, kunden svarer på.",
        "Callaz laver de opkald, jeres eget team ikke når. Mødebooking, telefonsalg, kundeservice og leadgenerering til danske virksomheder, leveret af et navngivet team fra Kolding.",
      ],
      ["Seks sprog", "Dansk og engelsk"],
      [
        "Dansk, engelsk, svensk, norsk, tysk og tyrkisk tales i afdelingen",
        "Dansk og engelsk tales i afdelingen",
      ],
      [
        "Remote-stillinger til modersmålstalende uden for Danmark",
        "Base på kontoret i Kolding",
      ],
    ],
    solutions: [
      ["\"Seks sprog\"", "\"Dansk og engelsk\""],
      ["\"title\": \"Seks sprog\"", "\"title\": \"Dansk og engelsk\""],
      [
        "Dansk, engelsk, svensk, norsk, tysk og tyrkisk, besvaret af nogen, der rent faktisk taler det.",
        "Begge sprog besvaret af nogen, der rent faktisk taler dem, så en engelsktalende kunde ikke ender i en dansk kø.",
      ],
      [
        "I sælger i flere lande, men bemander til ét",
        "I får opkald på engelsk, men bemander kun til dansk",
      ],
    ],
    pages: [
      [
        "Registreret i Danmark, ringer i Europa",
        "Registreret i Kolding, ringer i hele Danmark",
      ],
      [
        "Den registrerede adresse er i Kolding. Kampagneteams arbejder derfra og remote, afhængigt af hvilket sprog en kampagne kræver.",
        "Den registrerede adresse er i Kolding, og det er også der, kampagnerne køres fra. Vi ringer i hele landet.",
      ],
    ],
    careers: [
      [
        "Dansk, engelsk, svensk, norsk, tysk og tyrkisk bliver alle brugt. Et ekstra sprog flytter dig til bedre kampagner og bedre løn.",
        "Vi kører kampagner på dansk og engelsk. Er du stærk på begge, åbner det flere kampagner og bedre løn.",
      ],
      ["Sprog er en fordel her", "Engelsk er en fordel her"],
      [
        "Remote, hvor det giver mening",
        "Kontor i Kolding",
      ],
      [
        "Stillinger til modersmålstalende på markeder uden for Danmark er remote fra starten, med udstyr og systemer stillet til rådighed.",
        "Vi sidder sammen i Kolding. Det er nemmere at lære telefonarbejde, når man kan høre kollegaen ved siden af tage samtalen.",
      ],
    ],
  },

  en: {
    site: [
      ["Callaz — outbound contact centre for the Nordics and DACH", "Callaz — contact centre in Kolding, Denmark"],
      [
        "Callaz runs outbound calling for B2B teams: appointment setting, outbound sales, customer service and lead generation across six European markets in six languages.",
        "Callaz runs outbound calling for B2B teams in Denmark: appointment setting, outbound sales, customer service and lead generation, in Danish and English.",
      ],
      [
        "Inbound and follow-up handling in six languages, from overflow cover to a full front line, without lengthening your own payroll.",
        "Inbound and follow-up handling in Danish and English, from overflow cover to a full front line, without lengthening your own payroll.",
      ],
      [
        "A contact centre founded in Kolding, Denmark, built for outbound work across the Nordics and DACH. Registered facts, values and locations.",
        "A contact centre founded in Kolding, built for outbound work in the Danish market. Registered facts, values and address.",
      ],
      ["Inbound cover in six languages", "Inbound cover in Danish and English"],
      [
        "An outbound contact centre built in Denmark, working across the Nordics and DACH in the language the customer answers in.",
        "An outbound contact centre in Kolding, calling Danish businesses in Danish and English.",
      ],
      ["Coverage", "Market and languages"],
      [
        "Six markets, and the language the customer answers in",
        "One market, and we know it",
      ],
      [
        "A Dane picks up for a Dane and a German for a German. That is the whole point of running a multilingual floor rather than an English one, and it is why we only list a market when we can staff it properly.",
        "We call in Denmark, in Danish and English. That is a deliberate choice over spreading thin: we know the buyer types, the objections and the rules here, and we do not put a market on the website that we cannot staff.",
      ],
      ["Languages on the floor", "Languages we call in"],
      ["Markets we call into", "Of calls recorded"],
      ["Languages delivered", "Notice period"],
    ],
    home: [
      [
        "Callaz runs the calls your team does not have time to make. Appointment setting, outbound sales, customer service and lead generation across six European markets, delivered by people who speak the language the customer answers in.",
        "Callaz runs the calls your team does not have time to make. Appointment setting, outbound sales, customer service and lead generation for Danish businesses, delivered by a named team in Kolding.",
      ],
      ["Six languages", "Danish and English"],
      [
        "Danish, English, Swedish, Norwegian, German and Turkish spoken on the floor",
        "Danish and English spoken on the floor",
      ],
      [
        "Remote roles for native speakers outside Denmark",
        "Based in the Kolding office",
      ],
    ],
    solutions: [
      ["\"Six languages\"", "\"Danish and English\""],
      ["\"title\": \"Six languages\"", "\"title\": \"Danish and English\""],
      [
        "Danish, English, Swedish, Norwegian, German and Turkish, answered by someone who actually speaks it.",
        "Both answered by someone who actually speaks them, so an English-speaking customer does not land in a Danish queue.",
      ],
      [
        "You sell into several countries but staff for one",
        "You get calls in English but staff only for Danish",
      ],
    ],
    pages: [
      [
        "Registered in Denmark, calling across Europe",
        "Registered in Kolding, calling across Denmark",
      ],
      [
        "The registered office is in Kolding. Campaign teams work from there and remotely, depending on the language a campaign needs.",
        "The registered office is in Kolding, and that is where the campaigns are run from. We call nationwide.",
      ],
    ],
    careers: [
      [
        "Danish, English, Swedish, Norwegian, German and Turkish are all worked in. A second language moves you into better campaigns and better pay.",
        "Campaigns run in Danish and English. Being strong in both opens more campaigns and better pay.",
      ],
      ["Languages are an asset here", "English is an asset here"],
      ["Remote where it makes sense", "An office in Kolding"],
      [
        "Native-speaker roles for markets outside Denmark are remote by design, with equipment and systems provided.",
        "We sit together in Kolding. Phone work is easier to learn when you can hear the colleague next to you take the call.",
      ],
    ],
  },
};

let applied = 0;
let missed = 0;

for (const [locale, files] of Object.entries(edits)) {
  for (const [file, pairs] of Object.entries(files)) {
    const path = `${root}${locale}/${file}.json`;
    const original = readFileSync(path, "utf8");
    let next = original;

    for (const [from, to] of pairs) {
      if (next.includes(from)) {
        next = next.split(from).join(to);
        applied += 1;
      } else if (!next.includes(to)) {
        console.warn(`  ! ${locale}/${file}: not found — ${from.slice(0, 60)}…`);
        missed += 1;
      }
    }

    if (next !== original) {
      JSON.parse(next);
      writeFileSync(path, next);
    }
  }
}

console.log(`\n${applied} replacement(s) applied, ${missed} not found.`);
