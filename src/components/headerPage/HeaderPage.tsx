import { useHeaderPage } from "../../hooks/useHeaderPage";

const HeaderPage = () => {
  const { headerConfig } = useHeaderPage()
  const { isLoadingPage, backButton, title, description, rightContent } = headerConfig

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-col max-sm:flex-col max-sm:gap-10 max-sm:items-start justify-between items-center bg-base-200 py-4">
        <div className="flex justify-between items-center w-full">
          {!isLoadingPage ? (
            <>
              <div className="flex gap-10">
                {backButton}
                <div className="flex flex-col">
                  <h1 className="antialiased tracking-normal font-sans text-2xl font-semibold leading-relaxed">
                    {title}
                  </h1>
                  <p className="antialiased tracking-normal font-sans text-base font-normal leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
              {rightContent}
            </>
          ) : (
            <>
              <div className="flex items-center gap-10">
                <div className="skeleton h-16 w-6 rounded-md"></div>
                <div className="flex flex-col gap-3">
                  <div className="skeleton h-10 w-96"></div>
                  <div className="skeleton h-6 w-56"></div>
                </div>
              </div>
              <div className="skeleton h-10 w-48 rounded-md"></div>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderPage;
