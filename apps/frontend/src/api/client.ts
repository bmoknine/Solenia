const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function handle<T>(res: Response): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;
  let message = `API error ${res.status}`;
  try {
    const data = (await res.json()) as unknown;
    if (typeof (data as { message?: unknown })?.message === 'string') {
      message = (data as { message: string }).message;
    }
  } catch {
    // ignore parse error
  }
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      sessionId:'debug-session',
      runId:'run1',
      hypothesisId:'H-api-error',
      location:'api/client.ts:handle',
      message:'API error',
      data:{status:res.status,statusText:res.statusText,url:res.url},
      timestamp:Date.now()
    })
  }).catch(()=>{});
  // #endregion
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

export function withAuth(token?: string | null) {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  return {
    get: <T>(path: string, init?: RequestInit) =>
      apiGet<T>(path, {
        ...init,
        headers: { ...(init?.headers ?? {}), ...authHeaders },
      }),
    post: <T>(path: string, body: unknown, init?: RequestInit) =>
      apiPost<T>(path, body, {
        ...init,
        headers: { ...(init?.headers ?? {}), ...authHeaders },
      }),
    delete: <T>(path: string, init?: RequestInit) =>
      apiDelete<T>(path, {
        ...init,
        headers: { ...(init?.headers ?? {}), ...authHeaders },
      }),
  };
}

