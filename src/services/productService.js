import { apiRequest } from "./apiClient";
import { CLOUDINARY_FALLBACK_IMAGE } from "../constants/cloudinaryMedia";
import { resolveMediaUrl } from "../utils/media";

function normalizeProduct(product) {
  return {
    id: Number(product.id),
    name: product.name || "Untitled Product",
    category: product.category || "General",
    price: Number(product.price) || 0,
    image: resolveMediaUrl(product.image || CLOUDINARY_FALLBACK_IMAGE),
    description: product.description || "No description available.",
    sizes:
      Array.isArray(product.sizes) && product.sizes.length
        ? product.sizes
        : ["Free Size"],
    inStock: product.inStock !== false,
    rating: Number(product.rating) || 4.2,
  };
}

export async function getProducts() {
  const products = await apiRequest("/products");
  return products.map(normalizeProduct);
}

export async function getProductById(id) {
  const product = await apiRequest(`/products/${id}`);
  return normalizeProduct(product);
}

export async function addProduct(product) {
  const created = await apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
  return normalizeProduct(created);
}

export async function updateProduct(id, updates) {
  const updated = await apiRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return normalizeProduct(updated);
}

export async function deleteProduct(id) {
  await apiRequest(`/products/${id}`, {
    method: "DELETE",
  });
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiRequest("/uploads/product-image", {
    method: "POST",
    body: formData,
  });

  if (!response || !response.url) {
    throw new Error("Upload failed");
  }

  return response.url;
}

