import type { AuthState } from "../../types/auth";
import type { AuthAction } from "./authAction";


export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "LOGOUT":
      return initialAuthState;

    default:
      return state;
  }
};
