import { useState } from "react";
import ScrollReveal from "../components/ScrollReveal";

export default function ReturnModal({ order, onClose, onSubmit }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState("defective");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: "defective", label: "Defective/Damaged" },
    { value: "not-as-described", label: "Not as Described" },
    { value: "wrong-item", label: "Wrong Item Received" },
    { value: "size-issue", label: "Size Issue" },
    { value: "color-mismatch", label: "Color Mismatch" },
    { value: "other", label: "Other" },
  ];

  const toggleItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to return");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        orderId: order.id,
        items: selectedItems,
        reason,
        details,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-cyan-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900">Request Return</h2>
          <p className="text-sm text-slate-600 mt-1">Order #{order.orderNumber}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Select Items */}
          <div>
            <label className="text-sm font-semibold text-slate-900 mb-3 block">
              Select Items to Return
            </label>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <label key={item.id} className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="mt-1 w-5 h-5 text-cyan-600 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900">{item.productName}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Qty: {item.quantity} | Size: {item.size} | Rs {item.priceAtPurchase * item.quantity}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Return Reason */}
          <div>
            <label className="text-sm font-semibold text-slate-900 mb-3 block">
              Return Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Details */}
          <div>
            <label className="text-sm font-semibold text-slate-900 mb-3 block">
              Additional Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell us more about the issue (optional)"
              maxLength={500}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              rows={4}
            />
            <p className="text-xs text-slate-500 mt-1">{details.length}/500 characters</p>
          </div>

          {/* Return Policy Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-900 uppercase">Return Policy</p>
            <ul className="text-xs text-blue-800 mt-2 space-y-1 list-disc list-inside">
               <li>Returns accepted within 7 days of purchase</li>
              <li>Items must be unused and in original packaging</li>
              <li>Refund processed within 5-7 business days</li>
              <li>Return shipping is prepaid</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || selectedItems.length === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Submit Return Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
