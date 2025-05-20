import intensities from "../mocks/intensity.json";


export const getIntensities = async () => {
    return await intensities;
}
export const getIntensityPercentages = async (intensityId: number | string) => {
    return await intensities.find(intensity => intensity.id_intensity === intensityId);
}
