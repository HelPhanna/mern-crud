import { type ReactNode } from "react";
import { Navigation } from "./Navigation";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="w-full bg-[#EEEEEE] font-sans">
      <div>
        <Navigation />
      </div>

      {children}
    </div>
  );
};
