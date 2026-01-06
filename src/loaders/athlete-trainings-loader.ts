export const athleteTrainingHistoryLoader = async ({ params }: {
    params: {
        athleteId: string;
    }
}) => {
    const athleteId = params.athleteId ? Number(params.athleteId) : 0;

    return { athleteId };
}

export const athleteTrainingLoader = async ({ params }: {
    params: {
        athleteId: string;
        trainingId: string;
    }
}) => {
    const athleteId = params.athleteId ? Number(params.athleteId) : 0;
    const trainingId = params.trainingId ? Number(params.trainingId) : 0;

    return { athleteId, trainingId }
}