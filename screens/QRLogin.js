import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';



const QRLogin = () => {
  const navigation=useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=> navigation.openDrawer()}>
              <Icon name="menu" size={24} color="black" style={styles.iconLeft} />
        </TouchableOpacity>
              <Icon name="microphone" size={24} color="black" style={styles.iconRight} />
      </View>
      
      {/* White Box */}
      <View style={styles.camera} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3EEFF', // Light blue background
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 250,
    backgroundColor: '#6EA2FF', // Blue header
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 40, // Adjust for status bar
    borderBottomRightRadius:60
  },
  iconLeft: {
    position: 'absolute',
    left: 15,
    top: 40,
  },
  iconRight: {
    position: 'absolute',
    right: 15,
    top: 40,
  },
  camera: {
    width: 120,
    height: 120,
    marginTop: 200, // Adjust as needed
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default QRLogin;