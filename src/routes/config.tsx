import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import { CrumbData } from "../types/breadcrumb.types.ts";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader: async () => ({ label: "Inicio" }),
        handle: {
            crumb: (crumbData: CrumbData) => ({ label: crumbData?.label })
        },
    },
]);