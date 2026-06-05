import { ACCESS_TOKEN_KEY, API_BASE_URL } from "./apiClient";

function buildEventsUrl(token) {
  const separator = API_BASE_URL.includes("?") ? "&" : "?";
  return `${API_BASE_URL}/admin/events${separator}access_token=${encodeURIComponent(token)}`;
}

export function subscribeAdminEvents(onEvent) {
  if (typeof window === "undefined" || typeof window.EventSource === "undefined") {
    return () => {};
  }

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return () => {};

  const source = new EventSource(buildEventsUrl(token));

  const consume = (type) => (event) => {
    try {
      const payload = event.data ? JSON.parse(event.data) : null;
      onEvent?.({ type, payload });
    } catch {
      onEvent?.({ type, payload: null });
    }
  };

  source.addEventListener("connected", consume("connected"));
  source.addEventListener("order_created", consume("order_created"));
  source.addEventListener("order_status_updated", consume("order_status_updated"));

  return () => {
    source.close();
  };
}
