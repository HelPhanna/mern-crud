// import { ChartBarStacked, ShoppingCart } from "lucide-react";
import { Logo } from "../icons";

export const Navigation = () => {
  return (
    <div className="bg-white h-18.75 px-40 flex items-center justify-between stoke-[#E2E2E2]">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2.5 cursor-pointer">
        <div>
          <Logo />
        </div>
        <div className="font-bold text-[25px]">
          <span>Product</span> <span className="text-[#000DFF]">CRUD</span>
        </div>
      </div>
      {/* product and category */}
      {/* <div className="flex gap-10 font-medium text-md">
        <div className="flex gap-2.5 hover:text-[#000DFF] cursor-pointer">
          <ShoppingCart className="size-5" />
          Product
        </div>
        <div className="flex gap-2.5 hover:text-[#000DFF] cursor-pointer">
          <ChartBarStacked className="size-5" />
          Category
        </div>
      </div> */}
      {/* sign-out button */}
      {/* <div>
        <button className="flex items-center justify-center w-29.5 h-8.75 rounded-[10px] bg-[#FF0C0C] hover:bg-[#CC0D0D] hover:opacity-65 cursor-pointer">
          <div className="mt-3">
            <LogoutIcon />
          </div>
          <div className="text-white font-medium text-[15px]">Log Out</div>
        </button>
      </div> */}
    </div>
  );
};
