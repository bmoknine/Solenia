import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.personOfInterest.update({
    where: { id: 'f15655ae-460d-43a7-b970-147cae70e406' },
    data: {
      description: `<p>Naine de 28 ans, sœur cadette de Darn Fer-Vallée. Trapue et robuste, un visage ouvert et expressif qui trahit chaque émotion avant même qu'elle parle. Cheveux brun foncé coupés court en désordre, yeux noisette grands et francs. Une cicatrice en demi-lune sous l'œil droit — elle dit que c'est un accident, ses anciens compagnons disaient autrement. Les mains calleuses de quelqu'un qui travaille dur.</p>
<p>Brynn est naïve de la belle sorte : elle croit facilement aux gens, voit le meilleur en eux bien plus longtemps qu'elle ne devrait, et déteste l'idée que quelqu'un puisse la manipuler délibérément. Cette confiance lui a valu de mauvaises fréquentations à répétition — des gens qui lui ont fait miroiter de l'amitié, de l'appartenance, un but, avant de se servir d'elle comme intermédiaire ou de faire peser les risques sur ses épaules.</p>
<p>C'est ainsi qu'elle s'est retrouvée mêlée aux <strong>Rats des Fosses</strong>, un groupe de bandits et contrebandiers dont la planque est dans les égouts sous la Porte Basse d'Alagir. Elle croyait rejoindre des gens dans le besoin qui s'entraidaient. Elle sert surtout de passeur et de couverture sans en mesurer pleinement les conséquences.</p>
<p>Darn le sait, et ça l'inquiète plus qu'il ne le montre. Leurs relations sont tendues — il essaie de la prévenir, elle entend des reproches et se braque. Mais elle n'est pas perdue : quelqu'un de patient qui lui parle honnêtement pourrait l'atteindre.</p>`,
    }
  });
  console.log('✅ Brynn Fer-Vallée mise à jour.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
