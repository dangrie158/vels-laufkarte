import React, { useContext } from "react";
import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { RouteStateContext, useEvent } from "../providers";
import StatValue from "../components/StatValue";

const Level: React.FC = () => {
  const { routes, eventName } = useEvent();
  const [routeState] = useContext(RouteStateContext);

  const tops = Object.values(routeState).filter(({ state }) => ["top", "flash"].includes(state)).length;
  const flashes = Object.values(routeState).filter(({ state }) => state === "flash").length;
  const toProject = Object.values(routeState).filter(({ state }) => state === "project").length;
  const flashPercentage = Math.round((flashes / tops) * 100);

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

        <h2>Tops</h2>
        <StatValue type="fraction" value={tops} maxValue={routes.length} />

        <IonGrid>
          <IonRow>
            <IonCol>
              <h2>Routen geflasht</h2>
              <StatValue type="percentage" value={flashPercentage} />
            </IonCol>
            <IonCol>
              <h2>Routen zum Projektieren</h2>
              <StatValue type="number" value={toProject} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Level;
