import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LocalConfig from '../LocalConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
const DeliveryPolicy = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffff' }}>
      <View style={{ flexDirection: 'row', backgroundColor: LocalConfig.COLOR.BLACK }}>
        <View style={[styles.centerElement, { width: '10%', height: 50 }]}>
          <Ionicons
            name="arrow-back"
            size={23}
            color={LocalConfig.COLOR.UI_COLOR}
            style={{ marginTop: '7%' }}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={[styles.centerElement, { height: 50 }]}>
          <Text
            style={{
              fontSize: 15,
              color: LocalConfig.COLOR.UI_COLOR,
              marginLeft: '32%',
              fontFamily: 'verdanab',
            }}>
            Delivery Policy
          </Text>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: '#f4f4f4',
          borderBottomWidth: 0.7,
        }}
      />
      <WebView
        cacheEnabled={false}
        source={{ uri: `${LocalConfig.API_URL}admin/api/terms/delivery.php` }}
        automaticallyAdjustContentInsets={true}
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
    // marginTop: '3%',
    fontSize: 15,
    color: '#2b2d42',
    letterSpacing: 0.5,
    // marginHorizontal: '3%',
    textAlign: 'justify',
    margin: '3%',
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
export default DeliveryPolicy;
