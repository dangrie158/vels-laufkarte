import React, { useContext, useState } from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import MapView from "../components/MapView";
import { EVENT_NAME, RouteStateContext, useRoutes } from "../providers";
import { Route, RouteState } from "../types";
import RouteStatePopup from "../components/RouteStatePopup";

type LevelProps = {
  name: string;
  abbrevation: string;
  mapImage: string;
};

const Level: React.FC<LevelProps> = (props: LevelProps) => {
  const [allRoutes] = useRoutes();
  const [routeState, setRouteState] = useContext(RouteStateContext);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  const routes = allRoutes.filter(route => route.level === props.abbrevation);

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
        <IonToolbar>
          <IonTitle style={{ opacity: 1 }}>{EVENT_NAME}</IonTitle>
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
          routes={routes}
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
