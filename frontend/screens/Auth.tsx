import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { handleAuthRequest } from '../services/authService';
import { extractErrorMessages } from '../utils/errorUtils';

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

  const handleAuth = async () => {
    try {
      await handleAuthRequest(isRegistering, { username, password });
      setErrors([]);
      navigation.navigate('AnimalList');
    } catch (error: any) {
      setErrors(extractErrorMessages(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title={isRegistering ? 'Register' : 'Login'} onPress={handleAuth} />
      <Button title={isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'} onPress={() => setIsRegistering(!isRegistering)} />
      {errors.length > 0 && errors.map((error, index) => <Text key={index} style={styles.errorText}>{error}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 10,
  },
});