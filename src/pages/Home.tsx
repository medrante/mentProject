import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonFooter,
  IonButtons,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { addCircle, trash, share } from 'ionicons/icons';
import { useTTS } from '../hooks/useTTS';
import ment from '../theme/ment.png';
import {
  FilesystemDirectory,
  Plugins,
  FilesystemEncoding,
} from '@capacitor/core';
import './Home.css';

export interface ISensor {
  username: string;
  location: string;
  message: string;
  id: number;
  IP: string;
}

const Home: React.FC = () => {
  const [sensors, setSensor] = useState<ISensor[]>([]);
  const { createFile } = useTTS();
  const { Filesystem } = Plugins;

  // Updates on load or refresh - axios is the other way to save the data, but not as stable
  useEffect(() => {
    updateFile();
    checkIfSensorsExist();
  }, []);

  // Update data
  const updateFile = async () => {
    try {
      const contents = await Filesystem.readFile({
        path: 'data/data.json',
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8,
      });
      const sensors = JSON.parse(contents.data);
      setSensor(sensors);
      console.log('Sensors updated');
    } catch (e) {
      createFile();
    }
  };

  // Delete Sensor
  const deleteSensor = async (sensor: ISensor) => {
    let array = sensors; // make a separate copy of the array
    const newSensors = sensors.filter((s) => s.id !== sensor.id);
    setSensor(newSensors);
    // Update File
    await Filesystem.writeFile({
      path: 'data/data.json',
      data: JSON.stringify(newSensors),
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
    });
  };

  // TODO: Share sensor
  const shareSensor = async (id: number) => {
    alert('This will pull up a sharing ');
  };

  const checkIfSensorsExist = () => {
    if (sensors.length === 0) {
      return (
        <IonContent className='ion-padding-start'>
          <p>No sensors connected. Click add button to connect a sensor</p>
        </IonContent>
      );
    } else {
      return (
        <IonContent>
          {sensors.map((sensor, idx) => (
            <IonList key={idx}>
              <Link to={`/home/details/${sensor.id}`}>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>
                      {sensor.location} (ID: {sensor.id})
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>{sensor.message}</IonCardContent>
                  <IonRow>
                    <IonCol>
                      <IonButton
                        className='clear small icon-small'
                        onClick={(e) => {
                          e.preventDefault();
                          deleteSensor(sensor);
                        }}>
                        <IonIcon icon={trash}></IonIcon>
                      </IonButton>
                      <IonButton className='clear small icon-small'>
                        <IonIcon
                          icon={share}
                          slot='icon-only'
                          onClick={(e) => {
                            e.preventDefault();
                            shareSensor(sensor.id);
                          }}></IonIcon>
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCard>
              </Link>
            </IonList>
          ))}
        </IonContent>
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div>Home</div>
          </IonTitle>
          <IonFab horizontal='end' vertical='center' slot='fixed'>
            <IonFabButton color='light'>
              <img src={ment} />
            </IonFabButton>
          </IonFab>
        </IonToolbar>
      </IonHeader>
      <IonContent>{checkIfSensorsExist()}</IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot='end'>
            <IonButton routerLink='/addnewsensor'>
              <IonIcon slot='icon-only' icon={addCircle} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
