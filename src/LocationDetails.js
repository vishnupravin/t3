import React from 'react';
import {
  ImageBackground,
  Dimensions,
  Alert,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Button as RNButton,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Modal } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LocalConfig from '../LocalConfig';
import { postData } from '../Functions';
import { ActivityIndicator } from 'react-native';
export default class Manage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSwitchOn: false,
      dataSource: [],
      dataSource1: [],
      dataSource2: [],
      refresh: false,
      animating: true,
      data: '0',
      uid: '',
      bid: '',
      select: 0,
      espstatus: false,
      enterNameModal: false,
      enterNameText: "",
      addressData: { "aditional_number": "8825870294", "bid": "2", "city": "", "id": "109", "is_deleted": "0", "landmark": "fs", "latlng": "11.069871592983851,77.05044222995639", "line1": "33C2 49F, Karuparayanpalayam, கோயம்புத்தூர், தமிழ் நாடு 641004, India", "line2": "", "name": "", "pincode": "", "state": "", "type": "DELIVERY TO HOME", "uid": "4110" },
      enterNameLoading: false,
    };
  }
  async componentDidMount() {
    const key = await AsyncStorage.getItem('user_id');
    const key3 = await AsyncStorage.getItem('branch_id');
    const key4 = await AsyncStorage.getItem('a_id');
    this.setState({
      uid: key,
      bid: key3,
      select: key4,
      espstatus: (await AsyncStorage.getItem('espstatus')) == 'true',
    });
    this.closeActivityIndicator();
    this.getKey();
    this._unsubscribe = () => null;
    this.View();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getKey();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  editAddress = () => {
    this.setState({ enterNameLoading: true })
    const API = `${LocalConfig.API_URL}admin/api/add_address.php?aid=${this.state.addressData.id}&uid=${this.state.addressData.uid}&type=${this.state.addressData.type}&name=${this.state.enterNameText}&latlng=${this.state.addressData.latlng}&line1=${this.state.addressData.line1}&landmark=${this.state.addressData.landmark}&bid=${this.state.addressData.bid}&addiphne=${this.state.addressData.aditional_number}`;
    postData(API).then(res => {
      if (res.data.success) {
        this.setState({ enterNameModal: false, select: this.state.addressData.id })
        AsyncStorage.setItem('type', this.state.espstatus ? this.state.addressData.name : this.state.addressData.type);
        AsyncStorage.setItem('a_id', this.state.addressData.id);
        AsyncStorage.setItem('line', this.state.addressData.line1);
        AsyncStorage.setItem('latlng', this.state.addressData.latlng);
        this.props.navigation.navigate('CartScreen');
      } else {
        Alert.alert("Ooops!", "Something went wrong")
      }
      this.setState({ enterNameLoading: false })
    })
  }
  closeActivityIndicator = () =>
    setTimeout(
      () =>
        this.setState({
          animating: false,
          data: '1',
        }),
      1200,
    );
  getKey = async () => {
    const key = await AsyncStorage.getItem('user_id');
    const key3 = await AsyncStorage.getItem('branch_id');
    const key4 = await AsyncStorage.getItem('a_id');
    this.setState({
      uid: key,
      bid: key3,
      select: key4,
      espstatus: (await AsyncStorage.getItem('espstatus')) == 'true',
    });
    this.View();
    try {
    } catch (error) { }
  };
  async View() {
    const key = await AsyncStorage.getItem('user_id');
    const key3 = await AsyncStorage.getItem('branch_id');
    const key4 = await AsyncStorage.getItem('a_id');
    this.setState({
      uid: key,
      bid: key3,
      select: key4,
      espstatus: (await AsyncStorage.getItem('espstatus')) == 'true',
    });
    const Api =
      `${LocalConfig.API_URL}admin/api/get_address.php?uid=` + this.state.uid;
    fetch(Api)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: responseJson.address,
        });
      });
  }
  deleteItemById(id) {
    Alert.alert(
      'Delete Address',
      'Are you sure want to delete this address ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => this.deleteAddressDetail(id) },
      ],
      { cancelable: false },
    );
  }
  deleteAddressDetail(id) {
    const filteredData = this.state.dataSource.filter(item => item.id !== id);
    this.setState({ dataSource: filteredData });
    const API = `${LocalConfig.API_URL}admin/api/add_address.php?del_id=` +
      id +
      '&bid=' +
      this.state.bid
    console.log(API)
    fetch(API, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    );
  }
  handlePress1 = () => navigation.navigate('AddNewAddress');
  functionCombined() {
    this.deleteItemById(item.id);
    this.deleteItemById1(item.id);
  }
  refresh() {
    this.setState({
      refresh: !this.state.refresh,
    });
  }
  handlePress2 = () => navigation.navigate('HomeScreen');
  loc(item) {
    this.setState({ select: item.id });
    AsyncStorage.setItem('type', this.state.espstatus ? item.name : item.type);
    AsyncStorage.setItem('a_id', item.id);
    AsyncStorage.setItem('line', item.line1);
    AsyncStorage.setItem('latlng', item.latlng);
    this.props.navigation.navigate('CartScreen');
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.data == 0 && (
          <View style={{ width: '95%' }}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width={'90%'}
                height={100}
                marginLeft={'5%'}
                marginTop={12}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={'90%'}
                height={100}
                marginLeft={'5%'}
                marginTop={12}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={'90%'}
                height={100}
                marginLeft={'5%'}
                marginTop={12}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={'90%'}
                height={100}
                marginLeft={'5%'}
                marginTop={12}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={'90%'}
                height={100}
                marginLeft={'5%'}
                marginTop={12}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={'90%'}
                height={100}
                marginLeft={'5%'}
                marginTop={12}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={'90%'}
                height={100}
                marginLeft={'5%'}
                marginTop={12}
                borderRadius={4}
              />
            </SkeletonPlaceholder>
          </View>
        )}
        {this.state.data > 0 && (
          <ScrollView>
            <SafeAreaView style={styles.container}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: LocalConfig.COLOR.BLACK,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      width: 50,
                      height: 40,
                      marginTop: '1%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Ionicons
                      name="arrow-back"
                      size={25}
                      color={LocalConfig.COLOR.UI_COLOR}
                      style={{ marginTop: '7%' }}
                      onPress={() => this.props.navigation.goBack()}
                    />
                  </View>
                  <View
                    style={{
                      height: 45,
                      marginLeft: '16%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: LocalConfig.COLOR.BLACK,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: LocalConfig.COLOR.UI_COLOR,
                        marginTop: '7%',
                        fontFamily: 'verdanab',
                      }}>
                      MANAGE ADDRESS
                    </Text>
                  </View>
                </View>
                {this.state.dataSource.map(item => (
                  <View key={item.id}>
                    <SafeAreaView
                      style={{
                        flex: 1,
                        backgroundColor: LocalConfig.COLOR.BLACK,
                      }}>
                      <View style={styles.item}>
                        <Text style={styles.title}>
                          {this.state.espstatus ? item.name : item.type} {item.id}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.title1}>
                            {item.name != "" && `${item.name}, `}
                            {item.line1}
                            {item.city}
                            {item.pincode}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginBottom: '4%',
                            marginTop: '3%',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                          }}>
                          {!this.state.espstatus && (
                            <TouchableOpacity
                              style={{
                                width: '20%',
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: LocalConfig.COLOR.BLACK,
                                height: 25,
                                borderLeftColor: LocalConfig.COLOR.UI_COLOR,
                                borderLeftWidth: 4,
                                shadowColor: '#50514f',
                                elevation: 4,
                                borderRadius: 5,
                                borderTopWidth: 0.5,
                                borderTopColor: LocalConfig.COLOR.UI_COLOR,
                                borderRightWidth: 0.5,
                                borderRightColor: LocalConfig.COLOR.UI_COLOR,
                                borderBottomWidth: 0.5,
                                borderBottomColor: LocalConfig.COLOR.UI_COLOR,
                              }}
                              onPress={() => this.deleteItemById(item.id)}>
                              <Text
                                style={{
                                  color: LocalConfig.COLOR.UI_COLOR,
                                  fontSize: 12,
                                  fontFamily: 'Proxima Nova Bold',
                                }}>{`DELETE`}</Text>
                            </TouchableOpacity>
                          )}
                          {!this.state.espstatus && (
                            <TouchableOpacity
                              style={{
                                width: '20%',
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: LocalConfig.COLOR.BLACK,
                                height: 25,
                                borderLeftColor: LocalConfig.COLOR.UI_COLOR,
                                borderLeftWidth: 4,
                                shadowColor: '#50514f',
                                elevation: 4,
                                borderRadius: 5,
                                borderTopWidth: 0.5,
                                borderTopColor: LocalConfig.COLOR.UI_COLOR,
                                borderRightWidth: 0.5,
                                borderRightColor: LocalConfig.COLOR.UI_COLOR,
                                borderBottomWidth: 0.5,
                                borderBottomColor: LocalConfig.COLOR.UI_COLOR,
                              }}
                              onPress={() => {
                                this.props.navigation.navigate('LocationMap', {
                                  latlng: item.latlng,
                                  id: item.id,
                                  type: item.type,
                                  aditional_number: item.aditional_number,
                                  landmark: item.landmark,
                                  uid: item.uid,
                                  name: item.name,
                                  bid: item.bid,
                                });
                              }}>
                              <Text
                                style={{
                                  marginTop: '6%',
                                  color: LocalConfig.COLOR.UI_COLOR,
                                  fontSize: 12,
                                  fontFamily: 'Proxima Nova Bold',
                                }}>{`EDIT`}</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={{
                              width: '20%',
                              alignSelf: 'center',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: this.state.select == item.id ? LocalConfig.COLOR.UI_COLOR : LocalConfig.COLOR.BLACK,
                              height: 25,
                              borderLeftColor: LocalConfig.COLOR.UI_COLOR,
                              borderLeftWidth: 4,
                              shadowColor: '#50514f',
                              elevation: 4,
                              borderRadius: 5,
                              borderTopWidth: 0.5,
                              borderTopColor: LocalConfig.COLOR.UI_COLOR,
                              borderRightWidth: 0.5,
                              borderRightColor: LocalConfig.COLOR.UI_COLOR,
                              borderBottomWidth: 0.5,
                              borderBottomColor: LocalConfig.COLOR.UI_COLOR,
                            }}
                            onPress={() => {
                              if (item.name.length > 0)
                                this.loc(item);
                              else {
                                console.log(item)
                                this.setState({ enterNameModal: true, addressData: item })
                              }
                            }}>
                            <Text
                              style={{
                                marginTop: '6%',
                                color:
                                  this.state.select == item.id ? LocalConfig.COLOR.BLACK : LocalConfig.COLOR.UI_COLOR,
                                marginBottom: '3%',
                                fontSize: 12,
                                fontFamily: 'Proxima Nova Bold',
                              }}>{this.state.select == item.id ? `SELECTED` : `SELECT`}</Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            borderBottomColor: '#dee2e6',
                            borderBottomWidth: 0.9,
                          }}
                        />
                      </View>
                    </SafeAreaView>
                  </View>
                ))}
                {!this.state.espstatus && (
                  <Button
                    style={{
                      paddingVertical: -6,
                      marginTop: 40,
                      marginLeft: '5%',
                      marginRight: '5%',
                    }}
                    mode="contained"
                    color={LocalConfig.COLOR.UI_COLOR}
                    onPress={() =>
                      this.props.navigation.navigate('LocationMap')
                    }>
                    <Text
                      style={{
                        color: LocalConfig.COLOR.BLACK,
                        fontSize: 13,
                        fontFamily: 'verdanab',
                      }}>
                      ADD ADDRESS
                    </Text>
                  </Button>
                )}
              </View>
            </SafeAreaView>
          </ScrollView>
        )}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.enterNameModal}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{
            backgroundColor: LocalConfig.COLOR.BLACK,
            padding: 10,
            borderWidth: 2,
            borderColor: LocalConfig.COLOR.UI_COLOR,
            borderRadius: 10,
            width: (Dimensions.get("screen").width / 100) * 80
          }}
          >
            <TextInput
              label="Email"
              value={this.state.enterNameText}
              onChangeText={enterNameText => this.setState({ enterNameText })}
              placeholder={"Please Enter Name For this Address"}
              placeholderTextColor={LocalConfig.COLOR.WHITE_LIGHT}
              style={{
                color: LocalConfig.COLOR.WHITE,
                backgroundColor: LocalConfig.COLOR.BLACK,
                marginVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: LocalConfig.COLOR.WHITE
              }}
            />
            <TouchableOpacity
              disabled={this.state.enterNameLoading || this.state.enterNameText.length <= 0}
              onPress={() => this.editAddress()}
              style={{
                backgroundColor: this.state.enterNameLoading || this.state.enterNameText.length <= 0 ? LocalConfig.COLOR.UI_COLOR_LITE : LocalConfig.COLOR.UI_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                borderRadius: 10
              }}
            >
              <Text
                style={{
                  color: LocalConfig.COLOR.BLACK,
                  fontSize: 15,
                  fontFamily: 'Proxima Nova Bold',
                }}
              >{this.state.enterNameLoading ? <ActivityIndicator color={LocalConfig.COLOR.BLACK} /> : "UPDATE"}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LocalConfig.COLOR.BLACK,
  },
  logo: {
    height: 190,
    flex: 1,
    marginLeft: '3%',
    alignSelf: 'stretch',
    width: '98%',
  },
  container: {
    flex: 1,
    backgroundColor: LocalConfig.COLOR.BLACK,
  },
  item: {
    backgroundColor: LocalConfig.COLOR.BLACK,
    padding: 8,
    marginHorizontal: 16,
    marginTop: '2%',
  },
  title: {
    fontSize: 12,
    color: LocalConfig.COLOR.WHITE,
    letterSpacing: 0.9,
    flex: 1.2,
    fontFamily: 'verdanab',
  },
  title1: {
    marginTop: '3%',
    fontSize: 14,
    color: LocalConfig.COLOR.WHITE_LIGHT,
    letterSpacing: 0.3,
    width: '80%',
    fontFamily: 'Proxima Nova Font',
  },
  example: {
    marginVertical: '80%',
  },
});
