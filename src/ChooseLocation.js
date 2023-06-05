//import libraries
import { useNavigation } from '@react-navigation/native';
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
//reusable components
import AddressPickup from '../src/components/AddressPickup';
import CustomBtn from '../src/components/CustomBtn';
import { showError } from '../src/helper/helperFunction';
const ChooseLocation = (props) => {

    const navigation = useNavigation()
    const [state, setState] = useState({
        destinationCords: {}
    })
    const { destinationCords } = state
    const checkValid = () => {
        if (Object.keys(destinationCords).length === 0) {
            showError('Please enter your destination location')
            return false
        }
        return true
    }
    const onDone = () => {
        const isValid = checkValid()
        if (isValid) {
            props.route.params.getCordinates({
                destinationCords
            })
            navigation.navigate("LocationMap")
        }
    }
    const fetchDestinationCords = (lat, lng, zipCode, cityText) => {
        setState({
            ...state,
            destinationCords: {
                latitude: lat,
                longitude: lng
            }
        })
    }
    return (
        <View style={styles.container}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: 'white', flex: 1, padding: 24 }}
            >
                <View style={{ marginBottom: 16 }} />
                <AddressPickup
                    placheholderText="Enter Destination Location"
                    fetchAddress={fetchDestinationCords}
                />
                <CustomBtn
                    btnText="Done"
                    onPress={onDone}
                    btnStyle={{ marginTop: 24 }}
                />
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
export default ChooseLocation;