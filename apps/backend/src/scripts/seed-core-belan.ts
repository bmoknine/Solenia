import { PrismaClient, type Language } from '@prisma/client';

const prisma = new PrismaClient();

/** Core Belan — barde aasimar de maison de La Loutre SAOUL (Bas-Quais, Alagir). Idempotent. */
const ALAGIR = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const CHANT_TAL_TARIS = 'cd218e67-1630-4948-a3e2-585a884aee96';
const LOUTRE = '57210a91-4e46-40ee-9e76-a6abd07189b1';

const DESCRIPTION = `
<p>Homme aasimar, 34 ans. Longiligne et souple, épaules étroites, mains fines de musicien ; il tient peu de place dans une pièce, et toute la salle dès qu'il ouvre la bouche.</p>
<p>Traits fins, presque trop réguliers, sur une peau pâle aux reflets dorés. Cheveux blond cendré mi-longs, noués bas sur la nuque. <strong>Yeux d'un blanc laiteux, sans iris ni pupille visibles</strong> — il voit pourtant parfaitement, et élude la question quand on la lui pose. Au-dessus de sa tête flotte en permanence une fine <strong>auréole blanche</strong>, large comme une assiette, qui n'éclaire presque rien.</p>
<p>L'auréole le trahit avant lui : elle vacille quand il ment, se resserre quand il a peur, s'embrase quand il chante juste — aussi joue-t-il de préférence dos à la salle, dans la pénombre de l'estrade. Accorde son luth entre deux phrases quand il est nerveux. Ne boit jamais ce qu'on lui offre : il le vide discrètement dans le pot de fougère au pied de l'estrade, laquelle se porte mal.</p>
<p><strong>Rôle :</strong> barde de maison de <strong>La Loutre SAOUL</strong>. Il chante six soirs sur sept et fait salle comble les soirs de paie ; la taverne lui doit une bonne part de sa réputation aux Bas-Quais. Il connaît le nom, la dette et les travers de chaque habitué — on parle devant un musicien comme devant un meuble.</p>
<p><strong>Rapport aux PJ :</strong> loyal à l'établissement et franchement hostile aux visites mensuelles d'<strong>Odon Pince</strong>, qu'il appelle « le percepteur » et à qui il dédie des couplets de moins en moins allusifs. Excellent relais d'informations pour qui prend le temps de l'écouter, et un levier tout trouvé si les PJ s'attaquent à la « contribution à la tranquillité » du Conseil d'Acier.</p>
<p><strong>Secret (MJ) :</strong> il vend la liste des habitués de la Loutre à un « courtier en curiosités » qui le paie en pièces neuves. Il croit renseigner un collectionneur d'anecdotes ; c'est un relais de l'<strong>Œil Pourpre</strong>. Deux des noms qu'il a livrés ont disparu depuis. S'il venait à l'apprendre, il se dénoncerait de lui-même aux PJ plutôt que de continuer.</p>
<p><strong>Secret (MJ), plus profond :</strong> il lui manque trois mois de mémoire — l'hiver de ses trente ans. L'auréole et les yeux blancs datent de cette période. Il a quitté Alagir cet hiver-là et n'a jamais su pourquoi il y est revenu. <em>Piste : le Voile de l'Oubli de <strong>Mirdobas Filan</strong>.</em></p>
<p><strong>Capacités notables :</strong> Inspiration bardique, Contre-charme, Mots cinglants. Sorts : <em>Charme-personne</em>, <em>Image silencieuse</em>, <em>Repos hypnotique</em>, <em>Fracassement</em>, <em>Suggestion</em>, <em>Discours captivant</em>. Trait aasimar : <em>Âme radieuse</em> — auréole permanente, dégâts radiants une fois par repos long.</p>
`.trim();

async function main() {
  const data = {
    description: DESCRIPTION,
    breed: 'AASIMAR' as const,
    sex: 'MAN' as const,
    membership: 'OTHER' as const,
    languages: ['COMMUN', 'CELESTE', 'ELFIQUE', 'ARGOT_VOLEUR'] as Language[],
    fp: '3',
    pv: 40,
    ca: 14,
    STR: 9, DEX: 15, CON: 12, INT: 13, WIS: 11, CHA: 18,
    cityId: ALAGIR,
    districtId: CHANT_TAL_TARIS,
    placeId: LOUTRE,
    // Convention des PNJ rattachés à un lieu : c'est le lieu qui porte le pion sur la carte.
    showOnMap: false,
    isForDM: false,
  };

  const existing = await prisma.personOfInterest.findFirst({ where: { name: 'Core Belan' }, select: { id: true } });
  const person = existing
    ? await prisma.personOfInterest.update({ where: { id: existing.id }, data, select: { id: true } })
    : await prisma.personOfInterest.create({ data: { name: 'Core Belan', ...data }, select: { id: true } });
  console.log(existing ? '↻ Core Belan mis à jour' : '+ Core Belan créé', `[${person.id}]`);

  const check = await prisma.personOfInterest.findUnique({
    where: { id: person.id },
    select: {
      name: true, breed: true, sex: true, fp: true, pv: true, ca: true, languages: true,
      city: { select: { name: true } }, district: { select: { name: true } }, place: { select: { name: true } },
    },
  });
  console.log(JSON.stringify(check, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
