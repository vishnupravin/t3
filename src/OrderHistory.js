import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  ImageBackground,
  ToastAndroid,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Button, Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dash from 'react-native-dash';
import Icon from 'react-native-vector-icons/Ionicons';
import sqlservice from './sql';
import LocalConfig from '../LocalConfig';
let sql;
export default class OrderHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      query: '',
      dataSource: [],
      uid: '',
      bid: '',
      espstatus: false,
      reorderItemLoading: false,
    };
    sql = new sqlservice();
  }
  componentDidMount() {
    this.getKey();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getKey();
    });
  }
  getKey = async () => {
    try {
      const key = await AsyncStorage.getItem('user_id');
      const key3 = await AsyncStorage.getItem('branch_id');
      this.setState({ uid: key, bid: key3 });
      this.View();
    } catch (error) { }
  };
  async View() {
    const user = await AsyncStorage.getItem('user_id');
    const esp = (await AsyncStorage.getItem('espstatus')) == 'true';
    this.setState({ espstatus: esp });
    fetch(
      `${LocalConfig.API_URL}admin/api/order_history.php?user_id=` +
      this.state.uid +
      '&&bid=' +
      this.state.bid,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: responseJson.order,
        });
      });
  }
  async reorderItem(item) {
    const API =
      `${LocalConfig.API_URL}admin/api/order_details.php?order_id=` +
      item.order_no;
    let someDate = new Date();
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
        this.props.navigation.navigate('HomeScreen', { orderno: item.order_no });
      });
  }
  render() {
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
                fontFamily: 'verdanab',
                marginLeft: '30%',
              }}>
              ORDER HISTORY
            </Text>
          </View>
        </View>
        {this.state.dataSource == 'No record Found' ? (
          <View
            style={{
              flex: 1,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}>
            <View
              style={{
                borderRadius:
                  Math.round(
                    Dimensions.get('window').width +
                    Dimensions.get('window').height,
                  ) / 2,
                width: Dimensions.get('window').width * 1,
                height: Dimensions.get('window').width * 1,
                backgroundColor: LocalConfig.COLOR.BLACK,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                style={{
                  marginTop: '1%',
                  height: 190,
                  alignSelf: 'stretch',
                  width: '100%',
                }}
                source={require('../assests/cart.jpg')}
                resizeMode="center"
              />
              <Text
                style={{
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: 'ProximaBold',
                  marginBottom: '5%',
                  fontSize: 16,
                }}>
                {' '}
                We Will Meet You With Fresh Meat....
              </Text>
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE,
                  fontFamily: 'Proxima Nova Font',
                  marginBottom: '0.5%',
                  fontSize: 13,
                }}>
                No Recent orders Yet !
              </Text>
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE,
                  fontFamily: 'Proxima Nova Font',
                  marginBottom: '2%',
                  fontSize: 13,
                }}>
                Let's Taste somthing on the Door
              </Text>
              <Button
                style={{
                  marginTop: '3%',
                  marginLeft: '5%',
                  marginRight: '5%',
                  borderColor: LocalConfig.COLOR.WHITE,
                }}
                mode="outlined"
                title="BROWSE MENU"
                color={LocalConfig.COLOR.UI_COLOR}
                onPress={() => this.props.navigation.navigate('CartScreen')}>
                <Text
                  style={{
                    color: LocalConfig.COLOR.UI_COLOR,
                    fontSize: 13,
                    fontFamily: 'verdanab',
                  }}>
                  CHECK CART
                </Text>
              </Button>
            </View>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1, marginTop: '4%' }}
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('OrderHistory2', {
                      order_no: item.order_no,
                    })
                  }>
                  <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.listItem}>
                      <View
                        style={{
                          alignItems: 'baseline',
                          flex: 1,
                          marginBottom: '1%',
                          padding: '1%',
                        }}>
                        <View flexDirection="row">
                          <Text>
                            <Text style={styles.textStyleFlatList}>
                              Order No :{' '}
                            </Text>
                            <Text style={styles.textStyleFlatList}>
                              {' '}
                              {`${item.order_no}`}
                            </Text>
                          </Text>
                          <View style={{ marginLeft: '45%' }}>
                            <Text>
                              <Text style={styles.textStyleFlatList}>
                                No of Items :{' '}
                              </Text>
                              <Text
                                style={
                                  styles.textStyleFlatList
                                }>{`${item.items}`}</Text>
                            </Text>
                          </View>
                        </View>
                        <Dash
                          dashGap={5}
                          dashThickness={1}
                          dashColor={LocalConfig.COLOR.UI_COLOR}
                          style={{
                            width: '100%',
                            height: 1,
                            marginTop: '2%',
                            marginBottom: '2%',
                          }}
                        />
                        <Text style={{ marginTop: '1%' }}>
                          <Text style={styles.textStyleFlatList}>
                            Date : {`${item.date}`}
                          </Text>
                        </Text>
                        <Text style={{ marginTop: '1%' }}>
                          <Text style={styles.textStyleFlatList}>
                            Branch : {`${item.bname}`}
                          </Text>
                        </Text>

                        {!this.state.espstatus && (
                          <Text style={{ marginTop: '1%' }}>
                            <Text style={styles.textStyleFlatList}>
                              Order Amount : {'\u20B9'} {`${item.total_amount}`}
                            </Text>
                          </Text>
                        )}
                        <View flexDirection="row">
                          <Text
                            style={{
                              color: LocalConfig.COLOR.WHITE,
                              fontSize: 13,
                              marginTop: '1%',
                              width: '90%',
                              fontFamily: 'Proxima Nova Font',
                            }}>
                            Order Status : {`${item.status}`}{' '}
                          </Text>
                          {item.status == 'Order is Dispatched' && (
                            <Icon
                              name="ios-bicycle-sharp"
                              size={25}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          )}
                          {item.status == 'Payment Failed' && (
                            <Icon
                              name="close-circle"
                              size={25}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          )}
                          {item.status == 'Order not assigned' && (
                            <Icon
                              name="reload-circle"
                              size={25}
                              color="green"
                            />
                          )}
                          {item.status == 'Payment Pending' && (
                            <Icon
                              name="close-circle"
                              size={25}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          )}
                          {item.status == 'Order cancelled' && (
                            <Icon
                              name="close-circle"
                              size={25}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          )}
                          {item.status == 'Order Paid' && (
                            <Icon
                              name="checkmark-circle-sharp"
                              size={25}
                              color="green"
                            />
                          )}
                          {item.status == 'Order is Delivered' && (
                            <Icon
                              name="checkmark-circle-sharp"
                              size={25}
                              color="green"
                            />
                          )}
                          {item.status == 'Order assigned' && (
                            <Icon
                              name="checkmark-circle-sharp"
                              size={25}
                              color="#FFC107"
                            />
                          )}
                          {item.status == 'Order rejected' && (
                            <Icon
                              name="close-circle"
                              size={25}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          )}
                          {item.status == 'Order is preparing' && (
                            <Icon
                              name="restaurant"
                              size={25}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          )}
                          {/* etc. */}
                        </View>
                        {/* {item.status != 'Order cancelled' && ( */}
                        {false && (
                          <TouchableOpacity
                            style={styles.once_again}
                            onPress={() => {
                              this.setState({ reorderItemLoading: true });
                              this.reorderItem(item);
                            }}>
                            <Text style={styles.once_again_Text}>Reorder</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </SafeAreaView>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.order_no}
          />
        )}
        <Modal
          transparent={true}
          animationType={'none'}
          visible={this.state.reorderItemLoading}>
          <View style={styles.modalBackground}>
            {/* <View style={styles.activityIndicatorWrapper}> */}
            <ActivityIndicator
              color="#fff"
              animating={this.state.reorderItemLoading}
              size={'large'}
            />
            {/* </View> */}
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
    shadowColor: '#808080',
    marginBottom: '2%',
    elevation: 3,
  },
  once_again: {
    flex: 1,
    borderColor: LocalConfig.COLOR.UI_COLOR,
    borderWidth: 2,
    backgroundColor: LocalConfig.COLOR.BLACK,
    padding: '2%',
    width: '40%',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 10,
  },
  once_again_Text: {
    color: LocalConfig.COLOR.UI_COLOR,
    fontWeight: 'bold',
  },
  textStyleFlatList: {
    color: LocalConfig.COLOR.WHITE,
    fontSize: 13,
    fontFamily: 'Proxima Nova Font',
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
