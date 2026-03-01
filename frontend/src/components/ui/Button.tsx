import { AddIcon } from "../icons";

// Add category button
export const AddCategory = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between px-3.75 bg-[#3A43EC] w-41.25 h-8.75 rounded-[10px] cursor-pointer hover:opacity-85"
    >
      <div>
        <AddIcon />
      </div>
      <div className="text-white font-medium text-4">Add Category</div>
    </button>
  );
};

// Add product button
export const AddProduct = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between px-3.75 bg-[#3A43EC] w-41.25 h-8.75 rounded-[10px] cursor-pointer hover:opacity-85"
    >
      <div>
        <AddIcon />
      </div>
      <div className="text-white font-medium text-4">Add Product</div>
    </button>
  );
};
