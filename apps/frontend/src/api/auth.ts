import { apiGetWithAuth, apiPost, withAuth } from './client';

type LoginResponse = {
  user: {
    id: string;
    email: string;
    username: string;
    type: string;
  };
  accessToken: string;
  refreshToken: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', { email, password });
}

export async function changePassword(token: string, oldPassword: string, newPassword: string) {
  return withAuth(token).post('/auth/change-password', { oldPassword, newPassword });
}

export async function fetchMe(token: string) {
  return apiGetWithAuth<{ user: { id: string; email: string; username: string; type: string } | null }>(
    '/auth/me',
    token,
  );
}

