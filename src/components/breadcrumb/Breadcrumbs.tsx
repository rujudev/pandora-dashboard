import { useEffect, useState } from "react";
import { UIMatch, useMatches } from "react-router";
import { CrumbData, CrumbHandle } from "../../types/breadcrumb.types";
import Breadcrumb from "./Breadcrumb";

const Breadcrumbs = () => {
    const matches = useMatches() as UIMatch<CrumbData, CrumbHandle>[];
    const [crumbs, setCrumbs] = useState<CrumbData[]>([])
    const crumbRoutes = matches.filter(route => route.pathname !== '/' || Boolean(route?.handle?.crumb));

    useEffect(() => {
        setCrumbs(crumbRoutes
            .filter((route) => route?.data && route.handle)
            .map((route, index) => {
                const { data, handle } = route;
                const crumbData = handle.crumb(data);
                const isLast = index === crumbRoutes.length - 1;

                return ({
                    ...crumbData,
                    isLast: crumbData?.isLast || isLast,
                })
            }))
    }, [matches])

    return (
        <div className="flex flex-col gap-2">
            <ol className="flex gap-2">{crumbs.map((crumb: CrumbData, index) => (
                <li key={index} className="flex gap-2">
                    <Breadcrumb crumb={crumb} />
                    {!crumb.isLast && <span className="font-sans text-sm leading-normal font-normal">/</span>}
                </li>
            ))}</ol>
        </div>
    )
}

export default Breadcrumbs;