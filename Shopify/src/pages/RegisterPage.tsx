import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import { registerApi } from "../services/authApi";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Logo from "/Logo.jpg";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setLoading(true);

    try {
      await registerApi(name, email, password, password2);
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) return <Navigate to="/login" />;

  return (
    
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-[#f6f6f8] px-4">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl bg-white shadow-xl p-10 border border-indigo-50/50 my-8"
      >
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 shadow-inner flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-900 tracking-tight">
          Create Account
        </h2>

        <p className="text-center text-slate-500 text-sm mt-3">
          Join us and start exploring products effortlessly.
        </p>

        {error && (
          <div className="mt-4">
            <Error message={error} />
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              transition-all duration-200"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold 
          hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.98] 
          transition-all duration-200 flex items-center justify-center disabled:opacity-70"
        >
          {loading ? <Loading /> : "Create Account"}
        </button>

        <p className="text-center text-sm text-slate-600 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;