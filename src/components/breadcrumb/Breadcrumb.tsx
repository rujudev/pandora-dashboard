import { Link } from "react-router";
import { CrumbData } from "../../types/breadcrumb.types";

interface BreadcrumbProps {
    crumb: CrumbData,
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumb }) => {
    const { label, isLast, path } = crumb;

    return isLast || !path ? (
        <span className="font-sans text-sm leading-normal font-normal text-primary">{label}</span>
    ) : (
        <Link className="font-sans text-sm leading-normal font-normal text-primary-text hover:text-secondary" to={path}>{label}</Link>
    )
}

export default Breadcrumb;