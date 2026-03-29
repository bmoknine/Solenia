import { AUTH_ACCESS_KEY, AUTH_REFRESH_KEY } from '../auth/storageKeys';

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
    const issues = (data as { issues?: { path?: (string | number)[]; message: string }[] })?.issues;
    if (issues?.length) {
      const detail = issues.map((i) => `${i.path?.join('.') ?? '?'}: ${i.message}`).join('; ');
      message = `${message} (${detail})`;
    }
  } catch {
    // ignore parse error
  }
  
  if (res.status === 401) {
    localStorage.removeItem(AUTH_ACCESS_KEY);
    localStorage.removeItem(AUTH_REFRESH_KEY);
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

/** Rafraîchit l’access token via le refresh stocké (sans passer par handle, pour éviter boucles). */
async function tryRefreshAccessToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refresh = localStorage.getItem(AUTH_REFRESH_KEY);
  if (!refresh) return null;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refresh}`,
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  localStorage.setItem(AUTH_ACCESS_KEY, data.accessToken);
  localStorage.setItem(AUTH_REFRESH_KEY, data.refreshToken);
  window.dispatchEvent(
    new CustomEvent('auth:token-refreshed', {
      detail: { accessToken: data.accessToken, refreshToken: data.refreshToken },
    }),
  );
  return data;
}

async function fetchWithAuthRetry(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  opts: { token?: string | null; body?: unknown; init?: RequestInit },
): Promise<Response> {
  const { token, body, init } = opts;
  const url = `${API_URL}${path}`;

  const doFetch = (access: string | null | undefined) => {
    const headers = mergeAuthHeaders(init, access);
    const hasJsonBody = body !== undefined && (method === 'POST' || method === 'PUT');
    if (hasJsonBody) {
      headers.set('Content-Type', 'application/json');
    }
    return fetch(url, {
      method,
      ...init,
      ...(hasJsonBody ? { body: JSON.stringify(body) } : {}),
      headers,
    });
  };

  let res = await doFetch(token);
  if (res.status === 401 && token) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) {
      res = await doFetch(refreshed.accessToken);
    }
  }
  return res;
}

export function withAuth(token?: string | null) {
  return {
    get: <T>(path: string, init?: RequestInit) =>
      fetchWithAuthRetry('GET', path, { token, init }).then((r) => handle<T>(r)),
    post: <T>(path: string, body: unknown, init?: RequestInit) =>
      fetchWithAuthRetry('POST', path, { token, body, init }).then((r) => handle<T>(r)),
    put: <T>(path: string, body: unknown, init?: RequestInit) =>
      fetchWithAuthRetry('PUT', path, { token, body, init }).then((r) => handle<T>(r)),
    delete: <T>(path: string, init?: RequestInit) =>
      fetchWithAuthRetry('DELETE', path, { token, init }).then((r) => handle<T>(r)),
  };
}

/** GET avec en-tête Bearer + retry après refresh (ex. /auth/me au chargement). */
export async function apiGetWithAuth<T>(path: string, token: string | null | undefined): Promise<T> {
  const res = await fetchWithAuthRetry('GET', path, { token });
  return handle<T>(res);
}

