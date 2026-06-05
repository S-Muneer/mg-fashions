import { API_BASE_URL } from "../services/apiClient";

const EXTERNAL_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;

function getApiOrigin() {
  if (!API_BASE_URL || API_BASE_URL.startsWith("/")) return "";
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "";
  }
}

const API_ORIGIN = getApiOrigin();

export function resolveMediaUrl(path) {
  const value = String(path || "").trim();
  if (!value) return "";

  if (
    EXTERNAL_URL_PATTERN.test(value) ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  // Preserve local frontend static assets as root-relative paths.
  if (
    value.startsWith("/images") ||
    value.startsWith("/assets") ||
    value.startsWith("/logo") ||
    value.startsWith("/favicon")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return API_ORIGIN ? `${API_ORIGIN}${value}` : value;
  }

  return API_ORIGIN ? `${API_ORIGIN}/${value}` : `/${value}`;
}

