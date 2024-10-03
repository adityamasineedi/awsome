import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonStyle } from '../styles/styles';
import CustomButton from '../components/CustomButton';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
      setIsLoading(false);
    };

    getUsername();
  }, []);

  const handleLogin = async () => {
    await AsyncStorage.setItem('username', username);
    navigation.replace('Home');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={CommonStyle.heading}>Login</Text>
      <TextInput
        style={CommonStyle.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={'#111'}
      />
      <CustomButton buttonStyle={ username === '' ? {backgroundColor: '#cccccc'} : {backgroundColor:   '#6200ee'}} disabled={username === '' ?  true : false} title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default LoginScreen;
