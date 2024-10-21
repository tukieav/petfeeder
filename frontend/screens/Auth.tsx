import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Auth: undefined;
  AnimalList: undefined;
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const handleAuth = async (isRegister: boolean) => {
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const response = await axios.post(`http://localhost:3000${endpoint}`, { username, password });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      setErrors([]);
      navigation.navigate('AnimalList');
    } catch (error: any) {
      setErrors(error.response?.data?.errors?.map((err: any) => err.msg) || [error.message]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title={isRegistering ? 'Register' : 'Login'} onPress={() => handleAuth(isRegistering)} />
      <Button title={isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'} onPress={() => setIsRegistering(!isRegistering)} />
      {errors.length > 0 && errors.map((error, index) => <Text key={index} style={styles.errorText}>{error}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 },
  errorText: { color: 'red' },
});