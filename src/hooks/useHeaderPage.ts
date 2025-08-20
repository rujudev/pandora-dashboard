import { use } from "react"
import { HeaderPageContext } from "../context/header-page.context"

export const useHeaderPage = () => {
    const context = use(HeaderPageContext)
    if (!context) throw new Error("el hook useHeaderPage debe ser usado dentro de HeaderPageProvider")
    return context
}