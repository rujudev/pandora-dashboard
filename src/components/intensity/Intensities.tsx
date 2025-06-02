import { FC } from "react"
import { IntensityWithSeriesRepetitionsZoneAndSets } from "../../interfaces/interfaces_compuestas.interface"
import List from "../list/List"
import ListItem from "../list/ListItem"
import Intensity from "./Intensity"

interface Props {
    intensities: IntensityWithSeriesRepetitionsZoneAndSets[],
    sessionId: number,
    exerciseId: number,
    weightRef: number,
}
const Intensities: FC<Props> = ({
    intensities,
    sessionId,
    exerciseId,
    weightRef
}) => {
    return (
        <List classes="grid grid-cols-[repeat(auto-fit,minmax(200px,300px))] [&>.list-row:not(:last-child)]:after:border-0">
            {intensities.map((intensity) => (
                <ListItem key={intensity.id_intensity}>
                    <Intensity
                        key={intensity.id_intensity}
                        sessionId={sessionId}
                        exerciseId={exerciseId}
                        intensity={intensity}
                        weightRef={weightRef}
                    />
                </ListItem>
            ))}
        </List>
    )
}

export default Intensities