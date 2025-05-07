import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import { AthletePageIcon, DashboardPageIcon, TrainingPageIcon } from "../components/Icon.tsx";
import Athletes from "../pages/Athletes.tsx";
import Home from "../pages/Home.tsx";
import Trainings from "../pages/Trainings.tsx";
import { CrumbData } from "../types/breadcrumb.types.ts";

export const routes = [
  {
    name: "Inicio",
    path: "/",
    icon: <DashboardPageIcon />,
    element: <Home />,
    loader: async () => ({ label: "Inicio" }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label }),
    },
  },
  {
    name: "Atletas",
    path: "athletes",
    icon: <AthletePageIcon />,
    element: <Athletes />,
    loader: async () => ({ label: "Atletas" }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label }),
    },
  },
  {
    name: "Entrenamientos",
    path: "trainings",
    icon: <TrainingPageIcon />,
    element: <Trainings />,
    loader: async () => ({ label: "Entrenamientos" }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label }),
    },
  },
];

export const router = createBrowserRouter([
  {
    element: <App />,
    children: routes.map(({ path, element, loader, handle }) => ({
      path,
      element,
      loader,
      handle,
    })),
  },
]);
