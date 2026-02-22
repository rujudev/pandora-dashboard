import { Crumb, useBreadcrumbs } from "../../context/Breadcrumbs.context";
import Breadcrumb from "./Breadcrumb";

const Breadcrumbs = () => {
    const { crumbs } = useBreadcrumbs();

    return (
        <div className="breadcrumbs flex flex-col gap-2">
            <ul className="flex flex-wrap">
                {Array.isArray(crumbs) ? (
                    <>
                        {crumbs.map((crumb: Crumb, index) => (
                            <li key={index}>
                                <Breadcrumb crumb={crumb} />
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
            </ul>
        </div>
    )
}

export default Breadcrumbs;