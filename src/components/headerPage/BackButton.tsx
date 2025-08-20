import { useNavigate } from "react-router";
import { ArrowLeft } from "../Icon";

const BackButton = ({ path }: { path: string }) => {
    const navigate = useNavigate()

    return (
        <button
            className="flex justify-center items-center rounded-md text-primary hover:text-secondary duration-100 ease-linear cursor-pointer"
            onClick={() => navigate(path)}
        >
            <ArrowLeft />
        </button>
    )
}

export default BackButton;