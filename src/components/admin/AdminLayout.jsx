import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-30 bg-slate-950/45 transition-opacity duration-200 lg:hidden ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <aside
          className={`admin-sidebar fixed inset-y-0 left-0 z-40 w-72 p-6 transition-transform duration-200 lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-content-center rounded-xl bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-300/40">
              MG
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">
                Admin
              </p>
              <p className="text-lg font-semibold text-white">MG Fashions</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "admin-nav-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-xl border border-rose-300/45 bg-rose-400/15 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-400/25"
          >
            Logout
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setOpen(true)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm lg:hidden"
              >
                Menu
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Control Center
                </p>
                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                  Admin Dashboard
                </h1>
              </div>
              <div className="hidden text-xs text-slate-500 sm:block">
                Manage products, orders, and sales
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
