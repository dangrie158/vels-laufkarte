import { select, zoom } from "d3";
import React, { useRef, useEffect, useState } from "react";
import { Route, RouteColor, RouteInformation, RouteStateInformation } from "../types";
import squareMarkIcon from "../assets/mark-square.svg";

const ROUTE_SIZE = 0.023;
type HexColor = `#${string}`;

type ColorInformation = {
  fill: HexColor;
  stroke: HexColor;
  text: HexColor;
};
const ROUTE_COLORS: Record<RouteColor, ColorInformation> = {
  gray: {
    fill: "#878787",
    stroke: "#000000",
    text: "#FFFFFF",
  },
  yellow: {
    fill: "#F7F741",
    stroke: "#000000",
    text: "#000000",
  },
  green: {
    fill: "#1F9556",
    stroke: "#000000",
    text: "#FFFFFF",
  },
  violet: {
    fill: "#5E2970",
    stroke: "#000000",
    text: "#FFFFFF",
  },
  pink: {
    fill: "#DB1D73",
    stroke: "#000000",
    text: "#FFFFFF",
  },
  black: {
    fill: "#000000",
    stroke: "#AAAAAA",
    text: "#FFFFFF",
  },
  blue: {
    fill: "#0b6eba",
    stroke: "#000000",
    text: "#FFFFFF",
  },
  orange: {
    fill: "#F1762A",
    stroke: "#000000",
    text: "#FFFFFF",
  },
  red: {
    fill: "#C61E21",
    stroke: "#000000",
    text: "#FFFFFF",
  },
  white: {
    fill: "#FFFFFF",
    stroke: "#000000",
    text: "#000000",
  },
  turquoise: {
    fill: "#9CC5BC",
    stroke: "#000000",
    text: "#000000",
  },
};

type MapViewProps = {
  mapImage: string;
  routes: RouteInformation;
  routeStates: RouteStateInformation;
  onRouteClicked: (route: Route) => void;
};

const MapView: React.FC<MapViewProps> = (props: MapViewProps) => {
  const svgContainer = useRef<SVGSVGElement>(null);
  const mapContainer = useRef<SVGGElement>(null);
  const [container, setContainer] = useState({ width: 0, height: 0 });

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    const width = window.innerWidth;
    const height = window.innerHeight;
    setContainer({ width, height });

    const svg = select(svgContainer.current);
    svg.call(handleZoom as unknown as () => void);
  }, []);

  const handleWindowResize = () => {
    const height = svgContainer.current?.clientHeight;
    const width = svgContainer.current?.clientWidth;

    setContainer({ width: width ?? 0, height: height ?? 0 });
  };

  const handleZoom = zoom().on("zoom", event => {
    const g = select(mapContainer.current);
    g.attr("transform", event.transform);
  });

  const factor = Math.min(container.width, container.height);
  const offset = Math.abs(container.width - container.height) / 2;
  const xOffset = container.width > container.height ? offset : 0;
  const yOffset = container.width < container.height ? offset : 0;

  const strokeColor = (route: Route) => {
    if (props.routeStates[route.id]?.state === "flash") {
      return "gold";
    }
    return ROUTE_COLORS[route.color].stroke;
  };
  const opacity = (route: Route) => {
    if (props.routeStates[route.id]?.state === "flash" || props.routeStates[route.id]?.state === "top") {
      return 0.5;
    }
    return 1;
  };

  return (
    <svg width="100%" height="100%" ref={svgContainer}>
      <g ref={mapContainer} width="100%" height="100%">
        <image width={container.width} height={container.height} href={props.mapImage} />
        {props.routes.map(route => {
          const x = route.location.x * factor + xOffset;
          const y = route.location.y * factor + yOffset;
          const routeSize = ROUTE_SIZE * factor;
          return (
            <g
              width={routeSize}
              height={routeSize}
              key={route.id}
              transform={`rotate(${route.location.rotation}, ${x}, ${y}) translate(${x} ${y}) `}
              onClick={() => props.onRouteClicked(route)}
              style={{ cursor: "pointer" }}
              opacity={opacity(route)}
            >
              <rect
                width={routeSize}
                height={routeSize}
                fill={ROUTE_COLORS[route.color].fill}
                strokeWidth={0.002 * factor}
                stroke={strokeColor(route)}
              />
              <text
                width={routeSize}
                height={routeSize}
                x={routeSize / 2}
                y={routeSize / 2}
                fontSize={0.015 * factor}
                fontFamily="AbsentGrotesque"
                textAnchor="middle"
                alignmentBaseline="middle"
                fill={ROUTE_COLORS[route.color].text}
              >
                {route.id}
              </text>
              {props.routeStates[route.id]?.state === "project" ? (
                <image
                  width={routeSize * 2}
                  href={squareMarkIcon}
                  transform={`rotate(${-route.location.rotation}) translate(${-routeSize}, ${-routeSize / 2.5})`}
                ></image>
              ) : (
                ""
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default MapView;
