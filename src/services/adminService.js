import { apiRequest } from "./apiClient";

function toQueryString(params = {}) {
  const parts = [];
  for (const key of Object.keys(params)) {
    const value = params[key];
    if (value === undefined || value === null || value === "") continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

export async function getAdminStats(filters = {}) {
  const qs = toQueryString(filters);
  return apiRequest(`/admin/stats${qs}`);
}
