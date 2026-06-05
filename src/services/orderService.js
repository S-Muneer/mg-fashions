import { apiRequest } from "./apiClient";

export async function createOrder(payload) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyOrders() {
  return apiRequest("/orders/my");
}

export async function getAdminOrders() {
  return apiRequest("/orders");
}

export async function updateOrderStatus(orderId, status) {
  return apiRequest(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
