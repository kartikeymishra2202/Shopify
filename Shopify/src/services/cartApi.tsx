import api from "./api";
import type { Product } from "../types/product";

export const syncCartApi = async (items: { product_id: number; quantity: number }[]) => {
 
  try{const res = await api.post("user/cart/sync", { items });
  return res.data;}
  catch(err){
     console.error(err)
     throw err
  }
};


export const fetchCartApi = async () => {
  const res = await api.get("user/cart/"); 
  
  type CartItemApi = { quantity: number; product: Product };
  const items = (res.data.items ?? []) as CartItemApi[];

  return items.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));
};
