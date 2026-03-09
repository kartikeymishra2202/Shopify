import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../context/auth/authContext";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Logo from "/Logo.jpg";

import { auth0CallbackApi, loginApi } from "../services/authApi";
import { Analytics } from "../lib/mixpanel";

const LoginPage = () => {
  const { state, dispatch } = useAuth();
  const { loading, error, isAuthenticated } = state;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handledAuthCode = useRef<string | null>(null);

  const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
  const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const AUTH0_REDIRECT_URI =
    import.meta.env.VITE_AUTH0_REDIRECT_URI || `${window.location.origin}/login`;

  const finalizeLogin = (res: { token: { access: string; refresh: string }; user: any }, method: "email" | "auth0") => {
    const { access, refresh } = res.token;
    const user = res.user;
    if (user) {
      Analytics.identify(user.id);
      Analytics.trackLogin(method);
    }

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { user, token: access },
    });
  };

  const handleLogin = async () => {
    try {
      dispatch({ type: "LOGIN_START" });
      const res = await loginApi(email, password);
      finalizeLogin(res, "email");
    } catch (err: unknown) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: "Invalid credentials",
      });
    }
  };

  const startAuth0Login = () => {
    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_REDIRECT_URI) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: "Auth0 is not configured on frontend",
      });
      return;
    }

    const params = new URLSearchParams({
      response_type: "code",
      client_id: AUTH0_CLIENT_ID,
      redirect_uri: AUTH0_REDIRECT_URI,
      scope: "openid profile email",
    });

    window.location.href = `https://${AUTH0_DOMAIN}/authorize?${params.toString()}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const auth0Error = params.get("error");

    if (auth0Error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: "Auth0 login failed",
      });
      return;
    }

    if (!code || handledAuthCode.current === code) return;
    handledAuthCode.current = code;

    const exchangeCode = async () => {
      try {
        dispatch({ type: "LOGIN_START" });
        const res = await auth0CallbackApi(code);
        finalizeLogin(res, "auth0");
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch {
        dispatch({
          type: "LOGIN_ERROR",
          payload: "Auth0 code exchange failed",
        });
      }
    };

    exchangeCode();
  }, [dispatch]);

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-[#f6f6f8] px-4">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
       
        className="w-full max-w-md rounded-3xl bg-white shadow-xl p-10 border border-indigo-50/50"
      >
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 shadow-inner flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-900 tracking-tight">
          Sign In
        </h2>

        <p className="text-center text-slate-500 text-sm mt-3">
          Making product search easy, accessible and cost-effective.
        </p>

        {error && (
          <div className="mt-4">
            <Error message={error} />
          </div>
        )}

        <div className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              transition-all duration-200"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold 
          hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.98] 
          transition-all duration-200 flex items-center justify-center"
        >
          {loading ? <Loading /> : "Get Started"}
        </button>

        <button
          onClick={startAuth0Login}
          disabled={loading}
          className="w-full mt-3 bg-white text-slate-900 py-4 rounded-xl font-bold border border-slate-300 hover:bg-slate-50 transition-all duration-200"
        >
          Continue with Auth0
        </button>

        <p className="text-center text-sm text-slate-600 mt-8">
          New user?{" "}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-sm text-slate-600 mt-2">
          <Link to="/forgot-password" className="font-bold text-indigo-600 hover:underline">
            Forgot password?
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
