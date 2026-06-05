import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/collections", label: "Collections" },
  { to: "/brands", label: "Brands" },
  { to: "/deals", label: "Deals" },
  { to: "/gift-cards", label: "Gift Cards" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const navItemClass = ({ isActive }) =>
  `site-nav-link transition ${isActive ? "site-nav-link-active" : ""}`;

export default function Navbar() {
  const { cartCount } = useCart();
  const { isUserLoggedIn, isAdmin, user, logoutUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="site-top-strip text-center text-xs sm:text-sm py-1.5 font-semibold tracking-wide">
        Free shipping above Rs 1499 | New arrivals every week
      </div>
      <nav className="site-nav-shell backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="MG Fashions"
                className="h-11 w-11 rounded-full object-cover border border-teal-200/50"
              />
              <div>
                <p className="text-lg sm:text-xl font-bold tracking-wide">MG Fashions</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-teal-100">
                  Style Store
                </p>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden site-ghost-btn px-3 py-1"
            >
              Menu
            </button>

            <ul className="hidden lg:flex items-center gap-5 text-sm font-medium">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={navItemClass}>
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/cart" className={navItemClass}>
                Cart ({cartCount})
              </NavLink>
              {isUserLoggedIn ? (
                <>
                  <NavLink to="/account" className={navItemClass}>
                    Hi, {user?.name?.split(" ")[0] || "Account"}
                  </NavLink>
                  <button
                    onClick={logoutUser}
                    className="site-ghost-btn px-3 py-1.5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/user/login"
                  className="site-outline-btn px-4 py-2 transition"
                >
                  User Login
                </Link>
              )}
              {isAdmin ? (
                <>
                  <NavLink to="/admin/dashboard" className={navItemClass}>
                    Admin Dashboard
                  </NavLink>
                  <button
                    onClick={logoutUser}
                    className="site-ghost-btn px-3 py-1.5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="site-primary-btn inline-flex items-center gap-2 px-4 py-2"
                >
                  <span className="grid h-6 w-6 place-content-center rounded-full bg-black/20 text-[11px] font-bold">
                    AD
                  </span>
                  Admin
                </Link>
              )}
            </ul>
          </div>

          {mobileOpen && (
            <ul className="site-mobile-menu lg:hidden mt-4 grid grid-cols-2 gap-3 text-sm font-medium p-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={navItemClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/cart" className={navItemClass} onClick={() => setMobileOpen(false)}>
                Cart ({cartCount})
              </NavLink>
              {isUserLoggedIn ? (
                <>
                  <NavLink to="/account" className={navItemClass} onClick={() => setMobileOpen(false)}>
                    Account
                  </NavLink>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileOpen(false);
                    }}
                    className="site-ghost-btn py-2 px-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/user/login"
                  className="site-outline-btn px-4 py-2 inline-block text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  User Login
                </Link>
              )}
              {isAdmin ? (
                <>
                  <NavLink
                    to="/admin/dashboard"
                    className={navItemClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileOpen(false);
                    }}
                    className="site-ghost-btn py-2 px-4 col-span-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="site-primary-btn inline-flex items-center justify-center gap-2 px-4 py-2 text-center col-span-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="grid h-6 w-6 place-content-center rounded-full bg-black/20 text-[11px] font-bold">
                    AD
                  </span>
                  Admin
                </Link>
              )}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}
