import React from "react";
import { Route, RouteState } from "../types";
import { IonAlert, useIonToast } from "@ionic/react";
import { IonAlertCustomEvent, OverlayEventDetail } from "@ionic/core";

type RouteStatePopupProps = {
  isOpen: boolean;
  currentRoute: Route | null;
  onUpdateRouteState: (route: Route, newState: RouteState) => void;
  onDismiss: () => void;
  initialValue: RouteState | null;
};

const FEEDBACK_MESSAGES = {
  neutral: ["Wird schon 👍", "Allez! 💪"],
  positive: ["Nice! 👌", "Chacka! 👊"],
};

const RouteStatePopup: React.FC<RouteStatePopupProps> = (props: RouteStatePopupProps) => {
  const [openToast] = useIonToast();

  const handleDismiss = (event: IonAlertCustomEvent<OverlayEventDetail>) => {
    if (props.currentRoute !== null && event.detail.data !== undefined) {
      const newState = event.detail.data.values;
      const feedbackCategory = ["tbd", "project"].includes(newState) ? "neutral" : "positive";
      const availableMessages = FEEDBACK_MESSAGES[feedbackCategory];
      const randomMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
      openToast({ message: randomMessage, duration: 1000, position: "top" });
      props.onUpdateRouteState(props.currentRoute, newState);
    }
    props.onDismiss();
  };

  return (
    <IonAlert
      isOpen={props.isOpen}
      onDidDismiss={event => handleDismiss(event)}
      header={`Route ${props.currentRoute?.id}`}
      buttons={[{ text: "Speichern", role: "save" }]}
      inputs={[
        {
          label: "🤔 Unprojektiert",
          type: "radio",
          value: "tbd",
          checked: props.initialValue === null || props.initialValue === "tbd",
        },
        {
          label: "✌️ Projekt",
          type: "radio",
          value: "project",
          checked: props.initialValue === "project",
        },
        {
          label: "👊 TOP",
          type: "radio",
          value: "top",
          checked: props.initialValue === "top",
        },
        {
          label: "💯 Flash",
          type: "radio",
          value: "flash",
          checked: props.initialValue === "flash",
        },
      ]}
    ></IonAlert>
  );
};

export default RouteStatePopup;
