import { useState } from "react";
import { Route, RouteId, RouteStateInformation } from "./types";

export const EVENT_NAME = "Wintercup 2023";
const EVENT_KEY = EVENT_NAME.toLowerCase().replaceAll(" ", "-");

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (_: T) => void] {
    const initialValue = JSON.parse(localStorage.getItem(key) ?? "null") ?? defaultValue;
    const [state, setState] = useState(initialValue);

    function setValue(newValue: T) {
        localStorage.setItem(key, JSON.stringify(newValue));
        setState(newValue);
    }

    return [state, setValue];
}

export function useRoutes(): [Record<RouteId, Route>, (_: Record<RouteId, Route>) => void] {
    const event = `${EVENT_KEY}`;
    const UPDATE_THRESHOLD = 0;//1000 * 60;
    const [lastUpdated, setLastUpdated] = useLocalStorage<number>(`routes-${event}-lastUpdated`, 0);
    const [routes, setRoutes] = useLocalStorage<Record<RouteId, Route>>(`routes-${event}`, {});

    if ((Date.now() - lastUpdated) >= UPDATE_THRESHOLD) {
        fetch(`routes/${event}.json`)
            .then(data => data.json())
            .then(routes => setRoutes(routes))
            .then(() => setLastUpdated(Date.now()));
    }

    return [routes, setRoutes];
}

export function useRouteState(): [RouteStateInformation, (_: RouteStateInformation) => void] {
    return useLocalStorage<RouteStateInformation>(`${EVENT_KEY}-state`, {});
}
