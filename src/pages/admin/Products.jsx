import { useState } from "react";
import ProductModal from "../../components/admin/ProductModal";

const Products = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <button className="btn" onClick={() => setOpen(true)}>
        ➕ Add Product
      </button>

      <ProductModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Products;
