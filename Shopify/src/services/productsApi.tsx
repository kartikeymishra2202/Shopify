import api from "./api";

export const fetchProducts = async (params = {}) => {
  const res = await api.get("products/", { params });
  return res.data;
};

export const fetchCategories = async () => {
  const res = await api.get("categories/");
  return res.data;
};
export const fetchProductBySlug = async (slug: string) => {
  const res = await api.get(`products/${slug}/`);
  return res.data;
};

type AdminCreateProductPayload = {
  title: string;
  description: string;
  price: string;
  stock: string;
  category_id: number;
  is_active: boolean;
  image: string;
};

export const createAdminProduct = async (payload: AdminCreateProductPayload) => {
  const res = await api.post("admin/products/", payload);
  return res.data;
};


