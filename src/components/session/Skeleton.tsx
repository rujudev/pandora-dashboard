const SessionsSkeleton = () => {
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <div className="flex gap-5 py-4">
                <div className="skeleton rounded-md size-7"></div>
                <div className="skeleton w-32"></div>
                <div className="skeleton rounded-md size-7"></div>
            </div>
            <div className="grid grid-cols-12 w-full">
                <div className="col-start-2 col-span-11 grid grid-cols-7 justify-items-center w-full py-4">
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-32"></div>
                </div>
            </div>
            <div className="flex flex-col gap-5 w-full">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`sessionWeek-${index}`} className="grid grid-cols-12 w-full">
                        <div className="flex justify-center items-center">
                            <div className="skeleton flex w-10 h-6" />
                        </div>
                        <div className="col-span-11 grid grid-cols-7 justify-items-center">
                            {Array.from({ length: 7 }).map((_, index) => (
                                <div key={`sessionDay-${index}`} className="flex px-6 py-4">
                                    <div className="skeleton w-5 h-7" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SessionsSkeleton;