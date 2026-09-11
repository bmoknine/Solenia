import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Refonte du passé de Miravosk (demande MJ) :
 *  — il a rencontré sa femme à la Loutre mais n'y a JAMAIS travaillé (il était tonnelier) ;
 *  — il a eu un enfant ; femme et enfant sont morts ;
 *  — leur mort n'a aucun lien avec le Conseil d'Acier, mais un lien indirect avec les Palhindile.
 * L'accroche passe par les Verreries Royales, que les Palhindile exploitent.
 * Corrige aussi la fiche de Grazh, qui sous-entendait que Miravosk tenait la maison.
 */
const MIRAVOSK_DESC = `
<p>Homme nain, 142 ans. Large et voûté, la carrure encore là sous le laisser-aller ; il porte son ventre comme un homme qui fut costaud et a cessé de s'en soucier. Démarche lente, une main toujours prête à trouver un appui.</p>
<p>Visage buriné, joues et nez marbrés de couperose. Barbe grise mal égalisée, autrefois tressée — on devine encore le pli des anneaux qu'il n'y met plus. Yeux gris pâle bordés de rouge, qui se réveillent d'un coup dès qu'on parle chiffres, fournisseurs ou fûts. Sourcils épais, front barré de rides horizontales.</p>
<p>Il n'occupe jamais la table du fond, à gauche de l'âtre : c'est là qu'il l'a rencontrée. Il l'essuie chaque matin et n'y laisse asseoir personne. Tutoie tout le monde à partir du deuxième verre. Sait au litre près ce qui reste en cave sans avoir jamais rien noté.</p>
<p><strong>Rôle :</strong> <strong>tonnelier</strong> de son état, membre de la <strong>Guilde du Marteau Blanc</strong> — trente ans à monter et livrer des fûts dans tout Alagir, des brasseries des Bas-Quais jusqu'aux <strong>Verreries Royales</strong>, qui en achètent par douzaines pour le sable, la cendre et la soude. Il n'a <em>jamais</em> travaillé à <strong>La Loutre SAOUL</strong> : il y buvait. C'est là qu'il a rencontré sa femme, un soir de livraison. Après leur mort, il n'a plus quitté la maison — partir, ce serait la laisser — et il y est resté quand elle est tombée en ruine ; c'est là que les PJ l'ont trouvé, en train de cuver. Il en est aujourd'hui l'<strong>homme de confiance et l'administrateur</strong> : commandes, fournisseurs, gages, comptes et embauches passent par lui — c'est lui qui a engagé <strong>Sabine Quenot</strong>. Trente ans de tournées lui ont appris qui livre honnêtement, qui coupe son vin, et ce que chaque chose doit coûter.</p>
<p><strong>Secret (MJ) :</strong> sa femme <strong>Nerika</strong> soufflait le verre aux <strong>Verreries Royales</strong> ; leur fille <strong>Vilda</strong> a grandi dans l'air du Château de Verre et n'a pas vu ses dix ans. Elles sont mortes le même hiver de ce qu'on appelle en contrebas la « <strong>toux du verre</strong> » — celle qui prend les souffleurs et les rues sous le vent des évents. Les <strong>Palhindile</strong> ont payé les enterrements, comme ils le font toujours, et n'ont rien changé : les fours et les formules ont des siècles, les évents avec. Il y a vingt ans, Miravosk a déposé à la Chancellerie une requête demandant qu'on déplace ces évents ; elle a été enregistrée et jamais traitée — elle dort encore au <strong>Dépôt des Serments Inachevés</strong>, sous le nom de Nerika. Il garde en cave ses propres livres de livraison de ces années-là : les fours ont tourné plus fort trois hivers de suite, exactement quand la toux a commencé en bas. Cela prouve une coïncidence, pas un crime, et il sait ce qu'une grande maison fait d'un artisan des quais qui confond les deux. Il n'en a jamais parlé à personne. Mais si les Palhindile se mettaient publiquement à répondre de ce qu'ils font — ce que la proposition d'abolition laisserait croire — il sortirait tout.</p>
<p><strong>Capacités notables :</strong> aucun talent martial — il n'a plus levé autre chose qu'un tonneau depuis trente ans. En revanche, mémoire absolue des visages et des ardoises : il reconnaît un client vu une seule fois trente ans plus tôt, et se souvient de ce qu'il devait.</p>
`.trim();

const GRAZH_ANCIEN = "<strong>Miravosk</strong> l'a recueilli des années plus tôt, du temps où la maison tournait encore ; quand elle est tombée en ruine, il n'est pas parti davantage que le vieux nain.";
const GRAZH_NOUVEAU = "<strong>Miravosk</strong> l'a pris sous son aile des années plus tôt — il portait les fûts sur les tournées du vieux tonnelier ; quand celui-ci s'est enfermé dans la Loutre, il l'a suivi et n'en est pas reparti.";

async function main() {
  const m = await prisma.personOfInterest.findFirst({ where: { name: 'Miravosk' }, select: { id: true } });
  if (!m) throw new Error('Miravosk introuvable.');
  await prisma.personOfInterest.update({ where: { id: m.id }, data: { description: MIRAVOSK_DESC } });
  console.log('✓ Miravosk : passé réécrit (tonnelier ; Nerika et Vilda ; Verreries Royales)');

  const g = await prisma.personOfInterest.findFirst({ where: { name: 'Grazh' }, select: { id: true, description: true } });
  if (g?.description?.includes(GRAZH_ANCIEN)) {
    await prisma.personOfInterest.update({
      where: { id: g.id },
      data: { description: g.description.replace(GRAZH_ANCIEN, GRAZH_NOUVEAU) },
    });
    console.log('✓ Grazh : recueilli sur les tournées du tonnelier, plus « du temps où la maison tournait »');
  } else {
    console.log('· Grazh : phrase déjà corrigée ou introuvable');
  }

  // Contrôles : plus aucune trace de l'ancienne accroche Conseil d'Acier / tavernier.
  const check = await prisma.personOfInterest.findUnique({ where: { id: m.id }, select: { description: true } });
  const d = check!.description ?? '';
  console.log('\nContrôles sur la fiche Miravosk :');
  console.log('  ancien tavernier      :', /ancien tavernier|la maison était la sienne/.test(d) ? 'ENCORE PRÉSENT' : 'supprimé');
  console.log('  accroche Odon Pince   :', /Odon Pince/.test(d) ? 'ENCORE PRÉSENT' : 'supprimée');
  console.log("  accroche Conseil d'Acier :", /Conseil d'Acier|contribution à la tranquillité/.test(d) ? 'ENCORE PRÉSENT' : 'supprimée');
  console.log('  lien Palhindile       :', /Palhindile/.test(d) ? 'présent' : 'ABSENT');
  console.log('  femme + enfant        :', /Nerika/.test(d) && /Vilda/.test(d) ? 'présents' : 'ABSENTS');
  console.log('  mention Aesir         :', /Aesir/i.test(d) ? 'PRÉSENTE (à corriger)' : 'aucune');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
