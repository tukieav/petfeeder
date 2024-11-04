import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
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
  const theme = useTheme(); // Pobieranie motywu Material Design
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
      />
      <Button
        mode="contained"
        onPress={handleAuth}
        style={styles.button}
      >
        {isRegistering ? 'Register' : 'Login'}
      </Button>
      <Button
        mode="text"
        onPress={() => setIsRegistering(!isRegistering)}
        style={styles.switchButton}
      >
        {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
      </Button>
      {errors.length > 0 && errors.map((error, index) => (
        <Text key={index} style={styles.errorText}>{error}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  switchButton: {
    marginTop: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});