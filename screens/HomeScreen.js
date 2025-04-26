// import React, { useEffect, useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import Constants from "expo-constants";

// const features = [
//   { id: "1", title: "Appointment", image: require("../assets/images/calendar.png"), screenName: "Appointment" },
//   { id: "2", title: "Prescription", image: require("../assets/images/prescription.png"), screenName: "SchedulePage" },
//   { id: "3", title: "QR Login", image: require("../assets/images/qr.png"), screenName: "QRLogin" },
//   { id: "4", title: "Digital Twin", image: require("../assets/images/digitalTwin.png"), screenName: "DT" },
//   { id: "5", title: "History", image: require("../assets/images/history.png"), screenName: "History" },
// ];

// const HomeScreen = ({ route }) => {
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [ph, setPh] = useState("");
//   const [bg, setBg] = useState("");
//   const navigation = useNavigation();
//   const IP_ADDRESS = Constants.expoConfig.extra.IP_ADDRESS;
//   const id = route.params?.Userid;

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch(`http://192.168.25.159:5501/user/getById`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ id }),
//         });
//         const result = await response.json();
//         if (result.exists) {
//           setName(result.name);
//           setAge(result.age);
//           setPh(result.phone);
//           setBg(result.bg);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     if (id) {
//       fetchUser();
//     }
//   }, [id]);

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
//             <Text style={styles.userInfo}>Name - {name}</Text>
//             <Text style={styles.userInfo}>Phone - {ph}</Text>
//             <Text style={styles.userInfo}>Blood Group - {bg}</Text>
//           </View>
//         </View>
//         <Ionicons name="mic" size={28} color="black" />
//       </View>

//       {/* Features */}
//       <FlatList
//         data={features}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.featureCard}
//             onPress={() => navigation.navigate(item.screenName, item.screenName === "SchedulePage" ? { patientId: id } : {})}
//           >
//             <Image source={item.image} style={styles.featureImage} />
//             <Text style={styles.featureTitle}>{item.title}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#dce6f7" },
//   header: { backgroundColor: "#75a3ff", padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   profileContainer: { flexDirection: "row", alignItems: "center" },
//   profilePic: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#ccc", marginRight: 10 },
//   userInfo: { color: "#000", fontWeight: "bold" },
//   featureCard: { backgroundColor: "#fff", margin: 10, padding: 20, alignItems: "center", borderRadius: 10, flex: 1 },
//   featureImage: { width: 80, height: 80, marginBottom: 10 },
//   featureTitle: { fontWeight: "bold", textAlign: "center" },
// });

// export default HomeScreen;/

import Constants from "expo-constants";
import React,{useEffect, useState} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const features = [
  { id: "1", title: "Appointment", image: require("../assets/images/calendar.png"), screenName: "Appointment" },
  { id: "2", title: "Prescription", image: require("../assets/images/prescription.png"), screenName: "SchedulePage" },
  { id: "3", title: "QR Login", image: require("../assets/images/qr.png"), screenName: "QRLogin" },
  { id: "4", title: "Digital Twin", image: require("../assets/images/digitalTwin.png"), screenName: "DT" },
  { id: "5", title: "History", image: require("../assets/images/history.png"), screenName: "History" },
];

const HomeScreen = ({route}) => {
  const [name, setName] = useState();
  const [age,setAge] = useState();
  const [ph, setPh] = useState();
  const [bg, setBg] = useState();

  const IP_ADDRESS=Constants.expoConfig.extra.IP_ADDRESS;
  const navigation = useNavigation();
  const id=route.params?.Userid;
  console.log("User ID from route params:", id);
  const fetchUser= async()=>{
    try{
      const response=await fetch(`http://192.168.25.159:5501/user/getById`,{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({id})
      })
      const result=await response.json();
      setName(result.name);
      setAge(result.age);
      setPh(result.phone);
      setBg(result.bg);
      console.log("User data fetched successfully:", result);
    }
    catch(error){
      console.error("Error fetching user data:", error);
    }
  }
  const openDrawer = () => {
    // Check if we're in the drawer navigator
    try {
      navigation.openDrawer();
    } catch (error) {
      navigation.navigate("MainDrawer");
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, []);
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Menu Button to Open Drawer */}
        <TouchableOpacity onPress={ openDrawer/*() => navigation.dispatch(DrawerActions.openDrawer())*/}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.profilePic}></View>
          <View>
            <Text style={styles.userInfo}>Name - {name}</Text>
            <Text style={styles.userInfo}>Blood Group {bg}</Text>
            <Text style={styles.userInfo}>Age - {age}</Text>
            <Text style={styles.userInfo}>Phone number - {ph} </Text>
          </View>
        </View>

        {/* Microphone Icon */}
        <Ionicons name="mic" size={28} color="black" />
      </View>

      {/* Scheduling (First row, full width) */}
      <View style={styles.fullRow}>
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate(features[0].screenName,{userId:id})}
        >
          <Image source={features[0].image} style={styles.featureImage} />
          <Text style={styles.featureTitle}>{features[0].title}</Text>
        </TouchableOpacity>
      </View>

      {/* Remaining Features in a 2-column Grid */}
      <FlatList 
        data={features.slice(1)} 
        keyExtractor={(item) => item.id} 
        numColumns={2} 
        renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.featureCard} 
          onPress={() => {
            if (item.screenName) {
                navigation.navigate(item.screenName, { userId: id });
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
  header: { backgroundColor: "#75a3ff", padding: 20, height: 175, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  profileContainer: { flexDirection: "row", alignItems: "center" },
  profilePic: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#ccc", marginRight: 10 },
  userInfo: { color: "#000", fontWeight: "bold" },
  fullRow: { flexDirection: "row", justifyContent: "center", margin: 10 },
  featureCard: { backgroundColor: "#fff", margin: 10, padding: 20, alignItems: "center", borderRadius: 10, flex: 1 },
  featureImage: { width: 80, height: 80, marginBottom: 10 },
  featureTitle: { fontWeight: "bold", textAlign: "center" },
  languageSelector: { alignItems: "center", padding: 20 },
});

export default HomeScreen;
