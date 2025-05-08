import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import AthleteComponent from "../components/Athlete.tsx";
import { AthletePageIcon, DashboardPageIcon, TrainingPageIcon } from "../components/Icon.tsx";
import Athletes from "../pages/Athletes.tsx";
import Home from "../pages/Home.tsx";
import Trainings from "../pages/Trainings.tsx";
import { getAthlete } from "../services/athletes.ts";
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
    children: [
      {
        path: ":id/edit",
        name: "Atleta",
        element: <AthleteComponent />,
        loader: async ({ params }) => {
          const id = params.id;
          const athlete = await getAthlete(id);

          const athleteName = athlete ? `${athlete.name} ${athlete.last_name}` : '';

          return { label: athleteName, ...athlete }
        },
        handle: {
          crumb: (crumbData: CrumbData) => ({ label: crumbData?.label })
        }
      }
    ]
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
    children: routes.map(({ path, element, loader, handle, children = [] }) => ({
      path,
      element,
      loader,
      handle,
      children
    })),
  },
]);
