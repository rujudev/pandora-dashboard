import React, { ReactElement } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "./Icon";

interface HeaderProps {
  children?: ReactElement;
  title?: string | ReactElement;
  description?: string | ReactElement;
  hasBackButton?: boolean;
}

const HeaderPage: React.FC<HeaderProps> = ({
  children,
  title,
  description,
  hasBackButton = false
}) => {
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-10 flex max-sm:flex-col max-sm:gap-10 max-sm:items-start justify-between items-center bg-base-200 py-4">
        <div className="flex gap-10">
          {hasBackButton && (
            <button className="flex justify-center items-center rounded-md text-primary hover:text-secondary duration-100 ease-linear cursor-pointer" onClick={() => navigate(-1)} ><ArrowLeft /></button>
          )}
          <div className="flex flex-col">
            <h1 className="antialiased tracking-normal font-sans text-2xl font-semibold leading-relaxed">
              {title}
            </h1>
            <p className="antialiased tracking-normal font-sans text-base font-normal leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        {children}
      </header>
    </>
  );
};

export default HeaderPage;
