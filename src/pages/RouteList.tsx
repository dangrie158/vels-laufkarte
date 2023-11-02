import React, { useContext, useState } from "react";
import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import "./RouteList.css";
import { RouteStateContext, useEvent } from "../providers";
import { Route, RouteId, RouteState } from "../types";
import RouteStatePopup from "../components/RouteStatePopup";
import markIcon from "../assets/mark.svg";

const COLUMN_HEIGHT = 25;

const RouteList: React.FC = () => {
  const { eventName, routes } = useEvent();
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

  const numColumns = Math.ceil(routes.length / COLUMN_HEIGHT);
  const columns: Route[][] = [...Array(numColumns).keys()].map(columnIndex => {
    const startIndex = columnIndex * COLUMN_HEIGHT;
    const endIndex = startIndex + COLUMN_HEIGHT;
    return routes.slice(startIndex, endIndex);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ opacity: 1 }}>{eventName}</IonTitle>
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
            {columns.map((column, columnIndex) => {
              return (
                <IonCol class="outer" key={columnIndex} sizeXs="6" sizeSm="6" sizeMd="3" size="3">
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
                    {column.map(route => (
                      <IonRow key={route.id} onClick={() => handleRouteClick(route.id)} aria-disabled={!route.set}>
                        <IonCol size="4">
                          {route.id}
                          {routeState[route.id]?.state === "project" ? (
                            <img className="project-mark" src={markIcon} />
                          ) : (
                            ""
                          )}
                        </IonCol>
                        <IonCol class="entry" size="4">
                          {routeState[route.id]?.state === "flash" ? "X" : ""}
                        </IonCol>
                        <IonCol class="entry" size="4">
                          {routeState[route.id]?.state === "top" ? "X" : ""}
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
