import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Button,
  Modal,
  Linking,
  ScrollView,
  TextInput,
  ToastAndroid,
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dash from 'react-native-dash';
import ZigzagView from 'react-native-zigzag-view';
import { BlurView } from '@react-native-community/blur';
import { Checkbox } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import sqlservice from './sql';
import LocalConfig from '../LocalConfig';
import { Platform } from 'react-native';
let sql;
export default class OrderHistory2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 0,
      rating: '',
      msg: '',
      data: [],
      order_no: '',
      modalVisible: false,
      checked4: false,
      checked1: false,
      checked2: false,
      checked3: false,
      reason: '',
      pay_id: '',
      delivery: '',
      modalVisible1: true,
      uid: '',
      espstatus: false,
    };
    this.refreshScreen = this.refreshScreen.bind(this);
    sql = new sqlservice();
  }

  refreshScreen() {
    this.setState(() => {
      this.componentDidMount();
    });
  }
  componentDidMount() {
    this.View();
    this.getKey();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.View();
      this.getKey();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getKey = async () => {
    try {
      const key = await AsyncStorage.getItem('user_id');
      this.setState({
        espstatus: (await AsyncStorage.getItem('espstatus')) == 'true',
      });
      this.setState({ uid: key });
      this.View();
    } catch (error) { }
  };
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }
  View() {
    const order_no = this.props.route.params.order_no;
    this.state.order_no = order_no;
    const value = this.props.route.params.value;
    const API_url =
      `${LocalConfig.API_URL}admin/api/order_details.php?order_id=` + order_no;
    fetch(API_url)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.order_details != 'No record Found') {
          this.setState({
            data: responseJson.order_details,
          });
        }
      });
  }
  cancelorder() {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => this.reasonlist() },
    ]);
  }
  reasonlist() {
    this.setModalVisible(true);
  }
  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };
  setModalVisible1 = visible => {
    this.setState({ modalVisible1: visible });
  };
  InsertDataToServer = async () => {
    this.setModalVisible(!this.state.modalVisible);
    //   this.rest.getDatapost('razor_pay_refund_payment.php?order_id_user='+oid+'&&payment_id_rapivalue='+this.pid+'&&reason='+reason).then((res:any)=>{
    //     var sub=(res.toString()).substring(0,5);
    //     if(res=="cod_reject"){
    //         this.maketoast('Your order has been cancelled')
    //     }else if(sub=='rfnd_'){
    //       this.maketoast('Your order is successfully cancelled Amount will be refunded within 7 days')
    //     }else{
    //       this.maketoast(res.toString())
    //     }
    //     this.rest.stopLoader();
    //     this.nav.navigateRoot('order-list')
    // }).catch((err:any)=>{
    //   alert(JSON.stringify(err));
    // })
    const { order_no } = this.state;
    const { pay_id } = this.state;
    let api;
    const { reason } = this.state;
    if (this.state.data[0].payment_gateway == "cashfree") {
      api = `${LocalConfig.API_URL}admin/api/cashfree_refund.php?order_id_user=${order_no}&reason=${reason}`
    } else {
      api =
        `${LocalConfig.API_URL}admin/api/razor_pay_refund_payment.php?order_id_user=` +
        order_no +
        '&&payment_id_rapivalue=' +
        pay_id +
        '&&reason=' +
        reason;
    }
    await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        var sub = responseJson.toString().substring(0, 5);
                if (responseJson == 'cod_reject') {
          Alert.alert('Your order has been cancelled');
        } else if (sub == 'rfnd_') {
          Alert.alert(
            'Thanks for order with us', 'Your order is successfully cancelled Amount will be refunded within 7 days',
          );
        } else {
          Alert.alert(responseJson.toString());
        }
        this.refreshScreen();
      })
      .catch(error => { });
  };
  async reorderItem(item) {
    const API =
      `${LocalConfig.API_URL}admin/api/order_details.php?order_id=` + item;
    await fetch(API)
      .then(response => response.json())
      .then(responseJson => {
        var [LOOPvariantid, LOOPvariantName, LOOPvariantprice] = ['', '', ''];
        let order_detailsMenu = responseJson.order_details[0].menu;
        order_detailsMenu.map(item => {
          item.variant.map(variant => {
            LOOPvariantid = LOOPvariantid + ',' + variant.id;
            LOOPvariantName = LOOPvariantName + ',' + variant.variant_name;
            LOOPvariantprice = LOOPvariantprice + ',' + variant.price;
          });
          // (itm_id, cat, name, price, qty, image, wholecat, addonid, addname, addprice, variantid, variantName, variantprice, radioid, radioprice, varid, varprice, total, remark)
          let ITEM_TO_ADD = {
            itm_id: item.ItemId,
            cat: item.Itemcatid,
            name: item.ItemName,
            price: item.ItemAmt,
            qty: item.ItemQty,
            image: '',
            wholecat: item.Itemwholecat,
            addonid: '',
            addname: '',
            addprice: '',
            variantid: LOOPvariantid,
            variantName: LOOPvariantName,
            variantprice: LOOPvariantprice,
            radioid: LOOPvariantid,
            radioprice: LOOPvariantprice,
            varid: '',
            varprice: '',
            total: item.ItemTotalPrice,
            remark: '',
          };

          sql
            .addItemaddon(
              ITEM_TO_ADD.itm_id,
              ITEM_TO_ADD.cat,
              ITEM_TO_ADD.name,
              ITEM_TO_ADD.price,
              ITEM_TO_ADD.qty,
              ITEM_TO_ADD.image,
              ITEM_TO_ADD.wholecat,
              ITEM_TO_ADD.addonid,
              ITEM_TO_ADD.addname,
              ITEM_TO_ADD.addprice,
              ITEM_TO_ADD.variantid,
              ITEM_TO_ADD.variantName,
              ITEM_TO_ADD.variantprice,
              ITEM_TO_ADD.radioid,
              ITEM_TO_ADD.radioprice,
              ITEM_TO_ADD.varid,
              ITEM_TO_ADD.varprice,
              ITEM_TO_ADD.total,
              ITEM_TO_ADD.remark,
            )
            .then(() => {
              ToastAndroid.show('Items added your Cart', ToastAndroid.SHORT);
            });
        });
      })
      .finally(() => {
        this.props.navigation.navigate('HomeScreen', { orderno: item });
      });
  }
  InsertDataToServer2 = () => {
    this.setState({ modalVisible1: false });
    const { order_no } = this.state;
    const { rating } = this.state;
    const { msg } = this.state;
    const { uid } = this.state;
    fetch(
      `${LocalConfig.API_URL}admin/api/add_review.php?oid=` +
      order_no +
      '&&uid=' +
      uid +
      '&&message=' +
      msg +
      '&&rating=' +
      rating,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oid: order_no,
          uid: uid,
          message: msg,
          rating: rating,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        // Showing response message coming from server after inserting records.
        Alert.alert('Thanks for your Feedback');
        this.setState({ starCount: 0 });
      })
      .catch(error => {
        console.error(error);
      });
  };
  openDialScreen(delivery) {
    console.log(delivery)
    // // delivery = dbNumber;
    // const { delivery } = this.state;
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:$' +delivery;
    } else {
      phoneNumber = 'telprompt:$' +delivery;
    }
    console.log({phoneNumber})
    Linking.openURL(phoneNumber);
  }
  render() {
    const { modalVisible } = this.state;
    const { modalVisible1 } = this.state;
    const { checked1 } = this.state;
    const { checked2 } = this.state;
    const { checked3 } = this.state;
    const { checked4 } = this.state;
    return (
      <View style={styles.container}>
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
              onPress={() => this.props.navigation.navigate('OrderHistory')}
            />
          </View>
          <View style={[styles.centerElement, { height: 50 }]}>
            <Text
              style={{
                fontSize: 15,
                color: LocalConfig.COLOR.UI_COLOR,
                marginLeft: '25%',
                fontFamily: 'verdanab',
              }}>
              ORDER STATUS{' '}
            </Text>
          </View>
        </View>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.data}
          key={index => index}
          renderItem={({ item }) => (
            <SafeAreaView style={{ flex: 1 }}>
              <View key={item.item_order}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: LocalConfig.COLOR.BLACK_LIGHT }}>
                      Order Placed
                    </Text>
                    <Icon
                      name={'md-cart'}
                      size={20}
                      color={
                        item.order_status == 'Activate'
                          ? LocalConfig.COLOR.BLACK
                          : LocalConfig.COLOR.UI_COLOR_LITE
                      }
                      style={{
                        padding: 7,
                        margin: 5,
                        backgroundColor:
                          item.order_status == 'Activate'
                            ? LocalConfig.COLOR.UI_COLOR
                            : LocalConfig.COLOR.BLACK,
                        borderRadius: 20,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: LocalConfig.COLOR.BLACK_LIGHT }}>
                      Preparing
                    </Text>
                    <MaterialCommunityIcons
                      name={'food'}
                      size={20}
                      color={
                        item.order_status == 'preparing'
                          ? LocalConfig.COLOR.BLACK
                          : LocalConfig.COLOR.UI_COLOR_LITE
                      }
                      style={{
                        padding: 7,
                        margin: 5,
                        backgroundColor:
                          item.order_status == 'preparing'
                            ? LocalConfig.COLOR.UI_COLOR
                            : LocalConfig.COLOR.BLACK,
                        borderRadius: 20,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: LocalConfig.COLOR.BLACK_LIGHT }}>
                      Dispatching
                    </Text>
                    <Icon
                      name={'ios-bicycle'}
                      size={20}
                      color={
                        item.order_status == 'Delivered' ||
                          item.order_status == 'In Pickup'
                          ? LocalConfig.COLOR.BLACK
                          : LocalConfig.COLOR.UI_COLOR_LITE
                      }
                      style={{
                        padding: 7,
                        margin: 5,
                        backgroundColor:
                          item.order_status == 'Delivered' ||
                            item.order_status == 'In Pickup'
                            ? LocalConfig.COLOR.UI_COLOR
                            : LocalConfig.COLOR.BLACK,
                        borderRadius: 20,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: LocalConfig.COLOR.BLACK_LIGHT }}>
                      Delivered
                    </Text>
                    <Icon
                      name={'home'}
                      size={20}
                      color={
                        item.order_status == 'Delete'
                          ? LocalConfig.COLOR.BLACK
                          : LocalConfig.COLOR.UI_COLOR_LITE
                      }
                      style={{
                        padding: 7,
                        margin: 5,
                        backgroundColor:
                          item.order_status == 'Delete'
                            ? LocalConfig.COLOR.UI_COLOR
                            : LocalConfig.COLOR.BLACK,
                        borderRadius: 20,
                      }}
                    />
                  </View>
                </View>
                <View style={styles.listItem}>
                  <View>
                    <View style={{ marginBottom: '5%' }}>
                      <Text
                        style={{
                          color: LocalConfig.COLOR.WHITE,
                          fontSize: 12,
                          marginLeft: '33%',
                          letterSpacing: 0.5,
                          fontFamily: 'verdanab',
                        }}>
                        ORDER DETAILS
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          width: '100%',
                          height: 1,
                          backgroundColor: LocalConfig.COLOR.BLACK,
                          marginTop: -10,
                          marginBottom: 10,
                        }}
                      />
                    </View>
                    <View flexDirection="row" style={{ width: '95%' }}>
                      <Text
                        style={{
                          color: LocalConfig.COLOR.WHITE_LIGHT,
                          fontSize: 12,
                          marginBottom: 10,
                          width: '70%',
                          fontFamily: 'Proxima Nova Font',
                        }}>
                        Order Type
                      </Text>
                      <Text
                        style={{
                          color: LocalConfig.COLOR.WHITE_LIGHT,
                          fontSize: 12,
                          marginBottom: 10,
                          fontFamily: 'Proxima Nova Font',
                        }}>
                        {this.state.data[0].addr != ''
                          ? 'Delivery'
                          : 'Self Pickup'}
                          
                      </Text>
                    </View>
                    <Dash
                      dashGap={5}
                      dashThickness={0.8}
                      dashColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                      style={{ width: '99%', height: 3, marginTop: '1%' }}
                    />
                    {item.menu.map((item, index) => (
                      <View
                        style={{ flexDirection: 'row', width: '95%' }}
                        key={index}>
                        <Text
                          style={{
                            color: item.ItemTotalPrice == "0" ? LocalConfig.COLOR.UI_COLOR : LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 10,
                            marginTop: 10,
                            width: '70%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {item.ItemName}
                        </Text>
                        <Text
                          style={{
                            color: item.ItemTotalPrice == "0" ? LocalConfig.COLOR.UI_COLOR : LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 10,
                            marginTop: 10,
                            width: '10%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {item.ItemQty}
                        </Text>
                        {!this.state.espstatus && (
                          <Text
                            style={{
                              color: item.ItemTotalPrice == "0" ? LocalConfig.COLOR.UI_COLOR : LocalConfig.COLOR.WHITE_LIGHT,
                              fontSize: 12,
                              marginBottom: 10,
                              marginTop: 10,
                              fontFamily: 'Proxima Nova Font',
                            }}>
                            {item.ItemTotalPrice == "0" ? "Free" : `\u20B9 ${item.ItemTotalPrice}`}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
                {!this.state.espstatus && (
                  <View
                    style={{
                      width: '90%',
                      justifyContent: 'center',
                      marginTop: '5%',
                      marginLeft: '5%',
                      backgroundColor: LocalConfig.COLOR.BLACK,
                    }}
                    surfaceColor="#fff"
                    contentContainerStyle={{
                      height: 220,
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <View style={{ marginBottom: '5%', marginTop: '5%' }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE,
                            fontSize: 12,
                            marginLeft: '33%',
                            letterSpacing: 0.5,
                            fontFamily: 'verdanab',
                          }}>
                          PAYMENT DETAILS
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: 1,
                          backgroundColor: LocalConfig.COLOR.BLACK,
                          marginTop: '-4%',
                          marginBottom: 10,
                        }}
                      />
                      <View flexDirection="row" style={{ width: '100%' }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 7,
                            width: '70%',
                            marginLeft: '3%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          Subtotal
                        </Text>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 7,
                            marginLeft: '5%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {'\u20B9'} {parseFloat(item.subtot).toFixed(2)}
                        </Text>
                      </View>
                      <View flexDirection="row" style={{ width: '100%' }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            width: '70%',
                            marginLeft: '3%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          Tax
                        </Text>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            marginLeft: '5%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {'\u20B9'} {parseFloat(item.tax).toFixed(2)}
                        </Text>
                      </View>
                      <View flexDirection="row" style={{ width: '100%' }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            width: '70%',
                            marginLeft: '3%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          Delivery Charge
                        </Text>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            marginLeft: '5%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {'\u20B9'}
                          {parseFloat(item.dc).toFixed(2)}
                        </Text>
                      </View>
                      <View flexDirection="row" style={{ width: '100%' }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            width: '70%',
                            marginLeft: '3%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          Packaging Charge
                        </Text>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            marginLeft: '5%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {'\u20B9'}
                          {parseFloat(item.pc).toFixed(2)}
                        </Text>
                      </View>
                      <View flexDirection="row" style={{ width: '100%' }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            width: '70%',
                            marginLeft: '3%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          Discount
                        </Text>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            marginLeft: '5%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {'\u20B9'} {parseFloat(item.discount).toFixed(2)}
                        </Text>
                      </View>
                      <View flexDirection="row" style={{ width: '100%' }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            width: '70%',
                            marginLeft: '3%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          Tips
                        </Text>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: 5,
                            marginTop: 10,
                            marginLeft: '5%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {'\u20B9'} {parseFloat(item.tips).toFixed(2)}
                        </Text>
                      </View>
                      <Dash
                        dashGap={5}
                        dashThickness={0.8}
                        dashColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                        style={{ width: '99%', height: 3, marginTop: '1%' }}
                      />
                      <View flexDirection="row" style={{ width: '100%' }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: '5%',
                            marginTop: 10,
                            width: '75%',
                            marginLeft: '3%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          Total Price
                        </Text>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            fontSize: 12,
                            marginBottom: '5%',
                            marginTop: 10,
                            marginLeft: '1%',
                            fontWeight: 'bold',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {'\u20B9'}{' '}
                          {parseFloat(item.subtot) +
                            parseFloat(item.tax) +
                            parseFloat(item.dc) +
                            parseFloat(item.pc) +
                            parseFloat(item.tips) -
                            parseFloat(item.discount)}
                        </Text>
                        <Text style={{ color: '#ffffff', fontSize: 0 }}>
                          {(this.state.pay_id = item.pay_id)}
                        </Text>
                        <Text style={{ color: '#ffffff', fontSize: 0 }}>
                          {(this.state.delivery = item.delivery_boy_number)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                {/* {item.status_name != 'Cancelled' && ( */}
                {false && (
                  <TouchableOpacity
                    style={styles.once_again}
                    onPress={() => {
                      this.reorderItem(this.state.order_no);
                    }}>
                    <Text style={styles.once_again_Text}>Reorder</Text>
                  </TouchableOpacity>
                )}
                <Text style={{ color: '#ffffff', fontSize: 0 }}>
                  {(this.state.pay_id = item.pay_id)}
                </Text>
                {item.order_status == 'Activate' && (
                  <View>
                    <TouchableOpacity
                      style={{
                        width: '40%',
                        marginLeft: '55%',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 9,
                        marginTop: '5%',
                      }}
                      onPress={() => this.cancelorder()}>
                      <Text
                        style={{
                          marginTop: '3%',
                          textAlign: 'center',
                          marginBottom: '3%',
                          color: LocalConfig.COLOR.BLACK,
                          fontFamily: 'verdanab',
                          fontSize: 12,
                        }}>
                        CANCEL ORDER
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {(item.order_status == 'In Pickup' ||
                  item.order_status == 'Delivered') && <View>
                    <TouchableOpacity
                      style={{
                        width: '40%',
                        marginLeft: '55%',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 9,
                        marginTop: '5%',
                      }}
                      onPress={() => this.openDialScreen(item.delivery_boy_number)}>
                      <Text
                        style={{
                          marginTop: '3%',
                          textAlign: 'center',
                          marginBottom: '3%',
                          color: LocalConfig.COLOR.BLACK,
                          fontFamily: 'verdanab',
                          fontSize: 12,
                        }}>
                        CALL{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
                {item.order_status == 'Delete' && (
                  <View>
                    <TouchableOpacity
                      style={{
                        width: '40%',
                        marginLeft: '55%',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 9,
                        marginTop: '5%',
                      }}
                      onPress={() => this.setModalVisible1()}>
                      <Text
                        style={{
                          marginTop: '3%',
                          textAlign: 'center',
                          marginBottom: '3%',
                          color: '#fff',
                          fontFamily: 'verdanab',
                          fontSize: 12,
                        }}>
                        Feedback{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {item.order_status == 'Cancelled' && (
                  <View>
                    <TouchableOpacity
                      style={{
                        width: '40%',
                        marginLeft: '29%',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 9,
                        marginTop: '10%',
                      }}>
                      <Text
                        style={{
                          marginTop: '3%',
                          textAlign: 'center',
                          marginBottom: '3%',
                          color: '#fff',
                          fontFamily: 'verdanab',
                          fontSize: 12,
                        }}>
                        Order cancelled{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {item.order_status == 'Delete' && item.countfeed == 0 && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible1}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    this.setModalVisible1(!modalVisible1);
                  }}>
                  <BlurView
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                    }}
                    blurType="dark"
                    blurAmount={6}
                    reducedTransparencyFallbackColor="white"
                  />
                  <View
                    style={{
                      height: '100%',
                      marginTop: 'auto',
                      backgroundColor: LocalConfig.COLOR.BLACK,
                    }}>
                    <View style={{ flexDirection: 'column' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: LocalConfig.COLOR.UI_COLOR,
                          marginBottom: '2%',
                        }}>
                        <View>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 14,
                              fontFamily: 'verdanab',
                              padding: '5%',
                              letterSpacing: 0.3,
                            }}>
                            Review
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ modalVisible1: false });
                          }}>
                          <View
                            style={{
                              color: '#2b2d42',
                              fontSize: 15,
                              padding: '6%',
                              marginLeft: '65%',
                            }}>
                            <MaterialIcons
                              name="close"
                              size={25}
                              color="#fff"
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
                    <View
                      style={{
                        height: '100%',
                        alignItems: 'center',
                        flexDirection: 'column',
                        marginTop: 20,
                      }}>
                      <Text
                        style={{
                          color: '#2b2d42',
                          fontSize: 15,
                          marginTop: 6,
                          letterSpacing: 0.8,
                          fontFamily: 'Proxima Nova Font',
                        }}>
                        Rate our delivery
                      </Text>
                      <View
                        style={{
                          marginTop: '2%',
                          marginBottom: '10%',
                        }}>
                        <AirbnbRating
                          selectedColor={LocalConfig.COLOR.UI_COLOR}
                          count={5}
                          reviews={[
                            'BAD',
                            'POOR',
                            'AVERAGE',
                            'GOOD',
                            'EXCELLENT',
                          ]}
                          defaultRating={0}
                          reviewColor={LocalConfig.COLOR.UI_COLOR}
                          reviewSize={15}
                          size={35}
                          unSelectedColor="#edf2f4"
                          onFinishRating={rating => this.setState({ rating })}
                        />
                      </View>
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={'Feedback'}
                        placeholderTextColor={'#adb5bd'}
                        maxLength={50}
                        multiline={true}
                        ref={this.myTextInput}
                        onChangeText={msg => this.setState({ msg })}
                        style={{
                          textAlign: 'center',
                          borderWidth: 0.5,
                          width: '80%',
                          borderColor: '#adb5bd',
                          borderRadius: 7,
                          backgroundColor: LocalConfig.COLOR.BLACK,
                          height: 160,
                          color: LocalConfig.COLOR.BLACK,
                          marginBottom: '6%',
                        }}
                      />
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: '60%',
                          borderRadius: 16,
                          backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        }}
                        onPress={() => Alert.alert('Thanks for your Feedback')}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 16,
                            textAlign: 'center',
                            marginTop: '3%',
                            fontFamily: 'verdanab',
                          }}
                          onPress={this.InsertDataToServer2}>
                          SUBMIT
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            </SafeAreaView>
          )}
          keyExtractor={item => item.item_order}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            this.setModalVisible(!modalVisible);
          }}>
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            blurType="dark"
            blurAmount={6}
            reducedTransparencyFallbackColor="white"
          />
          <View
            style={{
              height: '47%',
              marginTop: 'auto',
              backgroundColor: LocalConfig.COLOR.BLACK,
              borderRadius: 20,
            }}>
            <View style={{ flexDirection: 'column' }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  marginBottom: '2%',
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                }}>
                <View>
                  <Text
                    style={{
                      color: LocalConfig.COLOR.BLACK,
                      fontSize: 14,
                      fontFamily: 'verdanab',
                      padding: '5%',
                      letterSpacing: 0.3,
                    }}>
                    Cancel Reason
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <View
                    style={{
                      color: '#2b2d42',
                      fontSize: 15,
                      padding: '6%',
                      marginLeft: '53%',
                    }}>
                    <MaterialIcons name="close" size={25} color={LocalConfig.COLOR.BLACK} />
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
            <ScrollView>
              <View flexDirection="row">
                {checked1 ? (
                  <Checkbox
                    color={LocalConfig.COLOR.UI_COLOR}
                    status={checked1 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      //{ this.setState({checked1: !checked1 }); }}
                      this.setState({ checked1: false });
                      this.setState({ reason: '' });
                    }}
                    uncheckedColor={
                      LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                    }
                    tintColors={{
                      true: LocalConfig.COLOR.UI_COLOR,
                      false: LocalConfig.COLOR.UI_COLOR,
                    }}
                  />
                ) : (
                  <Checkbox
                    color={LocalConfig.COLOR.UI_COLOR}
                    status={checked1 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      //{ this.setState({checked1: !checked1 }); }}
                      this.setState({ checked1: true });
                      this.setState({ checked2: false });
                      this.setState({ checked3: false });
                      this.setState({ checked4: false });
                      this.setState({ reason: 'Expected order time changed' });
                    }}
                    uncheckedColor={
                      LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                    }
                    tintColors={{
                      true: LocalConfig.COLOR.UI_COLOR,
                      false: LocalConfig.COLOR.UI_COLOR,
                    }}
                  />
                )}
                <Text
                  style={{
                    marginTop: '3%',
                    fontFamily: 'Proxima Nova Font',
                    color: LocalConfig.COLOR.WHITE,
                  }}>
                  Expected Order Time changed
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                  borderBottomWidth: 0.5,
                  marginTop: '1%',
                  marginBottom: '2%',
                }}
              />
              <View flexDirection="row">
                {checked2 ? (
                  <Checkbox
                    color={LocalConfig.COLOR.UI_COLOR}
                    status={checked2 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      //{ this.setState({checked1: !checked1 }); }}
                      this.setState({ checked2: false });
                      this.setState({ reason: '' });
                    }}
                    uncheckedColor={
                      LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                    }
                    tintColors={{
                      true: LocalConfig.COLOR.UI_COLOR,
                      false: LocalConfig.COLOR.UI_COLOR,
                    }}
                  />
                ) : (
                  <Checkbox
                    color={LocalConfig.COLOR.UI_COLOR}
                    status={checked2 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      //{ this.setState({checked1: !checked1 }); }}
                      this.setState({ checked2: true });
                      this.setState({ checked1: false });
                      this.setState({ checked3: false });
                      this.setState({ checked4: false });
                      this.setState({ reason: 'Expected item changed' });
                    }}
                    uncheckedColor={
                      LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                    }
                    tintColors={{
                      true: LocalConfig.COLOR.UI_COLOR,
                      false: LocalConfig.COLOR.UI_COLOR,
                    }}
                  />
                )}
                <Text
                  style={{
                    marginTop: '3%',
                    fontFamily: 'Proxima Nova Font',
                    color: LocalConfig.COLOR.WHITE,
                  }}>
                  Expected Item Changed
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: '#dee2e6',
                  borderBottomWidth: 0.5,
                  marginTop: '1%',
                  marginBottom: '2%',
                }}
              />
              <View flexDirection="row">
                {checked3 ? (
                  <Checkbox
                    color={LocalConfig.COLOR.UI_COLOR}
                    status={checked3 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      //{ this.setState({checked1: !checked1 }); }}
                      this.setState({ checked3: false });
                      this.setState({ reason: '' });
                    }}
                    uncheckedColor={
                      LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                    }
                    tintColors={{
                      true: LocalConfig.COLOR.UI_COLOR,
                      false: LocalConfig.COLOR.UI_COLOR,
                    }}
                  />
                ) : (
                  <Checkbox
                    color={LocalConfig.COLOR.UI_COLOR}
                    status={checked3 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      //{ this.setState({checked1: !checked1 }); }}
                      this.setState({ checked3: true });
                      this.setState({ checked1: false });
                      this.setState({ checked2: false });
                      this.setState({ checked4: false });
                      this.setState({ reason: 'Address wrong' });
                    }}
                    uncheckedColor={
                      LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                    }
                    tintColors={{
                      true: LocalConfig.COLOR.UI_COLOR,
                      false: LocalConfig.COLOR.UI_COLOR,
                    }}
                  />
                )}
                <Text
                  style={{
                    marginTop: '3%',
                    fontFamily: 'Proxima Nova Font',
                    color: LocalConfig.COLOR.WHITE,
                  }}>
                  Wrong Address
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: '#dee2e6',
                  borderBottomWidth: 0.5,
                  marginTop: '1%',
                  marginBottom: '2%',
                }}
              />
              <View flexDirection="row">
                {checked4 ? (
                  <Checkbox
                    color={LocalConfig.COLOR.UI_COLOR}
                    status={checked4 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      //{ this.setState({checked1: !checked1 }); }}
                      this.setState({ checked4: false });
                      this.setState({ reason: '' });
                    }}
                    uncheckedColor={
                      LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                    }
                    tintColors={{
                      true: LocalConfig.COLOR.UI_COLOR,
                      false: LocalConfig.COLOR.UI_COLOR,
                    }}
                  />
                ) : (
                  <Checkbox
                    color={LocalConfig.COLOR.UI_COLOR}
                    status={checked4 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      //{ this.setState({checked1: !checked1 }); }}
                      this.setState({ checked4: true });
                      this.setState({ checked1: false });
                      this.setState({ checked2: false });
                      this.setState({ checked3: false });
                      this.setState({ reason: 'other' });
                    }}
                    uncheckedColor={
                      LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                    }
                    tintColors={{
                      true: LocalConfig.COLOR.UI_COLOR,
                      false: LocalConfig.COLOR.UI_COLOR,
                    }}
                  />
                )}
                <Text
                  style={{
                    marginTop: '3%',
                    fontFamily: 'Proxima Nova Font',
                    color: LocalConfig.COLOR.WHITE,
                  }}>
                  Other
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: '#dee2e6',
                  borderBottomWidth: 0.5,
                  marginTop: '1%',
                  marginBottom: '2%',
                }}
              />
              <View>
                <TouchableOpacity
                  style={{
                    height: 45,
                    width: '60%',
                    borderRadius: 9,
                    backgroundColor: LocalConfig.COLOR.UI_COLOR,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '5%',
                    marginLeft: '20%',
                    marginBottom: 20,
                  }}
                  onPress={() =>
                  // this.setModalVisible(!modalVisible)}
                  {
                    if (
                      (checked1 === false) &
                      (checked2 === false) &
                      (checked3 === false) &
                      (checked4 === false)
                    ) {
                      Alert.alert('please select reason');
                    } else {
                      this.InsertDataToServer();
                    }
                  }
                  }>
                  <Text
                    style={{
                      color: LocalConfig.COLOR.BLACK,
                      fontSize: 13,
                      textAlign: 'center',
                      marginTop: '1%',
                      fontFamily: 'verdanab',
                    }}>
                    SUBMIT
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}
const theme = {
  colors: {
    primary: '#284b63',
  },
};
const styles = StyleSheet.create({
  centerElement: { justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    backgroundColor: LocalConfig.COLOR.BLACK,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  listItem: {
    margin: '1%',
    padding: '2.5%',
    backgroundColor: LocalConfig.COLOR.BLACK,
    width: '90%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#f2f2f2',
    shadowColor: '#f4f4f4',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.41,
    elevation: 5,
  },
  listItem1: {
    margin: '1%',
    padding: '2.5%',
    backgroundColor: '#ffffff',
    width: '90%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#f2f2f2',
    shadowColor: '#f4f4f4',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    marginTop: '5%',
    shadowOpacity: 0.2,
    shadowRadius: 2.41,
    elevation: 5,
  },
  once_again: {
    flex: 1,
    backgroundColor: LocalConfig.COLOR.UI_COLOR,
    padding: '2%',
    width: '30%',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 20,
    margin: '5%',
  },
  once_again_Text: {
    color: LocalConfig.COLOR.BLACK,
    fontWeight: 'bold',
  },
});
