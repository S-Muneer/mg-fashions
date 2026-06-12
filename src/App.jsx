import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";

// Lazy load pages for better performance
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Collections = lazy(() => import("./pages/Collections"));
const Deals = lazy(() => import("./pages/Deals"));
const FAQ = lazy(() => import("./pages/FAQ"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSucess"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Brands = lazy(() => import("./pages/Brands"));
const GiftCards = lazy(() => import("./pages/GiftCards"));
const UserLogin = lazy(() => import("./pages/UserLogin"));
const UserRegister = lazy(() => import("./pages/UserRegister"));
const Account = lazy(() => import("./pages/Account"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const UserProtectedRoute = lazy(() => import("./components/UserProtectedRoute"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Invoice = lazy(() => import("./pages/admin/Invoice"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
  </div>
);

function App() {
  const location = useLocation();
  const isAdminWorkspace =
    location.pathname.startsWith("/admin") && location.pathname !== "/admin/login";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminWorkspace && <Navbar />}
      {!isAdminWorkspace && <CartDrawer />}
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route
              path="/account"
              element={
                <UserProtectedRoute>
                  <Account />
                </UserProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <UserProtectedRoute>
                  <MyOrders />
                </UserProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<Orders />} />
              <Route path="invoices" element={<Invoice />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminWorkspace && <Footer />}
    </div>
  );
}

export default App;
