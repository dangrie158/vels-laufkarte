import React, { useState } from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import MapView from "../components/MapView";
import "./Level.css";
import { EVENT_NAME, useRouteState, useRoutes } from "../providers";
import { Route, RouteId, RouteState } from "../types";
import RouteStatePopup from "../components/RouteStatePopup";

type LevelProps = {
  name: string;
  abbrevation: string;
  mapImage: string;
};

const Level: React.FC<LevelProps> = (props: LevelProps) => {
  const [allRoutes] = useRoutes();
  const [routeState, setRouteState] = useRouteState();
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  const routes = Object.keys(allRoutes)
    .filter(routeId => allRoutes[routeId].level === props.abbrevation)
    .reduce((accumulator, key) => ((accumulator[key] = allRoutes[key]), accumulator), {} as typeof allRoutes);
  const handleRouteClick = (routeId: RouteId) => {
    setCurrentRoute(routes[routeId]);
  };

  const updateRouteState = (routeId: RouteId, newState: RouteState) => {
    setRouteState({
      ...routeState,
      [routeId]: { state: newState },
    });
  };
  const currentRouteState = routeState[currentRoute?.id ?? ""]?.state ?? null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ opacity: 1 }}>{EVENT_NAME}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{props.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <MapView
          mapImage={props.mapImage}
          routes={routes}
          routeStates={routeState}
          onRouteClicked={routeId => handleRouteClick(routeId)}
        ></MapView>
        <RouteStatePopup
          isOpen={currentRoute !== null}
          currentRoute={currentRoute?.id}
          initialValue={currentRouteState}
          onUpdateRouteState={(routeId, newState) => updateRouteState(routeId, newState)}
          onDismiss={() => setCurrentRoute(null)}
        ></RouteStatePopup>
      </IonContent>
    </IonPage>
  );
};

export default Level;
