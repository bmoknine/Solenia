import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Audit des descriptions de PNJ contre le patron imposé :
 *   1. genre / race / âge — 2. carrure — 3. visage — 4. voix — 5. tics
 * Les archétypes et unités (« Acolyte Pourpre », « Garde (x12) »…) sont exclus :
 * la règle du MJ interdit de leur inventer un physique.
 */
const texte = (s?: string | null) => (s ?? '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

/** Archétype : pluriel chiffré, « type », ou rôle générique sans nom propre. */
function estArchetype(nom: string): boolean {
  return /\(x\s*\d+\)|\btype\b|^(Soldat|Garde|Archer|Acolyte|Fantassin|Vétéran|Éclaireur|Cavalier|Guerrier|Prêtre déchu|Adeptus|Lame|Porte-Flamme|Inquisiteur|Fanatique|Gardien|Officier|Milicien|Marin|Docker|Brigand|Bandit|Mercenaire|Assassin|Espion|Voleur|Mage|Villageois|Paysan|Serviteur|Esclave)\b/i.test(nom);
}

/** Une race ET un âge dans les 160 premiers caractères, quelle que soit la tournure. */
const RACES = 'humaine?|elfe|demi-elfe|nain[e]?|halfelin[e]?|demi-orc|drakéide|gnome|tieffelin[e]?|aasimar|genasi|goliath|orque?';
const aOuverture = (t: string) => {
  const tete = t.slice(0, 160);
  return new RegExp(`\\b(${RACES})\\b`, 'i').test(tete) && /(~|environ\s*)?\d+\s*ans|\bla (quarantaine|cinquantaine|soixantaine|trentaine)\b/i.test(tete);
};
const aVoix = (t: string) => /\bvoix\b|\btimbre\b|\bdébit\b|\baccent\b|\bbégai|\bélocution\b|\bphrasé\b|\bmuet\b|\bparle (?:bas|fort|peu|vite|lentement)/i.test(t);
const aVisage = (t: string) => /\bvisage\b|\btraits\b|\byeux\b|\bregard\b|\bcheveux\b|\bbarbe\b|\bteint\b/i.test(t);
const aCarrure = (t: string) => /\bcarrure\b|\btrapu|\bmassif|\bmenue?\b|\bsec\b|\bsèche\b|\bgrand[e]?\b|\bpetit[e]?\b|\bmaigre\b|\blarge\b|\bélancé|\bcourt[e]? et|\bstature\b|\bcorpulen|\bvoûté|\blongiligne\b|\bimmense\b|\bcharpenté/i.test(t);

async function main() {
  const tous = await prisma.personOfInterest.findMany({
    select: { id: true, name: true, description: true, breed: true, fp: true },
    orderBy: { name: 'asc' },
  });

  const nommes = tous.filter((p) => !estArchetype(p.name));
  const archetypes = tous.filter((p) => estArchetype(p.name));

  const vide: string[] = [];
  const sansVoix: string[] = [];
  const sansOuverture: string[] = [];
  const sansVisage: string[] = [];
  const sansCarrure: string[] = [];
  const complets: string[] = [];

  for (const p of nommes) {
    const t = texte(p.description);
    if (t.length < 40) { vide.push(p.name); continue; }
    const manques: string[] = [];
    if (!aOuverture(t)) { sansOuverture.push(p.name); manques.push('ouverture'); }
    if (!aCarrure(t)) { sansCarrure.push(p.name); manques.push('carrure'); }
    if (!aVisage(t)) { sansVisage.push(p.name); manques.push('visage'); }
    if (!aVoix(t)) { sansVoix.push(p.name); manques.push('voix'); }
    if (manques.length === 0) complets.push(p.name);
  }

  console.log('═══ AUDIT DES DESCRIPTIONS PNJ ═══');
  console.log(`PNJ en base       : ${tous.length}`);
  console.log(`  archétypes/unités (exclus) : ${archetypes.length}`);
  console.log(`  individus nommés           : ${nommes.length}`);
  console.log('');
  console.log(`Conformes au patron complet  : ${complets.length}`);
  console.log(`Description vide ou quasi    : ${vide.length}`);
  console.log(`Sans ouverture genre/race/âge: ${sansOuverture.length}`);
  console.log(`Sans carrure                 : ${sansCarrure.length}`);
  console.log(`Sans visage                  : ${sansVisage.length}`);
  console.log(`Sans voix                    : ${sansVoix.length}`);

  console.log('\n── Conformes (voix comprise) ──');
  console.log('  ' + (complets.join(', ') || 'aucun'));

  console.log('\n── Descriptions vides ou quasi vides ──');
  console.log('  ' + (vide.join(', ') || 'aucune'));

  // Les fiches « bien faites sauf la voix » : ouverture + carrure + visage mais pas de voix
  const justeLaVoix = nommes.filter((p) => {
    const t = texte(p.description);
    return t.length >= 40 && aOuverture(t) && aCarrure(t) && aVisage(t) && !aVoix(t);
  });
  console.log(`\n── Complètes SAUF la voix (${justeLaVoix.length}) ──`);
  justeLaVoix.forEach((p) => console.log(`  · ${p.name}`));

  // Les fiches incomplètes au-delà de la voix
  const incompletes = nommes.filter((p) => {
    const t = texte(p.description);
    return t.length >= 40 && !(aOuverture(t) && aCarrure(t) && aVisage(t));
  });
  console.log(`\n── Incomplètes au-delà de la voix (${incompletes.length}) ──`);
  incompletes.forEach((p) => {
    const t = texte(p.description);
    const m = [!aOuverture(t) && 'ouverture', !aCarrure(t) && 'carrure', !aVisage(t) && 'visage'].filter(Boolean);
    console.log(`  · ${p.name.padEnd(34)} manque: ${m.join(', ')}  (${t.length} car.)`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
