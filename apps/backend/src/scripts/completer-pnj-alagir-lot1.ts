import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Complétion des fiches PNJ d'Alagir au patron imposé :
 *   genre/race/âge → carrure → visage → VOIX → tics → Rôle → Secret.
 * Tout le lore existant (rôle, secrets, stat-blocks, citations) est repris mot pour mot ;
 * seuls le physique et la voix sont ajoutés. Lot 1/6. Idempotent (marqueur « Voix : »).
 */
type Fiche = { nom: string; sexe?: Sex; desc: string };

const LOT: Fiche[] = [
  {
    nom: '"Le Voileur"',
    desc: `
<p>Race, âge et carrure inconnus. Personne n'ayant survécu à une rencontre, on n'en tient que des silhouettes contradictoires : grand et sec pour les uns, court et large pour les autres. Les deux versions circulent aux Bas-Quais avec la même certitude.</p>
<p>Visage jamais vu. Les rares témoins indirects parlent d'un voile sombre qui ne laisse rien passer, et de <strong>glyphes d'ombre</strong> qui courent sur la peau sous les vêtements, visibles une fraction de seconde quand il traverse une zone éclairée.</p>
<p><strong>Voix :</strong> jamais entendue. Aucun témoignage ne rapporte qu'il ait parlé — ni avant, ni pendant, ni après. Ceux qui prétendent le contraire n'ont jamais pu s'accorder sur ce qu'il aurait dit.</p>
<p><strong>Rôle :</strong> assassin fantôme du <strong>Syndicat d'Alagir</strong>. Tue sans jamais se montrer. Surnommé « <strong>Ombre de Sable</strong> » avec les autres assassins du Syndicat.</p>
`.trim(),
  },
  {
    nom: 'Abbesse Serel',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 58 ans. Petite et ronde, le dos droit malgré les heures d'office ; elle marche les mains jointes devant elle, à petits pas réguliers.</p>
<p>Visage plein et doux, joues rougies par le froid des nefs, cheveux blancs coupés court sous le voile. Yeux bleus délavés, très attentifs, qui ne lâchent pas leur interlocuteur. Une cicatrice fine à la lèvre supérieure, dont elle ne parle pas.</p>
<p><strong>Voix :</strong> chaude et ample, faite pour le chant liturgique et l'acoustique du Grand Temple — elle porte sans effort jusqu'au fond de la nef. Débit lent et scandé, avec une pause après chaque proposition, comme si elle laissait le temps d'acquiescer. Passe au murmure dès qu'elle s'adresse à une seule personne, et c'est là qu'on l'écoute le mieux.</p>
<p><strong>Rôle :</strong> abbesse du <strong>Grand Temple</strong> (Ral &amp; Tal Olena / Tal Odius). Détentrice d'un fragment de vitrail « vivant ».</p>
<p><strong>Capacités notables :</strong> CA 13 · PV 32. Religion +6, Médecine +5.</p>
`.trim(),
  },
  {
    nom: 'Amiro Léovine',
    sexe: 'MAN',
    desc: `
<p>Homme elfe, 214 ans. Grand et décharné, épaules tombantes, mains très longues qu'il tient souvent croisées sous le menton ; il ne s'assied jamais complètement, toujours au bord.</p>
<p>Traits fins et tirés, pommettes hautes, peau grise de quelqu'un qui ne sort plus depuis longtemps. Cheveux blancs coupés net à l'épaule. Yeux d'un bleu très pâle où court parfois un éclat cristallin, comme un reflet pris dans une facette.</p>
<p><strong>Voix :</strong> sèche et précise, sans chaleur, avec le détachement d'un homme qui explique pour la troisième fois quelque chose d'évident. Débit posé, phrases longues et parfaitement construites, jamais une reprise ni un « euh ». Appelle ses interlocuteurs par leur nom complet, systématiquement — y compris <strong>Elerÿna</strong>.</p>
<p><strong>Rôle :</strong> cristomancien, anciennement <strong>Virion Omalee</strong> (V.O.). Précepteur d'Elerÿna ; clones cristallins et expériences Valdris.</p>
`.trim(),
  },
  {
    nom: 'Baronne Alna Vis',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 49 ans. Grande et sèche, port raide de cavalière ; elle s'assoit toujours au bord du siège, dossier jamais touché.</p>
<p>Visage anguleux, nez fort, cheveux auburn tirés en arrière sans une mèche libre. Yeux gris sous des paupières lourdes. Une paire de lorgnons qu'elle chausse pour lire les chiffres et retire pour regarder les gens.</p>
<p><strong>Voix :</strong> nette et métallique, avec l'autorité de quelqu'un qu'on n'interrompt pas deux fois. Débit rapide et sans fioriture : elle annonce les montants avant les noms. Termine ses entretiens par « Nous en resterons là », qui ne souffre pas de réponse.</p>
<p><strong>Rôle :</strong> baronne comptable, directrice de la <strong>Couronne de Platine</strong>. Gère le capital-risque, les dotations nobiliaires et les grands travaux. Très proche des <strong>Cilovard</strong>.</p>
`.trim(),
  },
  {
    nom: 'Bord Amac',
    sexe: 'MAN',
    desc: `
<p>Homme humain, la quarantaine, au ventre généreux qui témoigne d'une vie de bonne chère et de tavernes. Mains calleuses, souvent une tache de goudron sur la paume ou le poignet ; veste de marinier élimée.</p>
<p>Teint rubicond des grands buveurs ; cheveux noirs clairsemés en désordre ; moustache épaisse sous un nez cassé ; yeux marron toujours un peu rieurs.</p>
<p><strong>Voix :</strong> forte et enrouée, avec un rire qui part du ventre et s'entend d'un quai à l'autre. Débit bavard, plein de digressions dont il ne revient pas toujours ; il raconte deux fois la même histoire dans la même soirée sans s'en apercevoir. Jure par « les crues » à tout bout de champ.</p>
<p><strong>Rôle :</strong> contremaître du transport fluvial. Bon vivant, corrompu par le <strong>Syndicat</strong>.</p>
`.trim(),
  },
  {
    nom: 'Boros Varn',
    sexe: 'MAN',
    desc: `
<p>Homme demi-orc, 46 ans. Colossal et compact, le cou aussi large que la mâchoire ; il se tient parfaitement immobile quand il écoute, ce qui inquiète davantage que s'il bougeait.</p>
<p>Peau vert sombre, crâne rasé, défenses inférieures intactes et jaunies. Nez plusieurs fois cassé, jamais remis. Yeux petits et noirs, sans curiosité. Une marque au fer sur la nuque — l'enclume du Conseil.</p>
<p><strong>Voix :</strong> très grave, presque un raclement, qui sort sans que le visage bouge. Débit économe : il répond par trois mots là où deux suffiraient. Ne pose jamais de question. Répète mot pour mot l'ordre qu'on lui donne avant de l'exécuter, comme on scelle un contrat.</p>
<p><strong>Rôle :</strong> commandant de terrain du <strong>Conseil d'Acier</strong>, loyal au-delà du raisonnable. Exécuteur principal des sentences du Conseil. Redoutable combattant, fanatiquement discipliné.</p>
`.trim(),
  },
  {
    nom: 'Capitaine Norven',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 71 ans. Maigre et noueux, le dos voûté par soixante ans de pont — il garde pourtant un équilibre parfait sur un plancher qui bouge, et le perd sur la terre ferme.</p>
<p>Visage tanné et creusé, barbe grise tressée en deux nattes serrées. Yeux bleus délavés, plissés par le sel. Habit de capitaine impeccable malgré l'âge, boutons astiqués chaque matin.</p>
<p><strong>Voix :</strong> éraillée et puissante, réglée pour couvrir le vent — il parle donc trop fort partout ailleurs, et ne s'en rend pas compte. Débit lent, ponctué de silences pendant lesquels il regarde au loin. Emploie un vocabulaire de marine que personne à terre ne comprend, et ne traduit jamais.</p>
<p><strong>Rôle :</strong> capitaine de navire pour le <strong>Syndicat d'Alagir</strong>. On le trouve au <strong>Radeau du Percé</strong>.</p>
`.trim(),
  },
  {
    nom: 'Dame Arinthe',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, d'âge indéterminable — entre trente et cinquante selon la lumière. Grande, d'une beauté statuaire, immobile au point qu'on la prend parfois pour un élément du décor avant qu'elle ne se tourne.</p>
<p>Beauté froide et régulière, teint très pâle, cheveux noirs lisses ramenés en arrière. Yeux trop fixes, qui ne clignent pas assez souvent et mettent mal à l'aise. Toujours en robes de velours noir, jamais un bijou.</p>
<p><strong>Voix :</strong> basse et lente, d'une douceur appliquée ; elle ne dépasse jamais le volume d'une confidence, si bien qu'on se penche vers elle sans l'avoir décidé. Débit très régulier, sans respiration audible entre les phrases. Ne dit jamais « non » : elle dit « pas ce soir ».</p>
<p><strong>Rôle :</strong> maîtresse des lieux à <strong>La Vigne Noire</strong>, pour le <strong>Syndicat d'Alagir</strong>.</p>
`.trim(),
  },
  {
    nom: 'Daren Tovalis',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 54 ans. Large carrure d'ancien contremaître, épaules épaisses mal contenues par des vêtements de politicien ; mains marquées par la pierre, ongles qu'aucun soin n'a rattrapés.</p>
<p>Visage carré et rougeaud, mâchoire lourde, cheveux poivre et sel coupés court. Sourcils broussailleux, yeux marron enfoncés qui jaugent avant de saluer. Une entaille ancienne au menton, souvenir de carrière.</p>
<p><strong>Voix :</strong> puissante et rocailleuse, une voix de chantier qu'il a appris à contenir dans les salons sans jamais tout à fait y parvenir. Débit direct, phrases courtes, aucune formule de politesse superflue. Ponctue ses décisions d'un « voilà qui est dit » après lequel il ne revient pas.</p>
<p><strong>Rôle :</strong> patriarche de la <strong>Maison Tovalis</strong>. Ancien contremaître devenu politicien, fin stratège économique, siège au <strong>Conseil Restreint</strong>. Contrôle 3 000 travailleurs et 8 carrières principales. Motivation : préserver l'équilibre d'Alagir. « <em>Tout se paie, même la loyauté.</em> »</p>
<p><strong>Secret (MJ) :</strong> il a découvert un document prouvant que le Roi n'est pas ce qu'il semble.</p>
`.trim(),
  },
  {
    nom: 'Darn Fer-Vallée',
    sexe: 'MAN',
    desc: `
<p>Homme nain, 34 ans. Trapu et compact, épaules larges, cou court ; il se déplace sans bruit pour sa carrure — une habitude de garde.</p>
<p>Cheveux bruns coupés court, barbe brune taillée net. Yeux verts vifs et mobiles, qui font le tour d'une pièce avant de se poser sur quiconque. Nez droit, teint hâlé.</p>
<p><strong>Voix :</strong> moyenne et claire, plus haut perchée qu'on ne s'y attend chez un nain. Débit prudent et mesuré devant les <strong>Tovalis</strong>, qui se détend d'un coup dès qu'il est entre gens de <strong>La Braise</strong>. Rit par le nez, sans bruit.</p>
<p><strong>Rôle :</strong> garde chez les <strong>Tovalis</strong> et membre de la cellule de <strong>La Braise</strong>. Contact à <strong>La Roue de Secours</strong>, escorte vers le <strong>Palazzo Khaz'Kanoon</strong> et <strong>Harl Denvar</strong>. Frère aîné de <strong>Brynn Fer-Vallée</strong>.</p>
`.trim(),
  },
  {
    nom: 'Donna Ilaria Mastiggia',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, la cinquantaine, aristocrate dolomicienne à l'élégance glaçante. Grande et mince, épaules effacées, port impeccable ; elle ne touche jamais le dossier d'un siège.</p>
<p>Cheveux noirs striés d'argent pris dans une résille de perles d'ambre. Visage long, pommettes hautes, teint poudré. Sourire commercial permanent, qui n'atteint jamais les yeux. Robes de velours sombre, éventail d'os gravé.</p>
<p><strong>Voix :</strong> douce et basse, d'une politesse impeccable qui ne varie pas d'un demi-ton, qu'elle vous serve du thé ou un prix. Débit lent et articulé, avec un léger accent dolomicien sur les voyelles longues. N'emploie jamais le mot « esclave » : elle dit « les effectifs », « la marchandise », « nos engagements ».</p>
<p><strong>Rôle :</strong> matriarche du comptoir Mastiggia d'Alagir (<strong>Larmes d'Ambre</strong>) et visage respectable de la maison. Elle gère la traite d'esclaves <em>légale</em> — autorisée à Alagir, dans les Dolomites et en Gandorenne — connaît chaque clause de la loi et ne se salit jamais les mains. Membre du clan <strong>Izotzargi</strong>, ligne « Chaînes du Sang ».</p>
<p><strong>Secret (MJ) :</strong> les « exportations spéciales » — la revente aux vampires — elle préfère les ignorer et les laisse à <strong>Vittore</strong>.</p>
`.trim(),
  },
  {
    nom: 'Dorian Rigart',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 68 ans. Grand et sec, le dos tenu droit par habitude plus que par force ; mains larges de docker qu'aucune décennie de bureau n'a affinées.</p>
<p>Visage long et creusé, favoris blancs, cheveux clairsemés ramenés en arrière. Yeux gris fatigués, aux paupières tombantes. Teint de quelqu'un qui a passé quarante ans au vent du port.</p>
<p><strong>Voix :</strong> grave et usée, avec un fond d'enrouement permanent. Débit lent ; il commence ses phrases par un raclement de gorge qui lui tient lieu de ponctuation. Parle des quais au présent et de sa société au passé.</p>
<p><strong>Rôle :</strong> père d'<strong>Eldric Rigart</strong> et fondateur des entrepôts des quais d'Alagir (évoqué au discours du port, Partie 5).</p>
`.trim(),
  },
  {
    nom: 'Dovren Sile',
    sexe: 'MAN',
    desc: `
<p>Homme humain d'âge indéterminable — entre quarante et soixante-dix selon le jour. Grand et très mince, immobile, les mains jointes devant lui ; personne ne l'a jamais vu s'asseoir.</p>
<p>Visage lisse et sans marque, traits réguliers qu'on oublie en sortant de la boutique. Cheveux argentés impeccablement coiffés. Costume noir sans le moindre ornement. Yeux dont aucun témoin ne s'accorde sur la couleur.</p>
<p><strong>Voix :</strong> calme, presque inaudible — et pourtant elle résonne à l'intérieur du crâne plutôt qu'à l'oreille. Débit d'une lenteur absolue, sans respiration entre les phrases, sans jamais monter ni descendre. « <em>Les sons sont des dettes. Je préfère le silence des transactions parfaites.</em> »</p>
<p><strong>Rôle :</strong> tient <strong>Le Cabinet du Silence</strong>.</p>
<p><strong>Secret (MJ) :</strong> rumeur tenace — il serait une illusion consciente créée par le magasin lui-même.</p>
`.trim(),
  },
  {
    nom: 'Edran Voss',
    sexe: 'MAN',
    desc: `
<p>Homme gnome, 62 ans. Petit et sec, perpétuellement penché en avant ; il travaille debout et se déplace en trottinant, sans jamais marcher vraiment.</p>
<p>Crâne rasé, sourcils roux broussailleux, lunettes à triple lentille qu'il fait pivoter sans y penser. Tablier de cuir brûlé par endroits. <strong>Bras gauche automate</strong>, couvert de glyphes — animé par l'âme de son apprenti, mort dans une explosion.</p>
<p><strong>Voix :</strong> haut perchée et nasillarde, débitée à une vitesse qui décourage l'interruption ; il finit les phrases des autres et enchaîne sur la sienne. Change de sujet en plein milieu et revient au premier trois minutes plus tard comme s'il ne l'avait jamais quitté. « <em>Non, pas ce flacon-là, il boude. Prenez celui qui tremble un peu, il aime les aventuriers.</em> »</p>
<p>Certains soirs, le bras automate écrit seul, dans une langue oubliée.</p>
<p><strong>Rôle :</strong> tient <strong>L'Œil d'Étain</strong>.</p>
`.trim(),
  },
];

async function main() {
  let faits = 0;
  for (const f of LOT) {
    const pnj = await prisma.personOfInterest.findFirst({ where: { name: f.nom }, select: { id: true, description: true } });
    if (!pnj) { console.log(`⚠ introuvable : ${f.nom}`); continue; }
    if ((pnj.description ?? '').includes('<strong>Voix :</strong>')) { console.log(`· ${f.nom.padEnd(28)} déjà complété`); continue; }

    await prisma.personOfInterest.update({
      where: { id: pnj.id },
      data: { description: f.desc, ...(f.sexe ? { sex: f.sexe } : {}) },
    });
    console.log(`✓ ${f.nom.padEnd(28)} complété${f.sexe ? ` (sexe: ${f.sexe})` : ''}`);
    faits++;
  }
  console.log(`\n${faits} fiche(s) complétée(s) sur ${LOT.length}.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
