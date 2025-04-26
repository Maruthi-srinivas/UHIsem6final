import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

export default function Appointment({route}) {
  const navigation = useNavigation();
  const IP_ADDRESS = Constants.expoConfig.extra.IP_ADDRESS;
  const [specialization, setSpecialization] = useState("General Medicine");
  const [doctors, setDoctors] = useState([]);
  const patient_id=route.params?.userId;
  console.log('Patient ID in Appointment:', patient_id);
  const [activeButton, setActiveButton] = useState(null);
  const [hoverButton, setHoverButton] = useState(null);

  // Fetch doctors based on specialization
  const doctors_specialization = async () => {
    try {
      const response = await fetch(`http://192.168.25.159:5501/doctor/specialization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ specialization })
      });

      if (response.ok) {
        const result = await response.json();
        setDoctors(result.doctor_list || []);
      } else {
        const errorResult = await response.json();
        console.log('No doctors found:', errorResult.message);
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctor list:", error);
      setDoctors([]);
    }
  };

  useEffect(() => {
    doctors_specialization();
  }, [specialization]);

  // Handle press on category icons
  const handlePress = (btn) => {
    setActiveButton(btn);
    setTimeout(() => setActiveButton(null), 100);

    if (btn === 'call') navigation.navigate('CallDoctor');
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.location}>📍 Bengaluru</Text>
      </View>

      {/* Heading */}
      <Text style={styles.heading}>
        Find your desired {'\n'}
        <Text style={styles.boldText}>Doctor Right Now!</Text>
      </Text>

      {/* Categories Section */}
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>Categories</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ViewAll')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Category Buttons */}
      <View style={styles.categoryContainer}>
        {['call', 'doctor', 'hospital'].map((btn) => (
          <Pressable
            key={btn}
            style={[
              styles.iconButton,
              (activeButton === btn || hoverButton === btn) && styles.iconButtonActive
            ]}
            onPress={() => handlePress(btn)}
            onPressOut={() => setActiveButton(null)}
            onMouseEnter={() => setHoverButton(btn)}
            onMouseLeave={() => setHoverButton(null)}
          >
            <Image
              source={
                btn === 'call'
                  ? require('../assets/images/phone.png')
                  : btn === 'doctor'
                  ? require('../assets/images/doctor.png')
                  : require('../assets/images/hospital.png')
              }
              style={styles.categoryIcon}
            />
          </Pressable>
        ))}
      </View>

      {/* Specialization Dropdown */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={specialization}
          style={styles.picker}
          onValueChange={(itemValue) => setSpecialization(itemValue)}
          dropdownIconRippleColor={"#8881f7"}
        >
          <Picker.Item label="General Medicine" value="General Medicine" />
          <Picker.Item label="Cardiology" value="Cardiology" />
          <Picker.Item label="ENT" value="ENT" />
          <Picker.Item label="Orthopedist" value="Orthopedist" />
          <Picker.Item label="Dermatologist" value="Dermatologist" />
          <Picker.Item label="Pediatrician" value="Pediatrician" />
        </Picker>
      </View>

      {/* Doctor List */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {doctors.length === 0 ? (
          <Text style={styles.noDoctorsText}>No doctors available for this specialization.</Text>
        ) : (
          doctors.map((doctor, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={require('../assets/images/displaypic.png')}
                style={styles.userIcon}
              />
              <View style={styles.cardDetails}>
                <Text style={styles.name}>{doctor.name}</Text>
                <Text style={styles.specialization}>{doctor.specialization}</Text>
                <Text style={styles.specialization}>{doctor.hospital}</Text>
                <Text style={styles.specialization}>{doctor.experience} years experience</Text>
              </View>

              <TouchableOpacity
                style={styles.callButton}
                onPress={() => {
                  console.log('Navigating to BookAppointment');
                  navigation.navigate('BookAppointment', {
                    doctorId: doctor.id,
                    name: doctor.name,
                    specialization: doctor.specialization,
                    patient_id: patient_id, // Ensure this is passed
                  });
                }}
              >
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6EEFF', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuIcon: { fontSize: 30 },
  location: { fontSize: 14, color: 'gray' },
  heading: { fontSize: 20, marginTop: 20 },
  boldText: { fontWeight: 'bold' },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAll: { color: 'blue' },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  
  iconButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    transition: 'background-color 0.3s',
  },
  iconButtonActive: {
    backgroundColor: '#4169E1',
  },
  categoryIcon: { width: 50, height: 50 },

  dropdownContainer: { backgroundColor: '#FFF', marginTop: 20, borderRadius: 10, paddingHorizontal: 10 },
  picker: { height: 55, width: '100%' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center'
  },
  userIcon: { width: 50, height: 50, marginRight: 10 },
  cardDetails: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16 },
  specialization: { color: 'gray' },
  bookNow: { backgroundColor: '#4169E1', padding: 10, borderRadius: 5 },
  bookText: { color: '#FFF' },
  noDoctorsText: { textAlign: 'center', marginTop: 20, color: 'gray' },
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