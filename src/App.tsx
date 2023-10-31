import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { listOutline } from "ionicons/icons";
import Level from "./pages/Level";
import Info from "./pages/Info";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import RouteList from "./pages/RouteList";

import egMap from "./assets/floors/EG.svg";
import ogMap from "./assets/floors/OG.svg";
import { RouteStateContext, useRouteState } from "./providers";
setupIonicReact();
const App: React.FC = () => {
  return (
    <IonApp>
      <RouteStateContext.Provider value={useRouteState()}>
        <IonReactRouter>
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
              <IonTabButton tab="list" href="/list">
                <IonIcon aria-hidden="true" icon={listOutline} />
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </RouteStateContext.Provider>
    </IonApp>
  );
};

export default App;
