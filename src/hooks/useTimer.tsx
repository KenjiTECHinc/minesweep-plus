import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { getTimeDifference } from "../utils";

const useTimer = () => {
    const timerInterval = useRef<null | number | NodeJS.Timeout>(null);
    const [timeStarted, setTimeStarted] = useState<Date | null>(null);
    const [timeNow, setTimeNow] = useState<Date | null>(null);
    const timeDifference = useMemo(() => getTimeDifference(timeStarted, timeNow), [timeNow]);
    const isTimerRunning = Boolean(timeStarted);

    const startTimer = useCallback(() => {
        setTimeStarted(new Date());
    }, [])

    const stopTimer = useCallback(() => {
        if (timerInterval.current !== null) {
            console.log("Stopping timer:", timerInterval.current);
            clearInterval(timerInterval.current);
            timerInterval.current = null; // Reset the reference
        }
    }, [])

    const resetTimer = useCallback(() => {
        setTimeStarted(null);
        setTimeNow(null);
    }, [])

    useEffect(() => {
        if (!timeStarted) return;

        timerInterval.current = setInterval(() => {
            setTimeNow(new Date());
        }, 1000)

        return () => {
            if (timerInterval.current !== null) {
                clearInterval(timerInterval.current);
                timerInterval.current = null;
            }
        };
    }, [timeStarted])

    return {
        timeDifference,
        startTimer,
        stopTimer,
        resetTimer,
        isTimerRunning
    };
}

export default useTimer;