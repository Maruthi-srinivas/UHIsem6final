import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { Appbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const SchedulePage = ({route}) => {
  const navigation = useNavigation();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [fetched, setFetched] = useState(false);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];
  const IP_ADDRESS=Constants.expoConfig.extra.IP_ADDRESS;
  const userId=route.params?.userId;
  
  useEffect(() => {
    if (userId) fetchMedicines();
  }, [userId]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.25.159:5501/medicines/${userId}`);
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };


  const getMedicineForCell = (day, time) => {
    const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day);
    const isWeekend = ["Sat", "Sun"].includes(day);

    const meds = medicines.filter(med =>
      med.schedule.some(s =>
        (s.day === day || s.day === "Everyday" || (s.day === "Weekdays" && isWeekday) || (s.day === "Weekends" && isWeekend)) && s.time === time
      )
    );

    return meds.map((med, index) => {
      const schedule = med.schedule.find(s => (s.day === day || s.day === "Everyday" || (s.day === "Weekdays" && isWeekday) || (s.day === "Weekends" && isWeekend)) && s.time === time);
      const mealIcon = schedule.beforeMeal ? "food-off" : "food";
      const mealText = schedule.beforeMeal ? "Before" : "After";
      return (
        <View key={index} style={styles.medicineCell}>
          <Icon name={mealIcon} size={16} color="#0256A3" />
          <Text style={styles.medicineText}>{med.name}</Text>
          <Text style={styles.mealText}>({mealText} Meal)</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()}>
          <Icon name="menu" size={28} color="white" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
        <View style={styles.headerIcons}>
          <Icon name="calendar" size={24} color="white" style={{ marginRight: 20 }} />
          <Icon name="notebook" size={24} color="white" onPress={() => navigation.navigate("PrescriptionList",{userId:userId})} />
        </View>
      </Appbar.Header>

      

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={styles.tableCell}>
          <Text style={styles.tableHeaderText}>Day</Text>
        </View>
        {timeSlots.map((time, index) => (
          <View key={index} style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>{time}</Text>
          </View>
        ))}
      </View>

      {/* Table Body */}
      <ScrollView style={styles.tableBody}>
        {loading ? (
          <ActivityIndicator size="large" color="#6DA5FA" style={{ marginTop: 20 }} />
        ) : (
          days.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableHeaderCell]}>
                <Text style={styles.tableHeaderText}>{day}</Text>
              </View>
              {timeSlots.map((time, timeIndex) => (
                <View key={timeIndex} style={styles.tableCell}>
                  {getMedicineForCell(day, time)}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default SchedulePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F8FF", // Light blue background for the entire page
  },
  header: {
    backgroundColor: "#0256A3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  fetchButton: {
    backgroundColor: "#0256A3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4A90E2", // Blue background for the table header
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  tableHeaderText: {
    color: "white", // White text for better contrast
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  tableBody: {
    flex: 1,
    marginHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#B3D4FC", // Light blue border for rows
    paddingVertical: 5,
    backgroundColor: "#EAF4FF", // Light blue background for rows
    borderRadius: 8,
    marginBottom: 5,
  },
  tableCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  tableHeaderCell: {
    backgroundColor: "#4A90E2", // Blue background for header cells
    borderRadius: 8,
  },
  medicineCell: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    padding: 5,
    backgroundColor: "#F3F8FF", // Light blue background for medicine cells
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B3D4FC", // Light blue border for medicine cells
  },
  medicineText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0256A3", // Dark blue text for medicine names
    textAlign: "center",
  },
  mealText: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
  },
});