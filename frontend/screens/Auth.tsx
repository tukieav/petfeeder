import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Import typów nawigacji
import AnimalList from './AnimalList';

// Definiowanie typów dla stosu nawigacji
type RootStackParamList = {
  Auth: undefined;
  AnimalList: undefined;
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Przełącznik między logowaniem a rejestracją
  const navigation = useNavigation<AuthScreenNavigationProp>(); // Użycie typów nawigacji

  // Funkcja do obsługi rejestracji
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', { username, password });
      const loginResponse = await axios.post('http://localhost:3000/auth/login', { username, password });
      const token = loginResponse.data.token;
      setMessage(`Cześć ${username}`);
      setIsLoggedIn(true);
      setErrors([]);
      await AsyncStorage.setItem('token', token);
      navigation.navigate('AnimalList'); // Nawigacja do ekranu AnimalList
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors.map((err: any) => err.msg));
      } else {
        setMessage('Error registering user');
      }
    }
  };

  // Funkcja do obsługi logowania
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      setMessage(`Hello ${username}`);
      setIsLoggedIn(true);
      setErrors([]);
      navigation.navigate('AnimalList'); // Nawigacja do ekranu AnimalList
    } catch (error: any) {
      setMessage('Error logging in');
      setErrors([error.message]);
    }
  };

  // Jeśli użytkownik jest zalogowany, wyświetl listę zwierząt
  if (isLoggedIn) {
    return <AnimalList />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={isRegistering ? 'Register' : 'Login'}
        onPress={isRegistering ? handleRegister : handleLogin}
      />
      <Button
        title={isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
        onPress={() => setIsRegistering(!isRegistering)}
      />
      {message ? <Text>{message}</Text> : null}
      {errors.length > 0 && (
        <View>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>{error}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
  },
});