/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import CustomButton from '../components/CustomButton';
import { CommonStyle } from '../styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HomeScreenProps {
    navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [randomWord, setRandomWord] = useState<string>('');
    const [definition, setDefinition] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRandomWord();
    }, []);

    const fetchRandomWord = async () => {
        setLoading(true);
        setError(null);
            const url = 'https://random-words-api.vercel.app/word/dutch';
        try {
            const response = await axios.get(url);
            if (response.data && response.data.length > 0) {
                const word = response.data[0].word;
                const deff = response.data[0].definition;
                setRandomWord(word);
                setDefinition(deff);
            } else {
                throw new Error('No word found');
            }
        } catch (err) {
            setError('Failed to fetch a random word. Please try again.');
            Alert.alert('Error', 'Failed to fetch a random word. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const Logout = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Storage successfully cleared!');
            navigation.navigate('Login');
          } catch (e) {
            console.error('Failed to clear AsyncStorage:', e);
          }
      };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <TouchableOpacity onPress={() => navigation.navigate('Details', { word: randomWord })}>
                        <Text style={CommonStyle.heading}>Random Word: {error !== null ? error : randomWord}</Text>
                    </TouchableOpacity>
                    <Text style={CommonStyle.description}>Definition: {definition}</Text>
                    <CustomButton title="Search Another Word" onPress={() => navigation.navigate('Search')} disabled={false} />
                    <CustomButton  buttonStyle={{ backgroundColor: '#b23b3b' }} title="Logout" onPress={() => Logout()} disabled={false} />

                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
});

export default HomeScreen;
