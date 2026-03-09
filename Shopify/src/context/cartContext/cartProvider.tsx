import { useReducer, useEffect, useCallback, type ReactNode } from "react";
import { CartContext } from "./CartContext";
import type { CartAction, CartItem, CartState } from "../../types/Cart";
import { useAuth } from "../auth/authContext";
import { fetchCartApi, syncCartApi } from "../../services/cartApi";



const getLocalCart = (): CartItem[] => {
  const localCart = localStorage.getItem("cart");
  return localCart ? JSON.parse(localCart) : [];
};

const getNextCartState = (
  currentItems: CartItem[],
  action: CartAction
): CartItem[] => {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADD_TO_CART": {
      const exists = currentItems.find((i) => i.id === action.payload.id);
      if (exists) {
        return currentItems.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...currentItems, { ...action.payload, quantity: 1 }];
    }

    case "INCREMENT_QTY":
      return currentItems.map((i) =>
        i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
      );

    case "DECREMENT_QTY":
      return currentItems.map((i) =>
        i.id === action.payload && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );

    case "REMOVE_FROM_CART":
      return currentItems.filter((i) => i.id !== action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return currentItems;
  }
};



function CartReducer(state: CartState, action: CartAction): CartState {
  return { items: getNextCartState(state.items, action) };
}


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(CartReducer, { items: [] });
  const { state: authState } = useAuth();
  const { isAuthenticated } = authState;



  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const serverItems = await fetchCartApi();
          dispatch({ type: "SET_CART", payload: serverItems });
        } catch (error) {
          console.error("Failed to load server cart", error);
        }
      } else {
        dispatch({ type: "SET_CART", payload: getLocalCart() });
      }
    };

    loadCart();
  }, [isAuthenticated]);


  const cartDispatch = useCallback(
    async (action: CartAction) => {
      const backupItems = [...state.items];
      const nextItems = getNextCartState(state.items, action);

      dispatch(action);

      try {
        if (isAuthenticated) {
          const payload = nextItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          }));

          await syncCartApi(payload);
        } else {
          localStorage.setItem("cart", JSON.stringify(nextItems));
        }
      } catch (error) {
        console.error("Sync failed! Rolling back.", error);

        // rollback
        dispatch({ type: "SET_CART", payload: backupItems });
        alert("Cart could not be saved.");
      }
    },
    [state.items, isAuthenticated]
  );

  return (
    <CartContext.Provider value={{ state, dispatch: cartDispatch }}>
      {children}
    </CartContext.Provider>
  );
};