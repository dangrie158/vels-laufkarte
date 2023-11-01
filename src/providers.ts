import { createContext, useState } from "react";
import { RouteInformation, RouteStateInformation } from "./types";

export const EVENT_NAME = "Wintercup 2023";
const EVENT_KEY = EVENT_NAME.toLowerCase().replaceAll(" ", "-");
const ROUTES_FILE_PATH = `${process.env.PUBLIC_URL}/routes/${EVENT_KEY}.json`;

export function usePersistentStorage() {
    // Request persistent local storage. This works on iOS only if the app is added
    // to the homescreen, otherwise the data will be deleted after 7 days of inactivity
    // https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
    if (navigator.storage) {
        return [navigator.storage.persist()];
    }
    return [Promise.reject("storage API not supported")];
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (_: T) => void] {
    const initialValue = JSON.parse(localStorage.getItem(key) ?? "null") ?? defaultValue;
    const [state, setState] = useState(initialValue);

    function setValue(newValue: T) {
        localStorage.setItem(key, JSON.stringify(newValue));
        setState(newValue);
    }

    return [state, setValue];
}

export function useRoutes(): [RouteInformation, (_: RouteInformation) => void] {
    const UPDATE_THRESHOLD = 1000 * 60;
    const [lastUpdated, setLastUpdated] = useLocalStorage<number>(`routes-${EVENT_KEY}-lastUpdated`, 0);
    const [routes, setRoutes] = useLocalStorage<RouteInformation>(`routes-${EVENT_KEY}`, []);

    if ((Date.now() - lastUpdated) >= UPDATE_THRESHOLD) {
        fetch(ROUTES_FILE_PATH)
            .then(data => data.json())
            .then(routes => setRoutes(routes))
            .then(() => setLastUpdated(Date.now()));
    }

    return [routes, setRoutes];
}

type RouteStateContextType = [RouteStateInformation, (_: RouteStateInformation) => void];
export const RouteStateContext = createContext<RouteStateContextType>([{} as RouteStateInformation, () => null]);
export function useRouteState(): RouteStateContextType {
    return useLocalStorage<RouteStateInformation>(`state-${EVENT_KEY}`, {} as RouteStateInformation);
}
