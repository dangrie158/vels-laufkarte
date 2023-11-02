import React, { useContext, useState } from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import MapView from "../components/MapView";
import { RouteStateContext, useEvent } from "../providers";
import { Route, RouteState, SetRoute } from "../types";
import RouteStatePopup from "../components/RouteStatePopup";

type LevelProps = {
  name: string;
  abbrevation: string;
  mapImage: string;
};

const Level: React.FC<LevelProps> = (props: LevelProps) => {
  const { routes, eventName } = useEvent();
  const [routeState, setRouteState] = useContext(RouteStateContext);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  const routeOnThisLevel = routes.filter(route => route.set && route.level === props.abbrevation) as SetRoute[];

  const updateRouteState = (route: Route, newState: RouteState) => {
    setRouteState({
      ...routeState,
      [route.id]: { state: newState },
    });
  };

  const currentRouteState: RouteState | null =
    currentRoute !== null ? routeState[currentRoute.id]?.state ?? null : null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar hidden={eventName === undefined}>
          <IonTitle style={{ opacity: 1 }}>{eventName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="bg-green">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{props.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <MapView
          mapImage={props.mapImage}
          routes={routeOnThisLevel}
          routeStates={routeState}
          onRouteClicked={route => setCurrentRoute(route)}
        ></MapView>
        <RouteStatePopup
          isOpen={currentRoute !== null}
          currentRoute={currentRoute}
          initialValue={currentRouteState}
          onUpdateRouteState={(route, newState) => updateRouteState(route, newState)}
          onDismiss={() => setCurrentRoute(null)}
        ></RouteStatePopup>
      </IonContent>
    </IonPage>
  );
};

export default Level;
