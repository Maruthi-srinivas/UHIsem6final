import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler"; // Ensure it's imported at the top

// Import Screens
import HomeScreen from "../screens/HomeScreen";
import SchedulePage from "../screens/SchedulePage";
import Appointment from "../screens/Appointment";
import QRLogin from "../screens/QRLogin";
import DigitalTwin from "../screens/DigitalTwin";
import History from "../screens/History";
import PrescriptionList from "../screens/PrescriptionPage";
import AddMedicinePage from "../screens/AddMedicine";
import ViewAllScreen from "../screens/ViewAllScreen";
import CallDoctorScreen from "../screens/CallDoctor";
import LoginScreen from "../screens/login";
import OtpScreen from "../screens/Otp";
import DoctorHome from "../screens/DoctorHome";
import AppointmentView from "../screens/AppointmentView";
import RegForm from "../screens/RegForm";
import BookAppointment from "../screens/BookAppointment";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator (Contains Home & Schedule)
function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Appointment" component={Appointment} />
      <Drawer.Screen name="SchedulePage" component={SchedulePage} />
      <Drawer.Screen name="QRLogin" component={QRLogin} />
      <Drawer.Screen name="DT" component={DigitalTwin} />
      <Drawer.Screen name="History" component={History} />
    </Drawer.Navigator>
  );
}
function DocDrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={DoctorHome} />
      <Drawer.Screen name="Appointments" component={AppointmentView} />
      <Drawer.Screen name="AddMedicine" component={AddMedicinePage} />
      {/* <Drawer.Screen name="QRLogin" component={QRLogin} /> */}
      <Drawer.Screen name="DT" component={DigitalTwin} />
      {/* <Drawer.Screen name="History" component={History} /> */}
    </Drawer.Navigator>
  );
}


// Root App Component
export default function Index() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
      <Stack.Screen name="DocMainDrawer" component={DocDrawerNavigator} />
      <Stack.Screen name="DocHome" component={DoctorHome} />
      <Stack.Screen name="RegForm" component={RegForm} />
      <Stack.Screen name="PrescriptionList" component={PrescriptionList} />
      <Stack.Screen name="AddMedicine" component={AddMedicinePage} />
      <Stack.Screen name="ViewAll" component={ViewAllScreen} />
      <Stack.Screen name="CallDoctor" component={CallDoctorScreen} />
      <Stack.Screen name="BookAppointment" component={BookAppointment}/>
    </Stack.Navigator>
  );
}
