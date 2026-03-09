import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { passwordResetConfirmApi } from "../services/authApi";

const ResetPasswordPage = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!uid || !token) {
      toast.error("Invalid reset link.");
      return;
    }
    if (!password || !password2) {
      toast.error("Please fill both password fields.");
      return;
    }

    try {
      setLoading(true);
      await passwordResetConfirmApi(uid, token, password, password2);
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch {
      toast.error("Reset link is invalid or expired.");
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
        <h2 className="text-2xl font-bold text-center text-slate-900">Reset Password</h2>
        <p className="text-center text-slate-500 text-sm mt-3">
          Enter your new password below.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all duration-200"
        >
          {loading ? "Updating..." : "Update Password"}
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

export default ResetPasswordPage;
