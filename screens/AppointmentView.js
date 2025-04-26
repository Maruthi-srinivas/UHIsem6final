import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const AppointmentView = () => {
    const [appointments, setAppointments] = useState([
        { id: '1', patientName: 'John Doe', time: '10:00 AM', status: 'Pending' },
        { id: '2', patientName: 'Jane Smith', time: '11:00 AM', status: 'Pending' },
        { id: '3', patientName: 'Sam Wilson', time: '12:00 PM', status: 'Pending' },
    ]);

    const handleAccept = (id) => {
        setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment.id === id ? { ...appointment, status: 'Accepted' } : appointment
            )
        );
    };

    const handleReject = (id) => {
        setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment.id === id ? { ...appointment, status: 'Rejected' } : appointment
            )
        );
    };

    const renderAppointment = ({ item }) => (
        <View style={styles.appointmentCard}>
            <Text style={styles.text}>Patient: {item.patientName}</Text>
            <Text style={styles.text}>Time: {item.time}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
            {item.status === 'Pending' && (
                <View style={styles.buttonContainer}>
                    <Button title="Accept" onPress={() => handleAccept(item.id)} />
                    <Button title="Reject" onPress={() => handleReject(item.id)} color="red" />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Appointments</Text>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                renderItem={renderAppointment}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    appointmentCard: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default AppointmentView;