import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
  PixelRatio,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import RNPgReactNativeSDK from 'react-native-pg-react-native-sdk'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox, Button, RadioButton } from 'react-native-paper';
import sqlservice from './sql';
import Dash from 'react-native-dash';
import RazorpayCheckout from 'react-native-razorpay';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { getPreciseDistance } from 'geolib';
import CheckBox from '@react-native-community/checkbox';
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSmsRetriever, { requestPhoneNumber } from 'react-native-sms-retriever';
import RNOtpVerify from 'react-native-otp-verify';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { moderateScale, verticalScale } from './Dimen';
import LocalConfig from '../LocalConfig';
import { useDispatch, useSelector } from 'react-redux';
import { ToastAndroid } from 'react-native';
import RNUserIdentity from 'react-native-user-identity';
let sql;
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
const FORMATDATE = (min = 0) => {
  let formatDateLocal = new Date();
  formatDateLocal.setTime(new Date().getTime() + min * 60 * 1000);
  return formatDateLocal;
};
export default class CartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.callRef = React.createRef();
    this.state = {
      text: '',
      modalVisible: false,
      checked: false,
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      checked6: false,
      checked7: false,
      checked8: false,
      selectAll: false,
      cartItemsIsLoading: false,
      items: [],
      freeItems: [],
      subtotal: [],
      total: '',
      carddet: [],
      dataSource: [],
      cat: '',
      gst: '',
      dataSource1: [],
      promo: 0,
      modalVisible1: false,
      modalVisible2: false,
      date: new Date(),
      date1: new Date(),
      open: false,
      nameError: '',
      date2: new Date(),
      date3: '',
      user_id: '',
      name: 'default',
      email: 'test',
      address: '',
      payment_type: 'cash',
      notes: '',
      city: 'cbe',
      total_price: '',
      latlong: '',
      token_id: '',
      pay_id: 'Cash On Delivery',
      a_id: '',
      rc: 0,
      //rc:'',
      dc: 0,
      // pc:'',
      pc: 0,
      espstatus: 1,
      discount: '0',
      selftime: 'default',
      line: '',
      dataSource12: [],
      dataSource13: '',
      dataSource15: [],
      orderid: '',
      razoroid: '',
      razorpayid: '',
      status: '',
      promo_id: '',
      latlong1: 0,
      date6: moment().utcOffset('+06:30').format('LT'),
      type: '',
      date7: moment().utcOffset('+05:45').format('LT'),
      selftime1: 'default1',
      check: false,
      itemname: [],
      total1: '',
      items12: [],
      modalVisible12: false,
      addon: [],
      addonitem: [],
      checked12: false,
      addonid: [],
      uid: '',
      mobile_no: '',
      tips: 0,
      tips1: '0',
      addonname: '',
      loading: false,
      bid: '',
      hotellat: [],
      hotellng: [],
      dc1: 0,
      dataSource16: [],
      home: 0,
      self: 1,
      online: 1,
      paymentGateway: [],
      selectedPaymentGateway: undefined,
      gatewayListModal: false,
      cash: 1,
      tips2: 1,
      notes2: 1,
      temp_id: [],
      temp_name: [],
      temp_price: [],
      checked18: false,
      modal18: false,
      modal19: false,
      menu: [],
      re: 0,
      loginmodal: false,
      loginemail: '',
      loginnumber: '',
      editemail: false,
      editnumber: false,
      editnotes: false,
      hash: '',
      verifymodal: false,
      otp: '',
      counter: 59,
      uid1: '',
      length: [],
      locationname: '',
      locationline: '',
      locationlatlng: '',
      locationaid: '',
      paymodal: false,
      radioid: [],
      radioname: [],
      radioprice: [],
      variant: [],
      variantid: [],
      variantname: [],
      variantprice: [],
      varid: [],
      varcheck: false,
      addresspage: 0,
      tid: 0,
      delay: 0,
      animating: true,
      // reduxSate: useSelector(state => state),
      promocode: '',
      foodTax: 5,
      taxPrice: null,
      minimumAmount: undefined,
    };
    sql = new sqlservice();
    this.refreshScreen = this.refreshScreen.bind(this);
  }
  refreshScreen() {
    this.setState(() => {
      this.componentDidMount();
    });
  }
  componentDidMount() {
    this.closeActivityIndicator();
    this.View();
    this.login();
    this.View123();
    this.getid();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.closeActivityIndicator();
      this.View();
      this.View123();
      this.getid();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  closeActivityIndicator = () =>
    setTimeout(
      () =>
        this.setState({
          animating: false,
          delay: 1,
        }),
      500,
    );
  View123 = async () => {
    const key3 = await AsyncStorage.getItem('branch_id');
    fetch(`${LocalConfig.API_URL}admin/api/menu_list.php?branch=` + key3)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ menu: responseJson.menu });
        this.initviews();
      })
      .catch();
  };
  initviews() {
    this.state.menu.map(element => {
      this.state.items.map(item => {
        var ite = [];
        for (let i = 0; i < this.state.items.length; i++) {
          if (element.id == item.item_id) {
            if (element.status == 0) {
              item.remarks = 1;
            }
          }
        }
      });
    });
  }
  View() {
    sql
      .getAllItem()
      .then(results => {
        var temp = [];
        var carddet1 = [];
        var data = results.rows.length;
        var sum = 0;
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i)),
            (sum = parseFloat(sum) + parseFloat(results.rows.item(i).total)),
            carddet1.push({
              ItemId: results.rows.item(i).item_id,
              ItemName: results.rows.item(i).item_name,
              ItemQty: results.rows.item(i).qty,
              ItemAmt: results.rows.item(i).price,
              ItemTotalPrice: results.rows.item(i).total,
              size: results.rows.item(i).remarks,
              ingredientsdetail: [results.rows.item(i).addons_id],
              variant: [results.rows.item(i).variant_id],
              freeid: results.rows.item(i).freeid,
              free_item_data: results.rows.item(i).free_item_data,
            });
        }
        sql.getAllFreeProduct()
          .then(results => {
            var freeItems = [];
            for (let i = 0; i < results.rows.length; ++i) {
              freeItems.push({
                item_name: results.rows.item(i).item_name,
                qty: results.rows.item(i).qty,
                item_id: results.rows.item(i).item_id,
                free_for_id: results.rows.item(i).free_for_id,
                free_for_name: results.rows.item(i).free_for_name,
                max_free_qty: results.rows.item(i).max_free_qty,
                min_item_qty: results.rows.item(i).min_item_qty,
                notes: results.rows.item(i).notes,
                freeid: results.rows.item(i).freeid,
              });
            }
            this.setState({ freeItems })
          })
        this.setState({
          items: temp,
          subtotal: sum,
          carddet: carddet1,
          checked1: false,
          date1: new Date(),
          date: new Date(),
          checked2: true,
          checked5: true,
          nameError: null,
          type: 'Delivery',
          latlong1: '1',
          checked1: false,
          length: data,
        });
        this.initviews();
      })
      .catch(res => {
        //alert(JSON.stringify(res))
      });
  }
  getid = async () => {
    try {
      const key = await AsyncStorage.getItem('user_id');
      const email = await AsyncStorage.getItem('mail_id');
      const key1 = await AsyncStorage.getItem('token');
      const key2 = await AsyncStorage.getItem('mobile_no');
      const key3 = await AsyncStorage.getItem('branch_id');
      const key4 = await AsyncStorage.getItem('type');
      const key5 = await AsyncStorage.getItem('a_id');
      const key6 = await AsyncStorage.getItem('line');
      const key7 = await AsyncStorage.getItem('latlng');
      AsyncStorage.getItem('esplogin').then(key => {
        this.setState({ espstatus: key == 'true' ? 1 : 0 });
      });
      this.setState({ uid: key, locationaid: key5 });
      this.setState({ email: email });
      this.setState({ token_id: key1 });
      this.setState({ mobile_no: key2 });
      this.setState({
        bid: key3,
        locationname: key4,
        locationline: key6,
        locationlatlng: key7,
      });
      this.distance();
      this.promo();
      this.status();
      this.view1();
    } catch (error) { }
  };
  distance() {
    fetch(
      `${LocalConfig.API_URL}admin/api/get_fssai.php?flag=4&&branch=` +
      this.state.bid,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          hotellat: responseJson.data.lat,
          hotellng: responseJson.data.lng,
        });
        this.dc();
      })
      .catch();
  }
  promo() {
    const API = `${LocalConfig.API_URL}admin/api/get_coupon.php?bid=` + this.state.bid;
    fetch(API)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource1: responseJson.promo,
        });
      })
      .catch(error => null); //to catch the errors if any
  }
  status() {
    const API = `${LocalConfig.API_URL}admin/api/status_all.php?bid=` + this.state.bid
    fetch(
      API,
    )
      .then(response => response.json())
      .then(responseJson => {
        let payments = []
        responseJson.status.map((item, index) => {
          if (item.status_name == 'tax')
            this.setState({ foodTax: responseJson.status[index].tax })
          if (item.status_name == 'self_pickup' && item.status == 1 && this.state.home == 0)
            this.setState({ checked1: true, checked2: false, checked3: true, type: 'Self Pickup' })
          if (item.status_name == 'home_delivery' && item.status == 1) this.setState({ checked1: false, checked2: true, checked5: true, type: 'Delivery', home: 1 });
          if (item.status_name == 'onlinpayment')
            this.setState({ online: responseJson.status[index].status });
          if (item.status_name == 'cashon')
            this.setState({ online: responseJson.status[index].status });
          if (item.status_name == 'min_amount')
            this.setState({
              minimumAmount: parseFloat(responseJson.status[index].min_amount),
            });
          if (item.status_name == 'tips' && item.status == 1) this.setState({ tips2: 1 })
          if (item.status_name == 'notes' && item.status == 1) this.setState({ notes2: 1 })
          if (item.status_name == 'razorpay' && item.status == 1) {
            payments.push('razorpay')
          }
          if (item.status_name == 'cashfree' && item.status == 1) {
            payments.push('cashfree')
          }
        })
        this.setState({
          dataSource16: responseJson.status, paymentGateway: payments
        });
      })
      .catch(error => null); //to catch the errors if any
  }
  view1() {
    fetch(
      `${LocalConfig.API_URL}admin/api/deliverycharge.php?bid=` +
      this.state.bid,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource12: responseJson.charge,
        });
      })
      .catch(error => null); //to catch the errors if any
  }
  InsertDataToServer = () => {
    const { name } = this.state;
    const { email } = this.state;
    //const {params} =this.props.route
    const { payment_type } = this.state;
    const { notes } = this.state;
    const { city } = this.state;
    let normalItems = this.state.carddet;
    let freeItems = this.state.freeItems
    let newCredit = { Order: [] };
    let FreeForAdded = []
    normalItems.map(normalItem => {
      let tempObj = {};
      tempObj.ItemId = normalItem.ItemId
      tempObj.ItemName = normalItem.ItemName
      tempObj.ItemQty = normalItem.ItemQty
      tempObj.ItemAmt = normalItem.ItemAmt
      tempObj.ItemTotalPrice = normalItem.ItemTotalPrice
      tempObj.ingredientsdetail = normalItem.ingredientsdetail
      tempObj.size = normalItem.size
      tempObj.variant = normalItem.variant
      tempObj.ItemDiscount = 0
      tempObj.flatappid = null
      tempObj.buyyapppid = "0"
      newCredit.Order.push(tempObj)
      freeItems.map(freeItem => {
        if (normalItem.ItemId == freeItem.free_for_id && !FreeForAdded.includes(freeItem.free_for_id)) {
          let tempObj = {};
          tempObj.ItemId = freeItem.item_id
          tempObj.ItemName = freeItem.item_name
          tempObj.ItemQty = freeItem.qty
          tempObj.ItemAmt = "0"
          tempObj.ItemTotalPrice = "0"
          tempObj.ingredientsdetail = ["0"]
          tempObj.size = "0"
          tempObj.variant = ["0"]
          tempObj.ItemDiscount = 0
          tempObj.flatappid = null
          tempObj.buyyapppid = "0"
          FreeForAdded.push(freeItem.free_for_id)
          newCredit.Order.push(tempObj)
        }
      })
    })
    const food_desc = encodeURIComponent(JSON.stringify(newCredit));
    const { total_price } = this.state;
    const { token_id } = this.state;
    const tk1 = encodeURIComponent(token_id);
    const { pay_id } = this.state;
    const latlong = this.state.latlong1 == 1 ? this.state.locationlatlng : '0';
    const address = this.state.latlong1 == 1 ? this.state.locationaid : '00';
    const a_id = this.state.latlong1 == 1 ? this.state.locationaid : '00';
    const { rc } = this.state;
    const { dc } = this.state;
    const { pc } = this.state;
    const { discount } = this.state;
    const { selftime } = this.state;
    const { tips } = this.state;
    const { bid, foodTax } = this.state;
    const API = `${LocalConfig.API_URL}admin/api/food_order.php?user_id=` + this.state.uid + '&&name=' + name + '&&email=' + email + '&&address=' + address + '&&payment_type=' + payment_type + '&&notes=' + notes + '&&city=' + city + '&&food_desc=' + food_desc + '&&total_price=' + total_price + '&&latlong=' + latlong + '&&token_id=' + tk1 + '&&pay_id=' + pay_id + '&&a_id=' + a_id + '&&rc=' + rc + '&&dc=' + dc + '&&pc=' + pc + '&&discount=' + discount + '&&selftime=' + selftime + '&&tips=' + tips + '&&bid=' + bid + "&food_tax=" + foodTax
    if (true) {
      fetch(
        API,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.state.uid,
            name: name,
            email: email,
            address: address,
            payment_type: payment_type,
            notes: notes,
            city: city,
            food_desc: food_desc,
            total_price: total_price,
            latlong: latlong,
            token_id: tk1,
            pay_id: pay_id,
            a_id: a_id,
            rc: rc,
            dc: dc,
            pc: pc,
            discount: discount,
            selftime: selftime,
            tips: tips,
          }),
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.success == 'Success') {
            if (responseJson.order_id) {
              this.state.orderid = responseJson.order_id;
              if (payment_type == 'card') {
                this.setState({ pay_id: 'payconnecting', loading: true });
                this.getorderid();
              } else {
                sql
                  .deleteallrows()
                  .then(res => { })
                  .catch(err => { });
                if (this.state.promo !== 0) {
                  sql.getpromousedusers(this.state.promo_id).then(res1 => {
                    var used = parseFloat(res1.rows.item(0).used_users) + 1;
                    //alert(this.promodata.promo_id);
                    if (used == 0) {
                      used = 1;
                    }
                    sql
                      .updatepromo(used, this.state.promo_id)
                      .then(res => { })
                      .catch(err => {
                        alert(JSON.stringify(err));
                      });
                  });
                }
                this.setState({ delay: 0 });
                let delitime;
                if (this.state.type == 'Self Pickup') {
                  delitime = this.state.selftime1;
                } else {
                  delitime = this.state.selftime;
                }
                this.setState({ checked1: false, checked7: false });
                this.props.navigation.navigate('OrderFinish', {
                  orderid: this.state.orderid,
                  type: this.state.type,
                  deltime: delitime.toString(),
                });
              }
            }
          }
        })
        .catch(error => {
        });
    }
  };
  dc = async () => {
    var key = await AsyncStorage.getItem('latlng');
    if (key !== null) {
      var latlng = key !== null ? key.split(',') : key;
      const lat = latlng !== null ? latlng[0] : '50.0878730';
      const log = latlng !== null ? latlng[1] : ' 77.0330790';
      const dis = getPreciseDistance(
        { latitude: lat, longitude: log },
        {
          latitude: Number(this.state.hotellat),
          longitude: Number(this.state.hotellng),
        },
      );
      const dis1 = dis / 1000;
      const dis2 = Math.round(dis1);
      fetch(
        `${LocalConfig.API_URL}admin/api/deliverycharge.php?bid=` +
        this.state.bid,
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            dc1: Object.values(responseJson.charge)[dis2],
          });
        })
        .catch(error => null);
    } else this.setState({ dc1: 0 })
  };
  updateid() {
    const { orderid } = this.state;
    const { razoroid } = this.state;
    fetch(
      `${LocalConfig.API_URL}admin/api/razorpay_order_update.php?oid=` +
      orderid +
      '&&order_id=' +
      razoroid,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oid: orderid,
          order_id: razoroid,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        var ch = responseJson.data;
        if (ch.success == '1') {
          this.startpayment();
        } else {
          Alert.alert('SomethingwentWrong!!! Please try again 569');
        }
        this.setState({ loading: false });
      })
      .catch(error => {
      });
  }
  getorderid() {
    var total = this.state.total_price;
    let API;
    // selectedPaymentGateway
    // paymentGateway: ['cashfree', 'razorpay', 'paytm']
    if (this.state.selectedPaymentGateway == 'razorpay')
      API = `${LocalConfig.API_URL}admin/api/razor_pay_order_id_generate.php?amount_get=${total}`
    else if (this.state.selectedPaymentGateway == 'cashfree') API = `${LocalConfig.API_URL}admin/api/cashfree_generate_token_id.php?amt=${total}&orderId=${this.state.orderid}`
    fetch(API)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success == '1' || responseJson.status == "OK") {
          if (this.state.selectedPaymentGateway == 'razorpay')
            this.state.razoroid = responseJson.oid;
          else if (this.state.selectedPaymentGateway == 'cashfree')
            this.state.razoroid = responseJson.cftoken;
          this.updateid();
        } else {
          this.setState({ loading: false })
          Alert.alert('SomethingwentWrong!!! Please try again 588');
        }
      })
      .catch(err => {
        this.setState({ loading: false })
        Alert.alert('SomethingwentWrong!!! Please try again 592');
      });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  setModalVisible1(visible) {
    this.setState({ modalVisible1: visible });
  }
  setModalVisible2(visible) {
    this.setState({ modalVisible2: visible });
  }
  setModalVisible12(visible) {
    this.setState({ modalVisible12: visible });
  }
  addItem(item) {
    var temp1 = [];
    var temp2 = [];
    var temp3 = [];
    var t = this.state.variantid.toString();
    var k = this.state.radioid.toString();
    temp1.push(t + ',' + k);
    var s = this.state.variantname.toString();
    var n = this.state.radioname.toString();
    temp2.push(s + ',' + n);
    var sn = this.state.variantprice.toString();
    var tk = this.state.radioprice.toString();
    if (sn.length > 0 || tk.length > 0) {
      if (sn.length > 0 && tk.length > 0) {
        temp3.push(sn + ',' + tk);
      } else {
        if (sn.length > 0) {
          temp3.push(sn);
        } else {
          temp3.push(tk);
        }
      }
    } else {
      temp3 = [];
    }
    if (item.wholecat == 2) {
      var qty = 0.5;
    } else {
      var qty = 1;
    }
    const reducer = (previousValue, currentValue) =>
      parseInt(previousValue) + parseInt(currentValue);
    var string2 = this.state.temp_price.toString();
    var vas = temp3.toString();
    const temp = string2.split(',');
    const vat = vas.split(',');
    var price1 = vat.reduce(reducer);
    var price = temp.reduce(reducer);
    if (price > 0) {
      price = price;
    } else {
      price = 0;
    }
    if (price1 > 0) {
      price1 = price1;
    } else {
      price1 = 0;
    }
    var t = parseFloat(item.price) + parseFloat(price) + parseFloat(price1);
    var tot = parseFloat(t) * qty;
    sql
      .addItemaddon(
        item.item_id,
        item.category,
        item.item_name,
        item.price,
        qty,
        item.image,
        item.wholecat,
        this.state.temp_id,
        this.state.temp_name,
        this.state.temp_price,
        temp1,
        temp2,
        temp3,
        this.state.radioid,
        this.state.radioprice,
        this.state.variantid,
        this.state.variantprice,
        tot,
        item.remark,
      )
      .then(res1 => { })
      .catch(err => { });
    this.setState({
      checked18: [],
      temp_id: [],
      temp_name: [],
      temp_price: [],
      modal18: false,
      varcheck: [],
      radioid: [],
      radioprice: [],
      variantid: [],
      variant_name: [],
      variant_price: [],
      radioname: [],
    });
    this.View();
    this.refreshScreen(false);
  }
  offerTextCode() {
    var res = false;
    this.setState({ loadingPromo: true });
    this.state.dataSource1.map(promocode => {
      if (promocode.promo_code == this.state.promocode) {
        res = true;
        this._onPressItem(promocode);
        this.setState({ promo: 1, loadingPromo: false });
        ToastAndroid.show(`Promo code applyed`, ToastAndroid.SHORT);
        return;
      } else {
        this.setState({ promo: 0, loadingPromo: false });
      }
    });
    if (!res) {
      this.setState({ loadingPromo: false });
      ToastAndroid.show(`Wrong Promo code`, ToastAndroid.SHORT)
    };
  }
  addMinusItem(item) {
    if (item.wholecat == 2) {
      var qty = parseFloat(item.qty) - 0.5;
      var prces = item.addons_price.split(',');
      var prc = 0;
      for (let i = 0; i < prces.length; i++) {
        if (prces[i]) {
          prc = prc + parseFloat(prces[i]);
        } else {
          prc = prc + 0;
        }
      }
      var tot = parseFloat(item.price) * qty + prc;
      if (qty <= 0) {
        sql
          .deleteitem1(item.id, item.remarks)
          .then(res => { })
          .catch(res => {
            // alert(JSON.stringify(res))
          });
      } else {
        sql
          .updateqty1(qty, tot, item.id, "", item)
          .then(res => { })
          .catch(res => { });
      }
      item.qty = qty;
      item.total = tot;
    } else {
      var qty = parseInt(item.qty) - 1;
      var prces = item.addons_price.split(',');
      var prc = 0;
      for (let i = 0; i < prces.length; i++) {
        if (prces[i]) {
          prc = prc + parseFloat(prces[i]);
        } else {
          prc = prc + 0;
        }
      }
      var tot = parseFloat(item.price) * qty + prc;
      if (qty <= 0) {
        sql
          .deleteitem1(item.id, item.remarks)
          .then(res => { })
          .catch(res => {
            // alert(JSON.stringify(res))
          });
      } else {
        sql
          .updateqty1(qty, tot, item.id, "", item)
          .then(res => { })
          .catch(res => { });
      }
      item.qty = qty;
      item.total = tot;
    }
    this.View();
    this.refreshScreen();
  }
  addPlusItem1(item) {
    if (item.wholecat == 2) {
      var qty = parseFloat(item.qty) + 0.5;
      var prces = item.addons_price.split(',');
      var prc = 0;
      for (let i = 0; i < prces.length; i++) {
        if (prces[i]) {
          prc = prc + parseFloat(prces[i]);
        } else {
          prc = prc + 0;
        }
      }
      var t = parseFloat(item.price) + parseFloat(prc);
      var tot = parseFloat(t) * qty;
      item.qty = parseFloat(item.qty) + 0.5;
      sql
        .updateqty1(qty, tot, item.id, "", item)
        .then(res => { })
        .catch(res => { });
      item.qty = qty;
      item.total = tot;
      this.refreshScreen(false);
    } else {
      var qty = parseInt(item.qty) + 1;
      var prces = item.addons_price.split(',');
      var prc = 0;
      for (let i = 0; i < prces.length; i++) {
        if (prces[i]) {
          prc = prc + parseFloat(prces[i]);
        } else {
          prc = prc + 0;
        }
      }
      var t = parseFloat(item.price) + parseFloat(prc);
      var tot = parseFloat(t) * qty;
      item.qty = parseInt(item.qty) + 1;
      sql
        .updateqty1(qty, tot, item.id, "", item)
        .then(res => { })
        .catch(res => { });
      item.qty = qty;
      item.total = tot;
      this.View();
      this.refreshScreen(false);
    }
    this.View();
    this.refreshScreen();
  }
  addPlusItem(item) {
    if (item.ingrecount > 0) {
      fetch(
        `${LocalConfig.API_URL}admin/api/ingredientsnew.php?category=` +
        item.category +
        '&&menu_id=' +
        item.item_id,
      )
        .then(response => response.json())
        .then(responseJson => {
          // if((responseJson.ingre.length>0)||(responseJson.variant.length>0)){
          var tt;
          var temp = [];
          var temp1 = [];
          var temp2 = [];
          responseJson.arrayvariant.map(
            item => (
              temp.push(item.id), temp1.push(item.name), temp2.push(item.price)
            ),
          );
          this.setState({ radioid: temp, radioname: temp1, radioprice: temp2 });
          this.setState({
            addon: responseJson.ingre,
            addonitem: item,
            modal19: true,
            variant: responseJson.variant,
          });
        });
    } else {
      if (item.wholecat == 2) {
        var qty = parseFloat(item.qty) + 0.5;
        var prces = item.addons_price.split(',');
        var prc = 0;
        for (let i = 0; i < prces.length; i++) {
          if (prces[i]) {
            prc = prc + parseFloat(prces[i]);
          } else {
            prc = prc + 0;
          }
        }
        var t = parseFloat(item.price) + parseFloat(prc);
        var tot = parseFloat(t) * qty;
        item.qty = parseFloat(item.qty) + 0.5;
        sql
          .updateqty1(qty, tot, item.id, "", item)
          .then(res => { })
          .catch(res => { });
        item.qty = qty;
        item.total = tot;
      } else {
        var qty = parseInt(item.qty) + 1;
        var prces = item.addons_price.split(',');
        var prc = 0;
        for (let i = 0; i < prces.length; i++) {
          if (prces[i]) {
            prc = prc + parseFloat(prces[i]);
          } else {
            prc = prc + 0;
          }
        }
        var t = parseFloat(item.price) + parseFloat(prc);
        var tot = parseFloat(t) * qty;
        item.qty = parseInt(item.qty) + 1;
        sql
          .updateqty1(qty, tot, item.id, "", item)
          .then(res => { })
          .catch(res => { });
        item.qty = qty;
        item.total = tot;
      }
    }
    this.View();
    this.refreshScreen();
  }
  async deleteitem(item) {
    sql
      .deleteitem2(item.id)
      .then(res => {
        this.state.re = 0;
        this.View();
      })
      .catch(res => {
        alert(JSON.stringify(res));
      });
    this.View();
    this.refreshScreen(false);
  }
  startpayment = () => {
    let number = this.state.mobile_no;
    const email = this.state.email;
    const razor = this.state.razoroid;
    let tot = this.state.total * 100;
    let phn = '+91' + number;
    if (this.state.selectedPaymentGateway == 'cashfree') {
      var params = {
        appId: LocalConfig.API_KEYS.cashFree.clientIdLive,
        orderId: `${this.state.orderid}`,
        orderCurrency: "INR",
        orderAmount: `${this.state.total_price}`,
        // customerPhone: 8825870294,
        customerPhone: number,
        customerEmail: email,
        tokenData: razor,
      }
      RNPgReactNativeSDK.startPaymentWEB(params, LocalConfig.API_KEYS.cashFree.envLive, (result) => {
        const jsonObject = JSON.parse(result);
        if (jsonObject.txStatus == 'SUCCESS') {
          this.setState({ razorpayid: jsonObject.referenceId });
          this.setState({ status: '1' });
          this.updatepaymentid();
        } else {
          this.setState({ razorpayid: 'failedpayment' });
          this.setState({ status: '0' });
          this.updatepaymentid();
        }
        // failed - {\"orderId\":\"51\",\"type\":\"CashFreeResponse\",\"txStatus\":\"CANCELLED\"}
        // sucess - "{\"paymentMode\":\"Wallet\",\"orderId\":\"29281\",\"txTime\":\"2022-07-19 18:14:05\",\"referenceId\":\"885379407\",\"type\":\"CashFreeResponse\",\"txMsg\":\"Transaction pending\",\"signature\":\"T3x3dfBWQzRq2nMggL7ppeVx0zaGmbtsIGLnKLfq8qE=\",\"orderAmount\":\"52.00\",\"txStatus\":\"SUCCESS\"}"
      });
    } else if (this.state.selectedPaymentGateway == 'razorpay') {
      var options = {
        description: 'Buy a fresh Meats',
        image: `${LocalConfig.API_URL}admin/images/logo/logo.png`,
        currency: 'INR',
        order_id: razor,
        key: LocalConfig.API_KEYS.razorpayApiKeyLive,
        amount: tot,
        name: LocalConfig.APP_NAME,
        prefill: {
          email: email,
          contact: phn,
          name: 'Razorpay Software',
        },
        theme: { color: LocalConfig.COLOR.UI_COLOR },
      };
      RazorpayCheckout.open(options)
        .then(data => {
          this.setState({ razorpayid: data.razorpay_payment_id });
          this.setState({ status: '1' });
          this.updatepaymentid();
        })
        .catch(error => {
          this.setState({ razorpayid: 'failedpayment' });
          this.setState({ status: '0' });
          this.updatepaymentid();
        });
    }

  };
  updatepaymentid() {
    const { orderid } = this.state;
    const { razorpayid } = this.state;
    const { status } = this.state;
    const API = `${LocalConfig.API_URL}admin/api/paystatus.php?oid=` + orderid + '&&pay_id=' + razorpayid + '&&pay_status=' + status
    fetch(
      API,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oid: orderid,
          pay_id: razorpayid,
          pay_status: status,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        var ch = responseJson.data;
        if (ch.success == '1') {
          if (status == '1') {
            sql
              .deleteallrows()
              .then(res => { })
              .catch(err => { });
            if (this.state.promo !== 0) {
              sql.getpromousedusers(this.state.promo_id).then(res1 => {
                var used = parseFloat(res1.rows.item(0).used_users) + 1;
                if (used == 0) {
                  used = 1;
                }
                sql
                  .updatepromo(used, this.state.promo_id)
                  .then(res => { })
                  .catch(err => {
                    alert(JSON.stringify(err));
                  });
              });
            }
            this.setState({ checked8: false, delay: 0, promo: 0 });
            this.setState({ latlong1: '0' });
            this.refreshScreen(false);
            this.setState({ name: '' });
            this.setState({ checked2: false });
            this.setState({ latlong1: '0' });
            this.props.navigation.navigate('OrderFinish', {
              orderid: this.state.orderid,
              type: this.state.type,
              deltime: this.state.selftime.toString(),
            });
          } else {
            Alert.alert('Payment Failed');
            this.state.razoroid = '';
            this.setState({ checked8: false });
          }
        } else {
          alert(ch);
          Alert.alert('SomethingwentWrong!!! Please try again 1011');
        }
      })
      .catch(error => {
      });
  }
  _onPressItem(item) {
    sql.getpromo(item.promo_id).then(res => {
      if (res.rows.length > 0) {
        sql.getpromousedusers(item.promo_id).then(res1 => {
          var used = res1.rows.item(0).used_users;
          if (parseFloat(used) >= item.usage_limit_user) {
            Alert.alert('Limit of using promocode is over');
          } else {
            var resultdis = item.promo_type;
            if (resultdis == 'percent') {
              var subt =
                parseFloat(this.state.subtotal) +
                parseFloat(this.state.rc) +
                parseFloat(this.state.pc) +
                parseFloat(this.state.dc);
              this.state.promo = (subt * parseFloat(item.discount_pa)) / 100;
            } else {
              this.setState({
                promo: item.discount_pa,
                promo_id: item.promo_id
              })
            }
            this.setState({
              modalVisible: false,
            });
          }
        });
      } else {
        sql
          .insertpromo(
            item.promo_id,
            item.promo_code,
            item.discount_pa,
            item.usage_limit_user,
            0,
            item.promo_type,
          )
          .then(res => {
            var resultdis = item.promo_type;
            if (resultdis == 'percent') {
              var subt =
                parseFloat(this.state.subtotal) +
                parseFloat(this.state.rc) +
                parseFloat(this.state.pc) +
                parseFloat(this.state.dc);
              this.state.promo = (subt * parseFloat(item.discount_pa)) / 100;
            } else {
              this.state.promo = item.discount_pa;
            }
            this.setState({
              modalVisible: false,
              promo_id: item.promo_id,
            });
          })
          .catch(err => { });
      }
    });
  }
  date1 = () => {
    this.setState({ date });
    this.setState({
      selftime: moment(this.state.date).format('DD-MM-YYYY hh:mm A'),
    });
  };
  promo1(item) {
    var resultdis = JSON.stringify(this.state.dataSource[item.id].promo_type);
  }
  check() {
    var temp = [];
    temp = this.state.itemname;
    var add = this.state.addonitem.id;
    temp.map(item => {
      if (this.state.check === true) {
        sql
          .getItem1(add)
          .then(res => {
            if (res.rows.item(0).addons_id.length == 0) {
              var prces1 = res.rows.item(0).variant_price.split(',');
              var prc1 = 0;
              for (let i = 0; i < prces1.length; i++) {
                if (prces1[i]) {
                  prc1 = prc1 + parseFloat(prces1[i]);
                } else {
                  prc1 = prc1 + 0;
                }
                //alert(prces[i]);
              }
              var t =
                parseFloat(res.rows.item(0).price) +
                parseFloat(item.price) +
                parseFloat(prc1);
              var wtot = parseFloat(res.rows.item(0).qty) * parseFloat(t);
              sql
                .addaddons(item.id, item.item_name, item.price, wtot, add)
                .then(res => {
                  this.totalcal(add);
                  this.updateite(add);
                })
                .catch(err => {
                  alert(JSON.stringify(err));
                });
            } else {
              var addid = res.rows.item(0).addons_id + ',' + item.id;
              var addname = res.rows.item(0).addonsName + ',' + item.item_name;
              var addprce = res.rows.item(0).addons_price + ',' + item.price;
              var prces = res.rows.item(0).addons_price.split(',');
              var prces1 = res.rows.item(0).variant_price.split(',');
              var prc = 0;
              var prc1 = 0;
              for (let i = 0; i < prces.length; i++) {
                if (prces[i]) {
                  prc = prc + parseFloat(prces[i]);
                } else {
                  prc = prc + 0;
                }
              }
              for (let i = 0; i < prces1.length; i++) {
                if (prces1[i]) {
                  prc1 = prc1 + parseFloat(prces1[i]);
                } else {
                  prc1 = prc1 + 0;
                }
              }
              var t =
                parseFloat(res.rows.item(0).price) +
                parseFloat(prc) +
                parseFloat(item.price) +
                parseFloat(prc1);
              var tot = parseFloat(res.rows.item(0).qty) * parseFloat(t);
              sql
                .addaddons(addid, addname, addprce, tot, add)
                .then(res => {
                  this.totalcal(add);
                  this.updateite(add);
                })
                .catch(err => { });
            }
          })
          .catch(err => { });
      } else {
        sql
          .getItem1(add)
          .then(res => {
            // var ids=(res.rows.item(0).addons_id).split(",");
            var addid = this.removeitem(res.rows.item(0).addons_id, item.id);
            var addname = this.removeitem(
              res.rows.item(0).addonsName,
              item.item_name,
            );
            var addprice = this.removeitem(
              res.rows.item(0).addons_price,
              item.price,
            );
            var prces = res.rows.item(0).addons_price.split(',');
            var prces1 = res.rows.item(0).variant_price.split(',');
            var prc = 0;
            var prc1 = 0;
            for (let i = 0; i < prces.length; i++) {
              if (prces[i]) {
                prc = prc + parseFloat(prces[i]);
              } else {
                prc = prc + 0;
              }
            }
            if (prc > 0) {
              prc = prc - parseFloat(item.price);
            } else {
              prc = 0;
            }
            for (let i = 0; i < prces1.length; i++) {
              if (prces1[i]) {
                prc1 = prc1 + parseFloat(prces1[i]);
              } else {
                prc1 = prc1 + 0;
              }
            }
            var t =
              parseFloat(res.rows.item(0).price) +
              parseFloat(prc) +
              parseFloat(prc1);
            var tot = parseFloat(res.rows.item(0).qty) * parseFloat(t);
            sql
              .addaddons(addid, addname, addprice, tot, add)
              .then(res => {
                this.totalcal(add);
                this.updateite(add);
              })
              .catch(err => {
                alert(JSON.stringify(err));
              });
          })
          .catch(err => { });
      }
    });
  }
  check1() {
    var temp = [];
    temp = this.state.itemname;
    var add = this.state.addonitem.id;
    temp.map(item => {
      if (this.state.check === true) {
        sql
          .getItem1(add)
          .then(res => {
            if (res.rows.item(0).variant_id.length == 0) {
              var rid = this.state.radioid;
              var t =
                parseFloat(res.rows.item(0).price) + parseFloat(item.price);
              var wtot = parseFloat(res.rows.item(0).qty) * parseFloat(t);
              sql
                .variant(
                  item.id,
                  item.variant_name,
                  item.price,
                  item.id,
                  item.price,
                  wtot,
                  add,
                )
                .then(res => {
                  this.totalcal(add);
                  this.updateite(add);
                })
                .catch(err => {
                  alert(JSON.stringify(err));
                });
            } else {
              var addid = res.rows.item(0).variant_id + ',' + item.id;
              var addname =
                res.rows.item(0).variantName + ',' + item.variant_name;
              var addprce = res.rows.item(0).variant_price + ',' + item.price;
              var vid = res.rows.item(0).varid;
              if (vid.length == 0) {
                vid = item.id;
              } else {
                vid = res.rows.item(0).varid + ',' + item.id;
              }
              var vprc = res.rows.item(0).varprice;
              if (vprc.length == 0) {
                vprc = item.price;
              } else {
                vprc = res.rows.item(0).varprice + ',' + item.price;
              }
              var prces = res.rows.item(0).variant_price.split(',');
              var prc = 0;
              for (let i = 0; i < prces.length; i++) {
                if (prces[i]) {
                  prc = prc + parseFloat(prces[i]);
                } else {
                  prc = prc + 0;
                }
              }
              var t =
                parseFloat(res.rows.item(0).price) +
                parseFloat(prc) +
                parseFloat(item.price);
              var tot = parseFloat(res.rows.item(0).qty) * parseFloat(t);
              sql
                .variant(addid, addname, addprce, vid, vprc, tot, add)
                .then(res => {
                  this.totalcal(add);
                  this.updateite(add);
                })
                .catch(err => { });
            }
          })
          .catch(err => { });
      } else {
        sql
          .getItem1(add)
          .then(res => {
            var addid = this.removeitem(res.rows.item(0).variant_id, item.id);
            var addname = this.removeitem(
              res.rows.item(0).variantName,
              item.variant_name,
            );
            var addprice = this.removeitem1(
              res.rows.item(0).variant_price,
              item.price,
            );
            var vid = this.removeitem(res.rows.item(0).varid, item.id);
            var vprc = this.removeitem1(res.rows.item(0).varprice, item.price);
            var prces = res.rows.item(0).variant_price.split(',');
            var prc = 0;
            for (let i = 0; i < prces.length; i++) {
              if (prces[i]) {
                prc = prc + parseFloat(prces[i]);
              } else {
                prc = prc + 0;
              }
            }
            if (prc > 0) {
              prc = prc - parseFloat(item.price);
            } else {
              prc = 0;
            }
            var t = parseFloat(res.rows.item(0).price) + prc;
            var tot = parseFloat(res.rows.item(0).qty) * parseFloat(t);
            sql
              .variant(addid, addname, addprice, vid, vprc, tot, add)
              .then(res => {
                this.totalcal(add);
                this.updateite(add);
              })
              .catch(err => {
                alert(JSON.stringify(err));
              });
          })
          .catch(err => { });
      }
    });
  }
  removeitem1(arr, elem) {
    var ids = arr.split(',');
    var data = ids.indexOf(elem);
    var res = [];
    for (let i = 0; i < ids.length; i++) {
      if (i == data) {
      } else {
        res.push(ids[i]);
      }
    }
    return res.join(',');
  }
  removeitem(arr, elem) {
    var ids = arr.split(',');
    var res = [];
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] == elem) {
      } else {
        res.push(ids[i]);
      }
    }
    return res.join(',');
  }
  totalcal(add) {
    sql
      .getItem1(add)
      .then(res => {
        var qty = res.rows.item(0).qty;
        var remark = res.rows.item(0).remarks;
        var id = res.rows.item(0).id;
        var prces = res.rows.item(i).addons_price.split(',');
        var prces1 = res.rows.item(i).variant_price.split(',');
        var prc = 0;
        for (let i = 0; i < prces.length; i++) {
          if (prces[i]) {
            prc = prc + parseFloat(prces[i]);
          } else {
            prc = prc + 0;
          }
        }
        var prc1 = 0;
        for (let i = 0; i < prces1.length; i++) {
          if (prces1[i]) {
            prc1 = prc1 + parseFloat(prces1[i]);
          } else {
            prc1 = prc1 + 0;
          }
        }
        var t =
          parseFloat(res.rows.item(0).price) +
          parseFloat(prc) +
          parseFloat(prc1);
        var tot = parseFloat(qty) * parseFloat(t);
        this.state.total1 = tot;
        sql
          .updateqty1(qty, tot, id, remark, "", res.rows.item(0))
          .then(res => { })
          .catch(res => {
            alert(JSON.stringify(res));
          });
      })
      .catch(res => { });
  }
  updateite(id) {
    sql.getItem1(id).then(res => {
      if (res.rows.item(0).addonsName == null) {
        this.state.items12 = 'None';
      } else {
        this.state.items12 = res.rows.item(0).addonsName;
      }
    });
    this.refreshScreen();
  }
  changeEvent = (ev, index, item) => {
    var text = item.id;
    let tmp_solution = { ...this.state.checked12 };
    var temp = [];
    if (tmp_solution[item.id]) {
      tmp_solution[item.id] = false;
    } else {
      tmp_solution[item.id] = true;
    }
    if (tmp_solution[item.id] === true) {
      temp.push(item);
      this.state.itemname = temp;
      this.state.check = true;
    } else {
      temp.push(item);
      this.state.itemname = temp;
      this.state.check = false;
    }
    this.check();
    this.setState({ checked12: tmp_solution });
  };
  changeEvent12 = item => {
    var text = item.id;
    let tmp_solution = { ...this.state.varcheck };
    var temp = [];
    if (tmp_solution[item.id]) {
      tmp_solution[item.id] = false;
    } else {
      tmp_solution[item.id] = true;
    }
    if (tmp_solution[item.id] === true) {
      temp.push(item);
      this.state.itemname = temp;
      this.state.check = true;
    } else {
      temp.push(item);
      this.state.itemname = temp;
      this.state.check = false;
    }
    this.check1();
    this.setState({ varcheck: tmp_solution });
  };
  ingrediant(item) {
    fetch(
      `${LocalConfig.API_URL}admin/api/ingredientsnew.php?category=` +
      item.category +
      '&&menu_id=' +
      item.item_id,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ingre.length > 0 || responseJson.variant.length > 0) {
          this.setState({
            addon: responseJson.ingre,
            addonitem: item,
            variant: responseJson.variant,
          });
          this.callingre();
          this.callingre1();
        }
      })
      .catch(res => { });
  }
  callingre() {
    var res = [];
    var ids = this.state.addonid.split(',');
    this.state.addon.map(item => {
      var ids1 = item.id.split(',');
      let tmp_solution = { ...this.state.checked12 };
      for (let i = 0; i < ids1.length; i++) {
        if (
          ids[0] == ids1[i] ||
          ids[1] == ids1[i] ||
          ids[2] == ids1[i] ||
          ids[3] == ids1[i] ||
          ids[4] == ids1[i] ||
          ids[5] == ids1[i] ||
          ids[6] == ids1[i] ||
          ids[7] == ids1[i] ||
          ids[8] == ids1[i] ||
          ids[9] == ids1[i]
        ) {
          tmp_solution[item.id] = true;
          res.push(tmp_solution);
          this.setState({ checked12: tmp_solution });
        } else {
          tmp_solution[item.id] = false;
          res.push(tmp_solution);
          this.setState({ checked12: tmp_solution });
        }
      }
    });
    this.setState({
      modalVisible12: true,
    });
  }
  callingre1() {
    var res = [];
    var ids = this.state.varid.split(',');
    this.state.variant.map(item => {
      item.data.map(data => {
        var ids1 = data.id.split(',');
        let tmp_solution = { ...this.state.varcheck };
        for (let i = 0; i < ids1.length; i++) {
          if (
            ids[0] == ids1[i] ||
            ids[1] == ids1[i] ||
            ids[2] == ids1[i] ||
            ids[3] == ids1[i] ||
            ids[4] == ids1[i] ||
            ids[5] == ids1[i] ||
            ids[6] == ids1[i] ||
            ids[7] == ids1[i] ||
            ids[8] == ids1[i] ||
            ids[9] == ids1[i]
          ) {
            tmp_solution[data.id] = true;
            res.push(tmp_solution);
            this.setState({ varcheck: tmp_solution });
          } else {
            tmp_solution[data.id] = false;
            res.push(tmp_solution);
            this.setState({ varcheck: tmp_solution });
          }
        }
      });
    });
    this.setState({
      modalVisible12: true,
    });
  }
  timeout = () => {
    setTimeout(() => {
      if (this.callRef.current) {
        this.callRef.current.focus();
      }
    }, 500);
  };
  changeEvent1 = (ev, index, item) => {
    var text = item.id;
    let tmp_solution = { ...this.state.checked18 };
    let temp = [];
    let temp1 = [];
    let temp2 = [];
    let temp3 = [];
    let temp4 = [];
    let temp5 = [];
    if (tmp_solution[item.id]) {
      tmp_solution[item.id] = false;
    } else {
      tmp_solution[item.id] = true;
    }
    if (tmp_solution[item.id] === true) {
      temp.push(item.id);
      temp2.push(item.item_name);
      temp3.push(item.price);
      if (this.state.temp_id.length == 0) {
        this.setState({ temp_id: temp });
        this.setState({ temp_name: temp2 });
        this.setState({ temp_price: temp3 });
      } else {
        var string = this.state.temp_id.toString();
        var string1 = this.state.temp_name.toString();
        var string2 = this.state.temp_price.toString();
        temp1.push(string + ',' + item.id);
        temp4.push(string1 + ',' + item.item_name);
        temp5.push(string2 + ',' + item.price);
        this.setState({ temp_id: temp1 });
        this.setState({ temp_name: temp4 });
        this.setState({ temp_price: temp5 });
      }
    } else {
      var string = this.state.temp_id.toString();
      var string1 = this.state.temp_name.toString();
      var string2 = this.state.temp_price.toString();
      var ln = string.split(',');
      var ln1 = string1.split(',');
      var ln2 = string2.split(',');
      for (let i = 0; i < ln.length; i++) {
        if (ln[i] == item.id) {
          ln.splice(i, 1);
          ln1.splice(i, 1);
          ln2.splice(i, 1);
          this.setState({ temp_id: ln });
          this.setState({ temp_name: ln1 });
          this.setState({ temp_price: ln2 });
        } else {
        }
      }
    }
    this.setState({ checked18: tmp_solution });
  };
  changeEvent27 = item => {
    var text = item.id;
    let tmp_solution = { ...this.state.varcheck };
    let temp = [];
    let temp1 = [];
    let temp2 = [];
    let temp3 = [];
    let temp4 = [];
    let temp5 = [];
    if (tmp_solution[item.id]) {
      tmp_solution[item.id] = false;
    } else {
      tmp_solution[item.id] = true;
    }
    if (tmp_solution[item.id] === true) {
      temp.push(item.id);
      temp2.push(item.variant_name);
      temp3.push(item.price);
      if (this.state.variantid.length == 0) {
        this.setState({ variantid: temp });
        this.setState({ variantname: temp2 });
        this.setState({ variantprice: temp3 });
      } else {
        var string = this.state.variantid.toString();
        var string1 = this.state.variantname.toString();
        var string2 = this.state.variantprice.toString();
        temp1.push(string + ',' + item.id);
        temp4.push(string1 + ',' + item.variant_name);
        temp5.push(string2 + ',' + item.price);
        this.setState({ variantid: temp1 });
        this.setState({ variantname: temp4 });
        this.setState({ variantprice: temp5 });
      }
    } else {
      var string = this.state.variantid.toString();
      var string1 = this.state.variantname.toString();
      var string2 = this.state.variantprice.toString();
      var ln = string.split(',');
      var ln1 = string1.split(',');
      var ln2 = string2.split(',');
      for (let i = 0; i < ln.length; i++) {
        if (ln[i] == item.id) {
          ln.splice(i, 1);
          ln1.splice(i, 1);
          ln2.splice(i, 1);
          this.setState({ variantid: ln });
          this.setState({ variantname: ln1 });
          this.setState({ variantprice: ln2 });
        } else {
        }
      }
    }
    this.setState({ varcheck: tmp_solution });
  };
  buttonPress = async () => {
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
    try {
      const phoneNumber = await RNSmsRetriever.requestPhoneNumber();
      this.setState({ loginnumber: phoneNumber.split('+91')[1] });
    } catch (error) {
      this.setState({ editnumber: true });
    }
  };
  login() {
    RNOtpVerify.getHash()
      .then(hash => {
        this.setState({ hash: hash });
      })
      .catch(error => null);
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
    this.setState({ loading: true });
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
    const os = 'android';
    //'https://kingsparkrestaurant.in/admin/api/register.php?'+'mobile_no='+userMobile+'&maild='+userEmail+'&token='+token+&&hash=1234567890
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
        if (responseJson['data'].success === '1') {
          // setIsLoading(false);
          let uid = responseJson['data'].register;
          this.setState({
            uid1: uid,
            verifymodal: true,
            loginmodal: false,
            loading: false,
          });
          this.counter();
        } else {
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        alert(error);
      });
  };
  verify() {
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(this.otpHandler))
      .catch(err => null);
  }
  otpHandler = message => {
    let verificationCodeRegex = /Hi, ([\d]{4})/;
    if (verificationCodeRegex.test(message)) {
      let verificationCode = message.match(verificationCodeRegex)[1];
      this.setState({ otp: verificationCode, tid: 1 });
      this.verifyid();
    }
    RNOtpVerify.removeListener();
  };
  verifyid() {
    if (this.state.tid == 1) {
      this.handleSubmitPress1();
      this.setState({ tid: 0 });
    }
  }
  handleSubmitPress1 = () => {
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
        if (responseJson['data'].success === '1') {
          this.setState({ verifymodal: false });
          AsyncStorage.setItem('user_id', uid1);
          AsyncStorage.setItem('mobile_no', loginnumber);
          AsyncStorage.setItem('mail_id', loginemail);
          this.getid();
          if (this.state.addresspage == 1) {
            this.props.navigation.navigate('LocationDetails');
          }
        } else if (responseJson['data'].success === '0') {
          alert('Please Enter the valid  OTP');
        }
      })
      .catch(error => { });
  };
  counter() {
    const timer =
      this.state.counter > 0 &&
      setInterval(() => this.setState({ counter: this.state.counter - 1 }), 1000);
    return () => clearInterval(timer);
  }
  radio1(index, data) {
    this.state.radioid[index] = data.id;
    this.state.radioname[index] = data.variant_name;
    this.state.radioprice[index] = data.price;
    this.setState({ modal18: true });
  }
  radio(index, data) {
    this.state.radioid[index] = data.id;
    this.state.radioname[index] = data.variant_name;
    this.state.radioprice[index] = data.price;
    var add = this.state.addonitem.id;
    sql.getItem1(add).then(res => {
      var prces = res.rows.item(0).varprice.split(',');
      var rprice = this.state.radioprice.toString();
      var vpr = this.state.radioprice;
      var prc = 0;
      var prc1 = 0;
      for (let i = 0; i < prces.length; i++) {
        if (prces[i]) {
          prc = prc + parseFloat(prces[i]);
        } else {
          prc = prc + 0;
        }
        //alert(prces[i]);
      }
      for (let i = 0; i < vpr.length; i++) {
        if (vpr[i]) {
          prc1 = prc1 + parseFloat(vpr[i]);
        } else {
          prc1 = prc1 + 0;
        }
      }
      var rid = this.state.radioid.toString();
      var t =
        parseFloat(res.rows.item(0).price) + parseFloat(prc) + parseFloat(prc1);
      var wtot = parseFloat(res.rows.item(0).qty) * parseFloat(t);
      var temp1 = [];
      var temp2 = [];
      var vvv = res.rows.item(0).varid;
      var vprice = res.rows.item(0).varprice;
      temp1.push(vvv + ',' + rid);
      temp2.push(vprice + ',' + rprice);
      sql
        .radio(
          temp1,
          temp2,
          this.state.radioid,
          this.state.radioprice,
          wtot,
          add,
        )
        .then(res => {
          this.totalcal(add);
          this.updateite(add);
          this.setState({ modalVisible12: true });
        })
        .catch(err => {
          alert(JSON.stringify(err));
        });
    });
  }
  Alertbox = () => {
    Alert.alert('Alert', 'Login to continue', [
      {
        text: 'OK',
        onPress: () => this.setState({ loginmodal: true, addresspage: 1 }),
      },
    ]);
  };
  AS_onPressItem(item) {
    this.setState({
      AS_item: item,
      AS_id: item.id,
      AS_name: item.item_name,
      AS_price: item.price,
      AS_dprice: item.total,
      AS_description: item.description,
      AS_image: item.image,
      AS_qty: item.qty,
      AS_ingrecount: item.ingrecount,
    });
  }
  render() {
    const styles = StyleSheet.create({
      centerElement: { justifyContent: 'center', alignItems: 'center' },
      item3: {
        width: '60%',
      },
      absolute: {
        flexGrow: 1,
      },
      container2: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      },
    });
    const { checked1 } = this.state;
    const { checked2 } = this.state;
    const { checked3 } = this.state;
    const { checked4 } = this.state;
    const { checked5 } = this.state;
    const { checked6 } = this.state;
    const { checked7 } = this.state;
    const { checked8 } = this.state;
    //const gst=(parseFloat(this.state.subtotal)*5)/100;
    const gst = 0;
    const { modalVisible12 } = this.state;
    const { params } = this.props.route;
    const order = params ? params.order_no : null;
    const type = params ? params.type : null;
    const line = params ? params.line : null;
    const city = params ? params.city : null;
    const pincode = params ? params.pincode : null;
    const latlng = params ? params.latlng.split(',') : null;
    const a_id = params ? params.a_id : null;
    const delivery = 0;
    const lat = params ? latlng[0] : '50.0878730';
    const log = params ? latlng[1] : ' 77.0330790';
    const dis =
      this.state.latlong1 == 1
        ? getPreciseDistance(
          { latitude: lat, longitude: log },
          { latitude: 11.087873, longitude: 77.033079 },
        )
        : '100000';
    const dis1 = dis / 1000;
    const reducer = (previousValue, currentValue) =>
      parseInt(previousValue) + parseInt(currentValue);
    var string2 = this.state.temp_price.toString();
    const temp = string2.split(',');
    var price = temp.reduce(reducer);
    var s = this.state.variantname.toString();
    var name = this.state.temp_name.toString();
    if (string2.length > 0) {
      price = price;
    } else {
      price = 0;
    }
    var varprc = this.state.variantprice.toString();
    const temp12 = varprc.split(',');
    var price1 = temp12.reduce(reducer);
    if (varprc.length > 0) {
      price1 = price1;
    } else {
      price1 = 0;
    }
    var radprc = this.state.radioprice.toString();
    const temp13 = radprc.split(',');
    var price2 = temp13.reduce(reducer);
    if (radprc.length > 0) {
      price2 = price2;
    } else {
      price2 = 0;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: LocalConfig.COLOR.BLACK,
          width: moderateScale(380),
          height: verticalScale(450),
        }}>
        {this.state.delay == 0 && (
          <View style={{ width: '95%' }}>
            <SkeletonPlaceholder
              backgroundColor={LocalConfig.COLOR.BLACK}
              highlightColor={LocalConfig.COLOR.BLACK_LIGHT}>
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
        {this.state.delay > 0 && this.state.length == 0 && (
          <View
            style={{
              position: 'absolute',
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
                  color: LocalConfig.COLOR.WHITE,
                  fontFamily: 'Proxima Nova Bold',
                  marginBottom: '5%',
                  fontSize: 16,
                }}>
                {' '}
                We Will Meet You With Fresh Food....
              </Text>
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE,
                  fontFamily: 'Proxima Nova Font',
                  marginBottom: '0.5%',
                  fontSize: 13,
                }}>
                {' '}
                Your cart is empty{' '}
              </Text>
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE,
                  fontFamily: 'Proxima Nova Font',
                  marginBottom: '2%',
                  fontSize: 13,
                }}>
                {' '}
                Add something from the products
              </Text>
              <Button
                style={{
                  marginTop: '3%',
                  marginLeft: '5%',
                  marginRight: '5%',
                  borderColor: LocalConfig.COLOR.WHITE,
                }}
                mode="outlined"
                title="BROWSE FRESH FOOD"
                color={LocalConfig.COLOR.UI_COLOR}
                onPress={() => this.props.navigation.navigate('HomeScreen')}>
                <Text
                  style={{
                    color: LocalConfig.COLOR.UI_COLOR,
                    fontSize: 13,
                    fontFamily: 'verdanab',
                  }}>
                  BROWSE FRESH FOOD
                </Text>
              </Button>
            </View>
          </View>
        )}
        {this.state.length > 0 && (
          <View
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              flex: 1,
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: LocalConfig.COLOR.BLACK,
                marginBottom: '0%',
              }}>
              <View style={[styles.centerElement, { width: '10%', height: 50 }]}>
                <Ionicons
                  name="arrow-back"
                  size={23}
                  color={LocalConfig.COLOR.UI_COLOR}
                  onPress={() => this.props.navigation.goBack()}
                />
              </View>
              <View style={[styles.centerElement, { height: 50 }]}>
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    color: LocalConfig.COLOR.UI_COLOR,
                    marginLeft: '35%',
                    fontFamily: 'verdanab',
                  }}>
                  YOUR CART
                </Text>
              </View>
            </View>
            <ScrollView
              style={{ flex: 1 }}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="always">
              <View style={{ flex: 1 }}>
                {this.state.items.map((item, index) => <View key={index}>
                  {item.remarks == 1 ? (
                    (this.state.re = 1) && (
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: LocalConfig.COLOR.BLACK,
                          height: 50,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                            backgroundColor: LocalConfig.COLOR.BLACK,
                          }}>
                          <Text
                            style={{
                              fontSize: 13,
                              color: LocalConfig.COLOR.WHITE,
                              letterSpacing: 0.2,
                              fontFamily: 'Proxima Nova Font',
                              width: '50%',
                              marginLeft: '3.5%',
                            }}>
                            {item.item_name}
                          </Text>
                          <Text
                            style={{
                              color: LocalConfig.COLOR.UI_COLOR,
                              marginLeft: '2%',
                              fontFamily: 'Proxima Nova Font',
                            }}>
                            Item not available
                          </Text>
                          <TouchableOpacity
                            style={{ marginLeft: '8.5%' }}
                            onPress={() => this.deleteitem(item)}>
                            <Ionicons
                              name="md-trash"
                              size={16}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: LocalConfig.COLOR.BLACK,
                        height: 60,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexGrow: 1,
                          flexShrink: 1,
                          alignSelf: 'center',
                        }}>
                        <View
                          style={{
                            flexGrow: 1,
                            flexShrink: 1,
                            flexDirection: 'column',
                            width: '50%',
                            marginLeft: '6%',
                            marginTop: '3%',
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: LocalConfig.COLOR.WHITE,
                              letterSpacing: 0.2,
                              fontFamily: 'Proxima Nova Font',
                              width: '80%',
                            }}>
                            {item.item_name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                              fontSize: 10,
                              color: LocalConfig.COLOR.WHITE_LIGHT,
                              letterSpacing: 0.2,
                              fontFamily: 'Proxima Nova Font',
                              width: '80%',
                            }}>
                            {item.variantName}
                          </Text>
                          {item.addons_id !== null &&
                            (item.addons_id.toString().length > 0 ? (
                              <View flexDirection="row">
                                <TouchableOpacity
                                  onPress={() => {
                                    this.AS_onPressItem(item);
                                    this.setState({
                                      addonid: item.addons_id,
                                      addonname: item.item_name,
                                      varid: item.variant_id,
                                      radioid: item.radioid.split(','),
                                      radioprice: item.radioprice.split(','),
                                    });
                                    this.ingrediant(item);
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      color: LocalConfig.COLOR.WHITE_LIGHT,
                                    }}>
                                    Customized(
                                    {item.variantName.split(',').length})
                                  </Text>
                                </TouchableOpacity>
                                <Ionicons
                                  name="caret-down-circle"
                                  size={15}
                                  color={LocalConfig.COLOR.UI_COLOR}
                                />
                              </View>
                            ) : (
                              <View flexDirection="row">
                                <TouchableOpacity
                                  onPress={() => {
                                    this.AS_onPressItem(item);
                                    this.setState({
                                      addonid: item.addons_id,
                                      addonname: item.item_name,
                                      varid: item.variant_id,
                                      radioid: item.radioid.split(','),
                                      radioprice: item.radioprice.split(','),
                                    });
                                    this.ingrediant(item);
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      color: LocalConfig.COLOR.WHITE,
                                    }}>
                                    Customized(
                                    {item.variantName.split(',').length})
                                  </Text>
                                </TouchableOpacity>
                                <Ionicons
                                  name="caret-down-circle"
                                  size={15}
                                  color={LocalConfig.COLOR.UI_COLOR}
                                />
                              </View>
                            ))}
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '21%',
                          marginRight: '15%',
                          height: 30,
                          backgroundColor: LocalConfig.COLOR.BLACK,
                          borderRadius: 2,
                          marginTop: '4%',
                          borderWidth: 0.1,
                          borderColor: LocalConfig.COLOR.WHITE_LIGHT,
                        }}>
                        <TouchableOpacity
                          style={{ marginTop: '7%', marginLeft: '1%' }}
                          onPress={() => this.addMinusItem(item)}>
                          <MaterialIcons
                            name="remove"
                            size={20}
                            color={LocalConfig.COLOR.UI_COLOR}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            marginTop: '6%',
                            width: '35%',
                            marginLeft: '8%',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: LocalConfig.COLOR.UI_COLOR,
                              marginTop: '7%',
                              fontFamily: 'Proxima Nova Font',
                              fontSize: 15,
                            }}>
                            {item.qty}{' '}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ marginTop: '7%', marginLeft: '7%' }}
                          onPress={() => this.addPlusItem(item)}>
                          <MaterialIcons
                            name="add"
                            size={18}
                            color={LocalConfig.COLOR.UI_COLOR}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: '13.5%',
                          backgroundColor: LocalConfig.COLOR.BLACK,
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: LocalConfig.COLOR.WHITE,
                            marginTop: '40%',
                            marginBottom: '10%',
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {'\u20B9'}
                          {item.total}
                        </Text>
                      </View>
                    </View>
                  )}
                  {this.state.freeItems.map((freeItem, freeIndex) => freeItem.free_for_id == item.item_id && <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center'
                    }}
                    key={freeIndex}
                  >
                    <Text style={{ color: LocalConfig.COLOR.WHITE, flex: 1, padding: 10 }}>{freeItem.item_name}</Text>
                    <Text style={{ color: LocalConfig.COLOR.UI_COLOR, flex: 0.5, textAlign: 'center', }}>{freeItem.qty}</Text>
                    <Text style={{ color: LocalConfig.COLOR.UI_COLOR, flex: 0.5, textAlign: 'center', }}>free</Text>
                  </View>)}
                </View>
                )}
                {this.state.notes2 == 1 && (
                  <View
                    style={{ backgroundColor: LocalConfig.COLOR.BLACK, flex: 1 }}>
                    <Dash
                      dashGap={5}
                      dashThickness={0.7}
                      dashColor={LocalConfig.COLOR.WHITE_LIGHT}
                      style={{ width: '100%' }}
                    />
                    <View
                      flexDirection="row"
                      marginBottom="1%"
                      marginTop="1%"
                      width="100%">
                      <TextInput
                        style={{
                          height: 40,
                          width: '85%',
                          marginLeft: '3%',
                        }}
                        // editable={this.state.editnotes}
                        returnKeyType="done"
                        onSubmitEditing={() =>
                          this.setState({ editnotes: false })
                        }
                        color={LocalConfig.COLOR.WHITE}
                        maxLength={50}
                        keyboardType="name-phone-pad"
                        placeholder="Add instructions"
                        placeholderStyle={{
                          fontFamily: 'Proxima Nova Font',
                          fontSize: 15,
                        }}
                        placeholderTextColor="#6c757d"
                        multiline={false}
                        onChangeText={notes => this.setState({ notes })}>
                        {this.state.notes}
                      </TextInput>
                      <TouchableOpacity>
                        <View style={{ alignItems: 'flex-end' }}>
                          <SimpleLineIcons
                            name="note"
                            size={18}
                            color={LocalConfig.COLOR.UI_COLOR_LITE}
                            style={{ marginLeft: '0.5%', marginTop: '25%' }}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: LocalConfig.COLOR.BLACK,
                  marginTop: '7%',
                  shadowColor: LocalConfig.COLOR.WHITE,
                  elevation: 5,
                }}>
                <View
                  style={[styles.centerElement, { width: '35%', height: 55 }]}>
                  <Text
                    style={{
                      marginLeft: '5%',
                      fontSize: width / 32,
                      color: LocalConfig.COLOR.WHITE,
                      fontFamily: 'verdanab',
                    }}>
                    Delivery Type
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: '3%',
                    marginLeft: '10%',
                  }}>
                  {this.state.self == 1 && (
                    <Checkbox
                      color={LocalConfig.COLOR.UI_COLOR}
                      uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                      status={checked1 ? 'checked' : 'unchecked'}
                      onPress={() => {
                        this.setState({ checked1: !checked1 });
                        this.setState({ checked2: false });
                        this.setState({ checked3: true });
                        this.setState({ checked4: false });
                        this.setState({ checked5: false });
                        this.setState({ checked6: false });
                      }}
                    />
                  )}
                  {this.state.self == 1 ? (
                    <Text
                      style={{
                        marginTop: '5%',
                        fontSize: width / 34.25,
                        color: LocalConfig.COLOR.UI_COLOR,
                        fontFamily: 'Proxima Nova Font',
                        marginLeft: '1%',
                      }}>
                      Self Pickup
                    </Text>
                  ) : (
                    <Text></Text>
                  )}
                  {this.state.home == 1 ? (
                    <Checkbox
                      color={LocalConfig.COLOR.UI_COLOR}
                      uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                      style={{ width: 10, height: 10 }}
                      status={checked2 ? 'checked' : 'unchecked'}
                      onPress={() => {
                        this.setState({ checked1: false });
                        this.setState({ checked2: !checked2 });
                        this.setState({ checked3: false });
                        this.setState({ checked4: false });
                        this.setState({ checked5: true });
                        this.setState({ checked6: false });
                        // this.setModalVisible2(true);
                      }}
                    />
                  ) : (
                    // )
                    <Text></Text>
                  )}
                  {this.state.home == 1 ? (
                    <Text
                      style={{
                        marginTop: '5%',
                        fontSize: width / 34.25,
                        color: LocalConfig.COLOR.UI_COLOR,
                        fontFamily: 'Proxima Nova Font',
                        marginLeft: '1%',
                      }}>
                      Delivery
                    </Text>
                  ) : (
                    <Text></Text>
                  )}
                </View>
              </View>
              {/* SELFPICKUP CONTAINER VIEW  */}
              {checked1 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: LocalConfig.COLOR.BLACK,
                    marginTop: '7%',
                    shadowColor: LocalConfig.COLOR.WHITE,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                      borderBottomWidth: 0.5,
                      marginTop: '-2%',
                      marginBottom: '2%',
                    }}
                  />
                  <ScrollView>
                    <View flexDirection="row" marginBottom="2%">
                      <View style={{ marginTop: '3%' }}>
                        <Checkbox
                          color={LocalConfig.COLOR.UI_COLOR}
                          uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                          status={checked3 ? 'checked' : 'unchecked'}
                          onPress={() => {
                            {
                              this.setState({ checked3: !checked3 });
                              this.setState({ checked4: false });
                            }
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        style={{ marginTop: '5%' }}
                        onPress={() => {
                          {
                            this.setState({ checked3: !checked3 });
                            this.setState({ checked4: false });
                            this.setState({ open: true });
                          }
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Proxima Nova Font',
                            color: LocalConfig.COLOR.WHITE,
                          }}>
                          Normal pickup time max 15 min
                        </Text>
                      </TouchableOpacity>
                      {checked3 ? (
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            width: '25%',
                            alignSelf: 'center',
                            alignItems: 'center',
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            height: 30,
                            borderRadius: 5,
                            marginTop: '2%',
                            marginLeft: '10.5%',
                          }}
                          onPress={() => {
                            this.setState({ open: true });
                            this.setState({ checked3: false });
                          }}>
                          <Text
                            style={{
                              alignContent: 'center',
                              textAlign: 'center',
                              color: LocalConfig.COLOR.BLACK,
                              marginBottom: '0%',
                              fontSize: 13,
                              fontFamily: 'Proxima Nova Bold',
                            }}>{`CHANGE`}</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            width: '25%',
                            alignSelf: 'center',
                            alignItems: 'center',
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            height: 30,
                            borderRadius: 5,
                            marginTop: '2%',
                            marginLeft: '10.5%',
                          }}
                          onPress={() => {
                            this.setState({ checked3: true });
                          }}>
                          <Text
                            style={{
                              marginTop: '6.5%',
                              color: LocalConfig.COLOR.BLACK,
                              marginBottom: '0%',
                              fontSize: 13,
                              fontFamily: 'Proxima Nova Bold',
                            }}>{`UNDO`}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View flexDirection="row">
                      <DatePicker
                        modal
                        title="Select Your Pickup Time"
                        minimumDate={FORMATDATE(15)}
                        open={this.state.open}
                        date={FORMATDATE(15)}
                        mode="datetime"
                        onConfirm={date => {
                          this.setState({ open: false });
                          this.setState({ date });
                          this.setState({
                            selftime: moment(this.state.date).format(
                              'DD-MM-YYYY hh:mm A',
                            ),
                          });
                          this.setState({
                            selftime1: moment(this.state.date).format(
                              'DD-MM-YYYY hh:mm A',
                            ),
                          });
                          this.setState({ type: 'Self Pickup' });
                        }}
                        onCancel={() => {
                          this.setState({ open: false });
                        }}
                      />
                    </View>
                    {/* PICKUP TIME VIEW */}
                    {!checked3 && (
                      <View>
                        <View
                          style={{
                            borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                            borderBottomWidth: 0.5,
                            marginTop: '1%',
                            marginBottom: '1%',
                          }}
                        />
                        <View
                          style={{
                            marginTop: '1%',
                            marginBottom: '2%',
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={{
                              color: LocalConfig.COLOR.WHITE,
                              fontSize: 13,
                              padding: '1%',
                              width: '50%',
                              marginLeft: '4.5%',
                              fontFamily: 'verdanab',
                            }}>
                            Pickup Time
                          </Text>
                          {this.state.date > this.state.date1 && (
                            <TouchableOpacity
                              onPress={() => this.setState({ open: true })}>
                              <Text
                                style={{
                                  color: LocalConfig.COLOR.UI_COLOR,
                                  fontSize: 13,
                                  marginTop: '2%',
                                  fontFamily: 'Verdana',
                                  marginLeft: '5%',
                                }}>
                                {this.state.selftime}
                              </Text>
                            </TouchableOpacity>
                          )}
                          {this.state.date1 >= this.state.date && (
                            <TouchableOpacity
                              onPress={() => this.setState({ open: true })}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  marginTop: '2%',
                                  color: LocalConfig.COLOR.WHITE_LIGHT,
                                  fontFamily: 'Verdana',
                                  marginLeft: '20%',
                                }}>
                                SELECT TIME
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}
                  </ScrollView>
                </View>
              ) : null}
              {/* DELIVERY TYPE CONTAINER */}
              {checked2 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: LocalConfig.COLOR.BLACK,
                    marginTop: '7%',
                    shadowColor: LocalConfig.COLOR.WHITE,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                      borderBottomWidth: 0.5,
                      marginTop: '-2%',
                      marginBottom: '2%',
                    }}
                  />
                  <ScrollView>
                    <View flexDirection="row" marginBottom="2%">
                      <View style={{ marginTop: '3%' }}>
                        <Checkbox
                          color={LocalConfig.COLOR.UI_COLOR}
                          uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                          status={checked5 ? 'checked' : 'unchecked'}
                          onPress={() => {
                            {
                              this.setState({ checked5: !checked5 });
                              this.setState({ checked6: false });
                            }
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        style={{ marginTop: '5%' }}
                        onPress={() => {
                          {
                            this.setState({ checked5: !checked5 });
                            this.setState({ checked6: false });
                            this.setState({ open: true });
                          }
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Proxima Nova Font',
                            color: LocalConfig.COLOR.WHITE,
                          }}>
                          Normal delivery time max 1 hour
                        </Text>
                      </TouchableOpacity>
                      {checked5 ? (
                        <TouchableOpacity
                          style={{
                            width: '25%',
                            alignSelf: 'center',
                            alignItems: 'center',
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            height: 30,
                            borderRadius: 5,
                            marginTop: '2%',
                            marginLeft: '8.9%', // Android
                          }}
                          onPress={() => {
                            this.setState({ open: true });
                            this.setState({ checked5: false });
                          }}>
                          <Text
                            style={{
                              marginTop: '6.5%',
                              color: LocalConfig.COLOR.BLACK,
                              marginBottom: '0%',
                              fontSize: 13,
                              fontFamily: 'Proxima Nova Bold',
                            }}>{`CHANGE`}</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            width: '25%',
                            alignSelf: 'center',
                            alignItems: 'center',
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            height: 30,
                            borderRadius: 5,
                            marginTop: '2%',
                            marginLeft: '8.9%', // Android
                          }}
                          onPress={() => {
                            this.setState({ checked5: true });
                          }}>
                          <Text
                            style={{
                              marginTop: '6.5%',
                              color: LocalConfig.COLOR.BLACK,
                              marginBottom: '0%',
                              fontSize: 13,
                              fontFamily: 'Proxima Nova Bold',
                            }}>{`UNDO`}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View flexDirection="row">
                      <DatePicker
                        modal
                        title="Select Your Delivery Time"
                        minimumDate={FORMATDATE(60)}
                        open={this.state.open}
                        date={FORMATDATE(60)}
                        mode="datetime"
                        onConfirm={date => {
                          this.setState({ open: false });
                          this.setState({ date });
                          this.setState({
                            selftime: moment(this.state.date).format(
                              'DD-MM-YYYY hh:mm A',
                            ),
                          });
                        }}
                        onCancel={() => {
                          this.setState({ open: false });
                        }}
                      />
                    </View>
                    {/* DELIVERY TIME VIEW */}
                    {!checked5 && (
                      <View>
                        <View
                          style={{
                            borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                            borderBottomWidth: 0.5,
                            marginTop: '1%',
                            marginBottom: '1%',
                          }}
                        />
                        <View
                          style={{
                            marginTop: '1%',
                            marginBottom: '2%',
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={{
                              color: LocalConfig.COLOR.WHITE,
                              fontSize: 13,
                              padding: '1%',
                              width: '50%',
                              marginLeft: '4.5%',
                              fontFamily: 'verdanab',
                            }}>
                            Delivery Time
                          </Text>
                          {this.state.date > this.state.date1 && (
                            <TouchableOpacity
                              onPress={() => this.setState({ open: true })}>
                              <Text
                                style={{
                                  color: LocalConfig.COLOR.UI_COLOR,
                                  fontSize: 13,
                                  marginTop: '2%',
                                  fontFamily: 'Verdana',
                                  marginLeft: '5%',
                                }}>
                                {this.state.selftime}
                              </Text>
                            </TouchableOpacity>
                          )}
                          {this.state.date1 >= this.state.date && (
                            <TouchableOpacity
                              onPress={() => this.setState({ open: true })}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  marginTop: '2%',
                                  color: LocalConfig.COLOR.WHITE_LIGHT,
                                  marginLeft: '20%',
                                  fontFamily: 'Verdana',
                                }}>
                                SELECT TIME
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}
                  </ScrollView>
                </View>
              ) : (
                <Text></Text>
              )}
              {checked2 ? (
                this.state.locationaid == null && (
                  <View
                    style={{
                      backgroundColor: LocalConfig.COLOR.BLACK,
                      width: '100%',
                      marginTop: '4%',
                      marginBottom: '9%',
                      shadowColor: LocalConfig.COLOR.WHITE,
                      elevation: 3,
                    }}>
                    <View flexDirection="row">
                      <View
                        style={{
                          borderRadius: 5,
                          marginTop: '3%',
                          marginBottom: '2%',
                          marginLeft: '5%',
                        }}>
                        <Text
                          style={{
                            marginTop: '2%',
                            color: LocalConfig.COLOR.WHITE_LIGHT,
                            marginBottom: '2%',
                            fontSize: 15,
                            fontFamily: 'Proxima Nova Bold',
                          }}>{`Select Address To Place Order`}</Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          width: '25%',
                          alignSelf: 'center',
                          alignItems: 'center',
                          backgroundColor: LocalConfig.COLOR.UI_COLOR,
                          height: 30,
                          borderRadius: 5,
                          //marginTop: '2%',
                          marginLeft: '13%',
                        }}
                        onPress={() => {
                          if (this.state.uid == null) {
                            this.Alertbox();
                          } else {
                            this.props.navigation.navigate('LocationDetails');
                          }
                        }}>
                        <Text
                          style={{
                            alignItems: 'center',
                            textAlign: 'center',
                            color: LocalConfig.COLOR.BLACK,
                            marginBottom: '0%',
                            fontSize: 13,
                            fontFamily: 'Proxima Nova Bold',
                          }}>{`SELECT`}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              ) : (
                <Text></Text>
              )}
              {checked2 ? (
                this.state.locationaid != null && (
                  <View
                    style={{
                      backgroundColor: LocalConfig.COLOR.BLACK,
                      width: '100%',
                      marginTop: '4%',
                      marginBottom: '9%',
                      shadowColor: LocalConfig.COLOR.WHITE,
                      elevation: 3,
                    }}>
                    <View flexDirection="row">
                      <View>
                        {checked2 ? (
                          <Text
                            style={{
                              marginLeft: '5%',
                              marginBottom: '1%',
                              marginTop: '1%',
                              fontSize: 10,
                              color: LocalConfig.COLOR.WHITE,
                              fontFamily: 'verdanab',
                            }}>
                            Delivery Time : Normal delivery time max 1 hour
                          </Text>
                        ) : (
                          <Text></Text>
                        )}
                      </View>
                      <View></View>
                    </View>
                    <TouchableOpacity
                      style={{
                        width: '45%',
                        alignSelf: 'center',
                        alignItems: 'center',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        borderColor: LocalConfig.COLOR.UI_COLOR,
                        borderWidth: 0.7,
                        borderRadius: 5,
                        marginLeft: '50%', // Android
                      }}
                      onPress={() =>
                        this.props.navigation.navigate('LocationDetails')
                      }>
                      <Text
                        style={{
                          marginTop: '2%',
                          color: LocalConfig.COLOR.BLACK,
                          marginBottom: '2%',
                          fontSize: 13,
                          fontFamily: 'Proxima Nova Bold',
                        }}>{`CHANGE ADDRESS  >> `}</Text>
                    </TouchableOpacity>
                    <View flexDirection="row">
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('LocationDetails')
                          }>
                          {checked2 ? (
                            this.state.locationaid !== null && (
                              <Text
                                style={{
                                  marginLeft: '5%',
                                  marginTop: '-5%',
                                  fontSize: 13,
                                  color: LocalConfig.COLOR.UI_COLOR,
                                  fontFamily: 'Proxima Nova Bold',
                                  marginBottom: '2%',
                                }}>
                                {this.state.locationname}{' '}
                              </Text>
                            )
                          ) : (
                            <Text></Text>
                          )}
                          {checked2 ? (
                            this.state.locationaid !== null && (
                              <Text
                                style={{
                                  marginLeft: '5%',
                                  marginBottom: '2%',
                                  fontSize: 13,
                                  color: LocalConfig.COLOR.WHITE,
                                  fontFamily: 'Proxima Nova Font',
                                }}>
                                {this.state.locationline}
                              </Text>
                            )
                          ) : (
                            <Text></Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              ) : (
                <Text></Text>
              )}
              {/* COUPON */}
              {!this.state.espstatus && (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: LocalConfig.COLOR.BLACK,
                    marginBottom: '4%',
                    shadowColor: LocalConfig.COLOR.BLACK,
                    elevation: 3,
                  }}>
                  <View
                    style={[
                      styles.centerElement,
                      { marginLeft: '3%', height: 55 },
                    ]}>
                    <MaterialCommunityIcons
                      name="brightness-percent"
                      size={23}
                      color={LocalConfig.COLOR.UI_COLOR}
                    />
                  </View>
                  <View style={[styles.centerElement, { marginLeft: '3%' }]}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: LocalConfig.COLOR.WHITE,
                        fontFamily: 'verdanab',
                      }}>
                      Coupon
                    </Text>
                  </View>
                  {this.state.promo == 0 && (
                    <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <TextInput
                        style={{
                          borderRadius: 10,
                          borderWidth: 0.8,
                          borderColor: LocalConfig.COLOR.BLACK_LIGHT,
                          height: 35,
                          width: 'auto',
                          marginLeft: '7%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontFamily: 'Proxima Nova Font',
                        }}
                        color={LocalConfig.COLOR.WHITE}
                        onChangeText={promocode => this.setState({ promocode })}
                        placeholder="Enter Coupon Code..."
                        placeholderTextColor={
                          LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                        }
                      />
                    </View>
                  )}
                  {this.state.promo == 0 ? (
                    <TouchableOpacity
                      style={{
                        width: '25%',
                        alignSelf: 'center',
                        alignItems: 'center',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        height: 30,
                        borderRadius: 5,
                        marginLeft: '3%',
                      }}
                      onPress={() => {
                        if (this.state.promocode.length > 0) {
                          this.offerTextCode();
                        } else this.setModalVisible(true);
                      }}>
                      {this.state.loadingPromo ? (
                        <ActivityIndicator
                          size={'small'}
                          color={LocalConfig.COLOR.BLACK}
                          style={{
                            marginTop: '5.5%',
                          }}
                        />
                      ) : (
                        <Text
                          style={{
                            marginTop: '7.5%',
                            color: LocalConfig.COLOR.BLACK,
                            marginBottom: '0%',
                            fontSize: 13,
                            fontFamily: 'Proxima Nova Bold',
                          }}>{`APPLY`}</Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        width: '25%',
                        alignSelf: 'center',
                        alignItems: 'center',
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        height: 30,
                        borderRadius: 5,
                        marginLeft: '35%',
                      }}
                      onPress={() => {
                        this.setModalVisible(true);
                      }}>
                      <Text
                        style={{
                          marginTop: '6.5%',
                          color: LocalConfig.COLOR.BLACK,
                          marginBottom: '0%',
                          fontSize: 13,
                          fontFamily: 'Proxima Nova Bold',
                        }}>{`APPLIED`}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {/* ADD TIP */}
              {this.state.tips2 == 1 && this.state.espstatus != 1 ? (
                <TouchableWithoutFeedback
                  onPress={() =>
                    Keyboard.dismiss(
                      this.state.tips > 0
                        ? this.setState({ tips1: 1 })
                        : this.setState({ tips1: 0, tips: 0 }),
                    )
                  }>
                  <View
                    style={{
                      backgroundColor: LocalConfig.COLOR.BLACK,
                      width: width,
                      marginTop: '2%',
                      marginBottom: '5%',
                      shadowColor: LocalConfig.COLOR.WHITE,
                      elevation: 3,
                    }}>
                    <View flexDirection="row">
                      <View>
                        <Text
                          style={{
                            marginLeft: '5%',
                            marginBottom: '2%',
                            marginTop: '2%',
                            fontSize: width / 31,
                            color: LocalConfig.COLOR.WHITE,
                            fontFamily: 'verdanab',
                          }}>
                          Thank you for adding a Tip!
                        </Text>
                        <View flexDirection="row" marginBottom="5%">
                          {this.state.tips == 15 ? (
                            <TouchableOpacity
                              flexDirection="row"
                              style={{
                                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                                shadowColor: LocalConfig.COLOR.BLACK,
                                elevation: 0,
                                marginTop: '3%',
                                marginLeft: '5%',
                                marginRight: '5%',
                                width: '16.5%',
                                borderRadius: 4,
                              }}
                              onPress={() =>
                                this.setState({ tips: 0, tips1: 0 })
                              }>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({ tips: 0, tips1: 0 })
                                }>
                                <Text
                                  style={{
                                    color: LocalConfig.COLOR.BLACK,
                                    fontSize: width / 31,
                                    fontFamily: 'verdanab',
                                    marginTop: '13%',
                                    marginLeft: '25%',
                                  }}>
                                  {'\u20B9'}15
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({ tips: 0, tips1: 0 })
                                }>
                                <Ionicons
                                  name="close"
                                  color={LocalConfig.COLOR.BLACK}
                                  size={10}
                                  style={{
                                    marginTop: '-39%',
                                    marginLeft: '80%',
                                  }}></Ionicons>
                              </TouchableOpacity>
                            </TouchableOpacity>
                          ) : (
                            <Button
                              style={{
                                marginTop: '3%',
                                marginLeft: '5%',
                                marginRight: '5%',
                                elevation: 2,
                                shadowColor: LocalConfig.COLOR.WHITE,
                              }}
                              mode="outlined"
                              color={LocalConfig.COLOR.UI_COLOR}
                              onPress={() =>
                                this.setState({ tips: 15, tips1: 0 })
                              }>
                              <Text
                                style={{
                                  color: LocalConfig.COLOR.UI_COLOR,
                                  fontSize: width / 31,
                                  fontFamily: 'verdanab',
                                }}>
                                {'\u20B9'}15
                              </Text>
                            </Button>
                          )}
                          {this.state.tips == 20 ? (
                            <TouchableOpacity
                              flexDirection="row"
                              style={{
                                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                                shadowColor: LocalConfig.COLOR.BLACK,
                                elevation: 0,
                                marginTop: '3%',
                                marginRight: '5%',
                                width: '16.5%',
                                borderRadius: 4,
                              }}
                              onPress={() =>
                                this.setState({ tips: 0, tips1: 0 })
                              }>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({ tips: 0, tips1: 0 })
                                }>
                                <Text
                                  style={{
                                    color: LocalConfig.COLOR.BLACK,
                                    fontSize: width / 31,
                                    fontFamily: 'verdanab',
                                    marginTop: '13%',
                                    marginLeft: '25%',
                                  }}>
                                  {'\u20B9'}20
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({ tips: 0, tips1: 0 })
                                }>
                                <Ionicons
                                  name="close"
                                  color={LocalConfig.COLOR.BLACK}
                                  size={10}
                                  style={{
                                    marginTop: '-39%',
                                    marginLeft: '80%',
                                  }}></Ionicons>
                              </TouchableOpacity>
                            </TouchableOpacity>
                          ) : (
                            <Button
                              style={{
                                marginTop: '3%',
                                elevation: 2,
                                shadowColor: LocalConfig.COLOR.WHITE,
                                marginRight: '5%',
                              }}
                              mode="outlined"
                              color={LocalConfig.COLOR.UI_COLOR}
                              onPress={() =>
                                this.setState({ tips: 20, tips1: 0 })
                              }>
                              <Text
                                style={{
                                  color: LocalConfig.COLOR.UI_COLOR,
                                  fontSize: width / 31,
                                  fontFamily: 'verdanab',
                                }}>
                                {'\u20B9'}20
                              </Text>
                            </Button>
                          )}
                          {this.state.tips == 30 ? (
                            <TouchableOpacity
                              flexDirection="row"
                              style={{
                                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                                shadowColor: LocalConfig.COLOR.BLACK,
                                elevation: 0,
                                marginTop: '3%',
                                marginRight: '5%',
                                width: '16.5%',
                                borderRadius: 4,
                              }}
                              onPress={() =>
                                this.setState({ tips: 0, tips1: 0 })
                              }>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({ tips: 0, tips1: 0 })
                                }>
                                <Text
                                  style={{
                                    color: LocalConfig.COLOR.BLACK,
                                    fontSize: width / 31,
                                    fontFamily: 'verdanab',
                                    marginTop: '13%',
                                    marginLeft: '25%',
                                  }}>
                                  {'\u20B9'}30
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({ tips: 0, tips1: 0 })
                                }>
                                <Ionicons
                                  name="close"
                                  color={LocalConfig.COLOR.BLACK}
                                  size={10}
                                  style={{
                                    marginTop: '-39%',
                                    marginLeft: '80%',
                                  }}></Ionicons>
                              </TouchableOpacity>
                            </TouchableOpacity>
                          ) : (
                            <Button
                              style={{
                                marginTop: '3%',
                                marginRight: '5%',
                                elevation: 2,
                                shadowColor: LocalConfig.COLOR.WHITE,
                              }}
                              mode="outlined"
                              color={LocalConfig.COLOR.UI_COLOR}
                              onPress={() =>
                                this.setState({ tips: 30, tips1: 0 })
                              }>
                              <Text
                                style={{
                                  color: LocalConfig.COLOR.UI_COLOR,
                                  fontSize: width / 31,
                                  fontFamily: 'verdanab',
                                }}>
                                {'\u20B9'}30
                              </Text>
                            </Button>
                          )}
                          {this.state.tips1 == 1 ? (
                            <TouchableOpacity
                              flexDirection="row"
                              style={{
                                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                                shadowColor: LocalConfig.COLOR.BLACK,
                                elevation: 0,
                                marginTop: '3%',
                                marginRight: '5%',
                                width: '26%',
                                borderRadius: 3,
                              }}
                              onPress={() =>
                                this.setState({ tips: 0, tips1: 0 })
                              }>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({ tips: 0, tips1: 0 })
                                }>
                                <Text
                                  style={{
                                    color: LocalConfig.COLOR.BLACK,
                                    fontSize: width / 31,
                                    fontFamily: 'verdanab',
                                    marginTop: '10%',
                                    marginLeft: '15%',
                                  }}>
                                  CUSTOM
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({ tips: 0, tips1: 0 })
                                }>
                                <Ionicons
                                  name="close"
                                  color={LocalConfig.COLOR.BLACK}
                                  size={10}
                                  style={{
                                    marginTop: '-26%',
                                    marginLeft: '87%',
                                  }}></Ionicons>
                              </TouchableOpacity>
                            </TouchableOpacity>
                          ) : (
                            <Button
                              style={{
                                marginTop: '3%',
                                marginRight: '5%',
                                elevation: 2,
                                shadowColor: LocalConfig.COLOR.WHITE,
                              }}
                              mode="outlined"
                              color={LocalConfig.COLOR.UI_COLOR}
                              onPress={() => {
                                this.setState({ tips1: 1, tips: 0 });
                                this.timeout();
                              }}>
                              <Text
                                style={{
                                  color: LocalConfig.COLOR.UI_COLOR,
                                  fontSize: moderateScale(13),
                                  fontFamily: 'verdanab',
                                }}>
                                CUSTOM
                              </Text>
                            </Button>
                          )}
                        </View>
                      </View>
                    </View>
                    {this.state.tips1 == 1 && (
                      <View
                        flexDirection="row"
                        marginBottom="5%"
                        marginTop="3%">
                        <Text
                          style={{
                            marginLeft: '5%',
                            marginRight: '2%',
                            marginBottom: '2%',
                            fontSize: 19,
                            color: LocalConfig.COLOR.WHITE,
                            fontFamily: 'Proxima Nova Font',
                          }}>
                          {'\u20B9'}
                        </Text>
                        <TextInput
                          style={{
                            fontSize: width / 25.68,
                            borderColor: 'gray',
                            marginTop: '-5%',
                            width: '85%',
                            borderRadius: 10,
                            fontFamily: 'Proxima Nova Font',
                            color: LocalConfig.COLOR.WHITE,
                          }}
                          onChangeText={tips => {
                            if (tips != "" && (parseFloat(tips) > 0)) {
                              this.setState({ tips: parseFloat(tips) })
                            } else {
                              this.setState({ tips: 0 })
                            }
                          }}
                          underlineColorAndroid={LocalConfig.COLOR.UI_COLOR}
                          keyboardType="numeric"
                          placeholder="Enter Tip Amount"
                          maxLength={3}
                          placeholderTextColor={LocalConfig.COLOR.WHITE_LIGHT}
                          ref={this.callRef}
                        />
                      </View>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              ) : null}
              <View
                style={{
                  width: width,
                  justifyContent: 'center',
                  marginTop: '1%',
                  backgroundColor: LocalConfig.COLOR.BLACK,
                  height: height / 3.6,
                  shadowColor: LocalConfig.COLOR.WHITE,
                  elevation: 3,
                }}>
                <View style={{ marginTop: '1%' }}>
                  <Text
                    style={{
                      fontSize: width / 29.35,
                      color: LocalConfig.COLOR.WHITE,
                      letterSpacing: 0.3,
                      marginLeft: '5%',
                      fontFamily: 'verdanab',
                      marginBottom: '0.5%',
                    }}>
                    Bill Details
                  </Text>
                  <View
                    style={{
                      borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                      borderBottomWidth: 1,
                      marginTop: 5,
                    }}
                  />
                  <View
                    style={{
                      marginTop: '1%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: '1%',
                    }}>
                    <Text
                      style={{
                        fontSize: width / 28.34,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginLeft: '5%',
                        fontFamily: 'Proxima Nova Font',
                      }}>
                      Item Total
                    </Text>
                    <Text
                      style={{
                        fontSize: width / 28.34,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginRight: '6%',
                        fontFamily: 'Proxima Nova Font',
                      }}>
                      {'\u20B9'}
                      {this.state.subtotal.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: '1%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: '1%',
                    }}>
                    <Text
                      style={{
                        fontSize: width / 28.34,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginLeft: '5%',
                        fontFamily: 'Proxima Nova Font',
                      }}>
                      Tax ( {this.state.foodTax}% )
                    </Text>
                    <Text
                      style={{
                        fontSize: width / 28.34,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginRight: '6%',
                        fontFamily: 'Proxima Nova Font',
                      }}>
                      {'\u20B9'}
                      {(this.state.taxPrice =
                        (parseFloat(this.state.subtotal) / 100) *
                        this.state.foodTax).toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: '1%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: '1%',
                    }}>
                    <Text
                      style={{
                        fontSize: width / 28.34,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginLeft: '5%',
                        fontFamily: 'Proxima Nova Font',
                      }}>
                      Delivery Charges
                    </Text>
                    <Text
                      style={{
                        fontSize: width / 28.34,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginRight: '6%',
                        fontFamily: 'Proxima Nova Font',
                      }}>
                      {'\u20B9'}
                      {checked1 == false && checked2 == false
                        ? (this.state.dc = 0)
                        : checked1
                          ? (this.state.latlong1 = 0)
                          : (this.state.dc = parseFloat(this.state.dc1).toFixed(2))}
                      {this.state.dc == undefined ? (this.state.dc = 0) : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: '1%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: '1%',
                    }}>
                    <Text
                      style={{
                        fontSize: width / 28.34,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginLeft: '5%',
                        fontFamily: 'Proxima Nova Font',
                      }}>
                      Others
                    </Text>
                    <Text
                      style={{
                        fontSize: width / 28.34,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginRight: '6%',
                        fontFamily: 'Proxima Nova Font',
                      }}>
                      {'\u20B9'}
                      {this.state.tips.length == 0
                        ? (this.state.tips = 0)
                        : this.state.tips.toFixed(2)}
                    </Text>
                  </View>
                  {this.state.espstatus != 1 ? (
                    <View
                      style={{
                        marginTop: '1%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: '1%',
                      }}>
                      <Text
                        style={{
                          fontSize: width / 28.34,
                          color: LocalConfig.COLOR.WHITE,
                          letterSpacing: 0.3,
                          marginLeft: '5%',
                          fontFamily: 'Proxima Nova Font',
                        }}>
                        Discount
                      </Text>
                      {this.state.promo == 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            this.setModalVisible(true);
                          }}>
                          <Text
                            style={{
                              fontSize: width / 28.34,
                              color: LocalConfig.COLOR.UI_COLOR,
                              letterSpacing: 0.3,
                              marginRight: '6%',
                              fontFamily: 'Proxima Nova Font',
                            }}>
                            Apply
                          </Text>
                        </TouchableOpacity>
                      )}
                      {this.state.promo > 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            this.setModalVisible(true);
                          }}>
                          <Text
                            style={{
                              fontSize: width / 31.6,
                              color: LocalConfig.COLOR.UI_COLOR,
                              letterSpacing: 0.3,
                              marginRight: 20,
                            }}>
                            -{'\u20B9'}
                            {this.state.promo}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : null}
                  <View
                    style={{
                      borderBottomColor: LocalConfig.COLOR.WHITE,
                      borderBottomWidth: 1,
                      marginTop: '1%',
                    }}
                  />
                  <View
                    style={{
                      marginTop: '2%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginLeft: '5%',
                        fontFamily: 'verdanab',
                      }}>
                      Total
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginRight: '5%',
                        fontFamily: 'verdanab',
                        display: 'none',
                      }}>
                      {'\u20B9'}
                      {
                        (this.state.total_price = (
                          parseFloat(this.state.subtotal) +
                          gst +
                          parseFloat(this.state.dc) +
                          parseFloat(this.state.pc) +
                          parseFloat(this.state.tips) -
                          parseFloat(this.state.promo)
                        ).toFixed(2))
                      }
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: LocalConfig.COLOR.WHITE,
                        letterSpacing: 0.3,
                        marginRight: '5%',
                        fontFamily: 'verdanab',
                      }}>
                      {'\u20B9'}
                      {(this.state.total_price =
                        parseFloat(this.state.total_price) +
                        (parseFloat(this.state.subtotal) / 100) *
                        this.state.foodTax).toFixed(2)}
                    </Text>
                  </View>
                  <Modal
                    style={{
                      width: width,
                      marginLeft: '0%',
                      marginBottom: '-1%',
                    }}
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modal19}
                    onBackdropPress={() => this.setState({ modal19: false })}
                    onRequestClose={() => {
                      this.setState({ modal19: false });
                    }}>
                    <BlurView
                      style={styles.absolute}
                      blurType="dark"
                      blurAmount={6}
                      reducedTransparencyFallbackColor="white"
                    />
                    <View
                      style={{
                        height: '27%',
                        marginTop: 'auto',
                        backgroundColor: LocalConfig.COLOR.WHITE,
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
                          <View style={{ width: '90%' }}>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.WHITE,
                                fontSize: width / 29.35,
                                fontFamily: 'verdanab',
                                textTransform: 'capitalize',
                                padding: '5%',
                                letterSpacing: 0.3,
                              }}>
                              {this.state.addonitem.item_name}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ modal19: false });
                            }}>
                            <View
                              style={{
                                color: LocalConfig.COLOR.WHITE,
                                fontSize: width / 27.4,
                                marginTop: '20%',
                              }}>
                              <MaterialIcons
                                name="close"
                                size={25}
                                color={LocalConfig.COLOR.WHITE}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                          borderBottomWidth: 0.5,
                          marginTop: '-2%',
                          marginBottom: '3%',
                        }}
                      />
                      <View flexDirection="row">
                        <Button
                          style={{
                            marginTop: '5%',
                            marginLeft: '3%',
                            width: '45%',
                            marginRight: '5%',
                            elevation: 0,
                          }}
                          mode="outlined"
                          color={LocalConfig.COLOR.UI_COLOR}
                          onPress={() => {
                            this.setState({ modal18: true, modal19: false });
                          }}>
                          <Text
                            style={{
                              color: LocalConfig.COLOR.UI_COLOR,
                              fontSize: width / 31.61,
                              fontFamily: 'verdanab',
                            }}>
                            I'LL CHOOSE
                          </Text>
                        </Button>
                        <Button
                          style={{
                            marginTop: '5%',
                            width: '45%',
                            marginRight: '5%',
                            elevation: 0,
                          }}
                          mode="contained"
                          color={LocalConfig.COLOR.UI_COLOR}
                          onPress={() => {
                            this.addPlusItem1(this.state.addonitem);
                            this.setState({ modal19: false });
                          }}>
                          <Text
                            style={{
                              color: LocalConfig.COLOR.WHITE,
                              fontSize: width / 31.61,
                              fontFamily: 'verdanab',
                            }}>
                            REPEAT
                          </Text>
                        </Button>
                      </View>
                    </View>
                  </Modal>
                  <Modal
                    style={{
                      width: width,
                      marginLeft: '0%',
                      marginBottom: '0%',
                      marginTop: '0%',
                    }}
                    animationType="slide"
                    transparent={true}
                    key={this.state.id}
                    visible={this.state.modal18}
                    onBackdropPress={() => {
                      this.setState({
                        checked18: [],
                        temp_id: [],
                        temp_name: [],
                        temp_price: [],
                        modal18: false,
                        varcheck: [],
                        radioid: [],
                        radioprice: [],
                        variantid: [],
                        variant_name: [],
                        variant_price: [],
                        radioname: [],
                      });
                    }}
                    onRequestClose={() => {
                      this.setState({
                        checked18: [],
                        temp_id: [],
                        temp_name: [],
                        temp_price: [],
                        modal18: false,
                        varcheck: [],
                        radioid: [],
                        radioprice: [],
                        variantid: [],
                        variant_name: [],
                        variant_price: [],
                        radioname: [],
                      });
                    }}>
                    <BlurView
                      style={styles.absolute}
                      blurType="dark"
                      blurAmount={6}
                      reducedTransparencyFallbackColor="white"
                    />
                    <View
                      style={{
                        marginTop: 'auto',
                        backgroundColor: LocalConfig.COLOR.WHITE,
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
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
                          <View style={{ width: '90%' }}>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.WHITE,
                                fontSize: 14,
                                fontFamily: 'verdanab',
                                textTransform: 'capitalize',
                                padding: '5%',
                                letterSpacing: 0.3,
                              }}>
                              {this.state.addonitem.item_name}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                checked18: [],
                                temp_id: [],
                                temp_name: [],
                                temp_price: [],
                                modal18: false,
                                varcheck: [],
                                radioid: [],
                                radioprice: [],
                                variantid: [],
                                variant_name: [],
                                variant_price: [],
                                radioname: [],
                              });
                            }}>
                            <View
                              style={{
                                marginTop: '55%',
                              }}>
                              <MaterialIcons
                                name="close"
                                size={25}
                                color={LocalConfig.COLOR.WHITE}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                          borderBottomWidth: 0.5,
                          marginTop: '-2%',
                          marginBottom: '3%',
                        }}
                      />
                      <ScrollView>
                        {this.state.addon.map((item, index) => (
                          <View key={index}>
                            <View flexDirection="row" marginLeft="5%">
                              <CheckBox
                                value={this.state.checked18[item.id]}
                                uncheckedColor={
                                  LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                                }
                                onValueChange={ev =>
                                  this.changeEvent1(ev, index, item)
                                }
                                key={index}
                                tintColors={{
                                  true: LocalConfig.COLOR.UI_COLOR,
                                  false: LocalConfig.COLOR.UI_COLOR,
                                }}
                              />
                              <TouchableOpacity
                                onPress={ev =>
                                  this.changeEvent1(ev, index, item)
                                }>
                                <View flexDirection="row">
                                  <Text
                                    style={{
                                      marginTop: '3%',
                                      fontFamily: 'Proxima Nova Font',
                                      width: '60%',
                                      marginLeft: '5%',
                                      color: LocalConfig.COLOR.BLACK,
                                    }}>
                                    {item.item_name}
                                  </Text>
                                  {item.price == '0' && (
                                    <Text
                                      style={{
                                        marginTop: '3%',
                                        fontFamily: 'Proxima Nova Font',
                                        marginLeft: '10%',
                                        color: LocalConfig.COLOR.WHITE,
                                      }}>
                                      free
                                    </Text>
                                  )}
                                  {item.price !== '0' && (
                                    <Text
                                      style={{
                                        marginTop: '3%',
                                        fontFamily: 'Proxima Nova Font',
                                        marginLeft: '10%',
                                        color: LocalConfig.COLOR.BLACK,
                                      }}>
                                      {'\u20B9'} {item.price}
                                    </Text>
                                  )}
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{
                                borderBottomColor:
                                  LocalConfig.COLOR.WHITE_LIGHT,
                                borderBottomWidth: 0.6,
                                marginTop: '1%',
                              }}
                            />
                          </View>
                        ))}
                        {this.state.variant.map((item1, index) => (
                          <View key={index}>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.BLACK,
                                fontSize: 14,
                                fontFamily: 'verdanab',
                                padding: 5,
                                marginBottom: '2%',
                                textAlign: 'center',
                                textTransform: 'capitalize',
                              }}>
                              {item1.heading}
                            </Text>
                            {item1.data.map((data, dindex) => (
                              <View key={dindex}>
                                {item1.status == 0 ? (
                                  <View flexDirection="row" marginLeft="5%">
                                    <CheckBox
                                      value={this.state.varcheck[data.id]}
                                      uncheckedColor={
                                        LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                                      }
                                      onValueChange={ev =>
                                        this.changeEvent27(data)
                                      }
                                      key={index}
                                      tintColors={{
                                        true: LocalConfig.COLOR.UI_COLOR,
                                        false: LocalConfig.COLOR.UI_COLOR,
                                      }}
                                    />
                                    <TouchableOpacity
                                      onPress={ev => this.changeEvent27(data)}>
                                      <View flexDirection="row">
                                        <Text
                                          style={{
                                            marginTop: '2%',
                                            fontFamily: 'Proxima Nova Font',
                                            width: '64%',
                                            marginLeft: '2.5%',
                                            color: LocalConfig.COLOR.BLACK,
                                            fontSize: 14.5,
                                          }}>
                                          {data.variant_name}
                                        </Text>
                                        {data.price == '0' && (
                                          <Text
                                            style={{
                                              marginTop: '2%',
                                              fontFamily: 'Proxima Nova Font',
                                              marginLeft: '10%',
                                              color: LocalConfig.COLOR.WHITE,
                                              fontSize: 14.5,
                                              width: '20%',
                                            }}>
                                            {'\u20B9'} {data.price}
                                          </Text>
                                        )}
                                        {data.price !== '0' && (
                                          <Text
                                            style={{
                                              marginTop: '2%',
                                              fontFamily: 'Proxima Nova Font',
                                              marginLeft: '10%',
                                              color: LocalConfig.COLOR.BLACK,
                                              fontSize: 14.5,
                                              width: '20%',
                                            }}>
                                            {'\u20B9'} {data.price}
                                          </Text>
                                        )}
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <RadioButton.Group
                                    onValueChange={() =>
                                      this.radio1(index, data)
                                    }
                                    value={this.state.radioid[index]}>
                                    {data.price == '0' && (
                                      <RadioButton.Item
                                        labelStyle={{
                                          fontSize: 14.5,
                                          fontFamily: 'Proxima Nova Font',
                                          color: LocalConfig.COLOR.WHITE
                                        }}
                                        label={data.variant_name}
                                        label1={''}
                                        value={data.id}
                                        uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                                        color={LocalConfig.COLOR.UI_COLOR}
                                      />
                                    )}
                                    {data.price !== '0' && (
                                      <RadioButton.Item
                                        labelStyle={{
                                          fontSize: 14.5,
                                          fontFamily: 'Proxima Nova Font',
                                          color: LocalConfig.COLOR.WHITE
                                        }}
                                        label={data.variant_name}
                                        label1={'\u20B9' + data.price}
                                        value={data.id}
                                        uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                                        color={LocalConfig.COLOR.UI_COLOR}
                                      />
                                    )}
                                  </RadioButton.Group>
                                )}
                                <View
                                  style={{
                                    borderBottomColor:
                                      LocalConfig.COLOR.WHITE_LIGHT,
                                    borderBottomWidth: 0.6,
                                    marginTop: '1%',
                                  }}
                                />
                              </View>
                            ))}
                          </View>
                        ))}
                      </ScrollView>
                      <View
                        style={{
                          bottom: 5,
                          left: 0,
                          width: '100%',
                        }}>
                        <View
                          style={{
                            borderBottomColor: LocalConfig.COLOR.WHITE,
                            borderBottomWidth: 0.5,
                            marginTop: '2%',
                            marginBottom: '2%',
                            width: '100%',
                          }}
                        />
                        <TouchableOpacity
                          style={{
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            width: '100%',
                            borderRadius: 3,
                            height: 40,
                            bottom: 0,
                          }}
                          onPress={() => this.addItem(this.state.addonitem)}>
                          <View flexDirection="row" style={{ marginTop: '2.5%' }}>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.WHITE,
                                width: '70%',
                                marginLeft: '5%',
                                fontFamily: 'Proxima Nova Bold',
                              }}>
                              Item Total{' '}
                              {parseFloat(this.state.addonitem.price) +
                                parseFloat(price) +
                                parseFloat(price1) +
                                parseFloat(price2)}
                            </Text>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.WHITE,
                                alignSelf: 'flex-end',
                                fontFamily: 'Proxima Nova Bold',
                              }}>
                              ADD ITEM
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                      this.setModalVisible(!this.state.modalVisible);
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
                      blurAmount={1}
                      reducedTransparencyFallbackColor="white"
                    />
                    <View
                      style={{
                        // height: '47%',
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
                                letterSpacing: 0.3,
                              }}>
                              Apply Coupon
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <View
                              style={{
                                color: LocalConfig.COLOR.WHITE,
                                fontSize: 15,
                                padding: '5%',
                                marginLeft: '57%',
                              }}>
                              <MaterialIcons
                                name="close"
                                size={25}
                                color={LocalConfig.COLOR.BLACK}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {this.state.dataSource1.length <= 0 ? (
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'verdanab',
                              color: LocalConfig.COLOR.UI_COLOR_LITE,
                            }}>
                            No Coupon Available
                          </Text>
                        </View>
                      ) : (
                        <ScrollView>
                          {this.state.dataSource1.map((item, index) => (
                            <View key={item.promo_id}>
                              <View style={{ flexDirection: 'row' }}>
                                <View
                                  style={{
                                    height: 28,
                                    backgroundColor: '#fef9e5',
                                    width: '30%',
                                    borderColor: '#d9ceb8',
                                    borderWidth: 0.5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 15,
                                      color: '#343a40',
                                      fontFamily: 'Proxima Nova Font',
                                    }}>
                                    {item.promo_code}
                                  </Text>
                                  <Ionicons name="ios-pricetags" size={15} color="#f9c74f" style={{ marginTop: '3%', marginLeft: '1%' }} />
                                </View>
                                <View style={{ margin: 20 }}>
                                  {/* APPLY BUTTON */}
                                  <TouchableOpacity
                                    onPress={() => {
                                      this._onPressItem(item);
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 14,
                                        color: LocalConfig.COLOR.UI_COLOR,
                                        marginLeft: '55%',
                                        marginTop: 5,
                                        justifyContent: 'flex-end',
                                        fontFamily: 'verdanab',
                                      }}>
                                      {item.promo_id == this.state.promo_id ? "APPLYED" : "APPLY"}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <View>
                                {item.promo_type == 'amount' && (
                                  <Text
                                    style={{
                                      marginLeft: '5%',
                                      marginTop: '-5%',
                                      color: LocalConfig.COLOR.WHITE,
                                      fontFamily: 'Proxima Nova Font',
                                      fontSize: 14,
                                    }}>
                                    Discount : {'\u20B9'} {item.discount_pa}{' '}
                                  </Text>
                                )}
                                {item.promo_type == 'percent' && (
                                  <Text
                                    style={{
                                      marginLeft: '5%',
                                      marginTop: '-5%',
                                      color: LocalConfig.COLOR.WHITE,
                                      fontFamily: 'Proxima Nova Font',
                                      fontSize: 14,
                                    }}>
                                    Discount : {item.discount_pa} %{' '}
                                  </Text>
                                )}
                                <Dash
                                  dashGap={5}
                                  dashThickness={0.7}
                                  dashColor={LocalConfig.COLOR.UI_COLOR}
                                  style={{
                                    width: '100%',
                                    height: 3,
                                    marginTop: '3%',
                                    marginBottom: '2%',
                                  }}
                                />
                              </View>
                            </View>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </Modal>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    key={this.state.id}
                    visible={modalVisible12}
                    onBackdropPress={() => {
                      this.setModalVisible12(!modalVisible12);
                      this.setState({
                        checked12: [],
                        temp_id: [],
                        temp_name: [],
                        temp_price: [],
                        varcheck: [],
                        radioid: [],
                        radioprice: [],
                        variantid: [],
                        variant_name: [],
                        variant_price: [],
                        radioname: [],
                      });
                    }}
                    onRequestClose={() => {
                      this.setModalVisible12(!modalVisible12);
                      this.setState({
                        checked12: [],
                        temp_id: [],
                        temp_name: [],
                        temp_price: [],
                        varcheck: [],
                        radioid: [],
                        radioprice: [],
                        variantid: [],
                        variant_name: [],
                        variant_price: [],
                        radioname: [],
                      });
                    }}>
                    <BlurView
                      style={styles.absolute}
                      blurType="dark"
                      blurAmount={6}
                      reducedTransparencyFallbackColor="white"
                    />
                    <View
                      style={{
                        //height: '98%',
                        marginTop: 'auto',
                        backgroundColor: LocalConfig.COLOR.BLACK,
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
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
                          <View style={{ width: '90%' }}>
                            <Text
                              style={{
                                color: LocalConfig.COLOR.BLACK,
                                fontSize: 14,
                                fontFamily: 'verdanab',
                                textTransform: 'capitalize',
                                padding: '5%',
                                letterSpacing: 0.3,
                                //({this.state.addon.length}){' '}// if you need just add the text tag
                              }}>
                              {this.state.addonname}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.setModalVisible12(!modalVisible12);
                              this.setState({
                                checked12: [],
                                temp_id: [],
                                temp_name: [],
                                temp_price: [],
                                varcheck: [],
                                radioid: [],
                                radioprice: [],
                                variantid: [],
                                variant_name: [],
                                variant_price: [],
                                radioname: [],
                              });
                            }}>
                            <View
                              style={{
                                color: LocalConfig.COLOR.WHITE,
                                fontSize: 15,
                                padding: '6%',
                                marginTop: '20%',
                              }}>
                              <MaterialIcons
                                name="close"
                                size={25}
                                color={LocalConfig.COLOR.BLACK}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                          borderBottomWidth: 0.5,
                          marginTop: '-2%',
                          marginBottom: '3%',
                        }}
                      />
                      <ScrollView>
                        {/* <Text style={{color:LocalConfig.COLOR.BLACK,fontSize: 14,
                            fontFamily:'verdanab',
                         marginLeft:'6%',
                          textTransform:'capitalize',}}>Add ons 1</Text> */}
                        {this.state.addon.map((item, index) => (
                          <View key={index}>
                            <View flexDirection="row" marginLeft="5%">
                              <CheckBox
                                value={this.state.checked12[item.id]}
                                uncheckedColor={
                                  LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                                }
                                onValueChange={ev =>
                                  this.changeEvent(ev, index, item)
                                }
                                key={index}
                                tintColors={{
                                  true: LocalConfig.COLOR.UI_COLOR,
                                  false: LocalConfig.COLOR.UI_COLOR,
                                }}
                              />
                              <View flexDirection="row">
                                <Text
                                  style={{
                                    marginTop: '3%',
                                    fontFamily: 'Proxima Nova Font',
                                    width: '60%',
                                    marginLeft: '5%',
                                    color: LocalConfig.COLOR.WHITE,
                                  }}>
                                  {item.item_name}
                                </Text>
                                {item.price == '0' && (
                                  <Text
                                    style={{
                                      marginTop: '3%',
                                      fontFamily: 'Proxima Nova Font',
                                      marginLeft: '10%',
                                      color: LocalConfig.COLOR.WHITE,
                                    }}>
                                    free
                                  </Text>
                                )}
                                {item.price !== '0' && (
                                  <Text
                                    style={{
                                      marginTop: '3%',
                                      fontFamily: 'Proxima Nova Font',
                                      marginLeft: '10%',
                                      color: LocalConfig.COLOR.WHITE,
                                    }}>
                                    {'\u20B9'} {item.price}
                                  </Text>
                                )}
                              </View>
                            </View>
                            <View
                              style={{
                                borderBottomColor:
                                  LocalConfig.COLOR.WHITE_LIGHT,
                                borderBottomWidth: 0.6,
                                marginTop: '1%',
                              }}
                            />
                          </View>
                        ))}
                        {this.state.variant.map((item1, index) => (
                          <View key={index} style={{ marginBottom: '3%' }}>
                            {item1.data.length > 0 ? (
                              <Text
                                style={{
                                  color: LocalConfig.COLOR.WHITE,
                                  fontSize: 14,
                                  fontFamily: 'verdanab',
                                  padding: 5,
                                  marginBottom: '2%',
                                  textAlign: 'center',
                                  textTransform: 'capitalize',
                                }}>
                                {item1.heading}
                              </Text>
                            ) : (
                              <Text></Text>
                            )}
                            {item1.data.map(data => (
                              <View key={data.id}>
                                {item1.status == 0 ? (
                                  <View flexDirection="row" marginLeft="5%">
                                    <CheckBox
                                      value={this.state.varcheck[data.id]}
                                      uncheckedColor={
                                        LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                                      }
                                      onValueChange={ev =>
                                        this.changeEvent12(data)
                                      }
                                      key={index}
                                      tintColors={{
                                        true: LocalConfig.COLOR.UI_COLOR,
                                        false: LocalConfig.COLOR.UI_COLOR,
                                      }}
                                    />
                                    <TouchableOpacity
                                      onPress={ev => this.changeEvent12(data)}>
                                      <View flexDirection="row">
                                        <Text
                                          style={{
                                            marginTop: '2%',
                                            fontFamily: 'Proxima Nova Font',
                                            width: '64%',
                                            marginLeft: '2.5%',
                                            color: LocalConfig.COLOR.WHITE,
                                            fontSize: 14.5,
                                          }}>
                                          {data.variant_name}
                                        </Text>
                                        {data.price == '0' && (
                                          <Text
                                            style={{
                                              marginTop: '2%',
                                              fontFamily: 'Proxima Nova Font',
                                              marginLeft: '10%',
                                              color: LocalConfig.COLOR.WHITE,
                                              fontSize: 14.5,
                                              width: '20%',
                                            }}>
                                            {'\u20B9'}
                                            {data.price}
                                          </Text>
                                        )}
                                        {data.price !== '0' && (
                                          <Text
                                            style={{
                                              marginTop: '2%',
                                              fontFamily: 'Proxima Nova Font',
                                              marginLeft: '10%',
                                              color: LocalConfig.COLOR.WHITE,
                                              fontSize: 14.5,
                                              width: '20%',
                                            }}>
                                            {'\u20B9'}
                                            {data.price}
                                          </Text>
                                        )}
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <RadioButton.Group
                                    onValueChange={() =>
                                      this.radio(index, data)
                                    }
                                    value={this.state.radioid[index]}>
                                    {data.price == '0' && (
                                      <RadioButton.Item
                                        labelStyle={{
                                          fontSize: 14.5,
                                          fontFamily: 'Proxima Nova Font',
                                          color: LocalConfig.COLOR.WHITE
                                        }}
                                        label={data.variant_name}
                                        label1={''}
                                        value={data.id}
                                        uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                                        color={LocalConfig.COLOR.UI_COLOR}
                                      />
                                    )}
                                    {data.price !== '0' && (
                                      <RadioButton.Item
                                        labelStyle={{
                                          fontSize: 14.5,
                                          fontFamily: 'Proxima Nova Font',
                                          color: LocalConfig.COLOR.WHITE
                                        }}
                                        label={data.variant_name}
                                        label1={'\u20B9' + data.price}
                                        value={data.id}
                                        uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                                        color={LocalConfig.COLOR.UI_COLOR}
                                      />
                                    )}
                                  </RadioButton.Group>
                                )}
                                <View
                                  style={{
                                    borderBottomColor:
                                      LocalConfig.COLOR.WHITE_LIGHT,
                                    borderBottomWidth: 0.6,
                                    marginTop: '1%',
                                  }}
                                />
                              </View>
                            ))}
                          </View>
                        ))}
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            width: '30%',
                            height: 'auto',
                            alignSelf: 'center',
                            borderRadius: 5,
                            marginBottom: '10%',
                            padding: 8,
                          }}
                          onPress={() => {
                            this.setState({ modalVisible12: false });
                          }}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: LocalConfig.COLOR.BLACK,
                              textAlign: 'center',
                            }}>
                            SUBMIT
                          </Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                  </Modal>
                  <Modal
                    //style={{marginTop:'0%',width:'100%',marginLeft:'0%',marginBottom:'0%'}}
                    animationType="slide"
                    transparent={true}
                    visible={this.state.loginmodal}
                    onRequestClose={() => {
                      this.setState({
                        loginmodal: false,
                        addresspage: 0,
                        editnumber: false,
                        editemail: false,
                      });
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
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20
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
                                marginLeft: '29%',
                                padding: '5%',
                                letterSpacing: 0.3,
                              }}>
                              ALMOST THERE
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  loginmodal: false,
                                  addresspage: 0,
                                });
                              }}>
                              <View
                                style={{
                                  color: LocalConfig.COLOR.WHITE,
                                  fontSize: 15,
                                  marginTop: '13%',
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
                              color: '#525252',
                              fontSize: 10,
                              fontFamily: 'verdanab',
                              marginTop: '-6%',
                              marginLeft: '31%',
                              marginBottom: '2%',
                              letterSpacing: 0.3,
                            }}>
                            Login to place your order
                          </Text>
                        </View>
                        <View
                          style={{
                            borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                            borderBottomWidth: 0.5,
                            marginTop: '-2%',
                            marginBottom: '3%',
                          }}
                        />
                        {/* <Text style={{marginTop:'3%',width:'100%',marginLeft:'5%',marginBottom:'1%',color:'#adb5bd',fontSize:13,letterSpacing:0.4}}>Email Address</Text>   */}
                        <View
                          style={{
                            width: '80%',
                            marginTop: '9%',
                            backgroundColor: LocalConfig.COLOR.WHITE,
                            borderColor: '#808080',
                            borderRadius: 25,
                            borderWidth: 0.3,
                            height: 50,
                            marginBottom: 20,
                            justifyContent: 'center',
                            padding: 20,
                            marginLeft: '9%',
                          }}>
                          <TextInput
                            style={{
                              height: 50,
                              color: 'black',
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() =>
                              this.setState({ editemail: false })
                            }
                            color={LocalConfig.COLOR.BLACK}
                            placeholder="Enter Your Email"
                            placeholderTextColor="#003f5c"
                            multiline={false}
                            onFocus={() => this.buttonPress()}
                            onChangeText={loginemail =>
                              this.setState({ loginemail })
                            }>
                            {this.state.loginemail}
                          </TextInput>
                        </View>
                        {/* <Text style={{marginTop:'3%',width:'100%',marginLeft:'5%',marginBottom:'1%',color:'#adb5bd',fontSize:13,letterSpacing:0.4}}>Phone Number</Text> */}
                        <View
                          style={{
                            width: '80%',
                            marginTop: '3%',
                            backgroundColor: LocalConfig.COLOR.WHITE,
                            borderColor: '#808080',
                            borderRadius: 25,
                            borderWidth: 0.3,
                            height: 50,
                            marginBottom: 20,
                            justifyContent: 'center',
                            padding: 20,
                            marginLeft: '9%',
                          }}>
                          <TextInput
                            style={{
                              height: 40,
                              borderColor: 'white',
                              borderWidth: 0.5,
                              width: '90%',
                              marginLeft: '5%',
                            }}
                            returnKeyType="done"
                            onFocus={() => this.buttonPress1()}
                            onSubmitEditing={() =>
                              this.setState({ editnumber: false })
                            }
                            color={LocalConfig.COLOR.BLACK}
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
                        <Button
                          title="Update"
                          color={LocalConfig.COLOR.UI_COLOR}
                          style={{
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            width: '80%',
                            marginLeft: '9%',
                            marginTop: '5%',
                            borderRadius: 25,
                            paddingVertical: 5
                          }}
                          onPress={() => {
                            this.handleSubmitPress();
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: LocalConfig.COLOR.BLACK,
                            }}>
                            Login
                          </Text>
                        </Button>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.verifymodal}
                    onRequestClose={() => {
                      this.setState({ verifymodal: false, addresspage: 0 });
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
                      blurAmount={1}
                      reducedTransparencyFallbackColor="white"
                    />
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
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            marginBottom: '2%',
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                          }}>
                          <Text
                            style={{
                              color: LocalConfig.COLOR.BLACK,
                              fontSize: 14,
                              fontFamily: 'verdanab',
                              marginLeft: '30%',
                              padding: '5%',
                              letterSpacing: 0.3,
                            }}>
                            Verify Otp
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                verifymodal: false,
                                addresspage: 0,
                              });
                            }}>
                            <View
                              style={{
                                color: LocalConfig.COLOR.UI_COLOR,
                                fontSize: 15,
                                marginTop: '6.5%',
                                marginLeft: '45%',
                              }}>
                              <MaterialIcons
                                name="close"
                                size={25}
                                color={LocalConfig.COLOR.BLACK}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
                          borderBottomWidth: 0.5,
                          marginTop: '-2%',
                          marginBottom: '3%',
                        }}
                      />
                      <Text
                        style={{
                          height: 150,
                          marginLeft: '22%',
                          alignSelf: 'stretch',
                          marginBottom: '6%',
                          width: '78%',
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
                            backgroundColor: LocalConfig.COLOR.WHITE,
                            elevation: 2,
                          }}
                          codeInputHighlightStyle={{
                            color: LocalConfig.COLOR.BLACK,
                            fontWeight: 'bold',
                            borderRadius: 10,
                            backgroundColor: LocalConfig.COLOR.WHITE,
                            elevation: 2,
                          }}
                          onCodeFilled={otp => this.setState({ otp })}
                        />
                      </View>
                      {this.state.counter > 0 ? (
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
                            Resend OTP in {this.state.counter} secs
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={this.handleSubmitPress}>
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
                      <Button
                        title="Update"
                        color={LocalConfig.COLOR.WHITE}
                        onPress={() => {
                          if (this.state.otp.length == 4) this.handleSubmitPress1()
                        }}
                        style={{
                          marginTop: '5%',
                          backgroundColor: this.state.otp.length == 4 ? LocalConfig.COLOR.UI_COLOR : LocalConfig.COLOR.UI_COLOR_LITE,
                          width: '80%',
                          marginLeft: '10%',
                          borderRadius: 25,
                        }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.BLACK,
                            textAlign: 'center',
                          }}>
                          VERIFY
                        </Text>
                      </Button>
                    </View>
                  </Modal>
                </View>
              </View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.paymodal}
                onBackdropPress={() => this.setState({ paymodal: false })}
                onRequestClose={() => {
                  this.setState({ paymodal: false });
                }}>
                <View
                  style={{
                    height: '45%',
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
                      <View style={{ width: '90%' }}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.BLACK,
                            fontSize: 14,
                            fontFamily: 'verdanab',
                            marginLeft: '24%',
                            textTransform: 'capitalize',
                            padding: '5%',
                            letterSpacing: 0.3,
                          }}>
                          Select payment type{' '}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ paymodal: false });
                        }}>
                        <View
                          style={{
                            fontSize: 15,
                            padding: '6%',
                            marginTop: '14%',
                          }}>
                          <MaterialIcons
                            name="close"
                            size={25}
                            color={LocalConfig.COLOR.BLACK}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: LocalConfig.COLOR.UI_COLOR_LITE,
                      borderBottomWidth: 0.5,
                      marginTop: '-2%',
                      marginBottom: '3%',
                    }}
                  />
                  <ImageBackground
                    style={{
                      marginTop: '1%',
                      height: 140,
                      alignSelf: 'stretch',
                      width: '100%',
                    }}
                    source={require('../assests/Credit.png')}
                    resizeMode="center"
                  />
                  <View flexDirection="row" style={{ marginTop: '3%' }}>
                    <View flexDirection="row" style={{ marginLeft: '14%' }}>
                      {(this.state.online == 1 && this.state.paymentGateway.length > 0) ? (
                        <Checkbox
                          color={LocalConfig.COLOR.UI_COLOR}
                          status={checked8 ? 'checked' : 'unchecked'}
                          uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                          onPress={() => {
                            if (this.state.paymentGateway.length == 1 || this.state.checked8) {
                              this.setState({ selectedPaymentGateway: this.state.paymentGateway[0] })
                              this.setState({ checked8: !checked8 });
                              this.setState({ payment_type: 'card' });
                              this.setState({ pay_id: 'payconnecting' });
                              this.setState({ checked7: false });
                            } else if (!this.state.checked8) {
                              this.setState({ gatewayListModal: true, checked7: false })
                            }
                          }}
                        />
                      ) : (
                        <Text></Text>
                      )}
                      {(this.state.online == 1 && this.state.paymentGateway.length > 0) &&
                        <TouchableOpacity
                          onPress={() => {
                            if (this.state.paymentGateway.length == 1 && this.state.checked8) {
                              this.setState({ checked8: !checked8 });
                              this.setState({ payment_type: 'card' });
                              this.setState({ pay_id: 'payconnecting' });
                              this.setState({ checked7: false });
                            } else if (!this.state.checked8) {
                              this.setState({ gatewayListModal: true, checked7: false })
                            }
                          }}
                          style={{ marginTop: '8%' }}>
                          <Text
                            style={{
                              fontSize: 15,
                              color: LocalConfig.COLOR.WHITE,
                              fontFamily: 'Proxima Nova Bold',
                              marginLeft: '1%',
                            }}>
                            Pay Online
                          </Text>
                        </TouchableOpacity>}
                    </View>
                    <View flexDirection="row" style={{ marginLeft: '2%' }}>
                      {this.state.cash == 1 &&
                        <Checkbox
                          color={LocalConfig.COLOR.UI_COLOR}
                          status={checked7 ? 'checked' : 'unchecked'}
                          uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                          onPress={() => {
                            this.setState({ payment_type: 'cash' });
                            this.setState({ pay_id: 'Cash On Delivery' });
                            this.setState({ checked8: false });
                            this.setState({ checked7: !checked7 });
                          }}
                        />
                      }
                      {this.state.cash == 1 &&
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ checked7: !checked7 });
                            this.setState({ payment_type: 'cash' });
                            this.setState({ pay_id: 'Cash On Delivery' });
                            this.setState({ checked8: false });
                          }}
                          style={{ marginTop: '3.5%' }}>
                          <Text
                            style={{
                              marginTop: '3%',
                              fontSize: 15,
                              color: LocalConfig.COLOR.WHITE,
                              fontFamily: 'Proxima Nova Bold',
                              marginLeft: '1%',
                            }}>
                            Cash On Delivery
                          </Text>
                        </TouchableOpacity>
                      }
                    </View>
                  </View>
                  <TouchableOpacity
                    disabled={this.state.total_price == NaN}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      backgroundColor: LocalConfig.COLOR.UI_COLOR,
                      alignItems: 'center',
                      marginTop: '10%',
                      position: 'absolute',
                      margin: 0,
                      bottom: 0,
                      height: 50,
                    }}
                    onPress={() => {
                      if ((checked7 === false) & (checked8 === false)) {
                        Alert.alert('Please select payment method');
                      } else {
                        this.InsertDataToServer();
                        this.setState({ paymodal: false });
                      }
                    }}>
                    <Text
                      style={{
                        color: LocalConfig.COLOR.BLACK,
                        fontFamily: 'Proxima Nova Bold',
                        fontSize: 18,
                        marginLeft: '4%',
                        marginTop: '1%',
                        width: '58%',
                      }}>
                      Total {'\u20B9'}{this.state.total_price.toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        color: LocalConfig.COLOR.BLACK,
                        fontFamily: 'Proxima Nova Bold',
                        fontSize: 20,
                        textAlign: 'center',
                        marginTop: '1%',
                      }}>
                      {this.state.checked8 ? "PAY" : "PLACE ORDER"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
              <View>
                <Modal
                  transparent={true}
                  animationType={'none'}
                  visible={this.state.loading}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      flexDirection: 'column',
                      justifyContent: 'space-around',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}>
                    <View
                      style={{
                        backgroundColor: LocalConfig.COLOR.WHITE,
                        height: 100,
                        width: 100,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                      }}>
                      <ActivityIndicator
                        color={LocalConfig.COLOR.BLACK}
                        animating={this.state.loading}
                      />
                    </View>
                  </View>
                </Modal>
                <Modal
                  visible={this.state.gatewayListModal}
                  transparent
                >
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
                  <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Start Your Payment Via</Text>
                    <View style={{ backgroundColor: LocalConfig.COLOR.UI_COLOR_LITE, padding: 10, borderRadius: 10, minWidth: '50%' }}>
                      {this.state.paymentGateway.map((item, index) => <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 10,
                          borderRadius: 10,
                        }}
                        key={index}
                      >
                        {item == 'razorpay' && <TouchableOpacity
                          style={{
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            padding: 5,
                            borderRadius: 10,
                            elevation: 20
                          }}
                          onPress={() => {
                            this.setState({
                              selectedPaymentGateway: item,
                              gatewayListModal: false,
                              checked8: !checked8,
                              payment_type: 'card',
                              pay_id: 'payconnecting',
                            })
                          }}
                        >
                          <Image resizeMode='stretch' style={{ width: 100, height: 30 }} source={require(`../assests/razorpay.png`)} />
                        </TouchableOpacity>}
                        {item == 'cashfree' && <TouchableOpacity
                          style={{
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            padding: 5,
                            borderRadius: 10,
                            elevation: 20
                          }}
                          onPress={() => {
                            this.setState({
                              selectedPaymentGateway: item,
                              gatewayListModal: false,
                              checked8: !checked8,
                              payment_type: 'card',
                              pay_id: 'payconnecting'
                            })
                          }}
                        >
                          <Image resizeMode='stretch' style={{ width: 100, height: 29 }} source={require(`../assests/cashfree.png`)} />
                        </TouchableOpacity>}
                      </View>)}
                      {/* <RadioButton.Group
                        onValueChange={(value) =>
                          this.setState({
                            selectedPaymentGateway: value,
                            gatewayListModal: false,
                            checked8: !checked8,
                            payment_type: 'card',
                            pay_id: 'payconnecting'
                          })
                        }
                        value={this.state.selectedPaymentGateway}>
                        {this.state.paymentGateway.map((item, index) => <RadioButton.Item
                          labelStyle={{
                            fontSize: 14.5,
                            fontFamily: 'Proxima Nova Font',
                            color: LocalConfig.COLOR.BLACK
                          }}
                          label={item.toLowerCase()}
                          value={item}
                          uncheckedColor={LocalConfig.COLOR.BLACK}
                          color={LocalConfig.COLOR.BLACK}
                        />)}
                      </RadioButton.Group> */}
                    </View>
                  </View>
                </Modal>
              </View>
            </ScrollView>
          </View>
        )}
        {this.state.carddet.length > 0 && (
          <View flexDirection="row">
            {checked1 && this.state.uid !== null ? (
              <TouchableOpacity
                disabled={this.state.total_price == NaN}
                style={{
                  height: 60,
                  width: '100%',
                  flexDirection: 'row',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (this.state.carddet.length == 0 || this.state.re == 1) {
                    if (this.state.re == 1) {
                      Alert.alert(
                        'Some food is currently not available please check your cart',
                      );
                    }
                  } else {
                    this.setState({ paymodal: true });
                  }
                }}>
                <Text
                  style={{
                    color: LocalConfig.COLOR.BLACK,
                    fontFamily: 'Proxima Nova Bold',
                    fontSize: 18,
                    marginLeft: '4%',
                    marginTop: '1%',
                    width: '58%',
                  }}>
                  Total {'\u20B9'}{this.state.total_price.toFixed(2)}
                </Text>
                <Text
                  style={{
                    color: LocalConfig.COLOR.BLACK,
                    fontFamily: 'Proxima Nova Bold',
                    fontSize: 20,
                    textAlign: 'center',
                    marginTop: '1%',
                  }}>
                  Next{' '}
                  <Ionicons
                    name="caret-forward"
                    color={LocalConfig.COLOR.BLACK}
                    size={16}
                    style={{}}
                  />
                </Text>
              </TouchableOpacity>
            ) : (
              <Text></Text>
            )}
            {checked2 && this.state.uid !== null ? (
              <TouchableOpacity
                disabled={this.state.total_price == NaN}
                style={{
                  height: 60,
                  width: '100%',
                  flexDirection: 'row',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (this.state.locationaid == null || this.state.re == 1) {
                    if (this.state.locationaid == null) {
                      Alert.alert('please select delivery address');
                    } else {
                      if (this.state.re == 1) {
                        Alert.alert(
                          'Some food is currently not available please check your cart',
                        );
                      }
                    }
                  } else {
                    this.setState({ paymodal: true });
                  }
                }}>
                <Text
                  style={{
                    color: LocalConfig.COLOR.BLACK,
                    fontFamily: 'Proxima Nova Bold',
                    fontSize: 18,
                    marginLeft: '4%',
                    marginTop: '1%',
                    width: '58%',
                  }}>
                  Total {'\u20B9'}{this.state.total_price.toFixed(2)}
                </Text>
                <Text
                  style={{
                    color: LocalConfig.COLOR.BLACK,
                    fontFamily: 'Proxima Nova Bold',
                    fontSize: 20,
                    textAlign: 'center',
                    marginTop: '1%',
                  }}>
                  Next{' '}
                  <Ionicons
                    name="caret-forward"
                    color={LocalConfig.COLOR.BLACK}
                    size={16}
                    style={{}}
                  />
                </Text>
              </TouchableOpacity>
            ) : (
              <Text></Text>
            )}
            {this.state.uid == null ? (
              <TouchableOpacity
                style={{
                  height: 60,
                  width: '100%',
                  flexDirection: 'row',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({ loginmodal: true, addresspage: 0 });
                }}>
                <Text
                  style={{
                    color: LocalConfig.COLOR.BLACK,
                    fontFamily: 'Proxima Nova Bold',
                    fontSize: 20,
                    textAlign: 'center',
                    marginTop: '1%',
                    marginLeft: '0 %',
                  }}>
                  Login to continue
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={this.state.total_price == NaN}
                style={{
                  height: 60,
                  width: '100%',
                  flexDirection: 'row',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  alignItems: 'center',
                }}
                onPress={() => {
                  Alert.alert('please select Delivery Type');
                }}>
                <Text
                  style={{
                    color: LocalConfig.COLOR.BLACK,
                    fontFamily: 'Proxima Nova Bold',
                    fontSize: 18,
                    marginLeft: '4%',
                    marginTop: '1%',
                    width: '58%',
                  }}>
                  Total {'\u20B9'}{this.state.total_price.toFixed(2)}
                </Text>
                <Text
                  style={{
                    color: LocalConfig.COLOR.BLACK,
                    fontFamily: 'Proxima Nova Bold',
                    fontSize: 20,
                    marginTop: '1%',
                  }}>
                  Next{' '}
                  <Ionicons
                    name="caret-forward"
                    color={LocalConfig.COLOR.BLACK}
                    size={16}
                  />
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }
}
