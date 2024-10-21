import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Auth'>>();
    navigation.navigate('Auth');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};