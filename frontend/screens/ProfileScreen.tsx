import React from 'react';
import { View, Button, Alert } from 'react-native';
import { logout } from '../services/authService';

const ProfileScreen = () => {
  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Logged out', 'You have been logged out successfully');
    } catch (error) {
      Alert.alert('Error', 'There was an issue logging out');
    }
  };

  return (
    <View>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;