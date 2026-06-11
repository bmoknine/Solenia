/**
 * Extrait personnages, lieux, organisations et sections depuis Partie 5.md
 * Usage: tsx src/scripts/extract-partie5.ts [chemin/vers/Partie\ 5.md]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_INPUT = join(process.env.HOME ?? '', 'Downloads', 'Partie 5.md');
const OUT_DIR = join(__dirname, '../../DriveSolenia/extracted');
const OUT_FILE = join(OUT_DIR, 'partie5-entities.json');

const BOLD_SKIP = new Set([
  'Contexte',
  'Déroulement',
  'Récompenses',
  'Dilemme / Révélation',
  'Effets possibles',
  'Note MJ',
  'Description',
  'Éléments clés',
  'Éléments de jeu',
  'Traits',
  'Actions',
  'Mort',
  'Effet',
  'Classe d\'armure',
  'Points de vie',
  'Vitesse',
  'Jets de sauvegarde',
  'Compétences',
  'Sens',
  'Langues',
  'Puissance',
  'Bonus de maîtrise',
  'Châtiment Divin',
  'Contexte**',
  'premiers Tovalis',
]);

const PERSON_SKIP = /^(Le|La|Les|Un|Une|Des|Il|Elle|Ils|Pour|Dans|Après|Avant|Cette|Cela|Radius|Régalio)$/i;

type Extracted = {
  source: string;
  persons: { name: string; context: string }[];
  places: { name: string; context: string }[];
  organisations: { name: string; context: string }[];
  sections: { level: number; title: string }[];
  loreTitles: { title: string; level: number }[];
  markdownLinks: { label: string; context: string }[];
};

function cleanTitle(raw: string): string {
  return raw
    .replace(/\*\*/g, '')
    .replace(/\\([.!])/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[\s#👑👻🪨🐲🌊⚖️🧱🕯️⚒️🩸🔥🧩🎭✨🐛🪲🧬]+\s*/u, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
}

function isLikelyPerson(name: string): boolean {
  if (name.length < 4 || name.length > 55) return false;
  if (BOLD_SKIP.has(name)) return false;
  if (/^\d|PX|DD |d\d|\+/.test(name)) return false;
  if (/^(Acte|Étape|Salle|Partie|Side|Storyline)/i.test(name)) return false;
  const words = name.split(/\s+/);
  if (words.length < 2 || words.length > 5) return false;
  if (!/^[A-ZÀ-Ü]/.test(words[0])) return false;
  if (PERSON_SKIP.test(words[0])) return false;
  // Éviter les titres de quêtes longs
  if (name.includes('—') && name.length > 40) return false;
  if (/\(/.test(name) && name.length > 35) return false;
  return true;
}

function isLikelyPlace(name: string): boolean {
  if (name.length < 3 || name.length > 80) return false;
  if (/^(Acte|Étape|Salle [IVX]+|Partie)/i.test(name)) return false;
  if (/Traits|Actions|Contexte/i.test(name)) return false;
  const placeHints =
    /^(Le |La |Les |L'|Palazzo|Domaine|Comptoir|Crypte|Conservatoire|Carrières|Atelier|Laboratoire|Château|Citadelle|Port |Quartier|Maison |Marché|Temple|Hôtel|Auberge|Taverne|Guilde|Banque|Place |Manoir|Salle |Galerie|Bastion|Rotonde|Four |Cercle|Dépôt|Cour |Docks|Entrepôt|Arène|Bureau|Oratoire|Grand )/i;
  return placeHints.test(name) || /d'Alagir|d’Alagir|Pourpre|Écarlate|Zitris|Odius/i.test(name);
}

function isLikelyOrg(name: string): boolean {
  return /^(Famille|Maison|Le |La |Les |L'|Clan |Guilde|Compagnie|Syndicat|Conseil|Ligature|Braise|Œil|Soleil)/i.test(name) && name.length < 60;
}

function addUnique<T extends { name: string }>(list: T[], item: T): void {
  if (!item.name?.trim()) return;
  const key = item.name.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  if (list.some((x) => x.name.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '') === key)) return;
  list.push(item);
}

function extract(text: string): Extracted {
  const lines = text.split(/\r?\n/);
  const result: Extracted = {
    source: 'Partie 5.md',
    persons: [],
    places: [],
    organisations: [],
    sections: [],
    loreTitles: [],
    markdownLinks: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const context = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3)).join(' ').slice(0, 400);

    const header = line.match(/^(#{1,4})\s+(.+)$/);
    if (header) {
      const level = header[1].length;
      const title = cleanTitle(header[2]);
      if (title.length > 2 && title.length < 120) {
        result.sections.push({ level, title });
        if (level <= 3 && !title.startsWith('Partie')) {
          result.loreTitles.push({ title, level });
        }
        if (level >= 2 && level <= 4 && isLikelyPlace(title)) {
          addUnique(result.places, { name: title, context });
        }
      }
    }

    for (const m of line.matchAll(/\[([^\]]{2,80})\]\([^)]+\)/g)) {
      const label = m[1].trim();
      if (label.length > 2 && !label.startsWith('http')) {
        addUnique(result.markdownLinks, { label, context });
        if (isLikelyPlace(label) || /^La |^Le |^Les /i.test(label)) {
          addUnique(result.places, { name: label, context });
        }
      }
    }

    for (const m of line.matchAll(/\*\*([^*]{2,60})\*\*/g)) {
      const name = m[1].trim().replace(/\\\./g, '.');
      if (BOLD_SKIP.has(name)) continue;
      if (isLikelyOrg(name)) {
        addUnique(result.organisations, { name, context });
      } else if (isLikelyPerson(name)) {
        addUnique(result.persons, { name, context });
      }
    }

    for (const m of line.matchAll(
      /(?:^|[\s,])(Famille|Maison|Clan|Guilde|Compagnie)\s+([A-ZÀ-Ü][\w’'\-]+(?:\s+[A-ZÀ-Ü][\w’'\-]+){0,3})/g,
    )) {
      const name = `${m[1]} ${m[2]}`.trim();
      addUnique(result.organisations, { name, context });
    }

    for (const m of line.matchAll(
      /(?:taverne|palazzo|domaine|comptoir|atelier|laboratoire|conservatoire|crypte)\s+(?:[«"'])?([A-ZÀ-Ü][^«"',\n.]{2,50})/gi,
    )) {
      const name = m[1]?.trim();
      if (name && name.length > 2) addUnique(result.places, { name, context });
    }
  }

  return result;
}

function main() {
  const inputPath = process.argv[2] ?? DEFAULT_INPUT;
  console.log(`📖 Lecture : ${inputPath}`);
  const text = readFileSync(inputPath, 'utf8');
  const data = extract(text);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n✅ Extraction écrite : ${OUT_FILE}`);
  console.log(`   Personnages : ${data.persons.length}`);
  console.log(`   Lieux       : ${data.places.length}`);
  console.log(`   Organisations : ${data.organisations.length}`);
  console.log(`   Sections    : ${data.sections.length}`);
  console.log(`   Liens MD    : ${data.markdownLinks.length}`);
}

main();
