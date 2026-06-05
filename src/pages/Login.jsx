import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const adminFieldClass =
    "input bg-slate-900/70 border-amber-200/20 text-amber-50 placeholder:text-slate-400 focus:ring-amber-400";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await adminLogin(form);
    setLoading(false);

    if (!result.ok) {
      setError(result.message || "Login failed");
      return;
    }

    navigate("/admin");
  };

  return (
    <section className="admin-login-section min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
        className="admin-login-card p-8 rounded-3xl w-full max-w-sm text-amber-50"
      >
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="grid h-11 w-11 place-content-center rounded-full bg-amber-300/20 ring-1 ring-amber-200/45 text-sm font-bold text-amber-100">
            AD
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-100/80">
              MG Fashions
            </p>
            <p className="text-sm font-semibold text-amber-100">Admin Console</p>
          </div>
        </div>
        <div className="text-center mb-5">
          <p className="admin-login-badge">ADMIN PORTAL</p>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
        <p className="text-sm text-slate-300 text-center mb-5">
          Restricted area for catalog, inventory, and order control.
        </p>

        <form onSubmit={handleLogin}>
          <input
            className={adminFieldClass}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setError("");
            }}
            required
          />
          <input
            className={`${adminFieldClass} mt-4`}
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setError("");
            }}
            required
          />
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full admin-login-btn py-3 mt-6"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Login;
