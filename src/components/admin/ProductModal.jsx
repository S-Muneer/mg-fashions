import { AnimatePresence } from "framer-motion";

const ProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {product ? "Edit Product" : "Add Product"}
          </h2>

          <input className="input mb-3" placeholder="Product Name" />
          <input className="input mb-3" placeholder="Price" />
          <input className="input mb-3" placeholder="Image path or URL" />
          <textarea className="input mb-3" placeholder="Description" />

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button className="px-4 py-2 bg-pink-500 text-white rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
