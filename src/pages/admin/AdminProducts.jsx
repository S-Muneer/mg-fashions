import { useEffect, useMemo, useState } from "react";
import { addProduct, deleteProduct, getProducts, updateProduct, uploadImage } from "../../services/productService";
import { CLOUDINARY_FALLBACK_IMAGE } from "../../constants/cloudinaryMedia";

const CATEGORY_OPTIONS = [
  "General",
  "Ladies Wear",
  "Men",
  "Women",
  "Kids Wear",
  "Accessories",
  "Sale",
  "New Arrivals",
];

const initialForm = {
  name: "",
  category: "General",
  price: "",
  image: CLOUDINARY_FALLBACK_IMAGE,
  description: "",
  sizes: "M,L,XL",
  inStock: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch((apiError) => {
        if (mounted) setError(apiError.message || "Failed to load products");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setError("");
    } catch (apiError) {
      setError(apiError.message || "Failed to refresh products");
    }
  };

  const filtered = useMemo(() => {
    return products.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const inStockCount = filtered.filter((item) => item.inStock).length;
  const outOfStockCount = filtered.length - inStockCount;

  const openAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
      sizes: product.sizes.join(","),
      inStock: product.inStock,
    });
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      image: form.image,
      description: form.description,
      sizes: form.sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      inStock: form.inStock,
    };
    if (editingId) {
      try {
        await updateProduct(editingId, payload);
      } catch (apiError) {
        setError(apiError.message || "Could not update product");
        return;
      }
    } else {
      try {
        await addProduct(payload);
      } catch (apiError) {
        setError(apiError.message || "Could not add product");
        return;
      }
    }
    setFormOpen(false);
    await loadProducts();
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
    } catch (apiError) {
      setError(apiError.message || "Could not delete product");
      return;
    }
    await loadProducts();
  };

  const markOutOfStock = async (product) => {
    try {
      await updateProduct(product.id, { inStock: false });
    } catch (apiError) {
      setError(apiError.message || "Could not update stock");
      return;
    }
    await loadProducts();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setForm({ ...form, image: imageUrl });
    } catch (apiError) {
      setError(apiError.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="admin-panel p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
              Catalog
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Product Management
            </h2>
          </div>
          <button
            onClick={openAdd}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Add Product
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Total listed: <span className="font-semibold">{filtered.length}</span>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            In stock: <span className="font-semibold">{inStockCount}</span>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Out of stock: <span className="font-semibold">{outOfStockCount}</span>
          </div>
        </div>
        <div className="mt-6 rounded-[2rem] border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-slate-50 p-5 text-slate-900 shadow-lg">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-700 font-semibold">Product gallery</p>
          <p className="mt-3 text-base text-slate-600">
            Manage your catalog in a visual gallery layout with larger item cards, quick stock controls, and clearer preview details.
          </p>
        </div>
      </section>

      <div className="mb-2">
        {error ? (
          <p className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search products by name"
          className="input max-w-lg border-slate-300 bg-white/85"
        />
      </div>

      {paginated.length === 0 ? (
        <div className="admin-panel rounded-[2rem] border border-slate-200 bg-white shadow-[0_22px_40px_-28px_rgba(15,23,42,0.35)] p-10 text-center">
          <p className="text-xl font-semibold text-slate-900">No products found</p>
          <p className="mt-2 text-sm text-slate-500">
            Add a new item or clear the search filter to see your catalog.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {paginated.map((p) => (
            <div
              key={p.id}
              className="admin-panel overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-56 w-full object-cover transition duration-500 hover:scale-105"
                />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-900 shadow-sm">
                {p.category}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{p.description}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                    p.inStock ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {p.inStock ? "In stock" : "Out"}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold text-cyan-700">Rs {p.price}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{p.sizes.join(" / ")}</p>
                </div>
                <div className="grid gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => markOutOfStock(p)}
                    className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                  >
                    OOS
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded-2xl border border-rose-300 bg-rose-50 py-2 text-rose-700 transition hover:bg-rose-100"
                >
                  Delete
                </button>
                <button
                  className="rounded-2xl border border-slate-300 bg-slate-50 py-2 text-slate-700 transition hover:bg-slate-100"
                >
                  Quick preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              currentPage === i + 1
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-xl space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
          >
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input bg-white"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                className="input"
                placeholder="Price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <input
                className="input"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="text-sm"
                />
                {uploading && <span className="text-sm text-slate-500">Uploading...</span>}
              </div>
              {form.image ? (
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-40 w-full rounded-xl border border-slate-200 object-cover"
                />
              ) : null}
            </div>
            <input
              className="input"
              placeholder="Sizes (comma separated)"
              value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            />
            <textarea
              className="input min-h-24"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              />
              Product is in stock
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
