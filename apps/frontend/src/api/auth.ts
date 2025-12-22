import { apiGet, apiPost } from './client';

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
  return apiPost('/auth/change-password', { oldPassword, newPassword }, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchMe(token: string) {
  return apiGet<{ user: { id: string; email: string; username: string; type: string } | null }>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

