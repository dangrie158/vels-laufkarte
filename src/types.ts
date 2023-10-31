export type RouteId = string;
export type RouteColor = "gray" | "yellow" | "green" | "violet" | "pink" | "black" | "blue" | "orange" | "red" | "white" | "turquoise";

export type Route = {
    id: RouteId;
    level: "EG" | "OG";
    location: { x: number; y: number; rotation: number; };
    color: RouteColor;
};

export type RouteState = "tbd" | "project" | "flash" | "top";
export type RouteStateInformation = Record<RouteId, {
    state: RouteState;
}>;