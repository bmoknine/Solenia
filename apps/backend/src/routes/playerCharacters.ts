import type { FastifyInstance } from 'fastify';
import type { Prisma } from '@prisma/client';
import {
  idSchema,
  playerCharacterInputSchema,
  DND_CLASS_VALUES,
  DND_ALIGNMENT_VALUES,
  PERSON_BREED_VALUES,
} from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

const includes = <T extends readonly string[]>(allowed: T, v: string): v is T[number] =>
  (allowed as readonly string[]).includes(v);

async function syncLists(
  app: FastifyInstance,
  pcId: string,
  fields: {
    skills?: { id?: string; name: string; ability: string; proficient: boolean; expertise: boolean }[];
    savingThrows?: { id?: string; ability: string; proficient: boolean }[];
    equipment?: { id?: string; name: string; quantity: number; description?: string | null; equipped: boolean }[];
    spells?: { id?: string; name: string; level: number; school?: string | null; description?: string | null; prepared: boolean }[];
  },
) {
  if (fields.skills !== undefined) {
    await app.prisma.playerCharacterSkill.deleteMany({ where: { playerCharacterId: pcId } });
    for (const s of fields.skills) {
      await app.prisma.playerCharacterSkill.create({
        data: { playerCharacterId: pcId, name: s.name, ability: s.ability ?? 'DEX', proficient: s.proficient, expertise: s.expertise },
      });
    }
  }
  if (fields.savingThrows !== undefined) {
    await app.prisma.playerCharacterSavingThrow.deleteMany({ where: { playerCharacterId: pcId } });
    for (const s of fields.savingThrows) {
      await app.prisma.playerCharacterSavingThrow.create({
        data: { playerCharacterId: pcId, ability: s.ability, proficient: s.proficient },
      });
    }
  }
  if (fields.equipment !== undefined) {
    await app.prisma.playerCharacterEquipmentItem.deleteMany({ where: { playerCharacterId: pcId } });
    for (const e of fields.equipment) {
      await app.prisma.playerCharacterEquipmentItem.create({
        data: { playerCharacterId: pcId, name: e.name, quantity: e.quantity, description: e.description ?? null, equipped: e.equipped },
      });
    }
  }
  if (fields.spells !== undefined) {
    await app.prisma.playerCharacterSpell.deleteMany({ where: { playerCharacterId: pcId } });
    for (const s of fields.spells) {
      await app.prisma.playerCharacterSpell.create({
        data: { playerCharacterId: pcId, name: s.name, level: s.level, school: s.school ?? null, description: s.description ?? null, prepared: s.prepared },
      });
    }
  }
}

const PC_INCLUDE = {
  position: true,
  kingdom: { select: { id: true, name: true } },
  city: { select: { id: true, name: true } },
  district: { select: { id: true, name: true } },
  place: { select: { id: true, name: true } },
  skills: true,
  savingThrows: true,
  equipment: true,
  spells: true,
} satisfies Prisma.PlayerCharacterInclude;

export async function playerCharacterRoutes(app: FastifyInstance) {
  app.get('/player-characters', async () => {
    return app.prisma.playerCharacter.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/player-characters/:id', async (request, reply) => {
    const id = parseRouteUuid(request);
    const pc = await app.prisma.playerCharacter.findUnique({ where: { id }, include: PC_INCLUDE });
    if (!pc) return reply.notFound();
    return pc;
  });

  app.post(
    '/player-characters',
    { preHandler: requireRole(app, ['admin', 'editor']) },
    async (request) => {
      const parsed = playerCharacterInputSchema.parse(request.body);
      const { skills, savingThrows, equipment, spells, ...fields } = parsed;

      const createData: Prisma.PlayerCharacterUncheckedCreateInput = {
        name: fields.name,
        class: fields.class ?? null,
        level: fields.level ?? 1,
        race: fields.race ?? null,
        background: fields.background ?? null,
        alignment: fields.alignment ?? null,
        imageUrl: fields.imageUrl ?? null,
        description: fields.description ?? null,
        STR: fields.STR,
        DEX: fields.DEX,
        CON: fields.CON,
        INT: fields.INT,
        WIS: fields.WIS,
        CHA: fields.CHA,
        pv: fields.pv ?? null,
        pvMax: fields.pvMax ?? null,
        ca: fields.ca ?? null,
        initiative: fields.initiative ?? null,
        speed: fields.speed ?? null,
        showOnMap: fields.showOnMap ?? true,
        isForDM: fields.isForDM ?? false,
        kingdomId: fields.kingdomId ?? null,
        cityId: fields.cityId ?? null,
        districtId: fields.districtId ?? null,
        placeId: fields.placeId ?? null,
      };

      const pc = await app.prisma.playerCharacter.create({ data: createData });
      await syncLists(app, pc.id, { skills: skills ?? [], savingThrows: savingThrows ?? [], equipment: equipment ?? [], spells: spells ?? [] });
      return app.prisma.playerCharacter.findUnique({ where: { id: pc.id }, include: PC_INCLUDE });
    },
  );

  app.put(
    '/player-characters/:id',
    { preHandler: requireRole(app, ['admin', 'editor']) },
    async (request) => {
      const id = parseRouteUuid(request);
      const rawBody = request.body as Record<string, unknown>;

      const bodyWithoutEnums = { ...rawBody };
      delete bodyWithoutEnums.class;
      delete bodyWithoutEnums.race;
      delete bodyWithoutEnums.alignment;
      delete bodyWithoutEnums.kingdomId;
      delete bodyWithoutEnums.cityId;
      delete bodyWithoutEnums.districtId;
      delete bodyWithoutEnums.placeId;
      delete bodyWithoutEnums.skills;
      delete bodyWithoutEnums.savingThrows;
      delete bodyWithoutEnums.equipment;
      delete bodyWithoutEnums.spells;

      const parsed = playerCharacterInputSchema.partial().parse(bodyWithoutEnums);
      const data: Prisma.PlayerCharacterUncheckedUpdateInput = {};

      if ('name' in rawBody && parsed.name !== undefined) data.name = parsed.name;
      if ('level' in rawBody && parsed.level !== undefined) data.level = parsed.level;
      if ('background' in rawBody) data.background = parsed.background ?? null;
      if ('imageUrl' in rawBody) data.imageUrl = parsed.imageUrl ?? null;
      if ('description' in rawBody) data.description = parsed.description ?? null;
      if ('pv' in rawBody) data.pv = parsed.pv ?? null;
      if ('pvMax' in rawBody) data.pvMax = parsed.pvMax ?? null;
      if ('ca' in rawBody) data.ca = parsed.ca ?? null;
      if ('initiative' in rawBody) data.initiative = parsed.initiative ?? null;
      if ('speed' in rawBody) data.speed = parsed.speed ?? null;
      if ('showOnMap' in rawBody && typeof parsed.showOnMap === 'boolean') data.showOnMap = parsed.showOnMap;
      if ('isForDM' in rawBody && typeof parsed.isForDM === 'boolean') data.isForDM = parsed.isForDM;
      if ('STR' in rawBody && parsed.STR !== undefined) data.STR = parsed.STR;
      if ('DEX' in rawBody && parsed.DEX !== undefined) data.DEX = parsed.DEX;
      if ('CON' in rawBody && parsed.CON !== undefined) data.CON = parsed.CON;
      if ('INT' in rawBody && parsed.INT !== undefined) data.INT = parsed.INT;
      if ('WIS' in rawBody && parsed.WIS !== undefined) data.WIS = parsed.WIS;
      if ('CHA' in rawBody && parsed.CHA !== undefined) data.CHA = parsed.CHA;

      if ('class' in rawBody) {
        const v = rawBody.class;
        data.class = v === '' || v === null ? null : typeof v === 'string' && includes(DND_CLASS_VALUES, v) ? v : null;
      }
      if ('race' in rawBody) {
        const v = rawBody.race;
        data.race = v === '' || v === null ? null : typeof v === 'string' && includes(PERSON_BREED_VALUES, v) ? v : null;
      }
      if ('alignment' in rawBody) {
        const v = rawBody.alignment;
        data.alignment = v === '' || v === null ? null : typeof v === 'string' && includes(DND_ALIGNMENT_VALUES, v) ? v : null;
      }
      if ('kingdomId' in rawBody) {
        const v = rawBody.kingdomId;
        data.kingdomId = v === '' || v === null ? null : typeof v === 'string' ? v : null;
      }
      if ('cityId' in rawBody) {
        const v = rawBody.cityId;
        data.cityId = v === '' || v === null ? null : typeof v === 'string' ? v : null;
      }
      if ('districtId' in rawBody) {
        const v = rawBody.districtId;
        data.districtId = v === '' || v === null ? null : typeof v === 'string' ? v : null;
      }
      if ('placeId' in rawBody) {
        const v = rawBody.placeId;
        data.placeId = v === '' || v === null ? null : typeof v === 'string' ? v : null;
      }

      const updated = await app.prisma.playerCharacter.update({ where: { id }, data });

      const listsUpdate: Parameters<typeof syncLists>[2] = {};
      if ('skills' in rawBody && Array.isArray(rawBody.skills)) listsUpdate.skills = rawBody.skills as never;
      if ('savingThrows' in rawBody && Array.isArray(rawBody.savingThrows)) listsUpdate.savingThrows = rawBody.savingThrows as never;
      if ('equipment' in rawBody && Array.isArray(rawBody.equipment)) listsUpdate.equipment = rawBody.equipment as never;
      if ('spells' in rawBody && Array.isArray(rawBody.spells)) listsUpdate.spells = rawBody.spells as never;
      await syncLists(app, id, listsUpdate);

      return app.prisma.playerCharacter.findUnique({ where: { id: updated.id }, include: PC_INCLUDE });
    },
  );

  app.delete(
    '/player-characters/:id',
    { preHandler: requireRole(app, ['admin']) },
    async (request, reply) => {
      const id = parseRouteUuid(request);
      await app.prisma.position.deleteMany({ where: { playerCharacterId: id } });
      await app.prisma.playerCharacter.delete({ where: { id } });
      reply.code(204);
    },
  );
}
