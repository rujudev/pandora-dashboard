import React from "react";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  description?: string | React.ReactElement;
}

const HeaderPage: React.FC<HeaderProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <>
      <header className="flex justify-between items-center">
        <div>
          <h1 className="antialiased tracking-normal font-sans text-2xl font-semibold leading-relaxed">
            {title}
          </h1>
          <p className="antialiased tracking-normal font-sans text-base font-normal leading-relaxed">
            {description}
          </p>
        </div>
        {children}
      </header>
    </>
  );
};

export default HeaderPage;
