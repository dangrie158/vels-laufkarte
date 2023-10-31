/// <reference types="react-scripts" />

import React from "react";

import { register as registerServiceWorker } from "./serviceWorkerRegistration";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { listOutline, medalOutline } from "ionicons/icons";
import Level from "./pages/Level";
import Info from "./pages/Info";
import RouteList from "./pages/RouteList";
import { RouteStateContext, useRouteState } from "./providers";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import "./theme/variables.css";
import "./theme/style.css";

import egMap from "./assets/floors/EG.svg";
import ogMap from "./assets/floors/OG.svg";

import iconLight from "./assets/icon/icon-light.png";
import iconDark from "./assets/icon/icon-dark.png";

setupIonicReact();
registerServiceWorker();

const App: React.FC = () => {
  return (
    <IonApp>
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
                <RouteList />
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
