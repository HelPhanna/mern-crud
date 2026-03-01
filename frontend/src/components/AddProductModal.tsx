import {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  DragEvent,
  useEffect,
} from "react";
import { Modal } from "./ui/Modal";
import { UploadIcon } from "./icons/UploadIcon";
import { XIcon } from "./icons/XIcon";
import api from "../lib/axios";

interface Product {
  _id: string;
  name: string;
  size: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: { _id: string; name: string } | string;
  isActive: boolean;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: Product | null;
}

export const AddProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  product,
}: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: "",
    stock: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      api
        .get("/categories")
        .then((res) => setCategories(res.data))
        .catch((err) => console.error("Failed to fetch categories", err));

      if (product) {
        setFormData({
          name: product.name,
          size: product.size,
          price: String(product.price),
          stock: String(product.stock),
          category:
            typeof product.category === "object"
              ? product.category._id
              : product.category,
        });

        // Helper to construct full image URL (duplicated from Products.tsx for now)
        const getImageUrl = (imagePath?: string) => {
          if (!imagePath) return null;
          if (imagePath.startsWith("http") || imagePath.startsWith("data:"))
            return imagePath;

          const baseURL = (
            import.meta.env.VITE_API_URL || "http://localhost:3000"
          ).replace(/\/$/, "");
          const normalizedPath = imagePath.replace(/\\/g, "/");
          const pathWithSlash = normalizedPath.startsWith("/")
            ? normalizedPath
            : `/${normalizedPath}`;

          return `${baseURL}${pathWithSlash}`;
        };

        setPreviewUrl(getImageUrl(product.imageUrl));
      } else {
        setFormData({ name: "", size: "", price: "", stock: "", category: "" });
        setPreviewUrl(null);
      }
      setImageFile(null);
    }
  }, [isOpen, product]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("size", formData.size);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("category", formData.category);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (product) {
        // Update
        await api.patch(`/products/${product._id}`, formDataToSend, config);
      } else {
        // Create
        await api.post("/products", formDataToSend, config);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Failed to save product");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-7.5">
        <div className="flex justify-between items-center mb-7.5">
          <h2 className="text-xl font-bold mx-auto">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-10">
          <div className="w-1/2">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                h-[340px] border-[1.5px] border-dashed rounded-[10px] flex flex-col items-center justify-center cursor-pointer transition-colors
                ${isDragging ? "border-[#3A43EC] bg-blue-50" : "border-[#3A43EC]"}
                ${previewUrl ? "border-solid" : ""}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-contain rounded-[10px]"
                />
              ) : (
                <div className="flex flex-col items-center text-[#7D7D7D]">
                  <div className="mb-4">
                    <UploadIcon />
                  </div>
                  <p className="font-medium text-4 text-center">
                    Drag & Drop to upload
                    <br />
                    <span className="text-[#3A43EC] text-3">Or browse</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="w-1/2 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-3 font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="h-9 px-3 border border-[#000DFF]/30 rounded-[5px] bg-[#F0F2FF] outline-none focus:border-[#3A43EC]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-3 font-medium">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className="h-9 px-3 border border-[#000DFF]/30 rounded-[5px] bg-[#F0F2FF] outline-none focus:border-[#3A43EC]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-3 font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="h-9 px-3 border border-[#000DFF]/30 rounded-[5px] bg-[#F0F2FF] outline-none focus:border-[#3A43EC]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-3 font-medium">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="h-9 px-3 border border-[#000DFF]/30 rounded-[5px] bg-[#F0F2FF] outline-none focus:border-[#3A43EC]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-3 font-medium">Type</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="h-9 px-3 border border-[#000DFF]/30 rounded-[5px] bg-[#F0F2FF] outline-none focus:border-[#3A43EC]"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-[#CCCCCC] rounded-[5px] text-[#7D7D7D] font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-8 py-2 bg-[#3A43EC] rounded-[5px] text-white font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading
                  ? product
                    ? "Updating..."
                    : "Adding..."
                  : product
                    ? "Update"
                    : "Add"}
                {!isUploading && !product && (
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[10px]">
                    +
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
