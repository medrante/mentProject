import React, { useState } from 'react';
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonInput,
  IonLabel,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import { useTTS } from '../hooks/useTTS';
import { useHistory } from 'react-router-dom';
import { mic } from 'ionicons/icons';
import {
  FilesystemDirectory,
  Plugins,
  FilesystemEncoding,
} from '@capacitor/core';
import { ISensor } from '../pages/Home';

// TODO: connect with IP

const AddNewSensor: React.FC<ISensor> = (props) => {
  const [newUsername, setUsername] = useState('');
  const [newLocation, setLocation] = useState('');
  const [newMessage, setMessage] = useState('');
  const [newIp, setIp] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [newIcon, setIcon] = useState('{ mic }');

  const { tts, startRecording, stopRecording } = useTTS();
  const { Filesystem } = Plugins;
  const history = useHistory();

  const onSubmit = async () => {
    try {
      tts(newMessage);
      // axios
      //   .post('locations', {
      //     username: newUsername,
      //     location: newLocation,
      //     message: newMessage,
      //     IP: newIp,
      //   })
      //   .then((res) => {
      //     console.log(res.data);
      //   });
      updateFile({
        username: newUsername,
        location: newLocation,
        message: newMessage,
        IP: newIp,
      });
      alert('Successfully added sensor');
    } catch (e) {
      setFormErrors(e);
    }
    setUsername('');
    setLocation('');
    setMessage('');
    setIp('');
    history.push('/');
  };

  // TODO: Update data
  const updateFile = async (inputData: any) => {
    const contents = await Filesystem.readFile({
      path: 'data/data.json',
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
    });
    const sensors = JSON.parse(contents.data);
    const length = sensors.length;
    inputData['id'] = length;
    sensors.push(inputData);
    await Filesystem.writeFile({
      path: 'data/data.json',
      data: JSON.stringify(sensors),
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
    });
    console.log(sensors);
  };

  // change mic icon to square to indcate that it is recording
  const showToggle = () => {
    if (newIcon == '{ mic }') {
      setIcon('{ mic }');
    } else {
      setIcon('{ mic }');
    }
  };

  // TODO: Record Audio
  const RecordAudio = async () => {
    const res = await startRecording();
  };

  // Stop Recording
  const StopRecording = async () => {
    const res = await stopRecording();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/home' />
          </IonButtons>
          <IonTitle>
            <p>Add New Sensor</p>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}>
          <IonList>
            <IonItem>
              <IonLabel>Username</IonLabel>
              <IonInput
                name='username'
                value={newUsername}
                onIonChange={(e: any) => setUsername(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Location</IonLabel>
              <IonInput
                name='location'
                value={newLocation}
                onIonChange={(e: any) => setLocation(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Message</IonLabel>
              <IonInput
                name='message'
                value={newMessage}
                onIonChange={(e: any) => setMessage(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonLabel>IP Address</IonLabel>
              <IonInput
                name='ipaddress'
                value={newIp}
                onIonChange={(e: any) => setIp(e.target.value)}
              />
            </IonItem>
          </IonList>
          <IonButton type='submit' color='ment'>
            Submit
          </IonButton>
        </form>

        <IonFab
          horizontal='center'
          vertical='bottom'
          className='ion-padding-bottom'>
          <IonFabButton color='ment'>
            <IonIcon
              icon={mic}
              onClick={() => {
                startRecording();
                showToggle();
              }}
            />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default AddNewSensor;
