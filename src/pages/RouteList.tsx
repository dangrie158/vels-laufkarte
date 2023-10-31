import React, { useContext, useState } from "react";
import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import "./RouteList.css";
import { EVENT_NAME, RouteStateContext, useRoutes } from "../providers";
import { Route, RouteId, RouteState } from "../types";
import RouteStatePopup from "../components/RouteStatePopup";
import markIcon from "../assets/mark.svg";

const RouteList: React.FC = () => {
  const [routes] = useRoutes();
  const [routeState, setRouteState] = useContext(RouteStateContext);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  const handleRouteClick = (routeId: RouteId) => {
    const clickedRoute = routes.find(route => route.id === routeId) ?? null;
    setCurrentRoute(clickedRoute);
  };

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
      <IonContent className="bg-white">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Alle Routen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid class="route-list">
          <IonRow>
            {[1, 26, 51, 76].map((startId, column) => {
              const routesInColumn = [...Array(25).keys()].map(i => (i + startId) as RouteId);
              return (
                <IonCol class="outer" key={column} sizeXs="6" sizeSm="6" sizeMd="3" size="3">
                  <IonGrid>
                    <IonRow>
                      <IonCol class="header" size="4"></IonCol>
                      <IonCol class="header" size="4">
                        <h2>FLASH</h2>
                      </IonCol>
                      <IonCol class="header" size="4">
                        <h2>TOP</h2>
                      </IonCol>
                    </IonRow>
                    {routesInColumn.map(routeId => (
                      <IonRow
                        key={routeId}
                        onClick={() => handleRouteClick(routeId)}
                        aria-disabled={!routes.some(route => route.id === routeId)}
                      >
                        <IonCol size="4">
                          {routeId}
                          {routeState[routeId]?.state === "project" ? (
                            <img className="project-mark" src={markIcon} />
                          ) : (
                            ""
                          )}
                        </IonCol>
                        <IonCol class="entry" size="4">
                          {routeState[routeId]?.state === "flash" ? "X" : ""}
                        </IonCol>
                        <IonCol class="entry" size="4">
                          {routeState[routeId]?.state === "top" ? "X" : ""}
                        </IonCol>
                      </IonRow>
                    ))}
                  </IonGrid>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
        <RouteStatePopup
          isOpen={currentRoute !== null}
          currentRoute={currentRoute}
          onUpdateRouteState={(route, newState) => updateRouteState(route, newState)}
          onDismiss={() => setCurrentRoute(null)}
          initialValue={currentRouteState}
        ></RouteStatePopup>
      </IonContent>
    </IonPage>
  );
};

export default RouteList;
