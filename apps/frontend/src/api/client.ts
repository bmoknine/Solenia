const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function handle<T>(res: Response): Promise<T> {
  if (res.ok) {
    // Pour les réponses 204 (No Content), ne pas essayer de parser JSON
    if (res.status === 204) {
      return undefined as T;
    }
    // Vérifier si la réponse a du contenu avant de parser
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json() as Promise<T>;
    }
    return undefined as T;
  }
  let message = `API error ${res.status}`;
  try {
    const data = (await res.json()) as unknown;
    if (typeof (data as { message?: unknown })?.message === 'string') {
      message = (data as { message: string }).message;
    }
  } catch {
    // ignore parse error
  }
  
  // Si le token a expiré (401), déconnecter l'utilisateur
  if (res.status === 401) {
    // Supprimer le token du localStorage
    localStorage.removeItem('solenia.token');
    // Déclencher un événement personnalisé pour notifier AuthProvider
    window.dispatchEvent(new CustomEvent('auth:token-expired'));
  }
  
  throw new Error(message);
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  return handle<T>(res);
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  return handle<T>(res);
}

export async function apiPut<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  return handle<T>(res);
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  return handle<T>(res);
}

export function getApiUrl() {
  return API_URL;
}

function mergeAuthHeaders(init: RequestInit | undefined, token: string | null | undefined): Headers {
  const headers = new Headers(init?.headers as HeadersInit | undefined);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

export function withAuth(token?: string | null) {
  return {
    get: <T>(path: string, init?: RequestInit) =>
      apiGet<T>(path, {
        ...init,
        headers: mergeAuthHeaders(init, token),
      }),
    post: <T>(path: string, body: unknown, init?: RequestInit) =>
      apiPost<T>(path, body, {
        ...init,
        headers: mergeAuthHeaders(init, token),
      }),
    put: <T>(path: string, body: unknown, init?: RequestInit) =>
      apiPut<T>(path, body, {
        ...init,
        headers: mergeAuthHeaders(init, token),
      }),
    delete: <T>(path: string, init?: RequestInit) =>
      apiDelete<T>(path, {
        ...init,
        headers: mergeAuthHeaders(init, token),
      }),
  };
}

