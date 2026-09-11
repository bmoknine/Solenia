import { apiGet, withAuth } from './client';

export type FamilySex = 'MAN' | 'WOMAN' | 'OTHER';

/** Référence légère vers l'entité liée (PNJ ou PJ). */
export type LinkedRef = { id: string; name: string };

/** Nœud d'arbre généalogique. */
export type FamilyMember = {
  id: string;
  organisationId: string;
  name: string;
  title?: string | null;
  personId?: string | null;
  playerCharacterId?: string | null;
  fatherId?: string | null;
  motherId?: string | null;
  spouseId?: string | null;
  /** Supérieur hiérarchique (organigrammes). */
  superiorId?: string | null;
  sex?: FamilySex | null;
  isFounder: boolean;
  generation?: number | null;
  order: number;
  notes?: string | null;
  isForDM: boolean;
  person?: LinkedRef | null;
  playerCharacter?: LinkedRef | null;
};

/** Sous-organisation affichée comme nœud dans un organigramme. */
export type SubOrganisation = { id: string; name: string; organisationType: string | null };

export type FamilyTree = {
  organisation: { id: string; name: string; organisationType: string | null };
  /** Dérivées de la hiérarchie réelle (parent/enfant), jamais stockées comme nœuds. */
  subOrganisations: SubOrganisation[];
  members: FamilyMember[];
};

/** Champs modifiables d'un membre. */
export type FamilyMemberInput = Partial<{
  name: string;
  title: string | null;
  personId: string | null;
  playerCharacterId: string | null;
  fatherId: string | null;
  motherId: string | null;
  spouseId: string | null;
  superiorId: string | null;
  sex: FamilySex | null;
  isFounder: boolean;
  generation: number | null;
  order: number;
  notes: string | null;
  isForDM: boolean;
}>;

export async function fetchFamilyTree(organisationId: string) {
  return apiGet<FamilyTree>(`/organisations/${organisationId}/family-tree`);
}

export async function createFamilyMember(
  token: string | null,
  organisationId: string,
  data: FamilyMemberInput & { name: string },
) {
  return withAuth(token).post<FamilyMember>(`/organisations/${organisationId}/family-members`, data);
}

export async function updateFamilyMember(token: string | null, id: string, data: FamilyMemberInput) {
  return withAuth(token).put<FamilyMember>(`/family-members/${id}`, data);
}

export async function deleteFamilyMember(token: string | null, id: string) {
  return withAuth(token).delete(`/family-members/${id}`);
}
