import { FC } from "react";
import { useSwiper } from "swiper/react";
import { ChevronLeft } from "../Icon";

interface Props {
    classes?: string,
    iconClasses?: string,
    isBeginning: boolean
}
const CustomPrevButton: FC<Props> = ({ classes, iconClasses, isBeginning }) => {
    const swiper = useSwiper()

    return (
        <button className={`${classes ? `${classes}` : ''}${isBeginning ? ' opacity-50 cursor-auto' : ' cursor-pointer'}`} onClick={() => swiper.slidePrev()} disabled={isBeginning}>
            <ChevronLeft classes={`${iconClasses ? ` ${iconClasses}` : ''}`} />
        </button>
    )
}

export default CustomPrevButton