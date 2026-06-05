function normalizeBaseUrl(url) {
  return String(url || "").replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || "/api"
);

export const ACCESS_TOKEN_KEY = "mg_fashions_access_token";
export const USER_KEY = "mg_fashions_user";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const isFormDataBody =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = {
    ...(isFormDataBody ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload;
}
