import React, { useState } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { CommonStyle } from '../styles/styles';
import CustomButton from '../components/CustomButton';

interface SearchScreenProps {
    navigation: any;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
    const [searchWord, setSearchWord] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const searchWordHandler = async () => {
        if (!searchWord) {
            Alert.alert('Input Error', 'Please enter a word to search.');
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`);
            console.log(response);
            setSearchResults(response.data);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Invalid word. Please try again.');
            setSearchResults([]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => navigation.navigate('Details', { word: item.word, details: item })}
        >
            <Text style={CommonStyle.heading}>Word: {item.word}</Text>
            <Text style={CommonStyle.description1}>Phonetic: {item.phonetic}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={CommonStyle.input}
                placeholder="Search for a word..."
                value={searchWord}
                onChangeText={setSearchWord}
                placeholderTextColor={'#111'}
            />
            <CustomButton disabled={false} title="Search" onPress={searchWordHandler} />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : errorMessage ? (
                <Text style={CommonStyle.errColor}>{errorMessage}</Text>
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    resultItem: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default SearchScreen;
