import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ViewAllScreen() {
  const navigation = useNavigation();
  const [activeButton, setActiveButton] = useState(null);

  const handlePress = (btn) => {
    setActiveButton(btn);
    setTimeout(() => setActiveButton(null), 300); // Revert to white after 300ms

    if (btn === 'call') navigation.navigate('CallDoctor');
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-thick" size={28} color="black" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
        <Text style={styles.location}>📍 Benaguru </Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Search" style={styles.searchInput} />
      </View>

      {/* Category List */}
      <ScrollView>
        {[
          { id: 'call', label: 'Call a doctor', icon: require('../assets/images/phone.png') },
          { id: 'yourDoctors', label: 'Your Doctors', icon: require('../assets/images/doctor.png') },
          { id: 'byDoctors', label: 'By Doctors', icon: require('../assets/images/doctors.png') },
          { id: 'byHospitals', label: 'By Hospitals', icon: require('../assets/images/hospital.png') },
          { id: 'byDisease', label: 'By Disease', icon: require('../assets/images/disease.png') },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.category,
              activeButton === item.id && styles.categoryActive,
            ]}
            onPress={() => handlePress(item.id)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.categoryText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6EEFF', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuIcon: { fontSize: 30 },
  location: { fontSize: 14, color: 'gray' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#FFF', padding: 10, borderRadius: 10, marginVertical: 10 },
  searchInput: { flex: 1 },

  // Default Category Button
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },

  // Active State
  categoryActive: {
    backgroundColor: '#4169E1',
  },

  icon: { width: 40, height: 40, marginRight: 10 },
  categoryText: { fontSize: 16, fontWeight: 'bold' },
});