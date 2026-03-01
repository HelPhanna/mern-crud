import React from "react";

interface DropDownIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
}

export const DropdownIcon: React.FC<DropDownIconProps> = ({
  width = 13,
  height = 9,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        opacity="0.4"
        d="M1.00003 1.00006L6.61367 8.00006L12 1.00006"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
