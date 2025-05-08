import { useEffect, useState } from "react";
import { UIMatch, useMatches } from "react-router";
import { CrumbData, CrumbHandle } from "../types/breadcrumb.types";
import Breadcrumb from "./Breadcrumb";

const Breadcrumbs = () => {
    const matches = useMatches() as UIMatch<CrumbData, CrumbHandle>[];
    const [crumbs, setCrumbs] = useState([{ path: '', isLast: false, label: '' }])
    const crumbRoutes = matches.filter(route => route.pathname !== '/' || Boolean(route.handle?.crumb));

    useEffect(() => {
        setCrumbs(crumbRoutes
            .map((route, index) => {
                const { data, handle, pathname } = route;
                const crumbData = handle.crumb(data);
                const crumbPath = pathname.replace(/\/$/, '');
                const isLast = index === crumbRoutes.length - 1;

                return ({
                    path: crumbPath,
                    isLast,
                    ...crumbData,
                })
            }))
    }, [matches])

    return (
        <div className="flex flex-col gap-2">
            <ol className="flex gap-2">{crumbs.map(crumb => (
                <>
                    <li><Breadcrumb crumb={crumb} /></li>
                    {!crumb.isLast && <span className="font-sans text-sm leading-normal font-normal">/</span>}
                </>
            ))}</ol>
            {/* <h6 className="antialiased tracking-normal font-sans text-base font-semibold leading-relaxed">{crumbs[crumbs.length - 1].label}</h6> */}
        </div>
    )
}

export default Breadcrumbs;