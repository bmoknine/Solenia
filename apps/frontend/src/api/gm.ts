import { withAuth } from './client';

export type CombatStatus = 'ACTIVE' | 'FINISHED';
export type QuestStatus = 'A_FAIRE' | 'EN_COURS' | 'TERMINEE' | 'ECHOUEE';
export type QuestStepStatus = 'A_FAIRE' | 'EN_COURS' | 'FAITE';

export type Combatant = {
  id: string;
  combatId: string;
  name: string;
  playerCharacterId?: string | null;
  personId?: string | null;
  initiativeRoll: number;
  currentHp: number;
  maxHp: number;
  ca?: number | null;
  conditions: string[];
  createdAt: string;
};

export type Combat = {
  id: string;
  name: string;
  round: number;
  activeTurnIndex: number;
  status: CombatStatus;
  questStepId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CombatDetail = Combat & { combatants: Combatant[] };
export type CombatSummary = Combat & { _count: { combatants: number } };

export type LinkedCombat = { id: string; name: string; status: CombatStatus; round: number };

export type QuestStep = {
  id: string;
  questId: string;
  title: string;
  description?: string | null;
  status: QuestStepStatus;
  optional?: boolean;
  order: number;
  combats?: LinkedCombat[];
  createdAt: string;
  updatedAt: string;
};

export type Quest = {
  id: string;
  title: string;
  description?: string | null;
  status: QuestStatus;
  notes?: string | null;
  order: number;
  campaignId?: string | null;
  steps: QuestStep[];
  createdAt: string;
  updatedAt: string;
};

export type Campaign = {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: { quests: number };
  players?: { id: string; name: string }[];
};

export type GameSession = {
  id: string;
  date: string;
  title?: string | null;
  summary?: string | null;
  campaignId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CombatantInput = {
  name: string;
  playerCharacterId?: string | null;
  personId?: string | null;
  initiativeRoll: number;
  currentHp: number;
  maxHp: number;
  ca?: number | null;
  conditions?: string[];
};

// ─── Combats ────────────────────────────────────────────────────────────────

export async function listCombats(token: string | null): Promise<CombatSummary[]> {
  return withAuth(token).get<CombatSummary[]>('/combats');
}

export async function createCombat(
  token: string | null,
  data: { name: string; questStepId?: string | null },
): Promise<Combat> {
  return withAuth(token).post<Combat>('/combats', data);
}

export async function launchCombatParty(token: string | null, combatId: string): Promise<CombatDetail> {
  return withAuth(token).post<CombatDetail>(`/combats/${combatId}/party`, {});
}

export async function getCombat(token: string | null, id: string): Promise<CombatDetail> {
  return withAuth(token).get<CombatDetail>(`/combats/${id}`);
}

export async function updateCombat(
  token: string | null,
  id: string,
  data: Partial<{ name: string; round: number; activeTurnIndex: number; status: CombatStatus }>,
): Promise<Combat> {
  return withAuth(token).put<Combat>(`/combats/${id}`, data);
}

export async function deleteCombat(token: string | null, id: string): Promise<void> {
  return withAuth(token).delete(`/combats/${id}`);
}

export async function addCombatant(
  token: string | null,
  combatId: string,
  data: CombatantInput,
): Promise<Combatant> {
  return withAuth(token).post<Combatant>(`/combats/${combatId}/combatants`, data);
}

export async function updateCombatant(
  token: string | null,
  id: string,
  data: Partial<CombatantInput>,
): Promise<Combatant> {
  return withAuth(token).put<Combatant>(`/combatants/${id}`, data);
}

export async function deleteCombatant(token: string | null, id: string): Promise<void> {
  return withAuth(token).delete(`/combatants/${id}`);
}

// ─── Campagnes ──────────────────────────────────────────────────────────────

export type CampaignInput = {
  name: string;
  description?: string | null;
  color?: string | null;
  order?: number;
  playerCharacterIds?: string[];
};

export async function listCampaigns(token: string | null): Promise<Campaign[]> {
  return withAuth(token).get<Campaign[]>('/campaigns');
}

export async function createCampaign(token: string | null, data: CampaignInput): Promise<Campaign> {
  return withAuth(token).post<Campaign>('/campaigns', data);
}

export async function updateCampaign(
  token: string | null,
  id: string,
  data: Partial<CampaignInput>,
): Promise<Campaign> {
  return withAuth(token).put<Campaign>(`/campaigns/${id}`, data);
}

export async function deleteCampaign(token: string | null, id: string): Promise<void> {
  return withAuth(token).delete(`/campaigns/${id}`);
}

// ─── Quêtes ─────────────────────────────────────────────────────────────────

export type QuestInput = {
  title: string;
  description?: string | null;
  status?: QuestStatus;
  notes?: string | null;
  order?: number;
  campaignId?: string | null;
};

export async function listQuests(token: string | null): Promise<Quest[]> {
  return withAuth(token).get<Quest[]>('/quests');
}

export async function createQuest(token: string | null, data: QuestInput): Promise<Quest> {
  return withAuth(token).post<Quest>('/quests', data);
}

export async function updateQuest(
  token: string | null,
  id: string,
  data: Partial<QuestInput>,
): Promise<Quest> {
  return withAuth(token).put<Quest>(`/quests/${id}`, data);
}

export async function deleteQuest(token: string | null, id: string): Promise<void> {
  return withAuth(token).delete(`/quests/${id}`);
}

// ─── Péripéties (QuestStep) ───────────────────────────────────────────────────

export type QuestStepInput = {
  title: string;
  description?: string | null;
  status?: QuestStepStatus;
  optional?: boolean;
  order?: number;
};

export async function addQuestStep(
  token: string | null,
  questId: string,
  data: QuestStepInput,
): Promise<QuestStep> {
  return withAuth(token).post<QuestStep>(`/quests/${questId}/steps`, data);
}

export async function updateQuestStep(
  token: string | null,
  id: string,
  data: Partial<QuestStepInput>,
): Promise<QuestStep> {
  return withAuth(token).put<QuestStep>(`/quest-steps/${id}`, data);
}

export async function deleteQuestStep(token: string | null, id: string): Promise<void> {
  return withAuth(token).delete(`/quest-steps/${id}`);
}

// ─── Sessions de jeu ────────────────────────────────────────────────────────

export type GameSessionInput = {
  date: string;
  title?: string | null;
  summary?: string | null;
  campaignId?: string | null;
};

export async function listGameSessions(token: string | null): Promise<GameSession[]> {
  return withAuth(token).get<GameSession[]>('/game-sessions');
}

export async function createGameSession(
  token: string | null,
  data: GameSessionInput,
): Promise<GameSession> {
  return withAuth(token).post<GameSession>('/game-sessions', data);
}

export async function updateGameSession(
  token: string | null,
  id: string,
  data: Partial<GameSessionInput>,
): Promise<GameSession> {
  return withAuth(token).put<GameSession>(`/game-sessions/${id}`, data);
}

export async function deleteGameSession(token: string | null, id: string): Promise<void> {
  return withAuth(token).delete(`/game-sessions/${id}`);
}
