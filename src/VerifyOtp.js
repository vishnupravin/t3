import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Loader';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import RNOtpVerify from 'react-native-otp-verify';
import LocalConfig from '../LocalConfig';
import { ActivityIndicator } from 'react-native-paper';
const VerifyOtp = ({ route, navigation }) => {
  const { uid, userMobile, userEmail, token1, hash } = route.params;
  const [token, setToken] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [tid, setTid] = useState('0');
  const passwordInputRef = createRef();
  const [counter, setCounter] = React.useState(59);
  React.useEffect(() => {
    RNOtpVerify.getOtp().then(p => RNOtpVerify.addListener(otpHandler));
    timeout1();
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);
  const otpHandler = message => {
    //
    let verificationCodeRegex = /Hi, ([\d]{4})/;
    if (verificationCodeRegex.test(message)) {
      let verificationCode = message.match(verificationCodeRegex)[1];
      setTid(1);
      setToken(verificationCode);
    }
    RNOtpVerify.removeListener();
  };
  const timeout1 = () => {
    if (tid == 1) {
      handleSubmitPress();
      setTid(0);
    }
  };
  const handleSubmitPress = () => {
    setErrortext('');
    if (!token) {
      alert('Please fill OTP');
      return;
    }
    setLoading(true);
    let dataToSend = { userMobile: userMobile };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    console.log(`${LocalConfig.API_URL}admin/api/verifyotp.php?` +
      'mobile_no=' +
      userMobile +
      '&token=' +
      token);
    fetch(
      `${LocalConfig.API_URL}admin/api/verifyotp.php?` +
      'mobile_no=' +
      userMobile +
      '&token=' +
      token,
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
        setLoading(false);
        if (responseJson['data'].success === '1') {
          AsyncStorage.setItem('user_id', uid).then(() => {
            AsyncStorage.setItem('mobile_no', userMobile).then(() => {
              AsyncStorage.setItem('mail_id', userEmail).then(() => {
                navigation.replace('frontpage');
              });
            });
          });
        } else if (responseJson['data'].success === '0') {
          alert('Please Enter the valid  OTP');
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
      });
  };
  const handleResend = () => {
    setErrortext('');
    setToken('');
    setLoading(true);
    let dataToSend = { userEmail: userEmail, userMobile: userMobile };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    const hash1 = encodeURIComponent(hash);
    //${LocalConfig.API_URL}admin/api/register.php?mobile_no=7397690211&&maild=darinisampath001@gmail.com&&token=

    fetch(
      `${LocalConfig.API_URL}admin/api/register.php?` +
      'maild=' +
      userEmail +
      '&mobile_no=' +
      userMobile +
      '&token=' +
      token1 +
      '&hash=' +
      hash1,
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
        setLoading(false);
        if (responseJson['data'].success === '1') {
          navigation.replace('VerifyOtp', {
            uid: responseJson['data'].register,
            userMobile: userMobile,
            userEmail: userEmail,
            espstatus: route.params.espstatus,
          });
          //;
        } else {
          alert(responseJson['data'].register);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
      });
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.logo}
          source={require('../assests/Logo.png')}
          resizeMode="center"
        />
        <Text style={styles.logo1}>We have sent a verification code</Text>
        <View style={styles.inputView}>
          <OTPInputView
            style={styles.inputText}
            pinCount={4}
            code={token}
            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={token => setToken(token)}
            autoFocusOnLoad
            codeInputFieldStyle={{
              color: LocalConfig.COLOR.BLACK,
              fontWeight: 'bold',
              borderRadius: 10,
              backgroundColor: LocalConfig.COLOR.WHITE_LIGHT,
              elevation: 2,
            }}
            codeInputHighlightStyle={{ color: LocalConfig.COLOR.BLACK, }}
            onCodeFilled={token => setToken(token)}
          />
        </View>
        {counter == 0 && (
          <TouchableOpacity onPress={handleResend}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                color: LocalConfig.COLOR.UI_COLOR,
                marginLeft: '55%',
                marginTop: '7%',
                margin: '5%',
              }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}
        {counter > 0 && (
          <TouchableOpacity>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                color: LocalConfig.COLOR.UI_COLOR,
                marginLeft: '55%',
                marginTop: '7%',
                margin: '5%',
              }}>
              Resend OTP in {counter} secs
            </Text>
          </TouchableOpacity>
        )}
        {errortext != '' ? (
          <Text style={styles.errorTextStyle}>{errortext}</Text>
        ) : null}
        {token.length == 4 ? (
          <TouchableOpacity disabled={loading} style={loading ? styles.loginBtn1 : styles.loginBtn} onPress={handleSubmitPress}>
            {loading ? <ActivityIndicator color={LocalConfig.COLOR.BLACK} /> : <Text style={styles.loginText}>VERIFY</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity disabled={loading} style={styles.loginBtn1}>
            <Text style={styles.loginText}>VERIFY</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
export default VerifyOtp;
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
    marginBottom: '6%',
    width: '78%',
  },
  logo1: {
    fontWeight: 'bold',
    fontSize: 13,
    color: LocalConfig.COLOR.UI_COLOR,
    marginBottom: '7%',
    margin: '5%',
  },
  logo2: {
    fontWeight: 'bold',
    fontSize: 13,
    color: LocalConfig.COLOR.UI_COLOR,
    marginBottom: '15%',
    margin: '5%',
    fontFamily: 'verdanab',
  },
  logo3: {
    fontWeight: 'bold',
    fontSize: 12,
    color: LocalConfig.COLOR.UI_COLOR,
    marginLeft: '55%',
    marginTop: '2%',
    margin: '5%',
  },
  inputView: {
    width: '80%',
    backgroundColor: LocalConfig.COLOR.BLACK,
    borderRadius: 25,
    borderWidth: 0,
    height: 50,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: '#ffffff',
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: LocalConfig.COLOR.UI_COLOR,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2%',
    marginBottom: '15%',
  },
  loginBtn1: {
    width: '80%',
    backgroundColor: LocalConfig.COLOR.UI_COLOR_LITE_TWICE,
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
});
