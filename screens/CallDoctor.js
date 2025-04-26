import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Constants from 'expo-constants';
import { ScrollView } from 'react-native';


export default function CallDoctorScreen() {
  const navigation = useNavigation();
  const IP_ADDRESS = Constants.expoConfig.extra.IP_ADDRESS;
  const [specialization,setSpecialization]=useState("General Medicine");
  const [doctors,setDoctors]=useState([
    {id:1, name: 'Dr. John Doe', description: 'Cardiologist' },
    {id:2, name: 'Dr. Jane Smith', description: 'Pediatrician' },
    {id:3, name: 'Dr. Mike Johnson', description: 'Dermatologist' }
  ]); 

  const doctors_specialization = async () => {
    try {
      const response = await fetch(`http://192.168.25.159:5501/doctor/specialization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ specialization })
      });
  
      if (response.ok) { // if status 200
        const result = await response.json();
        setDoctors(result.doctor_list || []);
      } else {
        const errorResult = await response.json();
        console.log('No doctors found:', errorResult.message);
        setDoctors([]); // Set empty list if 404
      }
    } catch (error) {
      console.error("Error fetching doctor list:", error);
      setDoctors([]); // Optional: Empty list on network error
    }
  };
  useEffect(()=>{
    doctors_specialization();
  },[specialization]);  

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left-thick" size={28} color="black" style={{ marginLeft: -10 }} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Call for</Text>
        <Text style={styles.subtitle}>The Best!</Text>
      </View>

      {/* Dropdown & Input */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={specialization}
          style={styles.picker}
          onValueChange={(itemValue) => setSpecialization(itemValue)}
          dropdownIconRippleColor={"#8881f7"}
        >
          <Picker.Item label="General Medicine" value="General Medicine" />
          <Picker.Item label="Cardiology" value="Cardiology" />
          <Picker.Item label="ENT" value="ENT"/>
          <Picker.Item label="Orthopedist" value="Orthopedist" />
          <Picker.Item label="Dermatologist" value="Dermatologist" />
          <Picker.Item label="Pediatrician" value="Pediatrician" />
        </Picker>
      </View>

      {/*<View style={styles.inputContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter number" 
          keyboardType="phone-pad" 
        />
      </View>

      <View style={styles.orContainer}>
        <Text style={styles.orText}>OR</Text>
      </View>
      */}

      {/* Doctor List */}
      <View style={styles.doctorList}>{doctors.length === 0 ? (
      <Text style={styles.noDoctorsText}>No doctors available for this specialization.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        {doctors.map((doctor, index) => (
        <View key={`doctor-${index}`} style={styles.doctorCard}>
        {/* Doctor Image */}
        <Image
          source={require('../assets/images/displaypic.png')}
          style={styles.avatar}
          defaultSource={require('../assets/images/displaypic.png')}
        />

          {/* Doctor Information */}
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.description}>{doctor.specialization}</Text>
          <Text style={styles.description}>{doctor.hospital}</Text>
          <Text style={styles.description}>{doctor.experience} years of experience</Text>
        </View>

          {/* Call Button */}
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => {
            console.log('Navigating to BookAppointment with params:', {
              doctorId: doctor.id,
              name: doctor.name,
              specialization: doctor.specialization,
              patient_id: route.params?.userId,
            });
            navigation.navigate('BookAppointment', {
              doctorId: doctor.id,
              name: doctor.name,
              specialization: doctor.specialization,
              patient_id: route.params?.userId,
            });
          }}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>
      ))}
    </ScrollView>
    )}
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#E6EEFF', 
    padding: 20 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20 
  },
  backButton: {
    padding: 5,
  },
  menuIcon: { 
    fontSize: 30 
  },
  titleContainer: {
    marginBottom: 15
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'black' 
  },
  dropdownContainer: { 
    backgroundColor: '#FFF', 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    marginVertical: 10
  },
  picker: { 
    height: 55, 
    width: '100%' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 10, 
    borderRadius: 10 
  },
  countryCode: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginRight: 10 
  },
  input: { 
    flex: 1, 
    fontSize: 16 
  },
  orContainer: {
    alignItems: 'center',
    marginVertical: 10
  },
  orText: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  doctorList: { 
    marginTop: 10 
  },
  doctorCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20,
    marginRight: 10 
  },
  doctorInfo: {
    flex: 1
  },
  doctorName: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  description: { 
    fontSize: 14, 
    color: 'gray' 
  },
  callButton: {
    padding: 5
  },
  callIcon: { 
    width: 30, 
    height: 30
  },
  bookNowText: {
    fontWeight: 'bold', 
    fontSize: 16, 
    color: '#000000' 
  },
  callButton:{
    backgroundColor:'#8881f7',
    borderRadius:10,
    padding:10
  },
});