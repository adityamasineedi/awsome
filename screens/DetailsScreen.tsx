/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import Sound from 'react-native-sound';
import CustomButton from '../components/CustomButton';
import { CommonStyle } from '../styles/styles';

interface RouteParams {
  params: {
    word: string;
  };
}

const DetailsScreen = ({ route }: { route: RouteParams }) => {
  const { word } = route.params;
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchWordDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWordDetails = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      setDetails(response.data[0]);
    } catch (error) {
      setErrorMessage('Failed to fetch word details. Please try again.');
      console.error(error);
      Alert.alert('Error', 'Failed to fetch word details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const playSound = (url: string) => {
    const sound = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
      sound.play();
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errorMessage ? (
        <Text style={CommonStyle.textColor}>{errorMessage}</Text>
      ) : (
        details && (
          <>
            <Text style={CommonStyle.heading}>Word: {details.word}</Text>
            {details.phonetics[0]?.audio && (
              <CustomButton title="Play Pronunciation" onPress={() => playSound(details?.phonetics[0]?.audio)} />
            )}
            <Text style={CommonStyle.description}>Phonetic: {details.phonetic}</Text>
            <Text style={CommonStyle.heading}>definitions:-</Text>
            {details?.meanings?.map((meaning: any, index: number) => (
              <View key={index} style={styles.meaningContainer}>
                <Text style={[CommonStyle.description, {textDecorationLine: 'underline', textTransform: 'uppercase'}]}>{meaning.partOfSpeech}</Text>
                {meaning?.definitions?.map((definition: any, defIndex: number) => (
                  <Text key={defIndex} style={CommonStyle.description1}>
                    {defIndex + 1}. {definition.definition}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  meaningContainer: {
    marginTop: 20,
  },
});

export default DetailsScreen;
