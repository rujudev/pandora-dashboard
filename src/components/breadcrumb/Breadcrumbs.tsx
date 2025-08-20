import { Crumb, useBreadcrumbs } from "../../context/breadcrumb.context";
import Breadcrumb from "./Breadcrumb";

const Breadcrumbs = () => {
    const { crumbs } = useBreadcrumbs();

    return (
        <div className="flex flex-col gap-2">
            <ol className="flex flex-wrap gap-2">
                {Array.isArray(crumbs) ? (
                    <>
                        {crumbs.map((crumb: Crumb, index) => (
                            <li key={index} className="flex gap-2">
                                <Breadcrumb crumb={crumb} />
                                {!crumb.isLast && <span className="font-sans text-sm leading-normal font-normal">/</span>}
                            </li>
                        ))}
                    </>
                ) : (
                    <>
                        {Array.from({ length: crumbs }).map((_, index) => (
                            <li key={index} className="flex gap-2">
                                <div className="skeleton h-4 w-20" />
                                {index < crumbs && '/'}
                            </li>
                        ))}
                    </>
                )}
            </ol>
        </div>
    )
}

export default Breadcrumbs;