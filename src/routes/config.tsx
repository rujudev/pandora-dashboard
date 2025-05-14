import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import AthleteComponent from "../components/athlete/Athlete.tsx";
import AthleteTraining from "../components/athlete/AthleteTraining.tsx";
import AthleteTrainingsHistory from "../components/athlete/AthleteTrainingsHistory.tsx";
import { AthletePageIcon, DashboardPageIcon, TrainingPageIcon } from "../components/Icon.tsx";
import Athletes from "../pages/Athletes.tsx";
import Home from "../pages/Home.tsx";
import Trainings from "../pages/Trainings.tsx";
import { getAthlete } from "../services/athletes.ts";
import { getTraining } from "../services/trainings.ts";
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
    loader: async () => ({ label: "Atletas", path: '/athletes' }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label, path: crumbData.path }),
    },
    children: [
      {
        path: ":athleteId",
        loader: async ({ params }) => {
          const athlete = await getAthlete(params.athleteId);
          const name = athlete ? `${athlete.name} ${athlete.last_name}` : '';

          return {
            label: name,
            isLast: false
          };
        },
        handle: {
          crumb: (crumbData: CrumbData) => ({ label: crumbData.label, isLast: crumbData.isLast })
        },
        children: [
          {
            path: "edit",
            name: "Atleta",
            element: <AthleteComponent />,
            loader: async ({ params }) => {
              const athlete = await getAthlete(params.athleteId);

              const athleteName = athlete ? `${athlete.name} ${athlete.last_name}` : '';

              return { label: athleteName, isLast: true, athlete }
            },
            handle: {
              crumb: (crumbData: CrumbData) => ({ label: 'Editar perfil', isLast: crumbData.isLast })
            },
          },
          {
            path: "trainings",
            name: "Atleta",
            element: <AthleteTrainingsHistory />,
            loader: async ({ params }) => {
              const athlete = await getAthlete(params.athleteId);

              const athleteName = athlete ? `${athlete.name} ${athlete.last_name}` : '';

              return { label: athleteName, isLast: true, athlete }
            },
            handle: {
              crumb: (crumbData: CrumbData) => ({ label: 'Historial de entrenamientos', path: `/athletes/${crumbData?.athlete?.id}/trainings`, isLast: false })
            },
            children: [
              {
                path: ':trainingId/edit',
                element: <AthleteTraining />,
                loader: async ({ params }) => {
                  const athlete = await getAthlete(params.athleteId);
                  const training = await getTraining(athlete?.trainings.find(athleteTraining => athleteTraining === params.trainingId) ?? '');

                  return { label: training?.name, isLast: true, athlete, training }
                },
                handle: {
                  crumb: (crumbData: CrumbData) => ({ label: crumbData.label })
                }
              }
            ]
          }
        ]
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
