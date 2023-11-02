import { createContext, useState } from "react";
import { Event, RouteStateInformation } from "./types";

const CURRENT_EVENT = "wintercup-2023";

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

export function useEvent(): Event {
    const update_threshold = 1000 * 60;
    const routes_file_path = `${process.env.PUBLIC_URL}/events/${CURRENT_EVENT}.json`;

    const [lastUpdated, setLastUpdated] = useLocalStorage<number>(`events-${CURRENT_EVENT}-lastUpdated`, 0);
    const [event, setEvent] = useLocalStorage<Event>(`events-${CURRENT_EVENT}`, { routes: [] });

    if ((Date.now() - lastUpdated) >= update_threshold) {
        fetch(routes_file_path)
            .then(data => data.json())
            .then(({ endDate, ...eventData }) => {
                const parsedEndDate = endDate !== undefined ? Date.parse(endDate) : undefined;
                return { ...eventData, endDate: parsedEndDate };
            })
            .then(event => setEvent(event))
            .then(() => setLastUpdated(Date.now()));
    }

    return event;
}

type RouteStateContextType = [RouteStateInformation, (_: RouteStateInformation) => void];
export const RouteStateContext = createContext<RouteStateContextType>([{} as RouteStateInformation, () => null]);
export function useRouteState(): RouteStateContextType {
    return useLocalStorage<RouteStateInformation>(`state-${CURRENT_EVENT}`, {} as RouteStateInformation);
}
