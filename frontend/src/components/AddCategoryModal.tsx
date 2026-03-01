import { useState, FormEvent } from "react";
import { Modal } from "./ui/Modal";
import { XIcon } from "./icons/XIcon";
import api from "../lib/axios";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddCategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/categories", formData);
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Failed to create category", error);
      alert("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-7.5">
        {/* Header */}
        <div className="flex justify-between items-center mb-7.5">
          <h2 className="text-xl font-bold mx-auto">Add New Category</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <XIcon />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-w-md mx-auto"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-3 font-medium">Name</label>
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
            <label className="text-3 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="px-3 py-2 border border-[#000DFF]/30 rounded-[5px] bg-[#F0F2FF] outline-none focus:border-[#3A43EC] resize-none"
            />
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
              disabled={isSubmitting}
              className="px-8 py-2 bg-[#3A43EC] rounded-[5px] text-white font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              {isSubmitting ? "Adding..." : "Add"}
              {!isSubmitting && (
                <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[10px]">
                  +
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
