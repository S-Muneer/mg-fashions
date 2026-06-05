import {
  ACCESS_TOKEN_KEY,
  USER_KEY,
  apiRequest,
} from "./apiClient";

function saveSession({ token, user }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function adminLogin(payload) {
  const result = await apiRequest("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  saveSession(result);
  return result.user;
}

export async function userRegister(payload) {
  const result = await apiRequest("/auth/user/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  saveSession(result);
  return result.user;
}

export async function userLogin(payload) {
  const result = await apiRequest("/auth/user/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  saveSession(result);
  return result.user;
}

export async function me() {
  const response = await apiRequest("/auth/me");
  if (response?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }
  return response.user || null;
}
