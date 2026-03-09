import { useEffect, useState } from "react";
import { fetchCategories, createAdminProduct } from "../services/productsApi";
import Error from "../components/Error";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminAddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(String(data[0].id));
        }
      })
      .catch(() => setError("Failed to load categories."));
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setStock("");
    setImage(null);
    setIsActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!image) {
      setError("Product image is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category_id", categoryId);
      formData.append("is_active", String(isActive));
      formData.append("image", image);

      await createAdminProduct(formData);
      setSuccess("Product created successfully.");
      resetForm();
    } catch {
      setError("Failed to create product. Check all fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-10 flex justify-center">
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Add Product</h1>
        <p className="text-sm text-slate-500 mb-6">Admin only product creation form.</p>

        {error && <Error message={error} />}
        {success && (
          <div className="my-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm font-semibold">
            {success}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Stock</label>
            <input
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-200"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active product
            </label>
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 text-white px-6 py-3 font-bold hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
