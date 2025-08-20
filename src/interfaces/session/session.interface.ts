import { DayPeriod, DayWeek } from "../../types/day.types";

export interface Session {
    id_session?: number;
    id_block?: number;
    id_training?: number;
    day_week: DayWeek;
    day_period: DayPeriod;
    is_new?: boolean;
}