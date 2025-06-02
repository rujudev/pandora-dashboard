import { isEqual } from "lodash";
import { useEffect } from "react";
import { useLoaderData, useLocation, useMatch, useOutletContext } from "react-router";
import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { AthleteOutletContext } from "../../interfaces/athlete/athlete-route-outlet.interface";
import { LoaderData } from "../../interfaces/loader-data.interface";
import Button from "../Button";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import { Save } from "../Icon";
import MuscleMovements from "../muscleMovements/MuscleMovements";
import Sessions from "../session/Sessions";
import StartEndDate from "../training/StartEndDate";

const AthleteTraining = () => {
    const { pathname } = useLocation();
    const { athlete, training } = useLoaderData() as LoaderData;
    const { state } = useAthleteTraining();
    const { setHeaderConfig } = useOutletContext<AthleteOutletContext>();
    const isAthleteTrainingEditPage = useMatch('/athletes/:athleteId/trainings/:trainingId/edit');

    useEffect(() => {
        if (isAthleteTrainingEditPage && state) {
            const formatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
            const formatterStartDate = formatter.format(new Date(state.start_date));
            const formatterEndDate = formatter.format(new Date(state.end_date));

            setHeaderConfig({
                hasBackButton: true,
                title: <>Entrenamiento de {athlete?.first_name} {athlete?.last_name}</>,
                description: (
                    <>
                        <small>
                            <strong>{formatterStartDate} - {formatterEndDate}</strong>
                        </small>
                    </>
                ),
                rightContent: (
                    <Button text="Guardar" disabled={isEqual(state, training)}>
                        <Save />
                    </Button>
                )
            })
        }
    }, [pathname, state, training]);

    return (
        <div className="grid grid-cols-2 w-full gap-5">
            <Card>
                <CardBody>
                    <StartEndDate classes="gap-5 grid grid-cols-2" />
                </CardBody>
            </Card>
            <Card>
                <CardBody classes="flex flex-col gap-5">
                    <MuscleMovements />
                </CardBody>
            </Card>
            <Card>
                <CardBody classes="flex flex-col gap-5">
                    <Sessions />
                </CardBody>
            </Card>
        </div>
    )
}

export default AthleteTraining