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

export const createAdminProduct = async (payload: FormData) => {
  const res = await api.post("admin/products/", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};


