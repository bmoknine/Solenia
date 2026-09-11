import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ALAGIR_CITY_ID = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const CHAMBELLAN_NAME = 'Chambellan Aldric Vorréal';

// ── Descriptions (format imposé : genre/race/âge → carrure → visage → particularités) ──
const CHAMBELLAN_DESC = `
<p>Homme humain, environ 52 ans. Sec et de taille moyenne, maintien rigide de haut fonctionnaire, gestes économes.</p>
<p>Visage étroit et glabre, front dégarni, cheveux gris coupés court ; yeux gris pâle au regard fixe et patient. Voix posée, presque douce.</p>
<p>Toujours ganté de sombre, chaîne d'office au col, un petit carnet de cuir qu'il n'ouvre jamais en public.</p>
<p><strong>Rôle :</strong> chambellan de la Cour, dépêché au Bal Tovalis pour porter les excuses du <strong>Roi Pelfort, officiellement souffrant</strong>. Courtois et protocolaire, il transmet les vœux de la Couronne… et observe.</p>
<p><strong>Secret (MJ) :</strong> relais du <strong>Soleil Pourpre</strong>. Sous couvert d'excuses royales, il jauge les trois Maisons, mémorise propos et alliances, et en rend compte. Insigne pourpre dissimulé dans la doublure ; sa mémoire est trop parfaite pour être naturelle.</p>
`.trim();

const VITTORE_MARKER = 'Bal Tovalis (Soir 1)';
const VITTORE_APPEND = `\n<p><strong>Bal Tovalis (Soir 1) :</strong> présent comme <strong>émissaire de la maison Mastiggia</strong>, sous les dehors d'un marchand dolomicien venu « nouer des contrats ».</p>`;

const INVITES_TITLE = 'Les invités du Bal — les trois Maisons';
const INVITES_DESC = `Toutes les grandes Maisons d'Alagir sont représentées au Palazzo Khaz'Kanoon. L'intendant Pellione annonce chaque entrée. Les PJ croiseront, au fil de la soirée :

Maison Cilovard (finance / marchand)
- Garran Cilovard — patriarche, courtois et guindé.
- Lady Velena Cilovard — épouse, comptable glaciale.
- Lorian Cilovard — fils aîné, commerce maritime.
- Ismara Cilovard — fille cadette, la « conscience » de la famille.
- Alliés : Merr Luth (nain, Le Poids Juste), Eldric Rigart (jeune héritier allié).

Maison Tovalis (hôtes — carriers / fluvial)
- Daren Tovalis — patriarche et hôte du bal.
- Maerin Tovalis — héritière, transport fluvial.
- Velric Tovalis — fils cadet, rebelle.
- Ordan Tovalis — porte-parole, maître de cérémonie officieux.
- Escorte / gardes : Darn Fer-Vallée (peut faire entrer les PJ), Harl Denvar, Cryta.
- Contremaîtres conviés : Derrik Holmar, Jesa Tolvine, Bord Amac (déjà éméché), Tarn Vess.
- Brynn Fer-Vallée — présente en marge, glissée par son frère Darn (naïve, peu à sa place).

Maison Palhindile (diplomatie / elfique)
- Lady Serenya Palhindile — matriarche, Chancelière d'Alagir.
- Lord Calen Palhindile — époux, érudit voûté.
- Selianne Palhindile — héritière, Cour des Ambassades.
- Lior Palhindile — mage archiviste.
- Nimra — elfe androgyne, La Verrière Fendue.

Invités d'honneur
- ${CHAMBELLAN_NAME} — envoyé de la Couronne pour excuser l'absence du Roi, dit souffrant. (MJ : œil du Soleil Pourpre.)
- Vittore Mastiggia — émissaire de la maison Mastiggia (marchand dolomicien).
- Lysanne Orfe — « courtière en obligations » : façade mondaine du Conseil d'Acier, venue rappeler leurs échéances aux trois Maisons.`;

const URNE_TITLE = 'Le tirage de l’urne — le plan de table';
const URNE_DESC = `À l'entrée du banquet, une grande urne de marbre attend les convives : chacun y tire un jeton numéroté qui désigne sa place — donc son voisin de table. Faites tirer chaque PJ (jeton, ou 1d20) : il dîne aux côtés du convive portant ce numéro. Deux PJ peuvent partager la même tablée.

Ce qu'on glane selon le voisin (ordre tiré au sort) :

1. Ismara Cilovard — sincère, rongée par un secret comptable de sa propre Maison ; confidente potentielle.
2. Ordan Tovalis — grandiloquent ; renseigne sur qui est qui dans la salle.
3. Lady Serenya Palhindile — Chancelière ; éclaire la politique d'Alagir — ses carnets de nuit trahissent, sans le savoir, les convois nocturnes vers la Citadelle Rouge.
4. Vittore Mastiggia — onctueux ; propose des « contrats de main-d'œuvre » troubles (façade esclavagiste).
5. Velric Tovalis — paris et combats illégaux ; porte d'entrée vers le milieu.
6. Lord Calen Palhindile — vieux diplomate ; laisse entendre qu'il détient une correspondance compromettante de son temps d'ambassadeur.
7. Garran Cilovard — guindé, sous une tension étrange ; un PJ perspicace sent le malaise (lien latent au Roi).
8. Bord Amac — éméché, il se lâche : convois nocturnes vers la Citadelle Rouge, inspecteurs « en pourpre ».
9. Selianne Palhindile — Cour des Ambassades ; carnet d'introductions, ouvre des portes.
10. Daren Tovalis — hôte méfiant ; sa rancœur contre la Couronne perce sous la courtoisie.
11. ${CHAMBELLAN_NAME} — langue de bois sur la « santé » du Roi ; un PJ attentif note qu'il observe et mémorise tout.
12. Lorian Cilovard — commerce maritime ; contacts portuaires, contrebande possible.
13. Sipha la Liseuse d'Ombres — diseuse du bal ; le voisinage vaut un présage gratuit (voir la péripétie dédiée).
14. Maerin Tovalis — laisse filer que des barges sont réquisitionnées la nuit sur le fleuve.
15. Lior Palhindile — nerveux ; laisse échapper l'existence d'une dalle gravée d'un plan des souterrains, sous son atelier.
16. Lady Velena Cilovard — glaciale ; teste la valeur des PJ, évoque des registres « à l'encre rouge ».
17. Harl Denvar — garde de Daren, vétéran du Soleil Pourpre ; peu bavard, mais ses silences en disent long.
18. « Bœuf-de-Pierre » — colosse de fête jovial et bruyant ; défis de force à la clé (voir la péripétie dédiée).
19. Merr Luth — nain honnête (Le Poids Juste) ; bon baromètre des prix et des rumeurs de marché.
20. Derrik Holmar — contremaître des carrières Nord ; franc du collier, ragots d'atelier et griefs sociaux.`;

async function main() {
  const log: string[] = [];

  // ── PARTIE 1.1 — Chambellan (agent du Soleil Pourpre) ──────────────
  const vanguard = await prisma.organisation.findFirst({
    where: { name: { contains: 'Vanguard', mode: 'insensitive' } },
    select: { id: true, name: true },
  });

  let chambellan = await prisma.personOfInterest.findFirst({ where: { name: CHAMBELLAN_NAME } });
  if (!chambellan) {
    chambellan = await prisma.personOfInterest.create({
      data: {
        name: CHAMBELLAN_NAME,
        description: CHAMBELLAN_DESC,
        breed: 'HUMAIN',
        sex: 'MAN',
        membership: 'POLITIC',
        STR: 10, DEX: 11, CON: 11, INT: 15, WIS: 14, CHA: 15,
        pv: 22, ca: 12, fp: '1',
        cityId: ALAGIR_CITY_ID,
        showOnMap: false,
        isForDM: false,
      },
    });
    log.push(`Chambellan créé : ${chambellan.name} (${chambellan.id})`);
  } else {
    log.push(`Chambellan déjà présent : ${chambellan.name} (${chambellan.id})`);
  }

  if (vanguard) {
    const link = await prisma.organisationMember.findFirst({
      where: { organisationId: vanguard.id, personId: chambellan.id },
    });
    if (!link) {
      await prisma.organisationMember.create({
        data: { organisationId: vanguard.id, personId: chambellan.id },
      });
      log.push(`Chambellan rattaché à ${vanguard.name}.`);
    } else {
      log.push(`Chambellan déjà rattaché à ${vanguard.name}.`);
    }
  } else {
    log.push('⚠ Maison Vanguard introuvable — chambellan non rattaché.');
  }

  // ── PARTIE 1.2 — Vittore Mastiggia = émissaire présent ─────────────
  const vittore = await prisma.personOfInterest.findFirst({
    where: { name: { contains: 'Vittore Mastiggia', mode: 'insensitive' } },
  });
  if (vittore) {
    if (!(vittore.description ?? '').includes(VITTORE_MARKER)) {
      await prisma.personOfInterest.update({
        where: { id: vittore.id },
        data: { description: (vittore.description ?? '') + VITTORE_APPEND },
      });
      log.push('Vittore Mastiggia : note de présence au bal ajoutée.');
    } else {
      log.push('Vittore Mastiggia : note de présence déjà présente.');
    }
  } else {
    log.push('⚠ Vittore Mastiggia introuvable.');
  }

  // ── PARTIE 1.3/1.4 — Nouvelles étapes du Bal ───────────────────────
  const bal = await prisma.quest.findFirst({
    where: { title: { contains: 'Bal', mode: 'insensitive' } },
    select: { id: true, title: true },
  });
  if (!bal) throw new Error('Quête « Bal » introuvable.');

  async function ensureStep(title: string, description: string) {
    let step = await prisma.questStep.findFirst({ where: { questId: bal!.id, title } });
    if (!step) {
      step = await prisma.questStep.create({
        data: { questId: bal!.id, title, description, optional: false, order: 999 },
      });
      log.push(`Étape créée : « ${title} ».`);
    } else {
      await prisma.questStep.update({ where: { id: step.id }, data: { description } });
      log.push(`Étape déjà présente (description mise à jour) : « ${title} ».`);
    }
    return step;
  }

  await ensureStep(INVITES_TITLE, INVITES_DESC);
  await ensureStep(URNE_TITLE, URNE_DESC);

  // ── PARTIE 1.5 — Réordonner : invités après « Arrivée », urne avant « Le banquet » ──
  const steps = await prisma.questStep.findMany({
    where: { questId: bal.id },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, title: true },
  });
  const news = steps.filter((s) => s.title === INVITES_TITLE || s.title === URNE_TITLE);
  const base = steps.filter((s) => s.title !== INVITES_TITLE && s.title !== URNE_TITLE);
  const invites = news.find((s) => s.title === INVITES_TITLE)!;
  const urne = news.find((s) => s.title === URNE_TITLE)!;

  const sequence: { id: string; title: string }[] = [];
  for (const s of base) {
    if (s.title === 'Le banquet') sequence.push(urne); // urne juste avant le banquet
    sequence.push(s);
    if (s.title === 'Arrivée & présentation') sequence.push(invites); // invités juste après l'arrivée
  }
  // Filet de sécurité si un titre d'ancrage a changé
  if (!sequence.some((s) => s.id === invites.id)) sequence.push(invites);
  if (!sequence.some((s) => s.id === urne.id)) sequence.push(urne);

  for (let i = 0; i < sequence.length; i++) {
    await prisma.questStep.update({ where: { id: sequence[i].id }, data: { order: i } });
  }
  log.push('Étapes du Bal réordonnées :');
  sequence.forEach((s, i) => log.push(`   ${String(i).padStart(2)} · ${s.title}`));

  // ── PARTIE 2 — Ordre des campagnes (Un oeuf… en premier) ───────────
  const camps = await prisma.campaign.findMany({ select: { id: true, name: true } });
  const egg = camps.find((c) => /oeuf|œuf/i.test(c.name));
  const others = camps.filter((c) => c !== egg);
  if (egg) {
    await prisma.campaign.update({ where: { id: egg.id }, data: { order: 0 } });
    let n = 1;
    for (const c of others) {
      await prisma.campaign.update({ where: { id: c.id }, data: { order: n++ } });
    }
    log.push(`Campagnes réordonnées : « ${egg.name} » en premier (order 0).`);
  } else {
    log.push('⚠ Campagne « Un oeuf… » introuvable.');
  }

  // ── PARTIE 3 — Villes : icône Village → Ville Fortifiée ─────────────
  const upd = await prisma.city.updateMany({
    where: { iconUrl: '/Icon/village.png' },
    data: { iconUrl: '/Icon/fortified-city.png' },
  });
  const remaining = await prisma.city.count({ where: { iconUrl: '/Icon/village.png' } });
  log.push(`Villes basculées Village → Ville Fortifiée : ${upd.count} (restantes sur Village : ${remaining}).`);

  console.log('\n===== RÉSUMÉ =====');
  log.forEach((l) => console.log(l));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
