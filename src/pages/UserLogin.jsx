import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserLogin() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginUser(form);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/account");
  };

  return (
    <section className="user-login-section py-12 sm:py-16 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="user-login-card max-w-md mx-auto rounded-3xl p-6 sm:p-8"
      >
        <p className="user-login-badge mb-3">CUSTOMER ACCOUNT</p>
        <h1 className="text-2xl font-bold mb-2">Customer Login</h1>
        <p className="text-gray-600 text-sm mb-5">
          Access your account, orders, saved address, and checkout details.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error ? <p className="text-red-600 text-sm">{error}</p> : null}
          <button
            disabled={loading}
            className="w-full user-login-btn py-2.5"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          New customer?{" "}
          <Link to="/user/register" className="text-cyan-700 hover:underline">
            Create account
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
