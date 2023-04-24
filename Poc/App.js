import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

export default function App() {
  const [uri, setUri] = useState(); 
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      
      console.log('Starting recording..');

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const recordingUri = recording.getURI(); 
    setUri(recordingUri);
    console.log('Recording stopped and stored at', recordingUri);
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({ uri })
    setSound(sound)

    await sound.playAsync()
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <>
    <View>
      <View style={styles.recordButton}>
        <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}
        />
      </View>
    </View>
    <View style={styles.playButton}>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  </>
  );
}

const styles = StyleSheet.create({
  recordButton: {
    marginTop: 400,
  },
  playButton: {
    marginTop: 40
  }
});