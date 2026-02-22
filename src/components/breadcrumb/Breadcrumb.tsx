import { Link } from "react-router";
import { Crumb } from "../../context/breadcrumb.context";

interface BreadcrumbProps {
    crumb: Crumb,
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumb }) => {
    const { label, isLast, path } = crumb;

    return isLast || !path ? (
        <span className="font-sans text-sm leading-normal font-normal text-primary no-underline! cursor-default!">{label}</span>
    ) : (
        <Link className="font-sans text-sm leading-normal font-normal text-primary-text hover:text-secondary" to={path}>{label}</Link>
    )
}

export default Breadcrumb;