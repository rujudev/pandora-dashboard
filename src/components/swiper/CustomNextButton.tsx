import { FC } from "react";
import { useSwiper } from "swiper/react";
import { ChevronRight } from "../Icon";

interface Props {
    classes?: string,
    iconClasses?: string,
    isEnd: boolean
}
const CustomNextButton: FC<Props> = ({ classes, iconClasses, isEnd }) => {
    const swiper = useSwiper()

    return (
        <button className={`${classes ? `${classes}` : ''}${isEnd ? ' opacity-50 cursor-auto' : ' cursor-pointer'}`} onClick={() => swiper.slideNext()} disabled={isEnd}>
            <ChevronRight classes={`${iconClasses ? ` ${iconClasses}` : ''}`} />
        </button>)
}

export default CustomNextButton