enum RouteIdType { _ = "" }

export type RouteId = string & RouteIdType;
export type RouteColor = "gray" | "yellow" | "green" | "violet" | "pink" | "black" | "blue" | "orange" | "red" | "white" | "turquoise";
export type UnsetRoute = {
    id: RouteId;
    set: false;
};
export type SetRoute = {
    id: RouteId;
    set: true;
    level: "EG" | "OG";
    name: string;
    location: { x: number; y: number; rotation: number; };
    color: RouteColor;
};

export type Route = UnsetRoute | SetRoute;

export type RouteState = "tbd" | "project" | "flash" | "top";
export type RouteStateInformation = Record<RouteId, {
    state: RouteState;
}>;
export type Event = {
    eventName?: string;
    endDate?: number;
    routes: Route[];
};
