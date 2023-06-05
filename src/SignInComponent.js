import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  PermissionsAndroid,
  Pressable,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import RNSmsRetriever from 'react-native-sms-retriever';
import RNOtpVerify from 'react-native-otp-verify';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNUserIdentity from 'react-native-user-identity';
import LocalConfig from '../LocalConfig';
import sqlSer from '../src/sql'
const sql = new sqlSer()
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export default class LocationMap extends React.Component {
  constructor(props) {
    super(props);
    searchText: '';
    mapView: '';
    this.callRef = React.createRef();
    this.callRef1 = React.createRef();
    this.state = {
      region: {
        latitude: 11.087873,
        longitude: 77.033079,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      region1: {
        latitude: 11.087873,
        longitude: 77.033079,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      listViewDisplayed: true,
      address: '',
      showAddress: false,
      search: '',
      currentLatitude: '',
      currentLongitude: '',
      status: 0,
      espstatus: false,
      forceRefresh: 0,
      searchText: '',
      mapView: '',
      userLocation: '',
      regionChangeProgress: false,
      isMapReady: true,
      isLoading: false,
      errortext: '',
      loading: false,
      userMobile: '',
      userPassword: '',
      token: '',
      userEmail: '',
      editable: false,
      editable1: false,
      hash: '',
    };
    this.refreshScreen = this.refreshScreen.bind(this);
  }
  refreshScreen() {
    this.setState(() => {
      this.componentDidMount();
    });
  }
  hasLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      this.location();
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      this.location();
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      ToastAndroid.show(
        'Location permission revoked by user',
        ToastAndroid.LONG,
      );
    }
    return false;
  };
  componentDidMount() {
    RNOtpVerify.getHash().then(hash => {
      this.setState({ hash: hash });
    });
    this.hasLocationPermission();
    this.getid();
    if(LocalConfig.IN_DEVELOPMENT){
      AsyncStorage.setItem('espstatus', `false`);
      this.props.navigation.navigate('frontpage');
    }
  }
  getid = async () => {
    try {
      const key = await AsyncStorage.getItem('token');
      this.setState({ token: key });
    } catch (error) { }
  };
  location() {
    Geolocation.getCurrentPosition(
      position => {
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        var region = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        this.setState({ currentLatitude: lat });
        this.setState({ currentLongitude: long });
      },
      error => alert(JSON.stringify(error)),
      {
        enableHighAccuracy: false,
        timeout: 10000000,
        maximumAge: 3600000,
      },
    );
  }
  goToInitialLocation = region => {
    let initialRegion = Object.assign({}, region);
    initialRegion['latitudeDelta'] = 0.005;
    initialRegion['longitudeDelta'] = 0.005;
    // this.mapView.animateToRegion(initialRegion, 2000);
  };
  handleEspPress = async () => {
    this.setState({ status: 1 });
    this.setState({ isLoading: true });
    this.setState({ errortext: '' });
    if (!this.state.userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!this.state.userPassword) {
      alert('Please fill Password');
      return;
    }
    this.setState({ loading: true });
    let dataToSend = {
      userEmail: this.state.userEmail,
      userPassword: this.state.userPassword,
    };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    const tk = encodeURIComponent(this.state.hash);
    const tk1 = encodeURIComponent(this.state.token);
    const esp = () => {
      if (this.state.espstatus) {
        return encodeURIComponent('');
      }
    };
    const os = 'android';
    const apiUrl = `${LocalConfig.API_URL}admin/api/register.php?maild=${this.state.userEmail
      }&&token=${tk1}&&type=${os}&&iserp=${this.state.espstatus ? 'yes' : 'no'
      }&&password=${this.state.userPassword}`;
    await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ loading: false });
        if (responseJson['data'].success == '1') {
          this.setState({ isLoading: false });
          AsyncStorage.setItem('espstatus', `true`);
          AsyncStorage.setItem('user_id', responseJson.data.userid);
          AsyncStorage.setItem('mobile_no', responseJson.data.mobile_number);
          AsyncStorage.setItem('mail_id', responseJson.data.mail);
          AsyncStorage.setItem('esp_userPassword', this.state.userPassword);
          this.setState({ isLoading: false });
          this.props.navigation.replace('frontpage', {
            uid: responseJson['data'].register,
            userPassword: this.state.userPassword,
            userEmail: this.state.userEmail,
            token1: this.state.token,
            hash: responseJson['data'].hash,
            espstatus: this.state.espstatus,
          });
        } else {
          console.log(responseJson['data'].register);
          this.setState({ errortext: responseJson['data'].register });
          this.setState({ isLoading: false });
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        //Hide Loader
        this.setState({ loading: false });
      });
  };
  handleSubmitPress = () => {
    this.setState({ isLoading: true });
    this.setState({ errortext: '' });
    if (!this.state.userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!this.state.userMobile && !this.state.espstatus) {
      alert('Please fill Mobile Number');
      return;
    }
    this.setState({ loading: true });
    let dataToSend = {
      userEmail: this.state.userEmail,
      userMobile: this.state.userMobile,
    };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    const tk = encodeURIComponent(this.state.hash);
    const tk1 = encodeURIComponent(this.state.token);
    const os = 'android';
    fetch(
      `${LocalConfig.API_URL}admin/api/register.php?` +
      'maild=' +
      this.state.userEmail +
      '&mobile_no=' +
      this.state.userMobile +
      '&token=' +
      tk1 +
      '&hash=' +
      tk +
      '&type=' +
      os,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson['data'].success == '1') {
          this.setState({ isLoading: false });
          AsyncStorage.setItem('espstatus', `false`);
          this.props.navigation.replace('VerifyOtp', {
            uid: responseJson['data'].register,
            userMobile: this.state.userMobile,
            userEmail: this.state.userEmail,
            token1: this.state.token,
            hash: responseJson['data'].hash,
            espstatus: this.state.espstatus,
          });
        } else {
          console.log(responseJson['data'].register);
          this.setState({ isLoading: false });
          this.setState({ loading: false });
          this.setState({ errortext: responseJson['data'].register });
        }
      })
      .catch(error => {
        //Hide Loader
        this.setState({ loading: false });
      });
  };
  buttonPress = async () => {
    try {
      const result = await RNUserIdentity.getUserId();
      //setUserEmail(result)
      this.setState({ userEmail: result });
      if (result === null) {
        ToastAndroid.show(`no email selected`, ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error) {
        this.setState({ editable1: true });
        // setEditable1(true);
        this.timeout1();
      }
    }
  };
  buttonPress1 = async () => {
    try {
      const phoneNumber = await RNSmsRetriever.requestPhoneNumber();
      this.setState({ userMobile: phoneNumber.split('+91')[1] });
    } catch (error) {
      this.setState({ editable: true });
      this.timeout();
    }
  };
  timeout = () => {
    setTimeout(() => {
      if (this.callRef.current) {
        this.callRef.current.focus();
      }
    }, 500);
  };
  timeout1 = () => {
    setTimeout(() => {
      if (this.callRef1.current) {
        this.callRef1.current.focus();
      }
    }, 500);
  };
  render() {
    const { region } = this.state;
    return (
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss(this.setState({ editable1: false }))}>
        <View style={styles.container}>
          <ImageBackground
            style={styles.logo}
            source={require('../assests/Logo.png')}
            resizeMode="center"
          />
          {this.state.errortext !== '' && 
          <Text style={styles.errorTextStyle}>{this.state.errortext}</Text>}
          <View style={styles.inputView}>
            {/* <TouchableOpacity onPress={this.buttonPress()} > */}
            <TextInput
              style={styles.inputText}
              keyboardType="email-address"
              placeholder="Enter The Email"
              placeholderTextColor="#1d3557"
              ref={this.callRef1}
              onChangeText={UserEmail => this.setState({ userEmail: UserEmail })}
              returnKeyType="done"
              onSubmitEditing={() => this.setState({ editable1: false })}
              editable={!this.state.isLoading}
              onFocus={() => this.buttonPress()}>
              {this.state.userEmail}
            </TextInput>
            {/* </TouchableOpacity> */}
          </View>
          <View style={styles.inputView}>
            {
              this.state.status == 0 ? (
                // <TouchableOpacity onPress={this.buttonPress1}>
                <TextInput
                  ref={this.callRef}
                  keyboardType="numeric"
                  style={styles.inputText}
                  autoCapitalize="none"
                  placeholder="Enter The Mobile Number"
                  placeholderTextColor="#1d3557"
                  onChangeText={UserMobile =>
                    this.setState({ userMobile: UserMobile })
                  }
                  maxLength={10}
                  blurOnSubmit={false}
                  onSubmitEditing={() => this.setState({ editable: false })}
                  returnKeyType="next"
                  editable={!this.state.isLoading}
                  onFocus={() => this.buttonPress1()}>
                  {this.state.userMobile}
                </TextInput>
              ) : (
                // </TouchableOpacity>
                // <TouchableOpacity onPress={this.buttonPress1}>
                <TextInput
                  keyboardType="name-phone-pad"
                  style={styles.inputText}
                  autoCapitalize="none"
                  placeholder="Enter Your Password"
                  placeholderTextColor="#1d3557"
                  onChangeText={UserPassword =>
                    this.setState({ userPassword: UserPassword })
                  }
                  maxLength={20}
                  blurOnSubmit={false}
                  onSubmitEditing={() => this.setState({ editable: false })}
                  returnKeyType="next"
                  editable={!this.state.isLoading}>
                  {this.state.userPassword}
                </TextInput>
              )
              // </TouchableOpacity>
            }
          </View>
          {this.state.status == 0 ? (
            <Pressable
              style={[
                styles.loginBtn,
                {
                  backgroundColor: this.state.isLoading
                    ? LocalConfig.COLOR.UI_COLOR_LITE
                    : LocalConfig.COLOR.UI_COLOR,
                },
              ]}
              disabled={this.state.isLoading}
              onPress={() => {
                if (
                  this.state.userMobile.length == 10 &&
                  this.state.userEmail.includes('@1')
                ) {
                  this.handleSubmitPress();
                } else {
                  if (!this.state.userEmail.includes('@') && this.state.userMobile.length != 10)
                    Alert.alert('Alert', 'Invalid Mobile Number Or Email');
                  else if (!this.state.userEmail.includes('@'))
                    Alert.alert('Alert', 'Please Check the Email ID');
                  else if (this.state.userMobile.length != 10)
                    Alert.alert('Alert', 'Please Check the Mobile Number');
                  this.setState({ isLoading: false });
                }
              }}>
              {this.state.isLoading ? (
                <ActivityIndicator
                  size="large"
                  color={LocalConfig.COLOR.BLACK}
                />
              ) : (
                <Text style={styles.loginText}>LOGIN</Text>
              )}
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.loginBtn,
                {
                  backgroundColor: this.state.isLoading
                    ? LocalConfig.COLOR.UI_COLOR_LITE
                    : LocalConfig.COLOR.UI_COLOR,
                },
              ]}
              onPress={() => {
                if (
                  this.state.userPassword.length > 0 &&
                  this.state.userEmail.length > 0
                ) {
                  if (this.state.espstatus) {
                    this.handleEspPress();
                  } else {
                    this.handleSubmitPress();
                  }
                } else {
                  Alert.alert('Alert', 'Invalid Mobile or Email');
                  this.setState({ isLoading: false });
                }
              }}>
              {this.state.isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={LocalConfig.COLOR.UI_COLOR}
                />
              ) : (
                <Text style={styles.loginText}>LOGIN</Text>
              )}
            </Pressable>
          )}
          {this.state.status == 0 ? (
            <Pressable
              style={{
                width: '25%',
                marginLeft: '67%',
                marginTop: '1%',
                marginBottom: '2%',
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: LocalConfig.COLOR.UI_COLOR_LITE,
                borderRadius: 16.5,
                shadowColor: 'rgba(0,0,0, .4)', // IOS
                shadowOffset: { height: 1, width: 1 }, // IOS
                shadowOpacity: 1, // IOS
                shadowRadius: 1, //IOS
                elevation: 6, // Android
              }}
              onPress={() => {
                AsyncStorage.setItem('espstatus', `false`);
                this.props.navigation.navigate('frontpage');
              }}>
              <Text
                style={{
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: 'verdanab',
                  fontSize: 13,
                  paddingVertical: 10,
                  fontWeight:'bold',
                }}>
                {`SKIP   ❯`}
              </Text>
            </Pressable>
          ) : (
            <Text></Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LocalConfig.COLOR.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 150,
    marginLeft: '19%',
    alignSelf: 'stretch',
    marginBottom: '9%',
    width: '78%',
  },
  errorTextStyle: {
    color: LocalConfig.COLOR.WHITE
  },
  inputView: {
    width: '80%',
    backgroundColor: LocalConfig.COLOR.WHITE,
    borderColor: '#808080',
    borderRadius: 25,
    borderWidth: 0.3,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2%',
    marginBottom: '15%',
  },
  loginText: {
    color: LocalConfig.COLOR.BLACK,
    fontFamily: 'verdanab',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: LocalConfig.COLOR.BLACK,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
