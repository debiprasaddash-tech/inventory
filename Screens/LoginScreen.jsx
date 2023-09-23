import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Picker,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // added data in async storage for employee and manager
    try {
      // Retrieve the stored user data from AsyncStorage
      const storedUserDataJSON = await AsyncStorage.getItem('user');

      // Parse the stored user data from JSON
      const storedUserData = JSON.parse(storedUserDataJSON);

      // Check if the stored user data matches the data to match
      if (
        storedUserData &&
        storedUserData.email === email &&
        storedUserData.password === password
      ) {
        console.log('User data matches.');
        navigation.navigate('Home');
      } else {
        console.log('User data does not match.');
      }
    } catch (error) {
      console.error('Error checking user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc', // Border color
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white', // Input background color
  },
  loginButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#007bff', // Button background color
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white', // Text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
