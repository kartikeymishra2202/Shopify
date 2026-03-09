import { createContext } from "react";
import type { CartAction, CartState } from "../../types/Cart";

export interface CartContextType {
  state: CartState;
  dispatch: (action: CartAction) => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);