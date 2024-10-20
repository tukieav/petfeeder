import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Auth() {
  const [username, setUsername] : any = useState('');
  const [password, setPassword] : any = useState('');
  const [message, setMessage] : any = useState('');
  const [errors, setErrors] : any = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] : any = useState(false);

  const handleRegister = async () => {
    try {
      const response : any = await axios.post('http://localhost:3000/auth/register', { username, password });
      const loginResponse : any = await axios.post('http://localhost:3000/auth/login', { username, password });
      const token : any = loginResponse.data.token;
      setMessage(`Cześć ${username}`);
      setIsLoggedIn(true);
      setErrors([]);
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors.map((err: any) => err.msg));
      } else {
        setMessage('Error registering user');
      }
    }
  };

  const handleLogin = async () => {
    try {
      const response : any = await axios.post('http://localhost:3000/auth/login', { username, password });
      const token : any = response.data.token;
      setMessage(`Hello ${username}`);
      setIsLoggedIn(true);
      setErrors([]);
    } catch (error : any) {
      setMessage('Error logging in');
    }
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setMessage('');
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <>
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
          <Button title="Register" onPress={handleRegister} />
          <Button title="Login" onPress={handleLogin} />
          {errors.length > 0 && (
            <View style={styles.errorContainer}>
              {errors.map((error : any, index : any) => (
                <Text key={index} style={styles.errorText}>{error}</Text>
              ))}
            </View>
          )}
        </>
      ) : (
        <>
          <Text>{message}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  errorContainer: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
  },
});