import type { Product } from "./product";

export interface CartItem extends Product{
    id:number,
    quantity:number
};

export interface CartState{
    items:CartItem[]
}

export type CartAction=
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "SET_CART"; payload:CartItem[] }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "INCREMENT_QTY"; payload: number }
  | { type: "DECREMENT_QTY"; payload: number }
  | { type: "CLEAR_CART" }
