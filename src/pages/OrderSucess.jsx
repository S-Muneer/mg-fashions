import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const orderNumber = state?.orderNumber;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg text-center max-w-md w-full">
        <div className="text-green-500 text-5xl sm:text-6xl mb-4">
          OK
        </div>

        <h2 className="text-2xl font-bold mb-2">Order Placed</h2>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with MG Fashions. Your order has been successfully placed.
        </p>
        {orderNumber ? (
          <p className="text-sm mb-5 text-gray-700">
            Order ID: <span className="font-semibold">{orderNumber}</span>
          </p>
        ) : null}

        <Link
          to="/products"
          className="inline-block bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
