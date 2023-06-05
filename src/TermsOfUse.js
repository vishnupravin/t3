import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import LocalConfig from '../LocalConfig';
import { Avatar, Title, Drawer, List } from 'react-native-paper';
export default TermsOfUse = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: LocalConfig.COLOR.BLACK }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ height: 50, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons
            name="arrow-back"
            size={23}
            color={LocalConfig.COLOR.UI_COLOR}
            style={{ marginTop: '7%' }}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={[styles.centerElement, { height: 50, flex: 5 }]}>
          <Text
            style={{
              fontSize: 15,
              color: LocalConfig.COLOR.UI_COLOR,
              fontFamily: 'verdanab',
            }}>
            Terms Of Usage
          </Text>
        </View>
        <View style={[styles.centerElement, { height: 50, flex: 1 }]} />
      </View>
      <View
        style={{
          borderBottomColor: '#f4f4f4',
          borderBottomWidth: 0.7,
          shadowColor: LocalConfig.COLOR.BLACK,
          elevation: 10,
        }}
      />
      <List.Item
        style={{ paddingHorizontal: 35, paddingTop: 4, marginLeft: -19 }}
        title="Terms and Conditions"
        titleStyle={{ fontSize: 14, fontFamily: 'Proxima Nova Font' }}
        theme={{ colors: { text: LocalConfig.COLOR.WHITE } }}
        left={props => (
          <List.Icon
            {...props}
            icon="file-document-edit"
            color={LocalConfig.COLOR.WHITE}
          />
        )}
        onPress={() => {
          navigation.navigate('TermsAndConditions');
        }}
      />
      <View
        style={{
          borderBottomColor: '#f4f4f4',
          borderBottomWidth: 0.7,
        }}
      />
      <List.Item
        style={{ paddingHorizontal: 35, paddingTop: 4, marginLeft: -19 }}
        title="Privacy Policy"
        titleStyle={{ fontSize: 14, fontFamily: 'Proxima Nova Font' }}
        theme={{ colors: { text: LocalConfig.COLOR.WHITE } }}
        left={props => (
          <List.Icon
            {...props}
            icon="shield-account"
            color={LocalConfig.COLOR.WHITE}
          />
        )}
        onPress={() => {
          navigation.navigate('PrivacyPolicy');
        }}
      />
      <View
        style={{
          borderBottomColor: '#f4f4f4',
          borderBottomWidth: 0.7,
        }}
      />
      <List.Item
        style={{ paddingHorizontal: 35, paddingTop: 4, marginLeft: -19 }}
        title="Cancellation Policy"
        titleStyle={{ fontSize: 14, fontFamily: 'Proxima Nova Font' }}
        theme={{ colors: { text: LocalConfig.COLOR.WHITE } }}
        left={props => (
          <List.Icon
            {...props}
            icon="file-cancel"
            color={LocalConfig.COLOR.WHITE}
          />
        )}
        onPress={() => {
          navigation.navigate('CancellationPolicy');
        }}
      />
      <View
        style={{
          borderBottomColor: '#f4f4f4',
          borderBottomWidth: 0.7,
        }}
      />
      <List.Item
        style={{ paddingHorizontal: 35, paddingTop: 4, marginLeft: -19 }}
        title="Delivery Policy"
        titleStyle={{ fontSize: 14, fontFamily: 'Proxima Nova Font' }}
        theme={{ colors: { text: LocalConfig.COLOR.WHITE } }}
        left={props => (
          <List.Icon {...props} icon="moped" color={LocalConfig.COLOR.WHITE} />
        )}
        onPress={() => {
          navigation.navigate('DeliveryPolicy');
        }}
      />
      <View
        style={{
          borderBottomColor: '#f4f4f4',
          borderBottomWidth: 0.7,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  centerElement: { justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: '1.5%',
    marginRight: '1.5%',
  },
  inpuStyle: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#bfbfbf',
    borderWidth: 0.2,
    alignItems: 'center',
    width: '35%',
    height: 38,
    justifyContent: 'center',
    marginTop: '7%',
  },
  contentText: {
    fontSize: 15,
    color: '#2b2d42',
    letterSpacing: 0.5,
    margin: '5%',
  },
  contenthedding: {
    marginTop: '5%',
    fontSize: 15,
    color: '#2b2d42',
    letterSpacing: 0.1,
    fontWeight: 'bold',
    width: '80%',
    textAlign: 'center',
  },
});
