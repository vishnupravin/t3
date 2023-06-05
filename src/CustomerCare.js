import React from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalConfig from '../LocalConfig';
export default class CustomerCare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      bid: '',
    };
  }
  componentDidMount() {
    this.getid();
  }
  getid = async () => {
    try {
      const key3 = await AsyncStorage.getItem('branch_id');
      this.setState({ bid: key3 });
      this.customerCare();
    } catch (error) { }
  };
  customerCare() {
    fetch(
      `${LocalConfig.API_URL}admin/api/customer_care.php?branch=` +
      this.state.bid,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          data: responseJson.data.register.customer_care_number,
        });
      })
      .catch(error => { });
  }
  openDialScreen = () => {
    fetch(
      `${LocalConfig.API_URL}admin/api/customer_care.php?branch=` +
      this.state.bid,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let number;
        if (Platform.OS === 'ios') {
          number = `telprompt:${responseJson.data.register.customer_care_number}`;
        } else {
          number = `tel:${responseJson.data.register.customer_care_number}`;
        }
        Linking.openURL(number);
      })
      .catch(error => { });
  };
  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: LocalConfig.COLOR.BLACK, height: 50 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.centerElement, { width: '10%', height: 50 }]}>
            <Ionicons
              name="arrow-back"
              size={23}
              color={LocalConfig.COLOR.UI_COLOR}
              style={{ marginTop: '7%' }}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={[styles.centerElement]}>
            <Text
              style={{
                fontSize: 15,
                color: LocalConfig.COLOR.UI_COLOR,
                marginLeft: '25%',
                fontFamily: 'verdanab',
              }}>
              CUSTOMER CARE
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: LocalConfig.COLOR.WHITE,
            borderBottomWidth: 0.7,
          }}
        />
        <View style={styles.container}>
          <Text
            style={{
              marginTop: '-80%',
              fontSize: 15,
              color: LocalConfig.COLOR.WHITE,
              letterSpacing: 0.7,
              fontFamily: 'verdanab',
            }}>
            Welcome to {LocalConfig.APP_NAME}...
          </Text>
          <Text
            style={{
              marginTop: '10%',
              fontSize: 15,
              color: LocalConfig.COLOR.WHITE,
              letterSpacing: 0.7,
              fontFamily: 'Proxima Nova Font',
            }}>
            We are happy to serve you!!!
          </Text>
          <TouchableOpacity
            onPress={() => this.openDialScreen()}
            style={styles.inpuStyle}>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name="call" size={15} color={LocalConfig.COLOR.BLACK} />
              <Text
                style={{
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: 'verdanab',
                  fontSize: 12,
                  marginLeft: '7%',
                }}>
                CONTACT US
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  centerElement: { justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LocalConfig.COLOR.BLACK,
  },
  inpuStyle: {
    backgroundColor: LocalConfig.COLOR.UI_COLOR,
    borderRadius: 15,
    alignItems: 'center',
    width: '35%',
    height: 38,
    justifyContent: 'center',
    marginTop: '7%',
  },
});
