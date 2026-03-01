import { useState, useEffect } from "react";
import { DropdownIcon } from "../icons/DropdownIcon";
import api from "../../lib/axios";
import { Category } from "@/types/category.type";

interface DropDownProps {
  onSelect?: (categoryId: string) => void;
  selectedCategory?: string;
}

export const DropDown = ({ onSelect, selectedCategory }: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories?activeOnly=true");
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  // Derive the label instead of storing it in state
  const selectedLabel = (() => {
    if (!selectedCategory || selectedCategory === "") {
      return "All Categories";
    }
    const cat = categories.find((c) => c._id === selectedCategory);
    return cat ? cat.name : "All Categories";
  })();

  const handleOptionClick = (value: string) => {
    onSelect?.(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-[165px] h-[35px]">
      {/* Backdrop to close when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-20 flex items-center justify-between w-full h-full rounded-[10px] border-[0.5px]
         border-[#000DFF] bg-white px-3.75 cursor-pointer outline-none hover:bg-gray-50 transition-colors"
      >
        <span
          className={`text-4 font-normal ${
            selectedLabel === "All Categories"
              ? "text-[#000000] opacity-50"
              : "text-black opacity-60"
          }`}
        >
          {selectedLabel === "All Categories"
            ? "All Categories"
            : selectedLabel.length > 15
              ? selectedLabel.substring(0, 12) + "..."
              : selectedLabel}
        </span>
        <div
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <DropdownIcon />
        </div>
      </button>
      {/* Options List */}
      {isOpen && (
        <div
          className="absolute top-[calc(100%+5px)] left-0 w-full bg-white border-[0.5px] border-[#000DFF] rounded-[10px] 
        shadow-lg z-20 overflow-hidden max-h-[300px] overflow-y-auto"
        >
          <ul className="flex flex-col py-1">
            <li
              onClick={() => handleOptionClick("")}
              className={`px-3.75 py-2 text-4 cursor-pointer transition-colors hover:bg-[#F0F2FF] ${
                selectedLabel === "All Categories"
                  ? "text-[#000DFF] font-medium bg-blue-50"
                  : "text-[#000000] opacity-50"
              }`}
            >
              All Categories
            </li>
            {categories.map((cat) => (
              <li
                key={cat._id}
                onClick={() => handleOptionClick(cat._id)}
                className={`px-3.75 py-2 text-4 cursor-pointer transition-colors hover:bg-[#F0F2FF] ${
                  selectedLabel === cat.name
                    ? "text-[#000DFF] font-medium bg-blue-50"
                    : "text-black"
                }`}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
