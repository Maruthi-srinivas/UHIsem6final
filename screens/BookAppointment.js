import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";

export default function BookAppointment({ route }) {
  const navigation = useNavigation();
  const doctorId = route.params?.doctorId;
  const name = route.params?.name;
  const specialization = route.params?.specialization;
  const patient_id = route.params?.patient_id;
  console.log('Patient ID in BookAppointment:', patient_id);
  console.log('Doctor ID in BookAppointment:', doctorId);
  const IP_ADDRESS = Constants.expoConfig.extra.IP_ADDRESS;

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  console.log("Patient ID in BookAppointment:", patient_id);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // All possible time slots for a day
  const allTimeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

  useEffect(() => {
    const today = new Date();
    const tempDates = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      tempDates.push(date);
    }
    setDates(tempDates);
  }, []);

  const getDay = (date) => {
    return date.getDate().toString();
  };

  const getMonth = (date) => {
    return date.toLocaleString('en-US', { month: 'short' });
  };

  // Format date as YYYY-MM-DD for MySQL
  const formatDateForMySQL = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchBookedSlots = async (date, docId) => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://192.168.25.159:5501/consultation/get_slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formatDateForMySQL(date),
          doctorId: docId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booked slots');
      }
      const data = await response.json();
      const bookedTimes = data.slots ? data.slots.map(slot => slot.time) : [];
      return bookedTimes; 
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      Alert.alert('Error', 'Failed to load available time slots. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async (date, docId, slot, patient_id) => {
    try {
      const response = await fetch(`http://192.168.25.159:5501/consultation/book_slot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date,doctor_id:docId,slot,patient_id}),
      });
      console.log(patient_id);
      if (!response.ok) {
        console.error('Failed to book appointment');
        return false;
      }
  
      const data = await response.json();
      console.log('Booking Response:', data);
      return true;
    } catch (error) {
      console.error('Error booking appointment:', error);
      return false;
    }
  };

  // Calculate available time slots by filtering out booked ones
  const calculateAvailableSlots = (bookedSlots) => {
    return allTimeSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const handleDatePress = async (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset selected time slot when date changes
    
    // For development/demo, you can use this mock data
    // const mockBookedSlots = ['9:00 AM', '1:00 PM'];
    // setBookedTimeSlots(mockBookedSlots);
    // setAvailableTimeSlots(calculateAvailableSlots(mockBookedSlots));
    
    console.log("Selected date:", formatDateForMySQL(date));
    // Uncomment below and comment out the mock data when your API is ready
    const bookedSlots = await fetchBookedSlots(date, doctorId);
    setBookedTimeSlots(bookedSlots);
    setAvailableTimeSlots(calculateAvailableSlots(bookedSlots));
  };

  const handleTimeSlotPress = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    // You could also add additional logic here like opening a confirmation modal
  };

  const handleBookAppointment = async () => {
    if (!selectedTimeSlot) {
      Alert.alert('Please select a time slot');
      return;
    }
  
    Alert.alert(
      'Confirm Appointment',
      `Book appointment with Dr. ${name} on ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            const success = await bookSlot(
              formatDateForMySQL(selectedDate),
              doctorId,
              selectedTimeSlot,
              patient_id
            );
  
            if (success) {
              Alert.alert('Success', 'Your appointment has been booked!');
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to book the appointment. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.arrow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-thick" size={28} color="black" style={{ marginLeft: -10 }} />
        </TouchableOpacity>
      </View>

      {/* Doctor Info Section */}
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={60} color="black" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{specialization}</Text>
        </View>
      </View>

      {/* Date Selection Section */}
      <View style={styles.dateScrollViewContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScrollViewContent}
        >
          {dates.map((date, index) => (
            <TouchableOpacity key={index} onPress={() => handleDatePress(date)}>
              <View style={[
                styles.dateCard, 
                selectedDate && date.toDateString() === selectedDate.toDateString() ? styles.selectedDateCard : {}
              ]}>
                <Text style={[
                  styles.dateDay, 
                  selectedDate && date.toDateString() === selectedDate.toDateString() ? styles.selectedDateText : {}
                ]}>
                  {getDay(date)}
                </Text>
                <Text style={[
                  styles.dateMonth,
                  selectedDate && date.toDateString() === selectedDate.toDateString() ? styles.selectedDateText : {}
                ]}>
                  {getMonth(date)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Time Slot Section */}
      {selectedDate && (
        <View style={styles.timeSlotContainer}>
          <Text style={styles.timeSlotTitle}>
            Available Time Slots for {selectedDate.toLocaleDateString()}
          </Text>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading available slots...</Text>
          ) : availableTimeSlots.length > 0 ? (
            <ScrollView style={styles.timeSlotList}>
              {availableTimeSlots.map((time, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.slotButton,
                    selectedTimeSlot === time ? styles.selectedSlotButton : {}
                  ]} 
                  onPress={() => handleTimeSlotPress(time)}
                >
                  <Text style={[
                    styles.slotText,
                    selectedTimeSlot === time ? styles.selectedSlotText : {}
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noSlotsText}>No available time slots for this date</Text>
          )}
        </View>
      )}

      {/* Book Appointment Button */}
      {selectedTimeSlot && (
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleBookAppointment}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E6EEFF',
    flexDirection: 'column',
    marginTop: 0,
  },
  arrow: {
    position: 'absolute',
    top: 10,
    left: 30,
    backgroundColor: '#E6EEFF',
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 50,
    width: '90%',
    height: 200,
  },
  dateScrollViewContainer: {
    marginTop: -10,
    width: '100%',
    alignItems: 'center',
  },
  dateScrollViewContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 5,
    width: 70,
    height: 90,
  },
  selectedDateCard: {
    backgroundColor: '#3A86FF', // Highlight selected date with blue background
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  dateMonth: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  selectedDateText: {
    color: '#FFFFFF', // White text for selected date
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  description: {
    fontSize: 16,
    color: 'gray',
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    padding: 5,
    marginRight: 15,
    width: 75,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  timeSlotContainer: {
    width: '90%',
    marginTop: 10,
    alignItems: 'center',
  },
  timeSlotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeSlotList: {
    width: '100%',
  },
  slotButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  selectedSlotButton: {
    backgroundColor: '#3A86FF', // Blue background for selected time slot
  },
  slotText: {
    fontSize: 18,
    color: 'black',
  },
  selectedSlotText: {
    color: '#FFFFFF', // White text for selected time slot
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  noSlotsText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  bookButton: {
    backgroundColor: '#4CAF50', // Green button for booking
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});