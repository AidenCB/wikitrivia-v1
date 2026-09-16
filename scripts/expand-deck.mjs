import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import badCards from "../lib/bad-cards.ts";

// Pin both inputs so rerunning this import produces the same deck.
const sourceCommit = "134654a372131a8d4145df8a4d76041d673cdf3c";
const response = await fetch(
  `https://raw.githubusercontent.com/michaelclarkcuadrado/wikitrivia-classic/${sourceCommit}/public/items.json.gz`
);
if (!response.ok)
  throw new Error(`Snapshot download failed: ${response.status}`);
const compressed = Buffer.from(await response.arrayBuffer());
if (
  createHash("sha256").update(compressed).digest("hex") !==
  "aab7eda9e0672daf859d91a8917fe00257f8c17adf06183a26054cfad5ddbfcb"
) {
  throw new Error("Snapshot checksum changed");
}
const snapshot = JSON.parse(gunzipSync(compressed).toString("utf8"));
const baseline = execFileSync(
  "git",
  ["show", "b398872bcd231a8ead09fca39a8cbf3968894d6c:public/items.json"],
  { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
).trim();
const original = baseline.split("\n").map((line) => JSON.parse(line));
const ids = new Set(original.map((item) => item.id));

// Prefer subjects with a concrete discovery, release, opening, or event date.
// Deliberately omit countries, religions, genres, and fictional people.
const categories = new Set([
  "chemical element",
  "exoplanet",
  "space probe",
  "space mission",
  "space telescope",
  "artificial satellite",
  "space station",
  "film",
  "video game",
  "television series",
  "animated television series",
  "novel",
  "painting",
  "sculpture",
  "opera",
  "ballet",
  "manga series",
  "programming language",
  "operating system",
  "mobile operating system",
  "website",
  "web browser",
  "mobile app",
  "video game console",
  "museum",
  "art museum",
  "national museum",
  "national park",
  "National Park of the United States",
  "stadium",
  "skyscraper",
  "road bridge",
  "suspension bridge",
  "railway station",
  "opera house",
  "astronomical observatory",
  "war",
  "battle",
  "peace treaty",
  "earthquake",
  "volcanic eruption",
  "World's fair",
]);
const dateProperties = new Set([
  "P571",
  "P575",
  "P580",
  "P577",
  "P1619",
  "P1191",
  "P6949",
]);
const additions = [];
for (const row of snapshot.rows) {
  const item = {
    id: `Q${row[0]}`,
    label: row[1],
    year: row[2],
    description: row[3],
    image: row[4],
    wikipedia_title: row[5] || row[1],
    date_prop_id: snapshot.dicts.date_prop_id[row[6]],
    instance_of: row[7].map((index) => snapshot.dicts.instance_of[index]),
    occupations:
      row[8] === null
        ? null
        : row[8].map((index) => snapshot.dicts.occupations[index]),
  };
  if (
    !/^Q\d+$/.test(item.id) ||
    !Number.isInteger(item.year) ||
    [
      item.label,
      item.description,
      item.image,
      item.wikipedia_title,
      item.date_prop_id,
    ].some((value) => typeof value !== "string") ||
    item.instance_of.some((value) => typeof value !== "string")
  )
    throw new Error(`Invalid snapshot card: ${item.id}`);
  if (
    ids.has(item.id) ||
    item.id in badCards ||
    !item.image ||
    item.id === "Q104822312" || // Snapshot has a disputed pre-release year.
    item.year > 2025 ||
    item.year < -100000 ||
    item.instance_of.includes("human") ||
    !item.instance_of.some((category) => categories.has(category)) ||
    !dateProperties.has(item.date_prop_id) ||
    item.label.includes(String(item.year)) ||
    item.description.includes(String(item.year)) ||
    /(?:th|st|nd|rd)[ -]century/i.test(item.description)
  )
    continue;
  ids.add(item.id);
  additions.push(item);
}
additions.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
writeFileSync(
  "public/items.json",
  `${baseline}\n${additions.map((item) => JSON.stringify(item)).join("\n")}\n`
);
console.log(
  `Preserved ${original.length} original cards; added ${
    additions.length
  }; total ${original.length + additions.length}.`
);
