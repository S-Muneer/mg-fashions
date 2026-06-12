export default function OrderInvoice({ order, onClose }) {
  if (!order) return null;

  const invoiceDate = new Date(order.createdAt || order.updatedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatCurrency = (value = 0) =>
    `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

  const addressParts = [
    order.shippingAddress?.address,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.postalCode,
  ].filter(Boolean);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-modal fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="invoice-window max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="invoice-actions flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
              Invoice
            </p>
            <h2 className="text-xl font-bold text-slate-950">
              {order.orderNumber || "Order Invoice"}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>

        <div id="invoice-content" className="max-h-[78vh] overflow-y-auto bg-slate-50 p-5 sm:p-8">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
            <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-content-center rounded-xl bg-cyan-700 text-lg font-bold text-white">
                  MG
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-950">MG Fashions</h1>
                  <p className="mt-1 text-sm text-slate-600">Premium Fashion Store</p>
                  <p className="mt-2 text-xs text-slate-500">
                    support@mgfashions.com | +91 9876543210
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-left sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-800">
                  Invoice Number
                </p>
                <p className="mt-2 font-mono text-lg font-extrabold text-slate-950">
                  {order.orderNumber}
                </p>
                <p className="mt-1 text-sm text-slate-600">{invoiceDate}</p>
              </div>
            </div>

            <div className="grid gap-4 border-b border-slate-200 py-6 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Bill To
                </p>
                <p className="mt-3 text-lg font-bold text-slate-950">{order.customerName}</p>
                <p className="mt-1 text-sm text-slate-600">{order.customerEmail}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Ship To
                </p>
                <p className="mt-3 text-lg font-bold text-slate-950">
                  {order.shippingAddress?.fullName || order.customerName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {addressParts.length ? addressParts.join(", ") : "Shipping address not available"}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto py-6">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-xs uppercase tracking-[0.12em] text-slate-500">
                    <th className="px-4 py-3 font-bold">Product</th>
                    <th className="px-4 py-3 text-center font-bold">Qty</th>
                    <th className="px-4 py-3 text-right font-bold">Unit Price</th>
                    <th className="px-4 py-3 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => {
                    const price = item.priceAtPurchase ?? item.price ?? 0;
                    return (
                      <tr key={`${item.productName}-${idx}`} className="border-b border-slate-100">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-950">{item.productName}</p>
                          {item.size ? (
                            <p className="mt-1 text-xs text-slate-500">Size: {item.size}</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-slate-700">
                          {formatCurrency(price)}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-slate-950">
                          {formatCurrency((item.quantity || 0) * price)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_22rem]">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Payment & Status
                </p>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Payment Method</p>
                    <p className="font-semibold capitalize text-slate-950">
                      {order.paymentMethod || "Not available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Order Status</p>
                    <p className="font-semibold text-slate-950">{order.status}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-950">{formatCurrency(order.total)}</span>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold text-emerald-700">Free</span>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-600">Discount</span>
                  <span className="font-semibold text-slate-950">Rs 0</span>
                </div>
                <div className="mt-4 flex justify-between border-t border-cyan-200 pt-4">
                  <span className="font-bold text-slate-950">Total Amount</span>
                  <span className="text-xl font-extrabold text-cyan-800">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5 text-center">
              <p className="text-sm font-semibold text-slate-950">Thank you for your business.</p>
              <p className="mt-1 text-xs text-slate-500">
                This is an auto-generated invoice. For inquiries, contact support@mgfashions.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
