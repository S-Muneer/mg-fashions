import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const shopLinks = [
  { to: "/products", label: "All Products" },
  { to: "/collections", label: "Collections" },
  { to: "/deals", label: "Deals" },
  { to: "/cart", label: "Cart" },
];

const companyLinks = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
  { to: "/user/login", label: "User Login" },
  { to: "/admin/login", label: "Admin Login" },
];

const linkClass = "site-footer-link";

export default function Footer() {
  return (
    <footer className="site-footer px-4 sm:px-6 py-12 mt-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={logo}
              alt="MG Fashions Logo"
              className="h-12 w-12 rounded-full border border-teal-200/45"
            />
            <div>
              <h3 className="text-white font-bold">MG Fashions</h3>
              <p className="text-xs text-teal-100">Fashion Marketplace</p>
            </div>
          </div>
          <p className="text-sm leading-6">
            Inspired by modern e-commerce style experiences and focused on quality-first catalog curation.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-3">Shop</h3>
          <ul className="text-sm space-y-2">
            {shopLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-3">Company</h3>
          <ul className="text-sm space-y-2">
            {companyLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-3">Support</h3>
          <p className="text-sm">Bangalore, India</p>
          <p className="text-sm mt-1">support@mgfashions.com</p>
          <p className="text-sm mt-1">+91 90000 00000</p>
          <p className="text-xs text-teal-100 mt-4">
            Mon-Sat: 10:00 AM - 8:00 PM
          </p>
        </div>
      </div>

      <div className="border-t border-teal-100/20 mt-10 pt-4 text-center text-xs">
        Copyright {new Date().getFullYear()} MG Fashions. All rights reserved.
      </div>
    </footer>
  );
}
