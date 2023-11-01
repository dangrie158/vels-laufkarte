/// <reference types="react-scripts" />

import React, { useEffect, useState } from "react";

import {
  IonAlert,
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  isPlatform,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { listOutline, medalOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import Info from "./pages/Info";
import Level from "./pages/Level";
import RouteList from "./pages/RouteList";
import Stats from "./pages/Stats";
import { RouteStateContext, useLocalStorage, usePersistentStorage, useRouteState } from "./providers";
import { register as registerServiceWorker } from "./serviceWorkerRegistration";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import "./theme/style.css";
import "./theme/variables.css";

import egMap from "./assets/floors/EG.svg";
import ogMap from "./assets/floors/OG.svg";

import iconDark from "./assets/icon/icon-dark.png";
import iconLight from "./assets/icon/icon-light.png";

setupIonicReact();
registerServiceWorker();

const App: React.FC = () => {
  const [warning, setWarning] = useState<string | null>(null);
  const [lastWarning, setLastWarning] = useLocalStorage("last-persistent-storage-warning", 0);

  useEffect(() => {
    checkPersistentStorage();
  }, []);

  const checkPersistentStorage = async () => {
    if (Date.now() - lastWarning >= 1000 * 60 * 60 * 24) {
      // only bother the user once a day
      return;
    }

    let warningMessage = null;
    try {
      const [persistStorage] = usePersistentStorage();

      if (await persistStorage) {
        // the data is persisted, no need to do anything
        return;
      }

      if (isPlatform("desktop")) {
        warningMessage =
          "Auf Desktopgeräten können die Daten eventuell nicht dauerhaft gespeichert werden. Öffne die App auf einem Mobilgerät um Datenverlust zu verhindern.";
      } else {
        warningMessage = "Füge die App auf deinen Homescreen hinzu um Datenverlust zu verhindern.";
        if (isPlatform("ios")) {
          warningMessage += " Teilen -> Zum Home-Bildschirm.";
        } else if (isPlatform("android")) {
          warningMessage += " ⋮ -> Zum Home-Bildschirm hinzufügen.";
        }
      }
    } catch {
      warningMessage =
        "Dein Gerät unterstützt das dauerhafte Speichern deiner Daten nicht. Es kann zu Datenverlusten kommen!";
    }

    if (warningMessage !== null) {
      setWarning(warningMessage);
      setLastWarning(Date.now());
    }
  };

  return (
    <IonApp>
      <IonAlert
        isOpen={!!warning}
        header="Achtung"
        subHeader="App nicht installiert"
        message={warning ?? ""}
        buttons={["Verstanden"]}
        onDidDismiss={() => setWarning(null)}
      ></IonAlert>
      <RouteStateContext.Provider value={useRouteState()}>
        <IonReactRouter basename="/vels-laufkarte">
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/eg">
                <Level name="ERDGESCHOSS" abbrevation="EG" mapImage={egMap} />
              </Route>
              <Route exact path="/og">
                <Level name="OBERGESCHOSS" abbrevation="OG" mapImage={ogMap} />
              </Route>
              <Route exact path="/list">
                <RouteList />
              </Route>
              <Route exact path="/stats">
                <Stats />
              </Route>
              <Route path="/info">
                <Info />
              </Route>
              <Route exact path="/">
                <Redirect to="/eg" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="eg" href="/eg">
                <h2>EG</h2>
              </IonTabButton>
              <IonTabButton tab="og" href="/og">
                <h2>OG</h2>
              </IonTabButton>
              <IonTabButton disabled={true}>
                <picture>
                  <source srcSet={iconLight} media="(prefers-color-scheme: dark)"></source>
                  <img src={iconDark} style={{ width: "50%" }} />
                </picture>
              </IonTabButton>
              <IonTabButton tab="list" href="/list">
                <IonIcon aria-hidden="true" icon={listOutline} />
                <IonLabel>Laufkarte</IonLabel>
              </IonTabButton>
              <IonTabButton tab="stats" href="/stats">
                <IonIcon aria-hidden="true" icon={medalOutline} />
                <IonLabel>Stats</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </RouteStateContext.Provider>
    </IonApp>
  );
};

export default App;
