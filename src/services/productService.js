import { apiRequest } from "./apiClient";
import { CLOUDINARY_FALLBACK_IMAGE } from "../constants/cloudinaryMedia";
import { resolveMediaUrl } from "../utils/media";

const PRODUCT_CACHE_KEY = "mgf_products_cache_v1";
let productCache = null;

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

function saveProductCache(products) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(products));
  } catch {
    // ignore storage errors
  }
}

function loadProductCache() {
  if (typeof window === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(PRODUCT_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export async function getProducts(forceRefresh = false) {
  if (!forceRefresh) {
    if (productCache) return productCache;
    const cached = loadProductCache();
    if (cached) {
      productCache = cached;
      return productCache;
    }
  }

  const products = await apiRequest("/products");
  const normalized = products.map(normalizeProduct);
  productCache = normalized;
  saveProductCache(normalized);
  return normalized;
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

