import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";

const RegForm = ({ route }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [ph, setPh] = useState(route.params?.phoneNumber.slice(3) || '');
  const [bg, setBg] = useState('');
  const [error, setError] = useState('');
  const IP_ADDRESS=Constants.expoConfig.extra.IP_ADDRESS;

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!name || !age || !ph || !bg) {
      setError("All fields are required");
      return;
    }
    try {
      const response = await fetch(`http://192.168.25.159:5501/user/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, ph, bg })
      });
      const result = await response.json();
      if (result.exists) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainDrawer',
              state: {
                routes: [
                  {
                    name: 'Home',
                    params: { Userid: result.id },
                  },
                ],
              },
            },
          ],
        });
      } else {
        setError(result.message || "Error in registration");
        console.log("Error:", result.message);
      }
    } catch (error) {
      setError("Error in registration");
      console.error("Error in registration:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registration Form</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={text => setAge(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          maxLength={3}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={ph}
          editable={false}
        />
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={bg}
            onValueChange={value => setBg(value)}
          >
            <Picker.Item label="Select Blood Group" value="" />
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="AB+" value="AB+" />
            <Picker.Item label="AB-" value="AB-" />
            <Picker.Item label="B+" value="B+" />
            <Picker.Item label="B-" value="B-" />
            <Picker.Item label="O+" value="O+" />
            <Picker.Item label="O-" value="O-" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4FF",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#0256A3",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  addButton: {
    backgroundColor: "#0256A3",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default RegForm;