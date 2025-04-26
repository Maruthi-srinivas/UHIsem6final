// import Constants from "expo-constants";
// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// const OtpScreen = ({ route }) => {
//   const { phoneNumber, isDoctorLogin } = route.params || {};
//   const [otp, setOtp] = useState("");
//   const [otpError, setOtpError] = useState(false);
//   const navigation = useNavigation();
//   const IP_ADDRESS = Constants.expoConfig.extra.IP_ADDRESS;

//   const handleVerifyOtp = async () => {
//     if (!otp.trim()) {
//       setOtpError(true);
//       return;
//     }
//     setOtpError(false);
//     try {
//       console.log("Verifying OTP for:", phoneNumber);

//       // Verify OTP using Maruthi backend
//       const otpResponse = await fetch(`http://192.168.25.159:5500/verifyOTP`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phoneNumber, otp }),
//       });
//       const otpResult = await otpResponse.json();

//       if (otpResponse.ok) {
//         console.log("OTP verified successfully:", otpResult);

//         // Fetch user details from Shanmuga backend
//         const userResponse = await fetch(`http://192.168.25.159:5501/user/find`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ph: phoneNumber.slice(3) }),
//         });
//         const userResult = await userResponse.json();

//         if (userResult.exists) {
//           navigation.reset({
//             index: 0,
//             routes: [
//               {
//                 name: "MainDrawer",
//                 state: {
//                   routes: [
//                     {
//                       name: "Home",
//                       params: { Userid: userResult.id },
//                     },
//                   ],
//                 },
//               },
//             ],
//           });
//         } else {
//           navigation.navigate("RegForm", { phoneNumber });
//         }
//       } else {
//         console.error("OTP verification failed:", otpResult.error);
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Enter OTP</Text>
//       <Text style={styles.subtitle}>OTP sent to {phoneNumber || "Unknown"}</Text>

//       <TextInput
//         style={[styles.otpInput, otpError && styles.inputError]}
//         placeholder="Enter OTP"
//         keyboardType="numeric"
//         value={otp}
//         onChangeText={(text) => {
//           setOtp(text);
//           setOtpError(false);
//         }}
//       />

//       {otpError && <Text style={styles.errorText}>Please enter OTP</Text>}

//       <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
//         <Text style={styles.buttonText}>Verify OTP</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
//   subtitle: { fontSize: 16, color: "gray", marginBottom: 20 },
//   otpInput: { borderWidth: 1, borderColor: "#ccc", padding: 10, fontSize: 18, width: "80%", textAlign: "center" },
//   inputError: { borderColor: "red", borderWidth: 2 },
//   errorText: { color: "red", fontSize: 14, marginTop: 5 },
//   verifyButton: { marginTop: 20, backgroundColor: "#8881f7", padding: 15, borderRadius: 8 },
//   buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
// });

// export default OtpScreen;




import Constants from "expo-constants";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OtpScreen = ({ route }) => {
  const { phoneNumber, isDoctorLogin } = route.params || {};
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const navigation = useNavigation();
  const IP_ADDRESS = Constants.expoConfig.extra.IP_ADDRESS;

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError(true);
      return;
    }
    setOtpError(false);
    try {
      console.log("Verifying OTP for:", phoneNumber);
      const otpResponse = await fetch(`http://192.168.25.159:5500/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      const otpResult = await otpResponse.json();
  
      if (otpResponse.ok) {
        console.log("OTP verified successfully:", otpResult);
        if (isDoctorLogin) {
          // Fetch doctor details from backend using phone number (without +91)
          const doctorResponse = await fetch(`http://192.168.25.159:5501/doctor/find`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ph: phoneNumber.slice(3) }),
          });
          const doctorResult = await doctorResponse.json();
          if (doctorResult.exists) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "DocMainDrawer",
                  state: {
                    routes: [
                      {
                        name: "Home",
                        params: { DoctorId: doctorResult.id, doctor: doctorResult },
                      },
                    ],
                  },
                },
              ],
            });
          } else {
            // Handle doctor not found (show error or navigate elsewhere)
            console.error("Doctor not found:", doctorResult.message);
          }
        } else {
          // For user login, fetch user details
          const userResponse = await fetch(`http://192.168.25.159:5501/user/find`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ph: phoneNumber.slice(3) }),
          });
          const userResult = await userResponse.json();
          if (userResult.exists) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "MainDrawer",
                  state: {
                    routes: [
                      {
                        name: "Home",
                        params: { Userid: userResult.id },
                      },
                    ],
                  },
                },
              ],
            });
          } else {
            navigation.navigate("RegForm", { phoneNumber });
          }
        }
      } else {
        console.error("OTP verification failed:", otpResult.error);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>OTP sent to {phoneNumber || "Unknown"}</Text>
      <TextInput
        style={[styles.otpInput, otpError && styles.inputError]}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={(text) => {
          setOtp(text);
          setOtpError(false);
        }}
      />
      {otpError && <Text style={styles.errorText}>Please enter OTP</Text>}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 16, 
    color: "gray", 
    marginBottom: 20 
  },
  otpInput: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 10, 
    fontSize: 18, 
    width: "80%", 
    textAlign: "center" 
  },
  inputError: { 
    borderColor: "red", 
    borderWidth: 2 
  },
  errorText: { 
    color: "red", 
    fontSize: 14, 
    marginTop: 5 
  },
  verifyButton: { 
    marginTop: 20, 
    backgroundColor: "#8881f7", 
    padding: 15, 
    borderRadius: 8 
  },
  buttonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});

export default OtpScreen;