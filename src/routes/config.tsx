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
import { getTrainingByAthlete } from "../services/trainings.ts";
import { CrumbData } from "../types/breadcrumb.types.ts";

export const routes = [
  {
    name: "Inicio",
    path: "/",
    icon: <DashboardPageIcon classes="opacity-30" />,
    element: <Home />,
    loader: async () => ({ label: "Inicio" }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label }),
    },
  },
  {
    name: "Atletas",
    path: "athletes",
    icon: <AthletePageIcon classes="opacity-30" />,
    element: <Athletes />,
    loader: async () => ({ label: "Atletas", path: '/athletes' }),
    handle: {
      crumb: (crumbData: CrumbData) => ({ label: crumbData?.label, path: crumbData.path }),
    },
    children: [
      {
        path: ":athleteId",
        loader: async ({ params }) => {
          const id = params.athleteId ? Number(params.athleteId) : 0;
          const athlete = await getAthlete(id);
          const name = athlete ? `${athlete.first_name} ${athlete.last_name}` : '';

          console.log(name, athlete);
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
              const id = params.athleteId ? Number(params.athleteId) : 0;
              const athlete = await getAthlete(id);

              const athleteName = athlete ? `${athlete.first_name} ${athlete.last_name}` : '';

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
              const id = params.athleteId ? Number(params.athleteId) : 0;
              const athlete = await getAthlete(id);

              const athleteName = athlete ? `${athlete.first_name} ${athlete.last_name}` : '';

              return { label: athleteName, isLast: true, athlete }
            },
            handle: {
              crumb: (crumbData: CrumbData) => ({ label: 'Historial de entrenamientos', path: `/athletes/${crumbData?.athlete?.id_athlete}/trainings`, isLast: false })
            },
            children: [
              {
                path: ':trainingId/edit',
                element: <AthleteTraining />,
                loader: async ({ params }) => {
                  const athleteId = params.athleteId ? Number(params.athleteId) : 0;
                  const trainingId = params.trainingId ? Number(params.trainingId) : 0;

                  const athlete = await getAthlete(athleteId);
                  const { data: dataTraining, error: errorTraining } = await getTrainingByAthlete(athleteId, trainingId);
                  const training = dataTraining?.[0];

                  const formatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: '2-digit' });
                  const formatterStartDate = formatter.format(new Date(training.start_date));
                  const formatterEndDate = formatter.format(new Date(training.end_date));

                  return { label: `${formatterStartDate} - ${formatterEndDate}`, isLast: true, athlete, training }
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
    icon: <TrainingPageIcon classes="opacity-30" />,
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
