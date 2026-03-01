import { SearchIcon } from "../icons/SearchIcon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative flex items-center w-49.5">
      <input
        type="text"
        placeholder="Search Product"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        /* Added 'peer' class here */
        className="peer pl-9 bg-white border-[0.5px] border-[#000DFF] w-full md:w-62.5 h-8.75 rounded-[10px] outline-none
         placeholder:text-[#000000] placeholder:opacity-50 focus:border-[#000DFF] focus:ring-1 focus:ring-[#000DFF] transition-colors"
      />
      {/* Use peer class if you want to style sibling elements based on the state of this input. like hide search icon on focus. */}
      <div className="absolute left-3.75 mt-2.5 flex items-center opacity-50 pointer-events-none">
        <SearchIcon />
      </div>
      {/* peer-focus:hidden */}
    </div>
  );
};
