import React, { useContext } from "react";
import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { RouteStateContext, useEvent } from "../providers";
import StatValue from "../components/StatValue";

const Level: React.FC = () => {
  const { routes, eventName, endDate } = useEvent();
  const [routeState] = useContext(RouteStateContext);

  const tops = Object.values(routeState).filter(({ state }) => ["top", "flash"].includes(state)).length;
  const flashes = Object.values(routeState).filter(({ state }) => state === "flash").length;
  const toProject = Object.values(routeState).filter(({ state }) => state === "project").length;
  const flashPercentage = Math.round((flashes / tops) * 100);

  const millisecondsLeft = (endDate ?? 0) - Date.now();
  let timeLeft = millisecondsLeft / (1000 * 60 * 60);
  let timeUnit = "Stunden";
  if (timeLeft > 48) {
    timeLeft = timeLeft / 24;
    timeUnit = "Tage";
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar hidden={eventName === undefined}>
          <IonTitle style={{ opacity: 1 }}>{eventName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="bg-white">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Stats</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            <IonCol>
              <h2>Tops</h2>
              <StatValue unit="fraction" value={tops} suffix={routes.length.toFixed()} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <h2>Routen geflasht</h2>
              <StatValue unit="%" value={flashPercentage} />
            </IonCol>
            <IonCol>
              <h2>Routen zum Projektieren</h2>
              <StatValue unit="" value={toProject} />
            </IonCol>
          </IonRow>
          <IonRow hidden={endDate === undefined}>
            <IonCol>
              <h2>Noch</h2>
              <StatValue unit={timeUnit} value={timeLeft} suffix="bis zur Abgabe" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Level;
