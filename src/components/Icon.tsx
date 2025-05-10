"use client";

import { ReactNode, MouseEventHandler } from "react";

interface IconProps {
  currColor: boolean;
  isActive: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children: ReactNode;
}

const Icon: React.FC<IconProps> = ({
  currColor,
  isActive,
  children,
  onClick,
}) => {
  return (
    <div
      className={`p-1 rounded cursor-pointer ${
        currColor && isActive ? "bg-[#2F3030]" : ""
      } ${!currColor && isActive ? "bg-gray-200" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Icon;
