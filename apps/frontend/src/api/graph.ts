const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export type GraphNode = {
  id: string;
  targetId: string;
  label: string;
  type: 'person' | 'organisation';
  breed?: string | null;
  membership?: string | null;
  cityId?: string | null;
};

export type GraphLink = {
  source: string;
  target: string;
  type: 'member' | 'hierarchy';
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

export type Stats = {
  kingdoms: number;
  cities: number;
  districts: number;
  places: number;
  persons: number;
  organisations: number;
  playerCharacters: number;
  lores: number;
  organisationMembers: number;
  comments: number;
};

export async function fetchGraph(): Promise<GraphData> {
  const res = await fetch(`${API_URL}/graph`);
  if (!res.ok) throw new Error('Chargement du graphe échoué');
  return res.json() as Promise<GraphData>;
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_URL}/stats`);
  if (!res.ok) throw new Error('Chargement des stats échoué');
  return res.json() as Promise<Stats>;
}
