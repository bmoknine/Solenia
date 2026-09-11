import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Reste du monde, lot 4 — les quatre dernières fiches. */
type Fiche = { nom: string; sexe?: Sex; desc: string };
const RACE_NC = '<p><em>Note MJ : sa race n\'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>';

const LOT: Fiche[] = [
  {
    nom: 'Vedast Bolger',
    desc: `
<p>Homme halfelin, 67 ans. Petit et rond, l'air d'un boulanger de village ; il enseigne assis sur un tabouret haut, les pieds ballants.</p>
<p>Visage joufflu et avenant, joues roses. Cheveux bruns bouclés grisonnants, pieds velus soigneusement peignés. Yeux marron chaleureux derrière des besicles rondes. Tablier de dissection impeccablement propre, ce qui est plus troublant que l'inverse.</p>
<p><strong>Voix :</strong> claire et enjouée, d'une bonhomie totalement inadaptée au sujet — il commente une éviscération du ton dont on donne une recette. Débit rapide et chantant, avec des « voilà, voilà » de satisfaction à chaque étape réussie. Ne hausse jamais le ton : quand un étudiant rate, il soupire, et c'est pire.</p>
<p><strong>Rôle :</strong> professeur à la <strong>Nécrole</strong> de Brodnica.</p>
`.trim(),
  },
  {
    nom: 'Vieille Yenna',
    desc: `
<p>Femme naine ancienne (~150 ans), le dos voûté par des décennies de travail du cuir. Ne quitte jamais sa tente sans son établi portatif.</p>
<p>Mains couvertes de cicatrices fines et de cals. Cheveux blancs tressés d'aiguilles à coudre en os. Visage profondément ridé, yeux plissés à force de travailler au fil.</p>
<p><strong>Voix :</strong> éraillée et basse, avec le chuintement d'une bouche à laquelle il manque des dents. Débit lent et bougon, entrecoupé de commentaires sur la qualité de ce qu'on lui apporte — « c'est pas du travail, ça » revient souvent. Elle ne dit jamais qu'un objet est irréparable : elle annonce un prix si élevé que le client renonce lui-même.</p>
<p><strong>Inventaire</strong> (prix en po) : cape de fourrure d'hiver (résistance au froid) 20 po ; armure de cuir clouté, qualité tribale, 45 po ; sac à dos en peau tannée (capacité augmentée) 12 po ; réparation d'un objet en cuir, peau ou plume, 5 à 15 po selon l'ampleur — <em>elle peut réparer et entretenir la cape de plumes de pégase si le groupe la ramène endommagée</em> ; bottes fourrées (avantage aux JS contre le froid extrême) 18 po ; tente individuelle en peau imperméabilisée 30 po.</p>
`.trim(),
  },
  {
    nom: 'Ymal Kinemor',
    desc: `
<p>Homme, 26 ans, membre de la famille royale <strong>Kinemor</strong>. Grand et maigre, les épaules en avant ; il paraît toujours vouloir quitter la pièce.</p>
<p>Visage pâle et étroit, traits juvéniles. Cheveux blond cendré fins, coiffés sans conviction. Yeux bleu pâle fuyants. Les ongles rongés jusqu'au sang, que les gants de cour dissimulent mal.</p>
<p><strong>Voix :</strong> faible et hésitante, avec l'accent pointu momoritanien mal assuré — on l'entend se corriger en cours de mot. Débit haché, plein de reprises et de « pardon, je voulais dire » ; il s'excuse d'avoir la parole. Une seule exception : lorsqu'il récite, et là le débit devient parfait, fluide et sans accroc.</p>
<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Zulban GardeBarbe',
    desc: `
<p>Homme, 59 ans. Court et massif, enveloppé de robes sombres trop lourdes ; il se tient une demi-longueur derrière <strong>Snakha</strong> et ne s'assoit jamais avant lui.</p>
<p>Visage large, teint gris. <strong>Barbe</strong> noire striée de blanc, très fournie, tressée en une natte unique glissée dans la ceinture — d'où son nom. Crâne chauve. Yeux noirs enfoncés, attentifs, qui surveillent la pièce plutôt que l'interlocuteur.</p>
<p><strong>Voix :</strong> grave et sourde, volontairement effacée ; il parle bas pour que l'on se concentre sur son maître. Débit lent et prudent, uniquement quand on l'interroge, et jamais plus que la réponse exacte. Les incantations, en revanche, il les prononce d'une voix claire et forte qui surprend à chaque fois.</p>
<p><strong>Rôle :</strong> mage personnel de <strong>Snakha</strong>, chef du <strong>Syndicat</strong> à Brodnica.</p>
${RACE_NC}
`.trim(),
  },
];

async function main() {
  let faits = 0;
  for (const f of LOT) {
    const pnj = await prisma.personOfInterest.findFirst({ where: { name: f.nom }, select: { id: true, description: true } });
    if (!pnj) { console.log(`⚠ introuvable : ${f.nom}`); continue; }
    if ((pnj.description ?? '').includes('<strong>Voix :</strong>')) { console.log(`· ${f.nom.padEnd(26)} déjà complété`); continue; }
    await prisma.personOfInterest.update({ where: { id: pnj.id }, data: { description: f.desc, ...(f.sexe ? { sex: f.sexe } : {}) } });
    console.log(`✓ ${f.nom.padEnd(26)} complété${f.sexe ? ` (sexe: ${f.sexe})` : ''}`);
    faits++;
  }
  console.log(`\n${faits} fiche(s) complétée(s) sur ${LOT.length}.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
