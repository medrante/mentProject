import React from 'react';
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonContent,
} from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';

interface SensorDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

// TODO: show sensor details with edit options
const Details: React.FC<SensorDetailPageProps> = ({ match }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/home' />
          </IonButtons>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        This should show the sensor details along with an edit option
      </IonContent>
    </IonPage>
  );
};

export default Details;
