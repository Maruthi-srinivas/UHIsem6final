// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";

// const features = [
//   { id: "1", title: "Add Medicine", image: require("../assets/images/prescription.png"), screenName: "AddMedicine" },
//   { id: "2", title: "Digital Twin", image: require("../assets/images/digitalTwin.png"), screenName: "DT" },
// ];

// const DoctorHome = () => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.openDrawer()}>
//           <Ionicons name="menu" size={28} color="black" />
//         </TouchableOpacity>
//         <View style={styles.profileContainer}>
//           <View style={styles.profilePic}></View>
//           <View>
//             <Text style={styles.userInfo}>Dr. John Doe</Text>
//             <Text style={styles.userInfo}>Specialization: Cardiologist</Text>
//           </View>
//         </View>
//         <Ionicons name="mic" size={28} color="black" />
//       </View>

//       {/* Welcome Section */}
//       <View style={styles.welcomeSection}>
//         <Text style={styles.welcomeText}>Welcome, Dr. John Doe</Text>
//         <Text style={styles.subtitle}>Manage your patients and their prescriptions</Text>
//       </View>

//       {/* Features Section */}
//       <FlatList
//         data={features}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.featureCard}
//             onPress={() => navigation.navigate(item.screenName)}
//           >
//             <Image source={item.image} style={styles.featureImage} />
//             <Text style={styles.featureTitle}>{item.title}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default DoctorHome;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#dce6f7",
//   },
//   header: {
//     backgroundColor: "#75a3ff",
//     padding: 20,
//     height: 175,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   profileContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   profilePic: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#ccc",
//     marginRight: 10,
//   },
//   userInfo: {
//     color: "#000",
//     fontWeight: "bold",
//   },
//   welcomeSection: {
//     padding: 20,
//     alignItems: "center",
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#0256A3",
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "gray",
//     textAlign: "center",
//   },
//   featureCard: {
//     backgroundColor: "#fff",
//     margin: 10,
//     padding: 20,
//     alignItems: "center",
//     borderRadius: 10,
//     flex: 1,
//   },
//   featureImage: {
//     width: 80,
//     height: 80,
//     marginBottom: 10,
//   },
//   featureTitle: {
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });



import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const features = [
  { id: "1", title: "Appointments", image: require("../assets/images/calendar.png"), screenName: "AppointmentView" },
  { id: "2", title: "Prescription", image: require("../assets/images/prescription.png"), screenName: "AddMedicine" },
  { id: "3", title: "Digital Twin", image: require("../assets/images/digitalTwin.png"), screenName: "DT" },
];

const DoctorHome = ({route}) => {

  const [name,setName]=useState("");
  const [age,setAge]=useState("");
  const [phone,setPhone]=useState();
  const doctor = route?.params?.doctor;
  const doctorid = doctor?.id;
  console.log("Doctor param:", doctorid);
  const navigation = useNavigation();

  const doctorFetch = async () => {
    try {
      const response = await fetch(`http://192.168.25.159:5501/doctor/getById`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: doctorid }), // Ensure doctorId is sent correctly
      });

      const result = await response.json();
      if (result.exists) {
        setName(result.name);
        setAge(result.age);
        setPhone(result.phone);
      } else {
        console.error("Doctor not found:", result.message);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  useEffect(()=>{
    doctorFetch();
  },[]); 
  
  const openDrawer = () => {
    try {
      navigation.openDrawer();
    } catch (error) {
      navigation.navigate("DocMainDrawer");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <View style={styles.profilePic}></View>
          <View>
            <Text style={styles.userInfo}>Name - {name}</Text>
            <Text style={styles.userInfo}>Phone number -{phone}</Text>
            
          </View>
        </View>

        <Ionicons name="mic" size={28} color="black" />
      </View>

      {/* Features Grid */}
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.featuresList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => {
              if (item.screenName === "AddMedicine") {
                navigation.navigate("AddMedicine", { doctorId: doctorid });
              } else {
                navigation.navigate(item.screenName);
              }
            }}
          >
            <Image source={item.image} style={styles.featureImage} />
            <Text style={styles.featureTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Language Selector */}
      <View style={styles.languageSelector}>
        <Picker style={{ width: 150 }}>
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#dce6f7" },
  header: {
    backgroundColor: "#75a3ff",
    padding: 20,
    height: 175,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: { flexDirection: "row", alignItems: "center" },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  userInfo: { color: "#000", fontWeight: "bold" },
  featuresList: {
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  featureCard: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
  },
  featureImage: { width: 80, height: 80, marginBottom: 10 },
  featureTitle: { fontWeight: "bold", textAlign: "center" },
  languageSelector: { alignItems: "center", padding: 20 },
});

export default DoctorHome;