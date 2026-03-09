import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { passwordResetRequestApi } from "../services/authApi";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await passwordResetRequestApi(email);
      toast.success("If the account exists, a reset link has been sent.");
    } catch {
      toast.error("Unable to process request right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-[#f6f6f8] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-3xl bg-white shadow-xl p-10 border border-indigo-50/50"
      >
        <h2 className="text-2xl font-bold text-center text-slate-900">Forgot Password</h2>
        <p className="text-center text-slate-500 text-sm mt-3">
          Enter your email to receive a password reset link.
        </p>

        <div className="mt-8">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="abc@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all duration-200"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-center text-sm text-slate-600 mt-6">
          Back to{" "}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
