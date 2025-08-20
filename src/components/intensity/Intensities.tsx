import { FC } from "react"
import { IntensityWithSeriesRepetitionsZoneAndSets } from "../../interfaces/intensity/intensity-with-series-repetitions-zone-and-sets.interface"
import Card from "../card/Card"
import CardBody from "../card/CardBody"
import { Bolt } from "../Icon"
import List from "../list/List"
import ListItem from "../list/ListItem"
import Intensity from "./Intensity"

interface Props {
    blockId: number,
    intensities: IntensityWithSeriesRepetitionsZoneAndSets[],
    sessionId: number,
    exerciseId: number,
    weightRef: number,
}
const Intensities: FC<Props> = ({
    blockId,
    intensities,
    sessionId,
    exerciseId,
    weightRef
}) => {
    return intensities.length > 0 ? (
        <List classes="grid grid-cols-[repeat(auto-fit,minmax(200px,300px))] [&>.list-row:not(:last-child)]:after:border-0">
            {intensities.map((intensity) => (
                <ListItem key={intensity.id_intensity}>
                    <Intensity
                        key={intensity.id_intensity}
                        blockId={blockId}
                        sessionId={sessionId}
                        exerciseId={exerciseId}
                        intensity={intensity}
                        weightRef={weightRef}
                    />
                </ListItem>
            ))}
        </List>
    ) : (
        <Card >
            <CardBody classes="flex flex-col items-center gap-3">
                <Bolt classes="size-8 text-base-content opacity-55" />
                <h2 className="text-base-content opacity-55">No hay intensidades creadas</h2>
            </CardBody>
        </Card>
    )
}

export default Intensities