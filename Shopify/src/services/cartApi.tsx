import api from "./api";

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
  
  
  return res.data.items.map((item) => ({
    ...item.product,
    quantity: item.quantity
  }));
};