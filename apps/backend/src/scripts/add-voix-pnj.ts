import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Ajoute le paragraphe « Voix » (ton / rythme / particularités) aux fiches PNJ que j'ai
 * rédigées, conformément au patron imposé : genre-race-âge → carrure → visage → VOIX → tics.
 * Le paragraphe s'insère après le visage. Quelques fiches mentionnaient déjà la voix au
 * milieu du visage : on l'en retire pour ne pas dire deux fois la même chose.
 * Idempotent : une fiche contenant déjà « Voix : » est ignorée.
 */
type Fiche = {
  nom: string;
  voix: string;
  /** Index du paragraphe après lequel insérer (défaut 1 = après le visage). */
  apres?: number;
  /** Remplace le paragraphe à cet index au lieu d'insérer. */
  remplace?: number;
  /** Bribes de voix à retirer d'un paragraphe existant. */
  nettoyer?: { de: string; vers: string }[];
};

const FICHES: Fiche[] = [
  {
    nom: 'Core Belan',
    voix: "<p><strong>Voix :</strong> ténor clair et chaud, qu'il pose très bas quand il parle — on se surprend à se pencher pour l'entendre, ce qu'il sait parfaitement. Débit lent, avec des silences qu'il laisse durer un temps de trop. En chantant, le timbre monte d'une octave et se charge d'un léger écho qui ne vient d'aucune salle. Dit « mon bon » à tout le monde, y compris à ceux qu'il déteste.</p>",
  },
  {
    nom: 'Sabine Quenot',
    voix: "<p><strong>Voix :</strong> de rogomme, éraillée par quarante ans de vapeur et de fumée de cambuse ; elle porte d'un bout à l'autre de la salle sans qu'elle ait besoin de crier. Débit en rafales courtes, presque des ordres, avec un temps d'arrêt avant chaque chiffre. Bascule dans le nain pour jurer, et personne n'a jamais osé lui demander la traduction.</p>",
  },
  {
    nom: 'Grazh',
    // Son paragraphe « Muet » tenait déjà ce rôle : on le remplace par la version complète.
    remplace: 2,
    voix: "<p><strong>Voix :</strong> aucune — on lui a coupé la langue. Il ne produit que des sons de gorge : un grondement bas et long pour l'assentiment, deux notes brèves pour le refus, un souffle par le nez quand quelque chose l'amuse. Il comprend parfaitement le commun et l'orc mais ne lit ni n'écrit ; il s'exprime par gestes et en frappant du plat de la main sur le chambranle — un coup pour « entre », deux pour « dehors ». <strong>Miravosk</strong> est le seul à le comprendre couramment. Salue les habitués d'un hochement, et regarde les inconnus jusqu'à ce qu'ils détournent les yeux.</p>",
  },
  {
    nom: 'Miravosk',
    voix: "<p><strong>Voix :</strong> grave et rocailleuse, usée par la fumée et le mauvais vin ; elle part dans les aigus quand il s'emporte, ce qui ne lui arrive presque jamais. Débit pâteux le matin, de plus en plus fluide à mesure que la journée avance. Ponctue ses phrases d'un « voilà » qui ne conclut rien. Ne prononce jamais le prénom de sa femme à voix haute : il dit « elle », et toute la maison a compris.</p>",
  },
  {
    nom: 'Rany Mullimax',
    voix: "<p><strong>Voix :</strong> basse et posée, qui ne monte jamais — c'est le silence qui suit qui fait peur. Débit régulier, sans une hésitation, avec des pauses placées là où d'autres mettraient une menace. Ne répète jamais une phrase : si on ne l'a pas entendue, c'est qu'on n'écoutait pas.</p>",
    nettoyer: [{
      de: ' Voix basse et posée, qui ne monte jamais — c’est le silence qui suit qui fait peur.',
      vers: '',
    }, {
      de: " Voix basse et posée, qui ne monte jamais — c'est le silence qui suit qui fait peur.",
      vers: '',
    }],
  },
  {
    nom: 'Tessa Kaorn',
    voix: "<p><strong>Voix :</strong> fluette et parfaitement nette, sans chaleur ; elle articule chaque syllabe comme on coche une case. Débit lent et régulier, avec une pause avant le verbe, si bien qu'on attend toujours la fin de sa phrase. Ne hausse jamais le ton — quand elle est en colère, elle parle simplement encore plus lentement.</p>",
  },
  {
    nom: 'Wilherm Cadenet',
    voix: "<p><strong>Voix :</strong> mince et chevrotante, souvent enrouée par le froid des caves ; il s'éclaircit la gorge entre deux phrases. Débit lent et monocorde, celui d'un homme qui lit à haute voix même quand il improvise — sauf sur les chiffres, qu'il énonce d'un trait, sans reprendre son souffle et sans se tromper. S'interrompt au milieu d'un mot dès qu'on ouvre une porte derrière lui.</p>",
  },
  {
    nom: 'Lysanne Orfe',
    voix: "<p><strong>Voix :</strong> claire et cultivée, d'un timbre agréablement bas, sans l'accent d'aucun quartier. Débit fluide et sans accroc, comme récité — elle ne cherche jamais un mot. Termine ses phrases sur une note montante qui transforme chaque constat en question polie, et rend un refus très difficile à formuler.</p>",
  },
  {
    nom: 'Capitaine Sorne Vask',
    voix: "<p><strong>Voix :</strong> raclée, presque soufflée — le garrot lui a abîmé la gorge et il ne dépasse jamais le volume d'une conversation, même pour donner un ordre. Débit haché, par groupes de trois ou quatre mots. Ses hommes se taisent pour l'entendre, et ça lui tient lieu d'autorité. Tousse entre ses phrases quand il a trop parlé.</p>",
    nettoyer: [{ de: ' — il parle bas, la voix raclée.', vers: '.' }],
  },
  {
    nom: 'Hulda Brasefer',
    voix: "<p><strong>Voix :</strong> énorme, faite pour couvrir un marteau sur l'enclume, et elle ne la baisse pour personne. Rit au milieu de ses propres phrases, souvent avant la fin. Roule les « r » à la manière des vieux clans et sème dans le commun des jurons nains que personne ne lui traduit. Devient très basse et très lente quand elle parle de ses armes — c'est le seul moment où on l'écoute vraiment.</p>",
  },
  {
    nom: 'Orane Ferrand',
    voix: "<p><strong>Voix :</strong> haut perchée et rapide, un peu essoufflée, comme si elle parlait en marchant — ce qui est souvent le cas. Débit en avalanche : elle entame trois idées avant d'en finir une, coupe la parole sans s'en apercevoir et s'en excuse toujours après coup. Baisse d'un ton et ralentit brutalement quand elle ment.</p>",
    nettoyer: [{ de: ' Parle vite, coupe la parole sans s’en apercevoir.', vers: '' }, { de: " Parle vite, coupe la parole sans s'en apercevoir.", vers: '' }],
  },
  {
    nom: 'Odon Pince',
    voix: "<p><strong>Voix :</strong> grave et douce, étonnamment posée pour sa carrure — il parle comme on s'excuse, et c'est précisément ce qui met mal à l'aise. Débit lent, phrases courtes, beaucoup de « vous » et de formules apprises. Ne hausse jamais le ton : quand ça se gâte, il parle plus bas et plus lentement encore.</p>",
  },
  {
    nom: 'Chambellan Aldric Vorréal',
    voix: "<p><strong>Voix :</strong> posée, presque douce, d'une neutralité soigneusement travaillée — aucun accent, aucune région, aucune classe. Débit égal et lent, avec une courte pause avant chaque nom propre, comme s'il le rangeait quelque part en le prononçant. Ne dit jamais « je » : il dit « la Couronne ».</p>",
    nettoyer: [{ de: ' Voix posée, presque douce.', vers: '' }],
  },
];

const decouper = (html: string) => html.match(/<p>[\s\S]*?<\/p>/g) ?? [];

async function main() {
  let modifies = 0;
  for (const f of FICHES) {
    const pnj = await prisma.personOfInterest.findFirst({ where: { name: f.nom }, select: { id: true, description: true } });
    if (!pnj) { console.log(`⚠ introuvable : ${f.nom}`); continue; }

    let desc = pnj.description ?? '';
    if (desc.includes('<strong>Voix :</strong>')) { console.log(`· ${f.nom.padEnd(28)} déjà pourvu d'une voix`); continue; }

    for (const n of f.nettoyer ?? []) desc = desc.replace(n.de, n.vers);

    const paras = decouper(desc);
    if (paras.length < 3) { console.log(`⚠ ${f.nom} : structure inattendue (${paras.length} paragraphes)`); continue; }

    if (f.remplace !== undefined) paras[f.remplace] = f.voix;
    else paras.splice((f.apres ?? 1) + 1, 0, f.voix);

    await prisma.personOfInterest.update({ where: { id: pnj.id }, data: { description: paras.join('\n') } });
    console.log(`✓ ${f.nom.padEnd(28)} voix ${f.remplace !== undefined ? 'intégrée' : 'insérée'} (${paras.length} paragraphes)`);
    modifies++;
  }

  console.log(`\n${modifies} fiche(s) modifiée(s) sur ${FICHES.length}.`);

  // Contrôle : plus aucune bribe de voix résiduelle dans les paragraphes de visage
  const noms = FICHES.map((f) => f.nom);
  const apres = await prisma.personOfInterest.findMany({ where: { name: { in: noms } }, select: { name: true, description: true } });
  const sansVoix = apres.filter((p) => !(p.description ?? '').includes('<strong>Voix :</strong>'));
  const doublons = apres.filter((p) => ((p.description ?? '').match(/Voix\s*:/g) ?? []).length > 1);
  console.log(`Fiches sans paragraphe Voix : ${sansVoix.map((p) => p.name).join(', ') || 'aucune'}`);
  console.log(`Fiches mentionnant la voix deux fois : ${doublons.map((p) => p.name).join(', ') || 'aucune'}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
