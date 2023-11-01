import React, { useContext } from "react";
import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { EVENT_NAME, RouteStateContext, useRoutes } from "../providers";
import StatValue from "../components/StatValue";

const Level: React.FC = () => {
  const [allRoutes] = useRoutes();
  const [routeState] = useContext(RouteStateContext);

  const tops = Object.values(routeState).filter(({ state }) => state === "top").length;
  const flashes = Object.values(routeState).filter(({ state }) => state === "flash").length;
  const toProject = Object.values(routeState).filter(({ state }) => state === "project").length;
  const flashPercentage = Math.round((flashes / tops) * 100);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ opacity: 1 }}>{EVENT_NAME}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="bg-white">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Stats</IonTitle>
          </IonToolbar>
        </IonHeader>

        <h2>Tops</h2>
        <StatValue type="fraction" value={tops} maxValue={allRoutes.length} />

        <IonGrid>
          <IonRow>
            <IonCol>
              <h2>Routen geflasht</h2>
              <StatValue type="percentage" value={flashPercentage} />
            </IonCol>
            <IonCol>
              <h2>Routen zum Projektieren</h2>
              <StatValue type="number" value={toProject} maxValue={100} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Level;
