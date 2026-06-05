import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserRegister() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await registerUser(form);
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
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-600 text-sm mb-5">Sign up for faster checkout and order updates.</p>

        <form onSubmit={submit} className="space-y-3">
          <input
            className="input"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/user/login" className="text-cyan-700 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
