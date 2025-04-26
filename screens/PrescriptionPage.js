import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Appbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { navigateToDrawerScreen } from "../utils/navigation";

const PrescriptionList = ({route}) => {
  const navigation = useNavigation();
  const [medicines, setMedicines] = useState([]);
  const [patientId, setPatientId] = useState("");
  const IP_ADDRESS=Constants.expoConfig.extra.IP_ADDRESS;
  const userId=route.params?.userId
  
  useEffect(()=>{
    if(userId){
    fetchMedicines();
    }
  },[userId]);
  // Fetch medicines from the backend
  const fetchMedicines = async () => {
    try {
      const response = await fetch(`http://192.168.25.159:5501/medicines/${userId}`);
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <Appbar.Header style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-thick" size={28} color="white" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Prescription List</Text>
        <TouchableOpacity onPress={() => navigateToDrawerScreen(navigation,"SchedulePage",{patientId})/*navigation.navigate("SchedulePage", { patientId })*/}>
          <Icon name="calendar" size={26} color="white" style={{ marginRight: 20 }} />
        </TouchableOpacity>
      </Appbar.Header>

      {/* Patient ID Input */}

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Medicine</Text>
        <Text style={styles.tableHeaderText}>Dosage</Text>
      </View>

      {/* Medicine List */}
      <ScrollView style={styles.medicineList}>
        {medicines.length > 0 ? (
          medicines.map((item, index) => (
            <View key={index} style={styles.medicineItem}>
              <Text style={styles.medicineText}>{item.name}</Text>
              <Text style={styles.dosageText}>{item.dosage}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No medicines found</Text>
        )}
      </ScrollView>

      {/* Add Medicine Button */}
      
    </View>
  );
};

export default PrescriptionList;

// ✅ Improved Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  header: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 5, 
  },
  headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "black",
  },
  fetchButton: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#B8C6FF",
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  medicineList: {
    marginHorizontal: 20,
  },
  medicineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  medicineText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dosageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#777",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 4,
  },
});
