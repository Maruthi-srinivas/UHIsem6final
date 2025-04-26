import Constants from "expo-constants";
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDoctorLogin, setIsDoctorLogin] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const navigation = useNavigation();
  const IP_ADDRESS=Constants.expoConfig.extra.IP_ADDRESS;

  const handleSendOTP = async () => {
    // Validate phone number input
    if (!phoneNumber.trim()) {
      setPhoneError(true);
      return;
    }
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    
    // Construct full phone number (e.g., with +91 country code)
    const fullPhoneNumber = '+91' + cleanedPhone;
    try {
      console.log("Sending OTP to:", fullPhoneNumber);
      const response = await fetch(`http://192.168.25.159:5500/sendOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("OTP sent successfully:", result);
        // Navigate to OtpScreen and pass the phone number and login type.
        navigation.navigate("OtpScreen", { phoneNumber: fullPhoneNumber, isDoctorLogin });
      } else {
        console.error("Error sending OTP:", result.error);
      }
    } catch (error) {
      console.error("Network error sending OTP:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueTriangle} />
      <View style={styles.bottomTriangle} />
      
      <View style={styles.contentContainer}>
        <Text style={styles.loginTitle}>Login</Text>
        
        <View style={styles.mobileButtonContainer}>
          <TouchableOpacity style={styles.mobileButton}>
            <Text style={styles.mobileButtonText}>Mobile Number</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.mobileInputSection}>
          <Text style={styles.mobileLabel}>Mobile Number</Text>
          
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.countryCode}>
              <View style={styles.flagContainer}>
                <View style={styles.flagOrange} />
                <View style={styles.flagWhite} />
                <View style={styles.flagGreen} />
              </View>
              <Text style={styles.countryCodeText}>+91</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            
            <TextInput
              style={[styles.phoneInput, phoneError ? styles.inputError : null]}
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setPhoneError(false);
              }}
              keyboardType="phone-pad"
            />
          </View>

          {phoneError && <Text style={styles.errorText}>Please enter a valid 10-digit phone number</Text>}
          
          <View style={styles.doctorLoginToggle}>
            <Text style={styles.doctorLoginText}>Doctor Login</Text>
            <Switch
              value={isDoctorLogin}
              onValueChange={setIsDoctorLogin}
              trackColor={{ false: '#ccc', true: '#666' }}
              thumbColor={isDoctorLogin ? '#fff' : '#fff'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.otpButton} onPress={handleSendOTP}>
          <Text style={styles.otpButtonText}>SEND OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  blueTriangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 500,
    borderTopWidth: 500,
    borderRightColor: 'transparent',
    borderTopColor: '#8881f7',
    opacity: 0.5,
  },
  bottomTriangle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 300,
    borderBottomWidth: 300,
    borderLeftColor: 'transparent',
    borderBottomColor: '#8881f7',
    opacity: 0.2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingTop: 100,
  },
  loginTitle: { fontSize: 42, fontWeight: 'bold', textAlign: 'center', marginBottom: 60 },
  mobileButtonContainer: {
    backgroundColor: '#e6efff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  mobileButton: {
    backgroundColor: '#8881f7',
    borderRadius: 8,
    paddingVertical: 12,
    width: 200,
    alignItems: 'center',
  },
  mobileButtonText: { color: 'white', fontSize: 16 },
  mobileInputSection: { marginBottom: 20 },
  mobileLabel: { fontSize: 16, marginBottom: 15 },
  inputRow: { flexDirection: 'row', marginBottom: 10 },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputError: { borderColor: 'red', borderWidth: 2 },
  errorText: { color: 'red', fontSize: 14, marginTop: 5, marginLeft: 5 },
  doctorLoginToggle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  otpButton: {
    backgroundColor: '#8881f7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  otpButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  flagContainer: {
    width: 20,
    height: 15,
    marginRight: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  flagOrange: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#FF9933',
  },
  flagWhite: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#FFFFFF',
  },
  flagGreen: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#138808',
  },
  countryCodeText: { fontSize: 16 },
  dropdownIcon: { fontSize: 10, marginLeft: 5, color: '#666' },
});

export default LoginScreen;
