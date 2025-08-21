import { useNavigate } from "react-router";
import { ArrowLeft } from "../Icon";

const BackButton = () => {
    const navigate = useNavigate()

    return (
        <button
            className="flex justify-center items-center rounded-md text-primary hover:text-secondary duration-100 ease-linear cursor-pointer"
            onClick={() => navigate(-1)}
        >
            <ArrowLeft />
        </button>
    )
}

export default BackButton;