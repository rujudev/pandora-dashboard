import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import AthleteComponent from "../components/athlete/Athlete.tsx";
import AthleteTrainingsHistory from "../components/athlete/AthleteTrainingsHistory.tsx";
import { AddTraining, AthletePageIcon, DashboardPageIcon, Movement, TrainingPageIcon } from "../components/Icon.tsx";
import { AthleteTrainingContextWrapper } from "../context/athlete-training.context.tsx";
import { BreadcrumbsProvider } from "../context/Breadcrumbs.context.tsx";
import ButtonStateProvider from "../context/button-state.context.tsx";
import { athleteTrainingHistoryLoader, athleteTrainingLoader } from "../loaders/athlete-trainings-loader.ts";
import Athletes from "../pages/Athletes.tsx";
import ExercisesPage from "../pages/Exercises.tsx";
import Home from "../pages/Home.tsx";
import MovementsPage from "../pages/Movements.tsx";
import Trainings from "../pages/Trainings.tsx";
import { getAthlete } from "../services/athletes.ts";
import { CrumbData } from "../types/breadcrumb.types.ts";
export const ROUTE = {
  HOME: '/',
  ATHLETES: '/athletes',
  ATHLETE: (athleteId: number | string) => `/athletes/${athleteId}`,
  ATHLETE_EDIT: (athleteId: number | string) => `/athletes/${athleteId}/edit`,
  ATHLETE_TRAININGS: (athleteId: number | string) => `/athletes/${athleteId}/trainings`,
  ATHLETE_TRAINING_EDIT: (athleteId: number | string, trainingId: number | string) =>
    `/athletes/${athleteId}/trainings/${trainingId}/edit`,
  TRAININGS: '/trainings',
  EXERCISES: '/exercises',
  MUSCLE_MOVEMENTS: '/muscle-movements'
};

export const routes = [
  {
    name: "Inicio",
    path: ROUTE.HOME,
    icon: <DashboardPageIcon classes="opacity-30" />,
    element: <Home />,
    loader: async () => ({ label: "Inicio" }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label }),
    },
  },
  {
    name: "Atletas",
    path: ROUTE.ATHLETES.replace(/^\//, ""),
    icon: <AthletePageIcon classes="opacity-30" />,
    element: (
      <ButtonStateProvider>
        <Athletes />
      </ButtonStateProvider>
    ),
    loader: async () => ({ label: "Atletas", path: '/athletes' }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label, path: crumbData.path }),
    },
    children: [
      {
        path: ":athleteId",
        children: [
          {
            path: "edit",
            name: "Atleta",
            element: <AthleteComponent />,
            loader: async ({ params }) => {
              const id = params.athleteId ? Number(params.athleteId) : 0;
              const { data: athleteData, error: athleteError } = await getAthlete(id);

              return { label: `${athleteData?.first_name} ${athleteData?.last_name}`, isLast: true, athlete: athleteData }
            },
            handle: {
              crumb: (crumbData: CrumbData) => ({ label: 'Editar perfil', isLast: crumbData.isLast })
            },
          },
          {
            path: "trainings",
            name: "Atleta",
            element: <AthleteTrainingsHistory />,
            loader: athleteTrainingHistoryLoader,
            handle: {
              crumb: (crumbData: CrumbData) => ({ label: 'Historial de entrenamientos', path: `/athletes/${crumbData?.athlete?.id_athlete}/trainings`, isLast: false })
            },
            children: [
              {
                path: ':trainingId/edit',
                element: <AthleteTrainingContextWrapper mode="edit" />,
                loader: athleteTrainingLoader,
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
    path: ROUTE.TRAININGS.replace(/^\//, ""),
    icon: <TrainingPageIcon classes="opacity-30" />,
    element: <Trainings />,
    loader: async () => ({ label: "Entrenamientos" }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label }),
    },
  },
  {
    name: "Ejercicios",
    path: ROUTE.EXERCISES.replace(/^\//, ""),
    icon: <AddTraining classes="opacity-30" />,
    element: <ExercisesPage />,
    loader: async () => ({ label: "Entrenamientos" }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label }),
    },
  },
  {
    name: "Movimientos",
    path: ROUTE.MUSCLE_MOVEMENTS.replace(/^\//, ""),
    icon: <Movement classes="opacity-30" />,
    element: <MovementsPage />,
    loader: async () => ({ label: "Movimientos" }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label }),
    },
  },
];

export const router = createBrowserRouter([
  {
    element: (
      <BreadcrumbsProvider>
        <App />
      </BreadcrumbsProvider>
    ),
    children: routes.map(({ path, element, loader, handle, children = [] }) => ({
      path,
      element,
      loader,
      handle,
      children
    })),
  },
]);
