import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import AthleteComponent from "../components/athlete/Athlete.tsx";
import AthleteTrainingsHistory from "../components/athlete/AthleteTrainingsHistory.tsx";
import { AthletePageIcon, DashboardPageIcon, TrainingPageIcon } from "../components/Icon.tsx";
import { AthleteTrainingContextWrapper } from "../context/athlete-training.context.tsx";
import ButtonStateProvider from "../context/button-state.context.tsx";
import Athletes from "../pages/Athletes.tsx";
import Home from "../pages/Home.tsx";
import Trainings from "../pages/Trainings.tsx";
import { getAthlete } from "../services/athletes.ts";
import { getAthleteTrainings, getTrainingByAthlete } from "../services/trainings.ts";
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
        loader: async ({ params }) => {
          const id = params.athleteId ? Number(params.athleteId) : 0;
          const athlete = await getAthlete(id);
          const name = athlete ? `${athlete.first_name} ${athlete.last_name}` : '';

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
              const { data: athleteData, error: athleteError } = await getAthlete(id);

              if (athleteError) throw new Error(athleteError.message)

              const athleteName = athleteData ? `${athleteData.first_name} ${athleteData.last_name}` : '';

              const { data: trainingsData, error: trainingsError } = await getAthleteTrainings(id);

              if (trainingsError) throw new Error(trainingsError.message);

              return { label: athleteName, isLast: true, athlete: athleteData, trainings: trainingsData }
            },
            handle: {
              crumb: (crumbData: CrumbData) => ({ label: 'Historial de entrenamientos', path: `/athletes/${crumbData?.athlete?.id_athlete}/trainings`, isLast: false })
            },
            children: [
              {
                path: ':trainingId/edit',
                element: <AthleteTrainingContextWrapper />,
                loader: async ({ params }) => {
                  const athleteId = params.athleteId ? Number(params.athleteId) : 0;
                  const trainingId = params.trainingId ? Number(params.trainingId) : 0;

                  const athlete = await getAthlete(athleteId);
                  const { data: dataTraining, error: errorTraining } = await getTrainingByAthlete(athleteId, trainingId);
                  const training = dataTraining?.[0];

                  console.log(training);
                  debugger;
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
