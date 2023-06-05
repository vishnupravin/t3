import React, { Component } from 'react';
import { List, Button } from 'react-native-paper';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import Dash from 'react-native-dash';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { BlurView } from '@react-native-community/blur';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import RNSmsRetriever, { requestPhoneNumber } from 'react-native-sms-retriever';
import RNOtpVerify from 'react-native-otp-verify';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Icon from 'react-native-vector-icons/Ionicons';
import LocalConfig from '../LocalConfig';
import RNUserIdentity from 'react-native-user-identity';
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      data: '',
      name: '',
      email: '',
      inputText: '',
      editedItem: 0,
      inputText1: '',
      isFetching: false,
      uid: '',
      bid: '',
      counter: 59,
      otp: '',
      loginmodal: false,
      verifymodal: false,
      loginnumber: '',
      loginemail: '',
      editemail: false,
      editnumber: false,
      uid1: '',
      hash: '',
      token_id: '',
      tid: 0,
    };
    this.refreshScreen = this.refreshScreen.bind(this);
  }
  refreshScreen() {
    this.setState(() => {
      this.componentDidMount();
    });
  }
  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };
  componentDidMount() {
    this.login();
    this.getKey();
  }
  getKey = async () => {
    try {
      const key = await AsyncStorage.getItem('user_id');
      const key3 = await AsyncStorage.getItem('branch_id');
      const key1 = await AsyncStorage.getItem('token');
      //
      this.setState({ uid: key, bid: key3, token_id: key1 });
      //
      this.profile();
    } catch (error) {
      //
    }
  };
  profile() {
    fetch(
      `${LocalConfig.API_URL}admin/api/user_profile.php?uid=` + this.state.uid,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        //
        this.setState({
          data: responseJson.profile,
        });
      })
      .catch(error => {
        //console.error(error);
      });
  }
  InsertDataToServer = () => {
    const { name } = this.state;
    const { email } = this.state;
    fetch(
      `${LocalConfig.API_URL}admin/api/update_profile.php?uid=` +
      this.state.uid +
      '&&maild=' +
      email +
      '&&name=' +
      name,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: name,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        //
        // Showing response message coming from server after inserting records.
        Alert.alert('Updated ');
      })
      .catch(error => {
        //console.error(error);
      });
  };
  setInputText = name => {
    this.setState({ name });
  };
  setInputText1 = email => {
    this.setState({ email });
  };
  setEditedItem = () => {
    this.setState({ editedItem: id });
  };
  login() {
    RNOtpVerify.getHash().then(hash => {
      this.setState({ hash: hash });
    });
  }
  handleSubmitPress = () => {
    if (!this.state.loginemail) {
      alert('Please fill Email');
      return;
    }
    if (!this.state.loginnumber) {
      alert('Please fill Mobile Number');
      return;
    }
    this.verify();
    const { loginemail } = this.state;
    const { loginnumber } = this.state;
    let dataToSend = {
      userEmail: this.state.loginemail,
      userMobile: this.state.loginnumber,
    };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    const tk = encodeURIComponent(this.state.hash);
    const tk1 = encodeURIComponent(this.state.token_id);
    // token)
    //  tk1)
    const os = 'android';
    fetch(
      `${LocalConfig.API_URL}admin/api/register.php?` +
      'maild=' +
      loginemail +
      '&mobile_no=' +
      loginnumber +
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
        // setLoading(false);
        if (responseJson['data'].success === '1') {
          // setIsLoading(false);
          let uid = responseJson['data'].register;
          // AsyncStorage.setItem('user_id',responseJson["data"].register);
          this.setState({ uid1: uid, verifymodal: true, loginmodal: false });
          this.counter();
        } else {
          //   setErrortext(responseJson["data"].register);
        }
      })
      .catch(error => {
        //Hide Loader
        //setLoading(false);
      });
  };
  verify() {
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(this.otpHandler))
      .catch(p => {
        //
      });
  }
  otpHandler = message => {
    let verificationCodeRegex = /Hi, ([\d]{4})/;
    if (verificationCodeRegex.test(message)) {
      let verificationCode = message.match(verificationCodeRegex)[1];
      this.setState({ otp: verificationCode });
      this.verifyid();
    }
    RNOtpVerify.removeListener();
  };
  verifyid() {
    if (this.state.tid == 1) {
      this.handleSubmitPress1();
      this.setState({ tid: 0 });
      // setTid(0);
    }
  }
  handleSubmitPress1 = () => {
    // setErrortext('');
    //
    if (!this.state.otp) {
      alert('Please fill OTP');
      return;
    }
    const { otp } = this.state;
    const { loginnumber } = this.state;
    const { loginemail } = this.state;
    const { uid1 } = this.state;
    //setLoading(true);
    let dataToSend = { userMobile: loginnumber };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch(
      `${LocalConfig.API_URL}admin/api/verifyotp.php?` +
      'mobile_no=' +
      loginnumber +
      '&token=' +
      otp,
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
        //  setLoading(false);
        if (responseJson['data'].success === '1') {
          this.setState({ verifymodal: false });
          AsyncStorage.setItem('user_id', uid1);
          AsyncStorage.setItem('mobile_no', loginnumber);
          AsyncStorage.setItem('mail_id', loginemail);
          this.getKey();
          // navigation.replace('frontpage');
        } else if (responseJson['data'].success === '0') {
          alert('Please Enter the valid  OTP');
        }
      })
      .catch(error => {
        //Hide Loader
        //setLoading(false);
      });
  };
  counter() {
    const timer =
      this.state.counter > 0 &&
      setInterval(() => this.setState({ counter: this.state.counter - 1 }), 1000);
    return () => clearInterval(timer);
  }
  buttonPress = async () => {
    console.log("buttonPress");
    try {
      const result = await RNUserIdentity.getUserId();
      this.setState({ loginemail: result });
      if (result === null) {
        ToastAndroid.show(`no email selected`, ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error) {
        this.setState({ editemail: true });
      }
    }
  };
  buttonPress1 = async () => {
    console.log("buttonPress1");
    try {
      const phoneNumber = await RNSmsRetriever.requestPhoneNumber();
      this.setState({ loginnumber: phoneNumber.split('+91')[1] });
    } catch (error) {
      this.setState({ editnumber: true });
    }
  };
  // buttonPress = async () => {
  //   try {
  //     const result = await RNSmsRetriever.getUserId();
  //     this.setState({ loginemail: result });
  //     //  setUserEmail(result)
  //     //
  //     if (result === null) {
  //       alert('User canceled UI flow');
  //     }
  //   } catch (error) {
  //     if (error) {
  //       //  setEditable1(true);
  //       this.setState({ editemail: true });
  //     }
  //   }
  // };
  // buttonPress1 = async () => {
  //   try {
  //     const phoneNumber = await requestPhoneNumber();
  //     //setUserMobile(phoneNumber.split('+91')[1])
  //     this.setState({ loginnumber: phoneNumber.split('+91')[1] });
  //   } catch (error) {
  //     this.setState({ editnumber: true });
  //   }
  // };
  render() {
    const { modalVisible } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: LocalConfig.COLOR.BLACK }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: LocalConfig.COLOR.BLACK,
          }}>
          <View style={[styles.centerElement, { width: '10%', height: 50 }]}>
            <Icon
              name="arrow-back"
              size={23}
              color={LocalConfig.COLOR.UI_COLOR}
              style={{ marginTop: '7%' }}
              onPress={() =>
                this.props.navigation.replace('DrawerNavigatorRoutes')
              }
            />
          </View>
          <View style={[styles.centerElement, { height: 50 }]}>
            <Text
              style={{
                fontSize: 15,
                color: LocalConfig.COLOR.UI_COLOR,
                marginLeft: '39%',
                fontFamily: 'verdanab',
              }}>
              PROFILE
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: LocalConfig.COLOR.BLACK,
            borderBottomWidth: 0.7,
          }}
        />
        {this.state.uid == null ? (
          <ScrollView>
            <ImageBackground
              style={{
                height: 550,
                alignSelf: 'stretch',
                width: '100%',
                flex: 1
              }}
              source={require('../assests/login.png')}
              resizeMode="center"
            />
            <View style={{ backgroundColor: LocalConfig.COLOR.BLACK, height: 'auto' }}>
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE,
                  marginLeft: '5%',
                  fontFamily: 'verdanab',
                }}>
                ACCOUNT
              </Text>
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE_LIGHT,
                  marginLeft: '5%',
                  marginTop: '1%',
                  fontFamily: 'Proxima Nova Font',
                }}>
                Login to continue
              </Text>
              <Button
                title="Login"
                titleStyle={{ color: LocalConfig.COLOR.WHITE }}
                style={{
                  marginTop: '5%',
                  width: '90%',
                  marginLeft: '5%',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                }}
                color={LocalConfig.COLOR.UI_COLOR_LITE_TW}
                onPress={() => this.setState({ loginmodal: true })}>
                <Text style={{ color: LocalConfig.COLOR.BLACK }}>Login</Text>
              </Button>
            </View>
            <Modal
              style={{
                marginTop: '0%',
                width: '100%',
                marginLeft: '0%',
                marginBottom: '0%',
              }}
              animationType="slide"
              transparent={true}
              visible={this.state.loginmodal}
              onRequestClose={() => { }}>
              <BlurView
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                }}
                blurType="dark"
                blurAmount={1}
                reducedTransparencyFallbackColor="white"
              />
              <TouchableWithoutFeedback
                onPress={() =>
                  Keyboard.dismiss(
                    this.setState({ editnumber: false, editemail: false }),
                  )
                }>
                <View
                  style={{
                    height: '60%',
                    marginTop: 'auto',
                    backgroundColor: LocalConfig.COLOR.BLACK,
                    borderRadius: 20,
                  }}>
                  <View style={{ flexDirection: 'column' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: LocalConfig.COLOR.BLACK,
                        marginBottom: '2%',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                      }}>
                      <Text
                        style={{
                          color: LocalConfig.COLOR.UI_COLOR,
                          fontSize: 14,
                          fontFamily: 'verdanab',
                          marginLeft: '28%',
                          padding: '5%',
                          letterSpacing: 0.3,
                        }}>
                        ALMOST THERE
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ loginmodal: false });
                        }}>
                        <View
                          style={{
                            color: '#2b2d42',
                            fontSize: 15,
                            marginTop: '7%',
                            marginLeft: '37%',
                          }}>
                          <MaterialIcons
                            name="close"
                            size={25}
                            color={LocalConfig.COLOR.UI_COLOR}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        color: LocalConfig.COLOR.WHITE,
                        fontSize: 13,
                        fontFamily: 'Proxima Nova Bold',
                        marginTop: '-6%',
                        marginLeft: '30%',
                        marginBottom: '3%',
                        letterSpacing: 0.3,
                      }}>
                      Login to place your order
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomColor: '#dee2e6',
                      borderBottomWidth: 0.5,
                      marginTop: '-2%',
                      marginBottom: '3%',
                    }}
                  />
                  {/* <Text style={{marginTop:'3%',width:'100%',marginLeft:'5%',marginBottom:'1%',color:'#adb5bd',fontSize:13,letterSpacing:0.4,fontFamily:'Proxima Nova Font'}}>Email Address</Text>   */}
                  <View
                    style={{
                      width: '80%',
                      marginTop: '8%',
                      backgroundColor: '#fff',
                      borderColor: '#808080',
                      borderRadius: 25,
                      borderWidth: 0.3,
                      height: 50,
                      marginBottom: 20,
                      justifyContent: 'center',
                      padding: 20,
                      marginLeft: '11%',
                    }}>
                    <TextInput
                      style={{
                        height: 50,
                        color: 'black',
                      }}
                      color="#545862"
                      placeholder="Enter Your Email"
                      placeholderTextColor="#003f5c"
                      multiline={false}
                      returnKeyType="done"
                      onFocus={() => this.buttonPress()}
                      onSubmitEditing={() =>
                        this.setState({ editemail: false })
                      }
                      onChangeText={loginemail =>
                        this.setState({ loginemail })
                      }>
                      {this.state.loginemail}
                    </TextInput>
                  </View>
                  {/* <Text style={{marginTop:'3%',width:'100%',marginLeft:'5%',marginBottom:'1%',color:'#adb5bd',fontSize:13,letterSpacing:0.4,fontFamily:'Proxima Nova Font'}}>Phone Number</Text> */}
                  <View
                    style={{
                      width: '80%',
                      marginTop: '3%',
                      backgroundColor: '#fff',
                      borderColor: '#808080',
                      borderRadius: 25,
                      borderWidth: 0.3,
                      height: 50,
                      marginBottom: 20,
                      justifyContent: 'center',
                      padding: 20,
                      marginLeft: '11%',
                    }}>
                    <TextInput
                      style={{
                        height: 40,
                        borderColor: 'white',
                        borderWidth: 0.5,
                        width: '90%',
                        marginLeft: '5%',
                      }}
                      onFocus={() => this.buttonPress1()}
                      returnKeyType="done"
                      onSubmitEditing={() =>
                        this.setState({ editnumber: false })
                      }
                      color="#545862"
                      maxLength={10}
                      keyboardType="numeric"
                      placeholder="Enter Your Mobile Number"
                      placeholderTextColor="#003f5c"
                      multiline={false}
                      onChangeText={loginnumber =>
                        this.setState({ loginnumber })
                      }>
                      {this.state.loginnumber}
                    </TextInput>
                  </View>
                  <View>
                    <Button
                      title="Login"
                      color={LocalConfig.COLOR.UI_COLOR_LITE}
                      titleStyle={{ color: LocalConfig.COLOR.WHITE }}
                      style={{
                        marginTop: '5%',
                        width: '79.5%',
                        marginLeft: '11%',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR_LITE,
                        borderRadius: 25,
                      }}
                      onPress={() => {
                        this.handleSubmitPress();
                      }}>
                      <Text style={{ color: LocalConfig.COLOR.BLACK }}>Login</Text>
                    </Button>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              style={{
                marginTop: '0%',
                width: '100%',
                marginLeft: '0%',
                marginBottom: '0%',
              }}
              animationType="slide"
              transparent={true}
              visible={this.state.verifymodal}
              onRequestClose={() => { }}>
              <BlurView
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                }}
                blurType="dark"
                blurAmount={1}
                reducedTransparencyFallbackColor="white"
              />
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View
                  style={{
                    height: '60%',
                    marginTop: 'auto',
                    backgroundColor: LocalConfig.COLOR.BLACK,
                    borderRadius: 20,
                  }}>
                  <View style={{ flexDirection: 'column' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: LocalConfig.COLOR.BLACK,
                        marginBottom: '2%',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                      }}>
                      <Text
                        style={{
                          color: LocalConfig.COLOR.UI_COLOR,
                          fontSize: 14,
                          fontFamily: 'verdanab',
                          marginLeft: '35%',
                          padding: '5%',
                          letterSpacing: 0.3,
                        }}>
                        Verify Otp
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ verifymodal: false });
                        }}>
                        <View
                          style={{
                            color: '#2b2d42',
                            fontSize: 15,
                            marginTop: '7%',
                            marginLeft: '45%',
                          }}>
                          <MaterialIcons
                            name="close"
                            size={25}
                            color={LocalConfig.COLOR.UI_COLOR}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: '#dee2e6',
                      borderBottomWidth: 0.5,
                      marginTop: '-2%',
                      marginBottom: '3%',
                    }}
                  />
                  <Text
                    style={{
                      height: 150,
                      marginLeft: '25%',
                      alignSelf: 'stretch',
                      marginBottom: '6%',
                      width: '85%',
                      color: LocalConfig.COLOR.WHITE,
                      fontFamily: 'Proxima Nova Font',
                    }}>
                    We have sent a verification code
                  </Text>
                  <View
                    style={{
                      width: '80%',
                      marginTop: '-10%',
                      backgroundColor: LocalConfig.COLOR.BLACK,
                      borderColor: LocalConfig.COLOR.BLACK,
                      borderRadius: 25,
                      borderWidth: 0,
                      height: 50,
                      marginLeft: '10%',
                      justifyContent: 'center',
                      padding: 10,
                    }}>
                    <OTPInputView
                      style={{
                        height: 50,
                        color: LocalConfig.COLOR.BLACK,
                      }}
                      pinCount={4}
                      code={this.state.otp}
                      // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                      onCodeChanged={otp => this.setState({ otp })}
                      autoFocusOnLoad={false}
                      codeInputFieldStyle={{
                        color: LocalConfig.COLOR.BLACK,
                        fontWeight: 'bold',
                        borderRadius: 10,
                        backgroundColor: '#ffffff',
                        elevation: 2,
                      }}
                      codeInputHighlightStyle={{ color: LocalConfig.COLOR.BLACK }}
                      onCodeFilled={otp => this.setState({ otp })}
                    />
                  </View>
                  {this.state.counter > 0 ? (
                    <TouchableOpacity>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 12,
                          color: LocalConfig.COLOR.UI_COLOR_LITE,
                          marginLeft: '55%',
                          marginTop: '7%',
                          margin: '5%',
                        }}>
                        Resend OTP in {this.state.counter} secs
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={this.handleSubmitPress}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 12,
                          color: LocalConfig.COLOR.UI_COLOR_LITE,
                          marginLeft: '55%',
                          marginTop: '7%',
                          margin: '5%',
                        }}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  )}
                  <View
                    style={{ marginTop: '5%', width: '80%', marginLeft: '9%' }}>
                    {this.state.otp.length == 4 ? (
                      <Button
                        title="VERIFY"
                        color={LocalConfig.COLOR.UI_COLOR_LITE}
                        titleStyle={{ color: LocalConfig.COLOR.WHITE }}
                        style={{
                          marginTop: '5%',
                          backgroundColor: LocalConfig.COLOR.UI_COLOR_LITE,
                          width: '90%',
                          marginLeft: '8%',
                          borderRadius: 25,
                        }}
                        onPress={() => {
                          this.handleSubmitPress1();
                        }}>
                        <Text style={{ color: LocalConfig.COLOR.BLACK, }}>VERIFY</Text>
                      </Button>
                    ) : (
                      <Button
                        title="VERIFY"
                        titleStyle={{ color: LocalConfig.COLOR.WHITE }}
                        style={{
                          marginTop: '5%',
                          backgroundColor: LocalConfig.COLOR.UI_COLOR_LITE,
                          width: '90%',
                          marginLeft: '8%',
                          borderRadius: 25,
                        }}>
                        <Text style={{ color: LocalConfig.COLOR.BLACK }}>VERIFY</Text>
                      </Button>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </ScrollView>
        ) : (
          <View style={styles.absolute}>
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => (
                <View style={{ marginVertical: 20 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.text2}>{item.name}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: '3%',
                      width: '100%',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'verdanab',
                        marginLeft: '6%',
                        width: '30%',
                        fontSize: 12,
                        color: LocalConfig.COLOR.WHITE,
                      }}>
                      {item.mob_number}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'verdanab',
                        width: '70%',
                        fontSize: 12,
                        color: LocalConfig.COLOR.WHITE,
                      }}>
                      {item.email}
                    </Text>
                  </View>
                  <Modal
                    style={{
                      marginTop: '100%',
                      width: '100%',
                      marginLeft: '0%',
                      flex: 1,
                    }}
                    visible={modalVisible}
                    onBackdropPress={() => {
                      this.setModalVisible(!modalVisible);
                    }}>
                    <BlurView
                      style={styles.absolute}
                      blurType="dark"
                      blurAmount={1}
                      reducedTransparencyFallbackColor="white"
                    />
                    <View
                      style={{ marginTop: '-40%', backgroundColor: LocalConfig.COLOR.BLACK }}>
                      <Text
                        style={{
                          marginTop: '3%',
                          width: '100%',
                          marginLeft: '5%',
                          marginBottom: '5%',
                          color: '#343a40',
                          fontSize: 16,
                          fontWeight: 'bold',
                          letterSpacing: 0.4,
                        }}>
                        Edit Profile
                      </Text>
                      <Text
                        style={{
                          marginTop: '3%',
                          width: '100%',
                          marginLeft: '5%',
                          marginBottom: '1%',
                          color: LocalConfig.COLOR.WHITE,
                          fontSize: 13,
                          letterSpacing: 0.4,
                        }}>
                        Name
                      </Text>
                      <TextInput
                        style={{
                          height: 40,
                          borderWidth: 0.5,
                          width: '90%',
                          marginLeft: '5%',
                        }}
                        defaultValue={this.state.name}
                        editable={true}
                        color={LocalConfig.COLOR.WHITE}
                        placeholderTextColor={LocalConfig.COLOR.UI_COLOR_LITE}
                        underlineColorAndroid={LocalConfig.COLOR.UI_COLOR_LITE}
                        multiline={false}
                        onChangeText={name => this.setState({ name })}
                      />
                      <Text
                        style={{
                          marginTop: '3%',
                          width: '100%',
                          marginLeft: '5%',
                          marginBottom: '1%',
                          color: LocalConfig.COLOR.WHITE,
                          fontSize: 13,
                          letterSpacing: 0.4,
                        }}>
                        Email Address
                      </Text>
                      <TextInput
                        style={{
                          height: 40,
                          borderWidth: 0.5,
                          width: '90%',
                          marginLeft: '5%',
                          marginBottom: '5%',
                        }}
                        defaultValue={this.state.email}
                        editable={true}
                        color={LocalConfig.COLOR.WHITE}
                        placeholderTextColor={LocalConfig.COLOR.UI_COLOR_LITE}
                        underlineColorAndroid={LocalConfig.COLOR.UI_COLOR_LITE}
                        multiline={false}
                        onChangeText={email => this.setState({ email })}
                      />
                      <Button
                        title="Update"
                        color={LocalConfig.COLOR.UI_COLOR_LITE}
                        titleStyle={{ color: LocalConfig.COLOR.WHITE }}
                        style={{
                          width: '50%',
                          backgroundColor: LocalConfig.COLOR.UI_COLOR,
                          marginLeft: '22%',
                          borderRadius: 10,
                          marginTop: '5%',
                        }}
                        onPress={() => {
                          this.InsertDataToServer();
                          this.setModalVisible(!modalVisible);
                          this.refreshScreen();
                        }}>
                        <Text style={{ color: LocalConfig.COLOR.BLACK }}>Update</Text>
                      </Button>
                    </View>
                  </Modal>
                  <List.Item
                    title="My Account"
                    theme={{
                      colors: {
                        primary: LocalConfig.COLOR.UI_COLOR,
                        text: LocalConfig.COLOR.UI_COLOR,
                      },
                    }}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon="account"
                        color={LocalConfig.COLOR.UI_COLOR}
                      />
                    )}></List.Item>
                  <Dash
                    dashGap={5}
                    dashThickness={0.8}
                    dashColor={LocalConfig.COLOR.UI_COLOR}
                    style={{ width: '100%', height: 3, marginTop: '1%' }}
                  />
                  <List.Section>
                    <List.Item
                      style={{ marginLeft: '0.5%' }}
                      title="Manage Address"
                      titleStyle={{ color: LocalConfig.COLOR.WHITE }}
                      onPress={() => {
                        this.props.navigation.navigate('LocationDetails');
                      }}
                      left={props => (
                        <List.Icon
                          {...props}
                          icon="map-marker"
                          color={LocalConfig.COLOR.WHITE}
                        />
                      )}
                    />
                    <View
                      style={{
                        borderBottomColor: '#f4f4f4',
                        borderBottomWidth: 0.7,
                      }}
                    />
                    <List.Item
                      style={{ marginLeft: '0.5%' }}
                      title="Edit Profile"
                      titleStyle={{ color: LocalConfig.COLOR.WHITE }}
                      onPress={() => {
                        this.setModalVisible(true);
                        this.setInputText(item.name);
                        this.setInputText1(item.email);
                      }}
                      left={props => (
                        <List.Icon
                          {...props}
                          icon="account-edit"
                          color={LocalConfig.COLOR.WHITE}
                        />
                      )}
                    />
                    <View
                      style={{
                        borderBottomColor: '#f4f4f4',
                        borderBottomWidth: 0.7,
                      }}
                    />
                    {/* <List.Item
                      style={{ marginLeft: '0.5%' }}
                      title="App Settings"
                      titleStyle={{ color: LocalConfig.COLOR.WHITE }}
                      left={props => (
                        <List.Icon
                          {...props}
                          icon="cellphone-settings"
                          color={LocalConfig.COLOR.WHITE}
                        />
                      )}
                    />
                    <View
                      style={{
                        borderBottomColor: '#f4f4f4',
                        borderBottomWidth: 0.7,
                      }}
                    /> */}
                  </List.Section>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        )}
      </View>
    );
  }
}
export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: LocalConfig.COLOR.BLACK,
  },
  centerElement: { justifyContent: 'center', alignItems: 'center' },
  loginBtn: {
    width: '28%',
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2%',
    marginBottom: '15%',
    shadowColor: LocalConfig.COLOR.BLACK,
    elevation: 3,
  },
  loginBtn1: {
    width: '28%',
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 30,
    marginTop: '2%',
    marginBottom: '15%',
    shadowColor: LocalConfig.COLOR.BLACK,
    elevation: 3,
  },
  loginText: {
    color: '#55a630',
    fontSize: 13,
    fontFamily: 'Proxima Nova Bold',
    flexDirection: 'row',
    marginTop: '3%',
  },
  title: {
    fontSize: 20,
    marginLeft: 20,
  },
  text1: {
    fontSize: 13,
    marginLeft: 25,
    marginBottom: 10,
    fontFamily: 'verdanab',
    color: 'black',
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fb5607',
    marginTop: 17,
    marginLeft: 10,
  },
  text2: {
    fontSize: 15,
    marginLeft: 25,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'verdanab',
    color: LocalConfig.COLOR.WHITE,
  },
  text5: {
    fontSize: 53,
    marginLeft: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginLeft: '70%',
  },
});
