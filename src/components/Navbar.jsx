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
  const { isUserLoggedIn, isAdmin, logoutUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="site-top-strip text-center text-xs sm:text-sm py-1.5 font-semibold tracking-wide">
        <marquee behavior="scroll" direction="left" scrollamount="5" className="text-red-600 font-bold ">
          Please do not make any payment. This is a demo store and no real transactions will occur.This website is made for testing purposes only.
        </marquee>
        Free shipping above Rs 1499 | New arrivals every week
      </div>
      <nav className="site-nav-shell backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <img
                src={logo}
                alt="MG Fashions"
                className="h-10 sm:h-11 w-10 sm:w-11 rounded-full object-cover border border-teal-200/50"
              />
              <div className="hidden sm:block">
                <p className="text-lg sm:text-xl font-bold tracking-wide">MG Fashions</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-teal-100">
                  Style Store
                </p>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden site-ghost-btn px-3 py-2 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? "✕ Close" : "☰ Menu"}
            </button>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-4 xl:gap-5 text-sm font-medium flex-1 justify-center">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={navItemClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Desktop Auth & Cart */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <NavLink to="/cart" className={navItemClass} title="Shopping Cart">
                🛒 ({cartCount})
              </NavLink>

              {isUserLoggedIn ? (
                <>
                  <NavLink to="/account" className={navItemClass} title="My Account">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-full hover:shadow-md transition border border-cyan-200">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          👤
                        </div>
                        <span className="text-xs font-semibold text-slate-700">Account</span>
                      </div>
                  </NavLink>
                  <button
                    onClick={logoutUser}
                    className="site-ghost-btn px-3 py-1.5 transition"
                  >
                      🚪 Logout
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
                  <NavLink to="/admin/dashboard" className={navItemClass} title="Admin Dashboard">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full hover:shadow-md transition border border-amber-200">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          ⚙️
                        </div>
                        <span className="text-xs font-semibold text-slate-700">Admin</span>
                      </div>
                  </NavLink>
                  <button
                    onClick={logoutUser}
                    className="site-ghost-btn px-3 py-1.5 transition"
                  >
                      🚪 Logout
                  </button>
                </>
              ) : (
                !isUserLoggedIn && (
                  <Link
                    to="/admin/login"
                      className="site-primary-btn inline-flex items-center gap-2 px-4 py-2 transition hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <span className="grid h-5 w-5 place-content-center rounded-full bg-black/20 text-[10px] font-bold">
                      AD
                    </span>
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-teal-200/30">
              <ul className="site-mobile-menu grid grid-cols-1 p-4 gap-2 text-sm font-medium">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={navItemClass}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </NavLink>
                ))}

                <div className="border-t border-teal-200/30 pt-3  space-y-2">
                  <NavLink
                    to="/cart"
                    className={navItemClass}
                    onClick={closeMobileMenu}
                  >
                    🛒 Cart ({cartCount})
                  </NavLink>

                  {isUserLoggedIn ? (
                    <>
                      <NavLink
                        to="/account"
                        className={navItemClass}
                        onClick={closeMobileMenu}
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                            👤
                          </div>
                          My Account
                        </span>
                      </NavLink>
                      <button
                        onClick={() => {
                          logoutUser();
                          closeMobileMenu();
                        }}
                        className="site-ghost-btn  text-left px-3 py-2"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/user/login"
                      className="site-outline-btn block text-center px-4 py-2"
                      onClick={closeMobileMenu}
                    >
                      User Login
                    </Link>
                  )}

                  {isAdmin ? (
                    <>
                      <NavLink
                        to="/admin/dashboard"
                        className={navItemClass}
                        onClick={closeMobileMenu}
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            ⚙️
                          </div>
                          Admin Dashboard
                        </span>
                      </NavLink>
                      <button
                        onClick={() => {
                          logoutUser();
                          closeMobileMenu();
                        }}
                        className="site-ghost-btn w-full text-left px-3 py-2"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    !isUserLoggedIn && (
                      <Link
                        to="/admin/login"
                        className="site-primary-btn block text-center px-4 py-2"
                        onClick={closeMobileMenu}
                      >
                        Admin Login
                      </Link>
                    )
                  )}
                </div>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
