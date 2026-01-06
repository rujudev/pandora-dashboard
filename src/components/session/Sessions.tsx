import {
    eachDayOfInterval,
    format,
    formatDate,
    getDay,
    getMonth,
    isAfter,
    isBefore,
    isSameDay,
    isToday,
    parseISO,
    startOfDay
} from "date-fns";
import { es } from "date-fns/locale";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { SessionWithExercisesAndIntensities } from "../../interfaces/session/session-with-exercises-and-intensities.interface";
import { WeeklyBlock } from "../../interfaces/session/weekly-blocks.interface";
import { DAY_PERIODS, DayPeriod, DAYS_OF_WEEK, DayWeek } from "../../types/day.types";
import { dayPeriodToNumber, dayWeekToNumber } from "../../utils/date";
import { colStartClass } from "../../utils/grid";
import { generateMonthBlocks, generateWeeklyBlocks } from "../../utils/weeklyBlocks"; // Funciones nuevas
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import Exercises from "../exercise/Exercises";
import { Calendar, Plus } from "../Icon";
import OpenModalButton from "../modal/OpenModalButton";
import CustomNextButton from "../swiper/CustomNextButton";
import CustomPrevButton from "../swiper/CustomPrevButton";
import SessionModalForm from "./SessionModalForm";
import SessionsSkeleton from "./Skeleton";

export type selectedBlockDayType = {
    blockId: number,
    sessions: SessionWithExercisesAndIntensities[],
    selectedPeriod: DayPeriod | null,
    date: Date
};

const initialSelectedBlockDay: selectedBlockDayType = {
    blockId: 0,
    sessions: [],
    selectedPeriod: null,
    date: new Date()
};

// ... (SessionsSkeleton sigue igual) ...

interface Props {
    isTrainingCompleted: boolean
}

const Sessions: FC<Props> = ({ isTrainingCompleted = false }) => {
    const { state, updateWeeklyBlocks, addSession } = useAthleteTraining();

    const startDate = state?.start_date ?? '';
    const endDate = state?.end_date ?? '';
    const weeklyBlocks = state?.weekly_blocks ?? [];

    const [existingBlocks, setExistingBlocks] = useState<Record<string, WeeklyBlock[]>>({});
    const [selectedBlockDay, setSelectedBlockDay] = useState<selectedBlockDayType | null>(initialSelectedBlockDay);
    const [isBeginning, setIsBeginning] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [initialMonth, setInitialMonth] = useState<number>(0);

    const swiperRef = useRef<SwiperType | null>(null);

    // Memoizar cálculos pesados
    const stateDateRange = useMemo(() => {
        if (!startDate || !endDate) return null;
        return {
            start: parseISO(startDate),
            end: parseISO(endDate)
        };
    }, [startDate, endDate]);

    const isSameWeekDay = (day: DayWeek, weekDay: Date) => getDay(weekDay) === dayWeekToNumber(day);
    const getDayNumber = (date: Date, length: number = 2) => formatDate(date, 'd'.repeat(length));
    const getRangeOfDates = (startDate: Date, endDate: Date) => eachDayOfInterval({ start: startDate, end: endDate });

    const handleAddNewSession = (monthKey: string, blockId: number, session: SessionWithExercisesAndIntensities) => {
        setExistingBlocks(prevBlocks => {
            const updatedBlocks = prevBlocks[monthKey].map(prevBlock => {
                if (prevBlock.id_block !== blockId) return prevBlock;

                const newSession = {
                    ...session,
                    is_new: true,
                    id_session: prevBlock.sessions.length > 0
                        ? Math.max(...prevBlock.sessions.map(s => s?.id_session!)) + 1
                        : 1
                };

                const sessions = [...prevBlock.sessions, newSession];

                addSession(prevBlock, newSession);

                setSelectedBlockDay(prev => {
                    return {
                        ...(prev ?? initialSelectedBlockDay), // Si prev es null, usa el valor inicial
                        blockId,
                        selectedPeriod: sessions.length > 1 ?
                            sessions
                                .filter(s => isSameWeekDay(s.day_week, new Date()))
                                .map(s => s.day_period)
                                .sort((a, b) => dayPeriodToNumber(a) - dayPeriodToNumber(b))[0]
                            : sessions[0].day_period,
                        sessions
                    }
                });

                return {
                    ...prevBlock,
                    sessions
                };
            });

            return {
                ...prevBlocks,
                [monthKey]: updatedBlocks
            };
        });
    };

    // Efecto principal para generar bloques
    useEffect(() => {
        if (stateDateRange) {
            const updatedBlocks = generateWeeklyBlocks(
                stateDateRange.start,
                stateDateRange.end,
                weeklyBlocks,
                {
                    assignIds: true,
                    preserveExisting: true,
                }
            );

            const existingBlocksGroupedByMonth = generateMonthBlocks(
                stateDateRange.start,
                stateDateRange.end,
                updatedBlocks
            );

            setExistingBlocks(existingBlocksGroupedByMonth);

            if (Object.keys(existingBlocks).length === 0) {
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonthIndex = getMonth(now) + 1; // 1-12
                const currentKey = `${currentYear}-${String(currentMonthIndex - 1).padStart(2, '0')}`;

                const keys = Object.keys(existingBlocksGroupedByMonth);
                const existingBlocksCurrentMonthIndex = keys.indexOf(currentKey);

                setInitialMonth(existingBlocksCurrentMonthIndex === -1 ? 0 : existingBlocksCurrentMonthIndex)
            }
        }
    }, [stateDateRange, weeklyBlocks]);

    // Efecto para manejar cambios en bloques existentes
    useEffect(() => {
        const existingBlocksLength = Object.keys(existingBlocks).length;
        setIsEnd(existingBlocksLength === 1);

        const date = selectedBlockDay?.date;
        const existingBlockKey = date
            ? `${date.getFullYear()}-${String(getMonth(date) + 1).padStart(2, "0")}`
            : "";

        const existingBlock = existingBlocks[existingBlockKey]?.find(
            (block) => block.id_block === selectedBlockDay?.blockId
        );

        setSelectedBlockDay(prevSelected => ({
            ...(prevSelected ?? initialSelectedBlockDay), // Si prevSelected es null, usa el valor inicial
            sessions: existingBlock?.sessions || []
        }));
    }, [existingBlocks, selectedBlockDay?.blockId]);

    useEffect(() => {
        if (swiperRef.current && initialMonth >= 0) {
            swiperRef.current.slideTo(initialMonth, 0);
        }
    }, [initialMonth])

    if (!state) {
        return <SessionsSkeleton />;
    }

    return (
        <Swiper
            slidesPerView={1}
            navigation={{
                prevEl: ".custom-prev-button",
                nextEl: ".custom-next-button"
            }}
            modules={[Navigation]}
            onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);

            }}
            className="w-full"
        >
            {Object.entries(existingBlocks).map(([monthKey, blocks]) => {
                const [yearStr, monthStr] = monthKey.split('-');
                const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 1);
                const slideMonthIndex = parseInt(monthStr, 10);
                const monthName = format(date, 'MMMM', { locale: es });
                const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

                const isSelectedDayOfBlockInThisMonth =
                    Boolean(selectedBlockDay) &&
                    getMonth(selectedBlockDay.date) === slideMonthIndex;

                return (
                    <SwiperSlide key={monthKey} className="!grid grid-rows-[max-content_1fr]">
                        <div className="flex flex-col justify-center items-center">
                            <header className="flex items-center gap-4 py-4">
                                <CustomPrevButton
                                    classes="custom-prev-button size-10"
                                    iconClasses="size-10"
                                    isBeginning={isBeginning}
                                />
                                <h2 className="text-2xl">{capitalizedMonthName} - {yearStr}</h2>
                                <CustomNextButton
                                    classes="custom-next-button size-10"
                                    iconClasses="size-10"
                                    isEnd={isEnd}
                                />
                            </header>
                            <div className="grid grid-cols-12 py-4 w-full">
                                <div className="col-span-11 grid grid-cols-7 col-start-2 justify-items-center w-full">
                                    {DAYS_OF_WEEK.map((day, index) => (
                                        <span key={`sessionDay-${index}`}>{day}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {blocks.length > 0 && (
                            <div className="flex flex-col justify-evenly gap-3">
                                {blocks.map(block => {
                                    const startDate = parseISO(block.week_start_date);
                                    const endDate = parseISO(block.week_end_date);
                                    const isActive = block.is_active;
                                    const rangeOfDates = getRangeOfDates(startDate, endDate);
                                    const isBeforeToday = isBefore(
                                        startOfDay(selectedBlockDay?.date!),
                                        startOfDay(new Date())
                                    );

                                    const filteredSessions = block.sessions
                                        .filter(session => isSameWeekDay(session.day_week, selectedBlockDay?.date!))
                                        .sort((a, b) => {
                                            const dayA = DAYS_OF_WEEK.indexOf(a.day_week);
                                            const dayB = DAYS_OF_WEEK.indexOf(b.day_week);

                                            if (dayA !== dayB) return dayA - dayB;

                                            const periodA = DAY_PERIODS.indexOf(a.day_period);
                                            const periodB = DAY_PERIODS.indexOf(b.day_period);

                                            return periodA - periodB;
                                        });

                                    return (
                                        <div className="grid grid-cols-12 gap-4" key={`${block.id_block}_${block.week_start_date}_${block.week_end_date}`}>
                                            <div className="flex items-center form-control">
                                                <label className="label gap-3 justify-center w-full">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={!isTrainingCompleted && isActive && isSelectedDayOfBlockInThisMonth}
                                                        className="toggle toggle-success !opacity-80 !cursor-auto"
                                                        disabled
                                                    />
                                                </label>
                                            </div>

                                            <div className="col-span-11 grid grid-cols-7 justify-items-center gap-2 p-4">
                                                {rangeOfDates.map((date, index) => {
                                                    const isSelected = isSameDay(date, selectedBlockDay?.date!);
                                                    const isInRange = !isBefore(date, parseISO(state.start_date)) &&
                                                        !isAfter(date, parseISO(state.end_date));

                                                    const isInRangeClass = !isInRange ? ' opacity-40' : ' cursor-pointer';
                                                    const isTodayNotSelectedClass = (isToday(date) && !isSelected) || (!isInRange && isToday(date)) ? ' bg-primary opacity-40' : '';
                                                    const isTodaySelectedClass = isToday(date) && isInRange ? ' bg-primary text-white' : '';
                                                    const isSelectedClass = isSelected &&
                                                        !isToday(date) ? ' bg-secondary' : '';

                                                    return (
                                                        <button
                                                            className={`flex flex-col items-center px-6 py-4 w-fit rounded-full ${colStartClass(getDay(date))}${isTodayNotSelectedClass}${isTodaySelectedClass}${isInRangeClass}${isSelectedClass}`}
                                                            onClick={() => {
                                                                const sessions = block.sessions.filter(
                                                                    session => isSameWeekDay(session.day_week, date)
                                                                );
                                                                const selectedPeriod = sessions[0]?.day_period || null;

                                                                const isSameBlock = selectedBlockDay?.blockId === block.id_block;
                                                                const isSameDate = isSameDay(selectedBlockDay?.date!, date);

                                                                setSelectedBlockDay({
                                                                    blockId: isSameBlock && isSameDate ? 0 : block.id_block!,
                                                                    sessions,
                                                                    selectedPeriod,
                                                                    date: isSameBlock && isSameDate ? new Date() : date
                                                                });
                                                            }}
                                                            key={index}
                                                            disabled={!isInRange}
                                                        >
                                                            <span className="label-text font-bold text-xl">
                                                                {getDayNumber(date)}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Mostrar periodos del día seleccionado */}
                                            {selectedBlockDay && selectedBlockDay.blockId === block.id_block && isSelectedDayOfBlockInThisMonth && (
                                                <div className="col-span-12 flex flex-col gap-4">
                                                    {!isTrainingCompleted && !isBeforeToday && (
                                                        <div className="flex justify-end w-full">
                                                            <OpenModalButton
                                                                buttonIcon={<Plus />}
                                                                buttonText="Nueva sesión"
                                                                modalContent={
                                                                    <SessionModalForm
                                                                        blockDate={selectedBlockDay.date}
                                                                        existingSessionsForDay={filteredSessions}
                                                                        muscleMovements={state?.muscle_movements}
                                                                        onAddSession={(session) => {
                                                                            const date = selectedBlockDay.date;
                                                                            const monthKey = `${date.getFullYear()}-${String(getMonth(date)).padStart(2, '0')}`;
                                                                            handleAddNewSession(monthKey, block.id_block!, session);
                                                                        }}
                                                                    />
                                                                }
                                                                modalId={`add-session`}
                                                                disabled={
                                                                    filteredSessions.length === DAY_PERIODS.length
                                                                }
                                                            />
                                                        </div>
                                                    )}

                                                    {filteredSessions.length > 0 ? (
                                                        <>
                                                            <div className="flex justify-evenly items-center gap-4 px-4">
                                                                {filteredSessions.map(session => (
                                                                    <button
                                                                        key={`${session.id_session}-${session.day_period}`}
                                                                        className={`flex flex-col items-center px-6 py-4 cursor-pointer${session.day_period === selectedBlockDay.selectedPeriod
                                                                            ? ' rounded-full bg-primary text-white'
                                                                            : ' opacity-50'
                                                                            }`}
                                                                        onClick={() => {
                                                                            setSelectedBlockDay(prev => ({
                                                                                ...(prev ?? initialSelectedBlockDay), // Si prev es null, usa el valor inicial
                                                                                selectedPeriod: session.day_period
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <span className="label-text font-bold text-md">
                                                                            {session.day_period}
                                                                        </span>
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            {selectedBlockDay.selectedPeriod && (
                                                                filteredSessions
                                                                    .filter(session =>
                                                                        session.day_period === selectedBlockDay.selectedPeriod
                                                                    )
                                                                    .map(session => (
                                                                        <Exercises
                                                                            key={session.id_session}
                                                                            blockId={block.id_block || 0}
                                                                            canAddExercises={!isBeforeToday}
                                                                            sessionId={session.id_session!}
                                                                            exercises={session.exercises}
                                                                        />
                                                                    ))
                                                            )}
                                                        </>
                                                    ) : (
                                                        <Card>
                                                            <CardBody classes="flex flex-col items-center gap-3">
                                                                <Calendar classes="size-8 text-base-content opacity-55" />
                                                                <h2 className="text-base-content opacity-55">
                                                                    No hay sesiones creadas
                                                                </h2>
                                                            </CardBody>
                                                        </Card>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};

export default Sessions;