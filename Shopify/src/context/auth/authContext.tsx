import type {ReactNode} from "react";
import { createContext, useContext, useReducer,  useEffect } from "react";
import { authReducer, initialAuthState } from "./authReducer";
import type { AuthState } from "../../types/auth";
import type { AuthAction } from "./authAction";


interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  useEffect(() => {
  
  const token = localStorage.getItem("access");
  const user = localStorage.getItem("user");

  if (token && user) {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        token,
        user: JSON.parse(user),
      },
    });
  }

}, []);


  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("used within CartProvider");
  }
  return context;
};
