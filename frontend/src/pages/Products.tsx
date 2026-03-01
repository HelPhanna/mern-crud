import { useState, useEffect } from "react";
import { AddCategory, AddProduct, DropDown, SearchBar } from "@/components/ui";
import { AddProductModal } from "@/components/AddProductModal";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { UpdateIcon } from "@/components/icons/UpdateIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import api from "@/lib/axios";
import { Product } from "@/types/product.type";

export default function Products() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ✅ Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params: { category?: string } = {};

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const res = await api.get("/products", { params });
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // ✅ Optimized delete (no refetch)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAddProductOpen(true);
  };

  const closeProductModal = () => {
    setIsAddProductOpen(false);
    setEditingProduct(null);
  };

  // ✅ Image URL helper
  const getImageUrl = (imagePath?: string): string => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
      return imagePath;
    }

    const baseURL = (
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    ).replace(/\/$/, "");

    const normalizedPath = imagePath.replace(/\\/g, "/");
    const pathWithSlash = normalizedPath.startsWith("/")
      ? normalizedPath
      : `/${normalizedPath}`;

    return `${baseURL}${pathWithSlash}`;
  };

  //  Search filter
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8.75">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="flex items-center space-x-4">
          <DropDown
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <AddCategory onClick={() => setIsAddCategoryOpen(true)} />
          <AddProduct onClick={() => setIsAddProductOpen(true)} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0F2FF]">
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Product Name</th>
              <th className="px-6 py-4 font-semibold">Size</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-[#F0F2FF] hover:bg-gray-50 last:border-b-0"
                >
                  {/* Image */}
                  <td className="px-6 py-4">
                    {product.imageUrl ? (
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/40?text=No+Img";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-700">{product.name}</td>

                  <td className="px-6 py-4 text-gray-700">{product.size}</td>

                  <td className="px-6 py-4 text-gray-700">
                    ${product.price.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-gray-700">{product.stock}</td>

                  <td className="px-6 py-4 text-gray-700">
                    {product.category?.name || "Uncategorized"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="hover:opacity-70 transition-opacity"
                        title="Edit"
                      >
                        <UpdateIcon />
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="hover:opacity-70 transition-opacity"
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={closeProductModal}
        onSuccess={() => {
          setIsAddProductOpen(false);
        }}
        product={editingProduct}
      />

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSuccess={() => {
          setIsAddCategoryOpen(false);
        }}
      />
    </div>
  );
}
