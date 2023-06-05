import {
  StyleSheet,
  Text,
  View,
  Modal,
  Platform,
  Alert,
  ImageBackground,
  Image,
  ProgressBarAndroid,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";
import React from "react";
import LocalConfig from "../LocalConfig";
import { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Sql from "./sql";
import moment from "moment";
import Dash from "react-native-dash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox, RadioButton, TouchableRipple } from "react-native-paper";
import {
  FORMATDATE,
  calcCrow,
  FORMATDATE as formatDate,
  getUserEmailPopUp,
  getUserPhonePopUp,
} from "./CartHelper";
import { BlurView } from "@react-native-community/blur";
import { postData } from "../Functions";
import RNOtpVerify from "react-native-otp-verify";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import DatePicker from "react-native-date-picker";
import CartEmtyView from "./CartEmtyView";
import RNPgReactNativeSdk from "react-native-pg-react-native-sdk";
import RazorpayCheckout from "react-native-razorpay";
import { RefreshControl } from "react-native";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import { handleLoginState } from "./Redux/Actions";

const sql = new Sql();
const CartScreen = (props) => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [swipeDownRefresh, setSwipeDownRefresh] = useState(false);
  const [counter, setCounter] = useState(59);
  const [branchStatus, setBranchStatus] = useState({});
  const [packingchargeData, setPackingchargeData] = useState({
    packingcharge: "8",
    pc_type: "2",
    max_amount: "199",
  });
  const [packingcharge, setPackingcharge] = useState(0);
  const [freeItems, setFreeItems] = useState([]);
  const [itemLoadingModal, setItemLoadingModal] = useState(!true);
  const [item_Total, setItem_Total] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [itemTax, setItemTax] = useState(5);
  const [billDiscount, setBillDiscount] = useState(0);
  const [billTotal, setBillTotal] = useState(0);
  const [userId, setUserId] = useState(null);
  const [mailId, setMailId] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [addressLine, setAddressLine] = useState(null);
  const [addressLatLon, setAddressLatLon] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [selfPickuperName, setSelfPickuperName] = useState("");
  const [deliveryType, setDeliveryType] = useState("home"); // home || self
  const [deliveryTime, setDeliveryTime] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [isCustomDeliveryTime, setIsCustomDeliveryTime] = useState("default"); // default || custom
  const [datePicker, setDatePicker] = useState(!true);
  const [loginModal, setLoginModal] = useState(!true);
  const [loginMobNum, setLoginMobNum] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [tokenHash, setTokenHash] = useState(null);
  const [fireBaseToken, setFireBaseToken] = useState(null);
  const [loginStage, setLoginStage] = useState("enter"); // enter || loading || otp || OTPloading
  const [OTP, setOTP] = useState(undefined);
  const [gettingCouponData, setGettingCouponData] = useState(true);
  const [couponData, setCouponData] = useState([]);
  const [couponApplied, setCouponApplied] = useState({});
  const [couponModal, setCouponModal] = useState(!true);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTips, setCustomTips] = useState(!true);
  const [paymentModal, setPaymentModal] = useState(!true);
  const [paymentType, setPaymentType] = useState("card"); // cash || card
  const [payId, setPayId] = useState("payconnecting"); // payconnecting || Cash On Delivery
  const [paymentMode, setPaymentMode] = useState("cashfree");
  const [customizedItemSelected, setCustomizedItemSelected] = useState({});
  const [customizedItemSelectedRes, setCustomizedItemSelectedRes] = useState(
    {}
  );
  const [customizedItemModal, setCustomizedItemModal] = useState(false);
  const [customization, setCustomization] = useState({});
  const tipsArray = [15, 20, 30, "CUSTOM"];
  const refreshWholeData = () => {
    setSwipeDownRefresh(true);
    callPageChanges();
    setSwipeDownRefresh(false);
  };
  const loginCounter = () => {
    if (counter >= 0) {
      const interval = setInterval(() => {
        setCounter((counter) => counter - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  };
  const getAllItem = () => {
    return new Promise((resolve, reject) => {
      sql.getAllItem().then((results) => {
        let Temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          Temp.push({
            sqlid: results.rows.item(i).id,
            ItemId: results.rows.item(i).item_id,
            ItemName: results.rows.item(i).item_name,
            ItemQty: results.rows.item(i).qty,
            ItemAmt: results.rows.item(i).price,
            ItemTotalPrice: results.rows.item(i).total,
            size: "",
            ingredientsdetail: [results.rows.item(i).addons_id],
            variant: [results.rows.item(i).variant_id],
            variantName: results.rows.item(i).variantName,
            variant_price: results.rows.item(i).variant_price,
            freeid: results.rows.item(i).freeid,
            free_item_data: results.rows.item(i).free_item_data,
            wholecat: results.rows.item(i).wholecat,
            addons_id: results.rows.item(i).addons_id,
          });
        }
        let Total = 0;
        for (let index = 0; index < Temp.length; index++) {
          Total += parseFloat(Temp[index].ItemTotalPrice);
        }
        setItem_Total(Total);
        setItems(Temp);
      });
      sql.getAllFreeProduct().then((res) => {
        let Temp = [];
        for (let i = 0; i < res.rows.length; ++i) {
          Temp.push(res.rows.item(i));
        }
        setFreeItems(Temp);
      });
      getUserInfo();
      resolve([]);
    });
  };
  const handleCouponModal = ({ open = true }) => {
    if (!open) {
      setCouponModal(false);
      setCouponData([]);
      setGettingCouponData(true);
    } else {
      setCouponModal(true);
      const get_coupon = `${LocalConfig.API_URL}admin/api/get_coupon.php?bid=${branchId}`;
      postData(get_coupon).then((res) => {
        setCouponData(res.promo);
        setGettingCouponData(false);
      });
    }
  };
  const handleCouponApply = ({ item }) => {
    // if (true) {
    if (!true) {
      sql.deleteitempromoall().then((deleteitempromoall) => {});
    } else {
      sql.getpromo(item.promo_id).then((getpromo) => {
        if (getpromo.rows.length > 0) {
          let usedUser = parseFloat(getpromo.rows.item(0).used_users) + 1;
          if (usedUser <= item.usage_limit_user) {
            sql.updatepromo(usedUser, item.promo_id).then((updatepromo) => {
              if (item.promo_type == "percent") {
                setBillDiscount(
                  parseFloat((item_Total / 100) * parseFloat(item.discount_pa))
                );
                handleCouponModal({ open: false });
                setCouponApplied(item);
              } else {
                setBillDiscount(parseFloat(item.discount_pa));
                setCouponApplied(item);
                handleCouponModal({ open: false });
              }
            });
          } else {
            Alert.alert(
              `Oops!`,
              `You Can't use this promo code more than ${item.usage_limit_user} Time(s)`
            );
          }
        } else {
          sql
            .insertpromo(
              item.promo_id,
              item.promo_code,
              item.discount_pa,
              item.usage_limit_user,
              1,
              item.promo_type
            )
            .then((insertPromo) => {
              if (item.promo_type == "percent") {
                setBillDiscount(
                  parseFloat((item_Total / 100) * parseFloat(item.discount_pa))
                );
                handleCouponModal({ open: false });
                setCouponApplied(item);
              } else {
                setBillDiscount(parseFloat(item.discount_pa));
                handleCouponModal({ open: false });
                setCouponApplied(item);
              }
            })
            .catch((err) => {});
        }
      });
    }
  };
  const handleCustomDeliveryTime = () => {
    setDatePicker(!datePicker);
  };
  const getUserInfo = async () => {
    await AsyncStorage.getItem("user_id").then((user_id) => {
      setUserId(user_id);
    });
    await AsyncStorage.getItem("mail_id").then((mail_id) => {
      setMailId(mail_id);
    });
    await AsyncStorage.getItem("mobile_no").then((mobile_no) => {
      setMobileNumber(mobile_no);
    });
    await AsyncStorage.getItem("branch_id").then((branch_id) => {
      setBranchId(branch_id);
    });
    await AsyncStorage.getItem("a_id").then((a_id) => {
      setAddressId(a_id);
    });
    await AsyncStorage.getItem("line").then((line) => {
      setAddressLine(line);
    });
    await AsyncStorage.getItem("latlng").then((latlng) => {
      setAddressLatLon(latlng);
    });
    await AsyncStorage.getItem("token").then((token) => {
      setFireBaseToken(token);
    });
    getDeliveryDetails();
  };
  const handleDeleteItem = ({ sqlId }) => {
    sql
      .deleteitem2(sqlId)
      .then(() => getAllItem().then(() => setItemLoadingModal(false)));
  };
  const handleAddItem = ({ item }) => {
    let sqlId = item.sqlid;
    sql.getItem1(sqlId).then((res) => {
      // setItemLoadingModal(true)
      let dataBaseItem = res.rows.item(0);
      // wholecat = 2 => qty+=0.5
      // wholecat = 1 => qty+=1
      let qty = 1;
      if (dataBaseItem.wholecat == "2") qty = 0.25;
      // adding by  - present Total / present qty to get price for each item then multiply by updated qty
      let SqlUpdateQty = parseFloat(dataBaseItem.qty) + parseFloat(qty);
      let SqlUpdateTotal =
        (parseFloat(dataBaseItem.total) / parseFloat(dataBaseItem.qty)) *
        parseFloat(SqlUpdateQty);
      // qty, tot, id, remark, item
      sql
        .updateqty1(
          SqlUpdateQty,
          SqlUpdateTotal,
          dataBaseItem.id,
          dataBaseItem.remarks,
          dataBaseItem
        )
        .then(() => getAllItem().then(() => setItemLoadingModal(false)));
    });
  };
  const handleMinusItem = ({ item }) => {
    let sqlId = item.sqlid;
    sql.getItem1(sqlId).then((res) => {
      // setItemLoadingModal(true)
      let dataBaseItem = res.rows.item(0);
      // // wholecat = 2 => qty+=0.5
      // // wholecat = 1 => qty+=1
      let qty = 1;
      if (dataBaseItem.wholecat == "2") qty = 0.25;
      let SqlUpdateQty = parseFloat(dataBaseItem.qty) - parseFloat(qty);
      if (SqlUpdateQty > 0) {
        let SqlUpdateTotal =
          (parseFloat(dataBaseItem.total) / parseFloat(dataBaseItem.qty)) *
          parseFloat(SqlUpdateQty);
        sql
          .updateqty1(
            SqlUpdateQty,
            SqlUpdateTotal,
            dataBaseItem.id,
            dataBaseItem.remarks,
            dataBaseItem
          )
          .then(() => getAllItem().then(() => setItemLoadingModal(false)));
      } else {
        sql
          .deleteitem2(sqlId)
          .then(() => getAllItem().then(() => setItemLoadingModal(false)));
      }
    });
  };
  const handleCustomization = ({ sqlId }) => {
    sql.getItem1(sqlId).then((getItem1) => {
      const item = getItem1.rows.item(0);
      setCustomizedItemSelected(item);
      const API = `${LocalConfig.API_URL}admin/api/ingredientsnew.php?category=${item.category}&menu_id=${item.item_id}`;
      postData(API).then((res) => {
        // const res = customizedItemSelectedRes;
        var myObj = { id: [], price: [], name: [] };
        res.variant.map((eachVariant) => {
          if (eachVariant.data.length) {
            if (eachVariant.status == 1 && eachVariant.data[0].id) {
              let pushed = false;
              eachVariant.data.map((variantItem, variantIndex) => {
                if (variantItem.selection == 1) {
                  myObj.id.push(eachVariant.data[variantIndex].id);
                  myObj.price.push(eachVariant.data[variantIndex].price);
                  myObj.name.push(eachVariant.data[variantIndex].variant_name);
                  pushed = !pushed;
                }
              });
              if (!pushed) {
                myObj.id.push(eachVariant.data[0].id);
                myObj.price.push(eachVariant.data[0].price);
                myObj.name.push(eachVariant.data[0].variant_name);
              }
            }
          } else {
            myObj.id.push(null);
            myObj.price.push(null);
            myObj.name.push(null);
          }
        });
        var total = parseFloat(item.price) * parseFloat(item.qty);

        item.addons_price.split(",").map((item) => {
          if (!isNaN(parseFloat(item))) total += parseFloat(item);
        });
        item.radioprice.split(",").map((item) => {
          if (!isNaN(parseFloat(item))) total += parseFloat(item);
        });
        item.variant_price.split(",").map((item) => {
          if (!isNaN(parseFloat(item))) total += parseFloat(item);
        });
        setCustomization({
          addonsName: item.addonsName.split(","),
          addons_id: item.addons_id.split(","),
          addons_price: item.addons_price.split(","),
          radioid: item.radioid.split(","),
          radioprice: item.radioprice.split(","),
          variantName: item.variantName.split(","),
          variant_id: item.variant_id.split(","),
          variant_price: item.variant_price.split(","),
          totalPrice: total,
          itemPrice: item.price,
          itemQty: item.qty,
          sqlId: item.id,
        });
        setCustomizedItemSelectedRes(res);
        setCustomizedItemModal(true);
      }); // post data close
    });
  };
  const handlePaymentMethod = ({ gateway }) => {
    // handlePaymentModal({ open: false })
    handleOrder(gateway, paymentType);
  };
  const handlePaymentType = ({ paymentType = "card" || "cash" }) => {
    setPaymentType(paymentType);
    if (paymentType == "card") setPayId("payconnecting");
    else setPayId("Cash On Delivery");
  };
  const handlePaymentModal = ({ open = true }) => {
    setPaymentModal(open);
  };
  const handleOrder = async (paymentMethod, paymentType) => {
    setItemLoadingModal(true);
    let newCredit = { Order: [] };
    items.map((normalItem) => {
      let tempObj = {};
      tempObj.ItemId = normalItem.ItemId;
      tempObj.ItemName = normalItem.ItemName;
      tempObj.ItemQty = normalItem.ItemQty;
      tempObj.ItemAmt = normalItem.ItemAmt;
      tempObj.ItemTotalPrice = normalItem.ItemTotalPrice;
      tempObj.ingredientsdetail = normalItem.ingredientsdetail;
      tempObj.size = normalItem.size;
      tempObj.variant = normalItem.variant;
      tempObj.ItemDiscount = 0;
      tempObj.flatappid = null;
      tempObj.buyyapppid = "0";
      newCredit.Order.push(tempObj);
    });
    freeItems.map((freeItem) => {
      if (
        normalItem.ItemId == freeItem.free_for_id &&
        !FreeForAdded.includes(freeItem.free_for_id)
      ) {
        let tempObj = {};
        tempObj.ItemId = freeItem.item_id;
        tempObj.ItemName = freeItem.item_name;
        tempObj.ItemQty = freeItem.qty;
        tempObj.ItemAmt = "0";
        tempObj.ItemTotalPrice = "0";
        tempObj.ingredientsdetail = ["0"];
        tempObj.size = "0";
        tempObj.variant = ["0"];
        tempObj.ItemDiscount = 0;
        tempObj.flatappid = null;
        tempObj.buyyapppid = "0";
        FreeForAdded.push(freeItem.free_for_id);
        newCredit.Order.push(tempObj);
      }
    });
    const selfTime = () => {
      if (deliveryType == "self") {
        return moment(pickupTime).format("DD-MM-YYYY hh:mm A");
      } else {
        return moment(deliveryTime).format("DD-MM-YYYY hh:mm A");
      }
    };
    // latlong = 0
    // a_id = 00
    const todayDate = new Date();
    const latlongFoodOrder = deliveryType == "home" ? addressLatLon : "0";
    const a_idFoorOrder = deliveryType == "home" ? addressId : "00";
    const addressForOrder = deliveryType == "home" ? addressId : "0"; // not addressLine
    const food_desc = encodeURIComponent(JSON.stringify(newCredit));
    const API = `${LocalConfig.API_URL}admin/api/food_order.php?
    user_id=${userId}&
    name=${deliveryType == "self" ? selfPickuperName : "user"}&
    email=${mailId}&
    address=${addressForOrder}&
    payment_type=${paymentType}&
    notes=${instructions}&
    city=${"cbe"}&
    food_desc=${food_desc}&
    total_price=${billTotal.toFixed(2)}&
    latlong=${latlongFoodOrder}&
    token_id=${fireBaseToken}&
    pay_id=${payId}&
    a_id=${a_idFoorOrder}& 
    rc=${0}&
    dc=${deliveryCharges}&
    pc=${packingcharge}&
    discount=${billDiscount}&
    selftime=${selfTime()}&
    tips=${tipAmount}&
    bid=${branchId}&
    food_tax=${itemTax.toFixed(2)}&
    future_order=${
      isCustomDeliveryTime == "custom" &&
      selfTime().split("-")[0] == todayDate.getDate()
        ? 0
        : 1
    }`;
    if (true)
      await postData(API).then((food_order) => {
        if (food_order.success == "Success") {
          if (paymentType == "card")
            handleOnlinePayment(
              paymentMethod,
              food_order.order_id,
              billTotal.toFixed(2)
            );
          else
            handleSuccessOrder({
              orderId: food_order.order_id,
            });
        } else {
          setItemLoadingModal(false);
          Alert.alert("Oops!", food_order.order_details);
        }
      });
    else {
      console.log(API);
      setItemLoadingModal(false);
    }
  };
  const handleSuccessOrder = async ({ orderId }) => {
    const selfTime = () => {
      if (isCustomDeliveryTime == "default")
        return moment(deliveryTime).format("DD-MM-YYYY hh:mm A");
      else if (isCustomDeliveryTime == "custom")
        return moment(pickupTime).format("DD-MM-YYYY hh:mm A");
    };
    sql.deleteallrows().then((res) => {
      setBillDiscount(0);
      setTipAmount(0);
      setItemLoadingModal(false);
      handlePaymentModal({ open: false });
      props.navigation.navigate("OrderFinish", {
        orderid: orderId,
        type: deliveryType == "self" ? "Self Pickup" : "Home Delivery",
        deltime: selfTime(),
      });
    });
  };
  const onlinePaymentError = (something) => {
    Alert.alert(
      `Oops!`,
      `Something Went Wrong, Please Contact Branch${
        something && ". " + something
      }`
    );
    setItemLoadingModal(false);
  };
  const handleOnlinePayment = async (paymentMethod, orderID, billTotal) => {
    let API;
    if (paymentMethod == "razorpay")
      API = `${LocalConfig.API_URL}admin/api/razor_pay_order_id_generate.php?amount_get=${billTotal}`;
    else if (paymentMethod == "cashfree")
      API = `${LocalConfig.API_URL}admin/api/cashfree_generate_token_id.php?amt=${billTotal}&orderId=${orderID}`;
    else if (paymentMethod == "payTm")
      API = `${LocalConfig.API_URL}admin/api/paytm_gen_token.php.php?orderId=${orderID}&amt=${billTotal}&cid=${userId}`;
    // if (API)
    if (true)
      placeOrder({ API }).then((tokenOrderRes) => {
        if (paymentMethod == "razorpay" && tokenOrderRes.success == "1") {
          updateOrderId({ orderID, tokenId: tokenOrderRes.oid, paymentMethod })
            .then(async (res) => {
              const mail_id = await AsyncStorage.getItem("mail_id");
              const mobile_no = await AsyncStorage.getItem("mobile_no");
              var options = {
                description: "Buy a fresh Meats",
                image: `${LocalConfig.API_URL}admin/images/logo/logo.png`,
                currency: "INR",
                order_id: tokenOrderRes.oid,
                key: LocalConfig.API_KEYS.razorpayApiKey,
                amount: billTotal,
                name: LocalConfig.APP_NAME,
                prefill: {
                  email: mail_id,
                  contact: mobile_no,
                  name: "Razorpay Software",
                },
                theme: { color: LocalConfig.COLOR.UI_COLOR },
              };
              RazorpayCheckout.open(options)
                .then((data) => {
                  updatePaymentId({
                    orderId: orderID,
                    referenceId: data.razorpay_payment_id,
                    status: 1,
                  }).then(
                    async () => await handleSuccessOrder({ orderId: orderID })
                  );
                })
                .catch(async (error) => {
                  await updatePaymentId({
                    orderId: tokenOrderRes.oid,
                    referenceId: "failedpayment",
                    status: 0,
                  });
                  setItemLoadingModal(false);
                  setPaymentType("card");
                  ToastAndroid.show(`Payment Failed`, ToastAndroid.SHORT);
                });
            })

            .catch((err) => onlinePaymentError(err));
        } else if (
          paymentMethod == "cashfree" &&
          tokenOrderRes.status == "OK"
        ) {
          updateOrderId({
            orderID,
            tokenId: tokenOrderRes.cftoken,
            paymentMethod,
          })
            .then(async (res) => {
              const customerEmail = await AsyncStorage.getItem("mail_id");
              const customerPhone = await AsyncStorage.getItem("mobile_no");
              var params = {
                appId: LocalConfig.API_KEYS.cashFree.clientId,
                orderId: `${orderID}`,
                orderCurrency: "INR",
                orderAmount: `${billTotal}`,
                customerPhone,
                customerEmail,
                tokenData: tokenOrderRes.cftoken,
              };
              RNPgReactNativeSdk.startPaymentWEB(
                params,
                LocalConfig.API_KEYS.cashFree.env,
                async (result) => {
                  const jsonObject = JSON.parse(result);
                  if (jsonObject.txStatus == "SUCCESS")
                    await updatePaymentId({
                      orderId: orderID,
                      referenceId: jsonObject.referenceId,
                      status: 1,
                    }).then(
                      async (res) =>
                        await handleSuccessOrder({ orderId: orderID })
                    );
                  else {
                    await updatePaymentId({
                      orderId: orderID,
                      referenceId: "failedpayment",
                      status: 0,
                    }).then((res) => res);
                    setPaymentType("card");
                    ToastAndroid.show(`Payment Failed`, ToastAndroid.SHORT);
                  }
                }
              );
              setItemLoadingModal(false);
            })
            .catch((err) => onlinePaymentError(err));
        } else onlinePaymentError(1);
      });
    // else {
    //   onlinePaymentError("Error Code 523")
    //   console.log(API)
    // }
  };
  const placeOrder = async ({ API }) => postData(API);
  const updateOrderId = async ({ orderID, tokenId, paymentMethod }) =>
    await postData(
      `${LocalConfig.API_URL}admin/api/razorpay_order_update.php?oid=${orderID}&order_id=${tokenId}&method=${paymentMethod}`
    );
  const updatePaymentId = async ({ orderId, referenceId, status }) =>
    await postData(
      `${LocalConfig.API_URL}admin/api/paystatus.php?oid=${orderId}&pay_id=${referenceId}&pay_status=${status}`
    );
  const handleLogin = async () => {
    setLoginStage("loading");
    RNOtpVerify.getHash().then(async (hash) => {
      setTokenHash(hash);
      const API = `${LocalConfig.API_URL}admin/api/register.php?maild=${loginEmail}&mobile_no=${loginMobNum}&token=${fireBaseToken}&hash=${hash}&type=${Platform.OS}`;
      await postData(API).then(async (res) => {
        setLoginStage("otp");
        setUserId(res.data.register);
        setCounter(59);
        loginCounter();
        RNOtpVerify.getOtp()
          .then((p) =>
            RNOtpVerify.addListener((message) => {
              let verificationCodeRegex = /Hi, ([\d]{4})/;
              if (verificationCodeRegex.test(message)) {
                let verificationCode = message.match(verificationCodeRegex)[1];
                setOTP(verificationCode);
                // VerifyOTP(verificationCode)
              }
              RNOtpVerify.removeListener();
            })
          )
          .catch((err) => null);
      });
    });
  };
  const VerifyOTP = async (verificationCode) => {
    setLoginStage("OTPloading");
    const API = `${
      LocalConfig.API_URL
    }admin/api/verifyotp.php?mobile_no=${loginMobNum}&token=${
      verificationCode ? verificationCode : OTP
    }`;
    await postData(API).then(async (res) => {
      if (res.data.success == "1") {
        setLoginStage("enter");
        await AsyncStorage.setItem("mail_id", loginEmail);
        await AsyncStorage.setItem("mobile_no", loginMobNum);
        await AsyncStorage.setItem("user_id", res.data.userid);
        setLoginModal(false);
        getAllItem();
        getUserInfo();
        setOTP(undefined);
        dispatch(handleLoginState(true));
      } else {
        setLoginStage("otp");
        Alert.alert("Error", "Enter Valid OTP");
      }
    });
  };
  const orderTime = () => {
    const getTime = () => {
      setPickupTime(formatDate(15));
      setDeliveryTime(formatDate(60));
    };
    // setInterval(function () {
    //   if (isCustomDeliveryTime != "custom") getTime()
    // }, 1 * 1000); // 60 * 1000 mil_sec
    if (isCustomDeliveryTime != "custom") getTime();
  };
  const getDeliveryCharges = async (deliveryDetails) => {
    await AsyncStorage.getItem("latlng").then(async (latlng) => {
      if (latlng != null) {
        await AsyncStorage.getItem("branch_id").then((branchId) => {
          const API = `${LocalConfig.API_URL}admin/api/deliverycharge.php?bid=${branchId}`;
          postData(API).then((res) => {
            const branchLatitude = parseFloat(deliveryDetails.lat);
            const branchLongitude = parseFloat(deliveryDetails.lng);
            const [userLongitude, userLatitude] = latlng.split(",");
            const distance = calcCrow({
              lat1: userLongitude,
              lon1: userLatitude,
              lat2: branchLatitude,
              lon2: branchLongitude,
            });
            const deliveryCharge = res.charge[distance <= 0 ? 1 : distance];
            setDeliveryCharges(deliveryCharge);
          });
        });
      }
    });
  };
  const getDeliveryDetails = async () => {
    await AsyncStorage.getItem("branch_id").then(async (branchId) => {
      const API = `${LocalConfig.API_URL}admin/api/get_fssai.php?flag=4&branch=${branchId}`;
      await postData(API).then((res) => {
        getDeliveryCharges(res.data);
      });
    });
  };
  const getSubTotal = () => {
    let Tax = (item_Total / 100) * parseFloat(branchStatus.tax);
    setItemTax(Tax);
    let tempDeliveryCharges = 0;
    if (deliveryType == "home") {
      tempDeliveryCharges += parseFloat(deliveryCharges);
    }
    let Tips = 0;
    if (parseFloat(tipAmount) > 0) {
      Tips += parseFloat(tipAmount);
    }
    let Discount = 0;
    if (
      item_Total < couponApplied.limit_price ||
      item_Total < couponApplied.discount_pa
    ) {
      setBillDiscount(0);
      setCouponApplied({});
    } else if (couponApplied.promo_type == "percent") {
      Discount = parseFloat(
        (item_Total / 100) * parseFloat(couponApplied.discount_pa)
      );
      setBillDiscount(Discount);
    } else Discount = parseFloat(billDiscount);
    let tempPackagingCharge = 0;
    if (item_Total < packingchargeData.max_amount) {
      tempPackagingCharge =
        packingchargeData.pc_type == "1"
          ? parseFloat(item_Total / 100) *
            parseFloat(packingchargeData.packingcharge)
          : parseFloat(packingchargeData.packingcharge);
    }
    setPackingcharge(tempPackagingCharge);
    setBillTotal(
      item_Total +
        Tax +
        tempDeliveryCharges +
        tempPackagingCharge +
        Tips -
        Discount
    );
  };
  const getPackingCharges = async () => {
    await AsyncStorage.getItem("branch_id").then(async (branchId) => {
      const API = `${LocalConfig.API_URL}admin/api/packagingcharge.php?bid=${branchId}`;
      await postData(API).then((res) => {
        setPackingchargeData(res.charge[0]);
      });
    });
  };
  const getStatus = async () => {
    await AsyncStorage.getItem("branch_id").then(async (branchId) => {
      const API = `${LocalConfig.API_URL}admin/api/status_all.php?bid=${branchId}`;
      await postData(API).then((res) => {
        let tempNewObj = {};
        res.status.map((item, index) => {
          if (item.status_name == "tax") {
            tempNewObj[item.status_name] = parseFloat(item.tax);
          } else if (item.status_name == "home_delivery(meat)") {
            tempNewObj["home_delivery_meat"] = parseFloat(item.status);
          } else if (item.status_name == "min_amount") {
            tempNewObj[item.status_name] = parseFloat(item.min_amount);
          } else {
            tempNewObj[item.status_name] = parseFloat(item.status);
          }
        });
        if (tempNewObj.home_delivery != 1) {
          setDeliveryType("self");
        }
        setBranchStatus(tempNewObj);
      });
    });
  };
  const checkAddedItemIsAvailable = async () => {
    await AsyncStorage.getItem("branch_id").then(async (branchId) => {
      const API = `${LocalConfig.API_URL}admin/api/search.php?branch=${branchId}`;
      await postData(API).then((res) => {
        // const res = require('./Res/seacrch_branch=1.json');
        const tempItems = [];
        res.sub_category.map((apiItem) => {
          items.map((cartItem) => {
            if (apiItem.id == cartItem.ItemId) {
              let temp = cartItem;
              temp.status = apiItem.status;
              tempItems.push(cartItem);
            }
          });
        });
        setItems(tempItems);
      });
    });
  };
  const callPageChanges = () => {
    // call the function when the page has changed
    getAllItem();
    getUserInfo();
    getStatus();
    orderTime();
  };
  const callViewCart = () => {
    // call the functions when the user is viewing for the first time the cart
    getStatus();
    getAllItem();
    orderTime();
    getPackingCharges();
  };
  // useEffect(() => {
  //   checkAddedItemIsAvailable()
  // }, [items.length])
  useEffect(() => {
    getSubTotal();
  }, [
    item_Total,
    deliveryCharges,
    tipAmount,
    billDiscount,
    deliveryType,
    itemTax,
    branchStatus,
    packingchargeData,
  ]);
  useEffect(() => {
    props.navigation.addListener("focus", () => callPageChanges());
    callViewCart();
  }, []);
  useEffect(() => orderTime(), [deliveryType]);

  return items.length == 0 ? (
    <CartEmtyView props={props} />
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: LocalConfig.COLOR.BLACK,
      }}
    >
      {/* Header */}
      <StatusBar backgroundColor={LocalConfig.COLOR.UI_COLOR} />
      <View style={styles.headder}>
        <Ionicons
          name="arrow-back"
          size={23}
          color={LocalConfig.COLOR.UI_COLOR}
          onPress={() => props.navigation.goBack()}
          style={{ flex: 1 }}
        />
        <Text style={styles.headderText}>Your Cart</Text>
        <View style={{ flex: 1 }} />
      </View>
      {/* CART VIEW */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={swipeDownRefresh}
            onRefresh={() => refreshWholeData()}
          />
        }
        style={{ flex: 1 }}
      >
        {items.map((item, index) => {
          let CustomizedCount = 0;
          // if is not an customised item it shoud return null
          if (item.variant[0] && item.variant[0][0] != "")
            CustomizedCount += item.variant[0].split(",").length;
          if (item.addons_id && item.addons_id[0] != "")
            CustomizedCount += (
              item.addons_id[0] == ","
                ? item.addons_id.slice(0, index) +
                  item.addons_id.slice(index + 1)
                : item.addons_id
            ).split(",").length;
          if (CustomizedCount > 1) CustomizedCount -= 1;
          return (
            <View key={index}>
              <View style={styles.cartItemView}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 2.5, padding: 1 }}>
                    <Text style={styles.cartItemText}>{item.ItemName}</Text>
                    {item.variantName != "" && (
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          color: LocalConfig.COLOR.BLACK_LIGHT,
                        }}
                      >
                        {item.variantName &&
                          (item.variantName[0] == ","
                            ? item.variantName.slice(0, index) +
                              item.variantName.slice(index + 1)
                            : item.variantName.split(",").join(", "))}
                      </Text>
                    )}
                    {item?.variant[0]?.split(",")?.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          handleCustomization({ sqlId: item.sqlid });
                        }}
                        style={{ flexDirection: "row" }}
                      >
                        <Text
                          style={styles.cartCustomText}
                        >{`Customized (${CustomizedCount})`}</Text>
                        <Ionicons
                          name="caret-down-circle"
                          size={15}
                          color={LocalConfig.COLOR.UI_COLOR}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: LocalConfig.COLOR.BLACK,
                      borderRadius: 10,
                      borderWidth: 0.5,
                      borderColor: LocalConfig.COLOR.WHITE,
                      padding: 3,
                    }}
                  >
                    {item.status != 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                          }}
                          onPress={() => handleMinusItem({ item })}
                        >
                          <MaterialIcons
                            name="remove"
                            size={20}
                            color={LocalConfig.COLOR.UI_COLOR}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              color: LocalConfig.COLOR.UI_COLOR,
                              fontFamily: "Proxima Nova Font",
                              fontSize: 12,
                              fontWeight: "bold",
                            }}
                          >
                            {item.ItemQty}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                          }}
                          onPress={() => handleAddItem({ item })}
                        >
                          <MaterialIcons
                            name="add"
                            size={18}
                            color={LocalConfig.COLOR.UI_COLOR}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: LocalConfig.COLOR.UI_COLOR,
                            fontFamily: "Proxima Nova Font",
                            fontSize: 15,
                          }}
                        >
                          Item Not Available
                        </Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    disabled={item.status != 0}
                    onPress={() => handleDeleteItem({ sqlId: item.sqlid })}
                    style={{
                      flex: 1,
                      backgroundColor: LocalConfig.COLOR.BLACK,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.status != 0 ? (
                      <Text
                        numberOfLines={1}
                        style={{
                          color: LocalConfig.COLOR.WHITE,
                          fontFamily: "Proxima Nova Font",
                          fontSize: 12,
                        }}
                      >
                        {`\u20B9${parseFloat(item.ItemTotalPrice).toFixed(2)}`}
                      </Text>
                    ) : (
                      <View>
                        <MaterialCommunityIcons
                          name="delete"
                          size={23}
                          color={LocalConfig.COLOR.UI_COLOR}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
        {freeItems.map(
          (item, index) =>
            item.qty > 0 && (
              <View
                key={index}
                style={[
                  styles.cartItemView,
                  { flexDirection: "row", alignItems: "center" },
                ]}
              >
                <View style={{ flex: 2.5 }}>
                  <Text style={styles.cartItemText}>{item.item_name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.cartItemText,
                      {
                        textAlign: "center",
                        color: LocalConfig.COLOR.UI_COLOR,
                      },
                    ]}
                  >
                    {item.qty}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.cartItemText,
                      {
                        textAlign: "center",
                        color: LocalConfig.COLOR.UI_COLOR,
                      },
                    ]}
                  >
                    {"free"}
                  </Text>
                </View>
              </View>
            )
        )}
        <Dash
          dashGap={5}
          dashThickness={0.7}
          dashColor={LocalConfig.COLOR.WHITE}
          style={{ width: "100%" }}
        />
        {/* ADD INSTRUCTIONS */}
        {branchStatus.notes == 1 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              style={{
                height: 40,
                width: "85%",
                marginHorizontal: 10,
              }}
              selectionColor={LocalConfig.COLOR.UI_COLOR}
              returnKeyType="done"
              color={LocalConfig.COLOR.WHITE}
              maxLength={100}
              keyboardType="name-phone-pad"
              placeholder="Add instructions"
              placeholderStyle={{
                fontFamily: "Proxima Nova Font",
                fontSize: 15,
              }}
              placeholderTextColor={"#6c757d"}
              multiline={false}
              onChangeText={(instructions) => setInstructions(instructions)}
              value={instructions}
            />
            <SimpleLineIcons
              name="note"
              size={18}
              color={LocalConfig.COLOR.UI_COLOR_LITE}
            />
          </View>
        )}
        {/* Delivery Type Start */}
        <View
          style={{ flexDirection: "row", alignItems: "center", margin: 10 }}
        >
          <View>
            <Text
              style={{ color: LocalConfig.COLOR.WHITE, fontFamily: "verdanab" }}
            >
              Delivery Type
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsCustomDeliveryTime("default");
                setDeliveryType("self");
              }}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Checkbox.Android
                color={LocalConfig.COLOR.UI_COLOR}
                uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                status={deliveryType == "self" ? "checked" : "unchecked"}
              />
              <Text style={{ color: "white", fontFamily: "Proxima Nova Font" }}>
                Self Pickup
              </Text>
            </TouchableOpacity>
            {branchStatus.home_delivery == 1 && (
              <TouchableOpacity
                onPress={() => {
                  setIsCustomDeliveryTime("default");
                  setDeliveryType("home");
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Checkbox.Android
                  color={LocalConfig.COLOR.UI_COLOR}
                  uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                  status={deliveryType == "home" ? "checked" : "unchecked"}
                />
                <Text
                  style={{ color: "white", fontFamily: "Proxima Nova Font" }}
                >
                  Home Delivery
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Self PickUp Name Starts */}
        {deliveryType == "self" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              style={{
                height: 40,
                borderBottomWidth: 0.5,
                borderBottomColor: LocalConfig.COLOR.WHITE,
                width: "97%",
              }}
              selectionColor={LocalConfig.COLOR.UI_COLOR}
              returnKeyType="done"
              color={LocalConfig.COLOR.WHITE}
              maxLength={100}
              keyboardType="name-phone-pad"
              placeholder="Pickuper Name"
              placeholderStyle={{
                fontFamily: "Proxima Nova Font",
                fontSize: 15,
              }}
              placeholderTextColor={LocalConfig.COLOR.WHITE_LIGHT}
              multiline={false}
              onChangeText={(selfPickuperName) =>
                setSelfPickuperName(selfPickuperName)
              }
              value={selfPickuperName}
            />
          </View>
        )}
        {/* Self PickUp Name Ends */}
        {/* Delivery Type End */}
        <View>
          <View style={{ margin: 10, flexDirection: "row" }}>
            <View
              style={{
                flex: 2,
              }}
            >
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE,
                  fontFamily: "verdanab",
                }}
              >
                {isCustomDeliveryTime == "default" ? "Normal" : "Custom"}{" "}
                {deliveryType == "self" ? "Self Pickup" : "Home Delivery"} Time
              </Text>
              {deliveryType == "self" ? (
                <Text style={{ color: LocalConfig.COLOR.WHITE, fontSize: 12 }}>
                  {isCustomDeliveryTime == "default" && "Expected "}Pickup Time{" "}
                  {pickupTime.getHours() > 12
                    ? pickupTime.getHours() - 12
                    : pickupTime.getHours()}
                  :
                  {pickupTime.getMinutes() > 10
                    ? pickupTime.getMinutes()
                    : `0${pickupTime.getMinutes()}`}
                  :
                  {deliveryTime.getSeconds() > 9
                    ? deliveryTime.getSeconds()
                    : `0${pickupTime.getSeconds()}`}{" "}
                  {pickupTime.getHours() >= 12 ? "PM" : "AM"}
                </Text>
              ) : (
                <Text style={{ color: LocalConfig.COLOR.WHITE, fontSize: 12 }}>
                  {isCustomDeliveryTime == "default" && "Expected "}Delivery
                  Time{" "}
                  {deliveryTime.getHours() > 12
                    ? deliveryTime.getHours() - 12
                    : deliveryTime.getHours()}
                  :
                  {deliveryTime.getMinutes() > 10
                    ? deliveryTime.getMinutes()
                    : `0${deliveryTime.getMinutes()}`}
                  :
                  {deliveryTime.getSeconds() > 10
                    ? deliveryTime.getSeconds()
                    : `0${deliveryTime.getSeconds()}`}{" "}
                  {deliveryTime.getHours() >= 12 ? "PM" : "AM"}
                </Text>
              )}
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                onPress={() => {
                  if (isCustomDeliveryTime == "default")
                    handleCustomDeliveryTime();
                  else {
                    setIsCustomDeliveryTime("default");
                    setPickupTime(formatDate(15));
                    setDeliveryTime(formatDate(60));
                  }
                }}
                style={{
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                  fontSize: 15,
                  textAlign: "center",
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  padding: 5,
                  borderRadius: 5,
                  width: "80%",
                  fontWeight: "bold",
                }}
              >
                {isCustomDeliveryTime == "default" ? "CHANGE" : "CLEAR"}
              </Text>
            </View>
          </View>
        </View>
        {/* Address Starts */}
        {deliveryType == "home" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              margin: 10,
            }}
          >
            <View style={{ flex: 2 }}>
              {addressId == null ? (
                <Text
                  style={{
                    color: LocalConfig.COLOR.WHITE,
                    fontFamily: "verdanab",
                  }}
                >
                  {userId == null
                    ? "Login To Select Address"
                    : "Select Address to Place Order"}
                </Text>
              ) : (
                <View>
                  <Text
                    style={{
                      color: LocalConfig.COLOR.UI_COLOR,
                      fontFamily: "verdanab",
                    }}
                  >
                    DELIVER TO {deliveryType.toUpperCase()}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: LocalConfig.COLOR.WHITE,
                      fontFamily: "verdanab",
                      fontSize: 12,
                    }}
                  >
                    {addressLine}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                onPress={() => {
                  if (userId == null) {
                    setLoginModal(true);
                  } else {
                    props.navigation.navigate("LocationDetails");
                  }
                }}
                style={{
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                  fontSize: 15,
                  textAlign: "center",
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  padding: 5,
                  borderRadius: 5,
                  width: "80%",
                  fontWeight: "bold",
                }}
              >
                {userId == null
                  ? "LOGIN"
                  : addressId != null
                  ? "CHANGE"
                  : "SELECT"}
              </Text>
            </View>
          </View>
        )}
        {/* Address Ends */}
        {/* COUPON START */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name="brightness-percent"
                size={23}
                color={LocalConfig.COLOR.UI_COLOR}
                style={{}}
              />
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE,
                  fontFamily: LocalConfig.FONTS.verdanab,
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                COUPON
              </Text>
            </View>
            {billDiscount >= 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: LocalConfig.FONTS.verdanab,
                    color: LocalConfig.COLOR.UI_COLOR,
                  }}
                >
                  {couponApplied?.promo_code}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                }}
              />
            )}
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              onPress={() => {
                if (billDiscount <= 0) handleCouponModal({ open: true });
                else {
                  setBillDiscount(0);
                  setCouponApplied({});
                }
              }}
              style={{
                color: LocalConfig.COLOR.BLACK,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                textAlign: "center",
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                padding: 5,
                borderRadius: 5,
                width: "80%",
                fontWeight: "bold",
              }}
            >
              {billDiscount <= 0 ? "APPLY" : "REMOVE"}
            </Text>
          </View>
        </View>
        {/* COUPON ENDS */}
        {/* Tips Starts */}
        {branchStatus.tips == 1 && (
          <View
            style={{
              margin: 10,
            }}
          >
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.verdanab,
                fontSize: 15,
              }}
            >
              Thank You For Adding A Tip
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
              }}
            >
              {tipsArray.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: item == "CUSTOM" ? 1.5 : 1,
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (item != "CUSTOM") {
                        if (tipAmount == item) setTipAmount(0);
                        else setTipAmount(item);
                        setCustomTips(false);
                      } else {
                        if (customTips) {
                          setTipAmount(0);
                          setCustomTips(false);
                        } else {
                          setTipAmount(item);
                          setCustomTips(true);
                        }
                      }
                    }}
                    style={{
                      borderColor: LocalConfig.COLOR.BLACK_LIGHT,
                      borderWidth: tipAmount == item ? 0 : 2,
                      padding: tipAmount == item ? 12 : 10,
                      borderRadius: 5,
                      backgroundColor:
                        tipAmount == item
                          ? LocalConfig.COLOR.UI_COLOR
                          : LocalConfig.COLOR.BLACK,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          tipAmount == item
                            ? LocalConfig.COLOR.BLACK
                            : LocalConfig.COLOR.UI_COLOR,
                        fontFamily: LocalConfig.FONTS.verdanab,
                      }}
                    >
                      {item != "CUSTOM" ? `\u20B9 ${item}` : item}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {customTips && (
              <View>
                <TextInput
                  style={{
                    flex: 1,
                    height: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: LocalConfig.COLOR.WHITE,
                    marginHorizontal: 5,
                  }}
                  autoFocus={true}
                  selectionColor={LocalConfig.COLOR.UI_COLOR}
                  returnKeyType="done"
                  color={LocalConfig.COLOR.WHITE}
                  maxLength={3}
                  keyboardType="numeric"
                  placeholder="ENTER TIPS"
                  placeholderStyle={{
                    fontFamily: "Proxima Nova Font",
                    fontSize: 15,
                  }}
                  placeholderTextColor={LocalConfig.COLOR.BLACK_LIGHT}
                  multiline={false}
                  onChangeText={(tip) => setTipAmount(tip)}
                  value={tipAmount != "CUSTOM" && tipAmount}
                />
              </View>
            )}
          </View>
        )}
        {/* Tips Ends */}
        {/* Bill Details Starts */}
        <View
          style={{
            margin: 10,
          }}
        >
          <Text
            style={{
              color: LocalConfig.COLOR.UI_COLOR,
              fontFamily: LocalConfig.FONTS.verdanab,
              fontSize: 15,
            }}
          >
            Bill Details
          </Text>
          <View
            style={{
              borderBottomColor: LocalConfig.COLOR.BLACK_LIGHT,
              borderBottomWidth: 1,
              marginTop: 5,
            }}
          />
          {/* Item Total */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
              }}
            >
              Item Total
            </Text>
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >{`\u20B9${parseFloat(item_Total).toFixed(2)}`}</Text>
          </View>
          {/* TAX Charges */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
              }}
            >
              Tax {`${branchStatus.tax}%`}
            </Text>
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >{`\u20B9${parseFloat(itemTax).toFixed(2)}`}</Text>
          </View>
          {/* Delivery Charges */}
          {deliveryType == "home" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE,
                  fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                  fontSize: 15,
                  flex: 1,
                  marginVertical: 5,
                  fontWeight: "bold",
                }}
              >
                Delivery Charges
              </Text>
              <Text
                style={{
                  color: LocalConfig.COLOR.WHITE,
                  fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                  fontSize: 15,
                  flex: 1,
                  marginVertical: 5,
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >{`\u20B9${parseFloat(deliveryCharges).toFixed(2)}`}</Text>
            </View>
          )}
          {/* Packing Charges */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
              }}
            >
              Packing Charges
            </Text>
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >{`\u20B9${parseFloat(packingcharge).toFixed(2)}`}</Text>
          </View>
          {/* Discount */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
              }}
            >
              Coupon Discount
            </Text>
            <Text
              style={{
                color: LocalConfig.COLOR.UI_COLOR,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >{`\u20B9${parseFloat(billDiscount).toFixed(2)}`}</Text>
          </View>
          {/* Others */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
              }}
            >
              Others
            </Text>
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >{`\u20B9${
              isNaN(parseFloat(tipAmount))
                ? Number(0).toFixed(2)
                : parseFloat(tipAmount).toFixed(2)
            }`}</Text>
          </View>
          <Dash
            dashGap={5}
            dashThickness={0.7}
            dashColor={LocalConfig.COLOR.WHITE}
            style={{
              width: "100%",
              marginVertical: 5,
            }}
          />
          {/* Bill Total */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
              }}
            >
              Total Price
            </Text>
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                fontSize: 15,
                flex: 1,
                marginVertical: 5,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >{`\u20B9${billTotal.toFixed(2)}`}</Text>
          </View>
        </View>
        {/* Bill Details Ends */}
        {/* Open Loading Starts */}
        <Modal visible={itemLoadingModal} transparent={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <ProgressBarAndroid
              styleAttr="Horizontal"
              color={LocalConfig.COLOR.UI_COLOR}
              indeterminate={true}
              progress={0.1}
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                width: Dimensions.get("screen").width,
                padding: 0,
              }}
            />
            {/* <ActivityIndicator size={20} color={LocalConfig.COLOR.WHITE} /> */}
          </View>
        </Modal>
        {/* Open Loading ends */}
        {/* Login Modal Starts */}
        <Modal visible={loginModal} transparent={true}>
          <BlurView
            style={{
              position: "absolute",
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
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                padding: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  flex: 1,
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: LocalConfig.FONTS.verdanab,
                  fontSize: 15,
                  textAlign: "center",
                  padding: 5,
                }}
              >
                Login
              </Text>
              <TouchableOpacity
                onPress={() => setLoginModal(false)}
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="close"
                  color={LocalConfig.COLOR.BLACK}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            {loginStage == "enter" || loginStage == "loading" ? (
              <View
                style={{
                  backgroundColor: LocalConfig.COLOR.BLACK,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    color: LocalConfig.COLOR.WHITE,
                    fontFamily: LocalConfig.FONTS.verdanab,
                    textAlign: "center",
                    margin: 5,
                  }}
                >
                  Please Login To Place Your Order
                </Text>
                <TextInput
                  style={{
                    height: 50,
                    color: LocalConfig.COLOR.WHITE,
                    margin: 5,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: LocalConfig.COLOR.WHITE,
                    borderRadius: 20,
                  }}
                  returnKeyType="done"
                  onFocus={() =>
                    getUserEmailPopUp().then((res) => setLoginEmail(res))
                  }
                  keyboardType="email-address"
                  color={LocalConfig.COLOR.WHITE}
                  placeholder="Enter Your Email"
                  placeholderTextColor={LocalConfig.COLOR.WHITE_LIGHT}
                  multiline={false}
                  onChangeText={(email) => setLoginEmail(email)}
                  value={loginEmail}
                />
                <TextInput
                  style={{
                    height: 50,
                    color: LocalConfig.COLOR.WHITE,
                    margin: 5,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: LocalConfig.COLOR.WHITE,
                    borderRadius: 20,
                  }}
                  maxLength={10}
                  returnKeyType="done"
                  onFocus={() =>
                    getUserPhonePopUp().then((res) => setLoginMobNum(res))
                  }
                  keyboardType="number-pad"
                  color={LocalConfig.COLOR.WHITE}
                  placeholder="Enter Your Phone Number"
                  placeholderTextColor={LocalConfig.COLOR.WHITE_LIGHT}
                  multiline={false}
                  onChangeText={(number) => setLoginMobNum(number)}
                  value={loginMobNum}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (loginMobNum.length == 10 && loginEmail.includes("@")) {
                      handleLogin();
                    } else {
                      if (!loginEmail.includes("@") && loginMobNum.length != 10)
                        Alert.alert("Alert", "Invalid Mobile Number Or Email");
                      else if (!loginEmail.includes("@"))
                        Alert.alert("Alert", "Please Check the Email ID");
                      else if (loginMobNum.length != 10)
                        Alert.alert("Alert", "Please Check the Mobile Number");
                      // this.setState({ isLoading: false });
                    }
                  }}
                  style={{
                    backgroundColor:
                      loginMobNum == "" ||
                      loginEmail == "" ||
                      loginMobNum.length != 10
                        ? LocalConfig.COLOR.UI_COLOR_LITE
                        : LocalConfig.COLOR.UI_COLOR,
                    paddingVertical: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                    margin: 5,
                  }}
                >
                  <Text
                    style={{
                      color: LocalConfig.COLOR.BLACK,
                      fontFamily: LocalConfig.FONTS.verdanab,
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    {loginStage == "loading" ? (
                      <ActivityIndicator color={LocalConfig.COLOR.BLACK} />
                    ) : (
                      "Login"
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              (loginStage == "otp" || loginStage == "OTPloading") && (
                <View
                  style={{
                    backgroundColor: LocalConfig.COLOR.BLACK,
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      color: LocalConfig.COLOR.WHITE,
                      fontFamily: LocalConfig.FONTS.Proxima_Nova_Font,
                      fontSize: 15,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Enter OTP
                  </Text>
                  <View
                    style={{
                      padding: 20,
                    }}
                  >
                    {counter > 0 ? (
                      <Text
                        style={{
                          color: LocalConfig.COLOR.UI_COLOR,
                          textAlign: "right",
                        }}
                      >
                        RESENT OTP in {counter} secs
                      </Text>
                    ) : (
                      <TouchableOpacity onPress={() => handleLogin()}>
                        <Text
                          style={{
                            color: LocalConfig.COLOR.UI_COLOR,
                            textAlign: "right",
                          }}
                        >
                          RESENT OTP
                        </Text>
                      </TouchableOpacity>
                    )}
                    <OTPInputView
                      style={{
                        height: 50,
                        color: LocalConfig.COLOR.BLACK,
                        marginVertical: 20,
                      }}
                      pinCount={4}
                      code={OTP}
                      onCodeChanged={(otp) => setOTP(otp)}
                      autoFocusOnLoad={false}
                      codeInputFieldStyle={{
                        color: LocalConfig.COLOR.BLACK,
                        fontWeight: "bold",
                        borderRadius: 10,
                        backgroundColor: LocalConfig.COLOR.WHITE,
                        elevation: 2,
                      }}
                      codeInputHighlightStyle={{
                        color: LocalConfig.COLOR.BLACK,
                        fontWeight: "bold",
                        borderRadius: 10,
                        backgroundColor: LocalConfig.COLOR.WHITE,
                        elevation: 2,
                      }}
                      onCodeFilled={(otp) => setOTP(otp)}
                      // onCodeFilled={otp => VerifyOTP(otp)}
                    />
                    <TouchableOpacity
                      onPress={() => VerifyOTP()}
                      style={{
                        backgroundColor: LocalConfig.COLOR.UI_COLOR,
                        paddingVertical: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 20,
                        margin: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: LocalConfig.COLOR.BLACK,
                          fontFamily: LocalConfig.FONTS.verdanab,
                          fontSize: 15,
                          textAlign: "center",
                        }}
                      >
                        {loginStage == "OTPloading" ? (
                          <ActivityIndicator color={LocalConfig.COLOR.BLACK} />
                        ) : (
                          "Verify"
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            )}
          </View>
        </Modal>
        {/* Login Modal Ends */}
        {/* Customized Modal Starts */}
        <Modal visible={customizedItemModal} transparent={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                padding: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  flex: 5,
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: LocalConfig.FONTS.verdanab,
                  fontSize: 15,
                  textAlign: "center",
                  padding: 5,
                }}
              >
                {customizedItemSelected.item_name}
              </Text>
              <TouchableOpacity
                onPress={() => setCustomizedItemModal(false)}
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="close"
                  color={LocalConfig.COLOR.BLACK}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: LocalConfig.COLOR.BLACK,
                width: "100%",
              }}
            >
              {customizedItemSelectedRes.ingre?.length > 0 && (
                <Text
                  style={{
                    color: LocalConfig.COLOR.WHITE,
                    fontFamily: LocalConfig.FONTS.verdanab,
                    fontSize: 15,
                    paddingVertical: 5,
                    paddingHorizontal: 20,
                  }}
                >
                  {"Add Ons"}
                </Text>
              )}
              {customizedItemSelectedRes.ingre?.length > 0 &&
                customizedItemSelectedRes.ingre.map((ingreItem, ingreIndex) => (
                  <TouchableOpacity
                    key={ingreIndex}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      paddingHorizontal: 35,
                    }}
                    onPress={() => {
                      if (customization.addons_id.includes(ingreItem.id)) {
                        let TempCustomization = customization;
                        TempCustomization.addonsName.splice(
                          TempCustomization.addons_id.indexOf(ingreItem.id)
                        );
                        TempCustomization.addons_id.splice(
                          TempCustomization.addons_id.indexOf(ingreItem.id)
                        );
                        TempCustomization.addons_price.splice(
                          TempCustomization.addons_id.indexOf(ingreItem.id)
                        );
                        var total =
                          parseFloat(TempCustomization.itemPrice) *
                          parseFloat(TempCustomization.itemQty);
                        TempCustomization.addons_price.map((item) => {
                          if (!isNaN(parseFloat(item)))
                            total += parseFloat(item);
                        });
                        TempCustomization.radioprice.map((item) => {
                          if (!isNaN(parseFloat(item)))
                            total += parseFloat(item);
                        });
                        TempCustomization.variant_price.map((item) => {
                          if (!isNaN(parseFloat(item)))
                            total += parseFloat(item);
                        });
                        TempCustomization.totalPrice = total;
                        sql.addaddons(
                          TempCustomization.addons_id.toString(),
                          TempCustomization.addonsName.toString(),
                          TempCustomization.addons_price.toString(),
                          total,
                          customization.sqlId
                        );
                        setCustomizedItemModal(false);
                        getAllItem();
                      } else {
                        let TempCustomization = customization;
                        TempCustomization.addons_id.push(ingreItem.id);
                        TempCustomization.addonsName.push(ingreItem.item_name);
                        TempCustomization.addons_price.push(ingreItem.price);
                        var total =
                          parseFloat(TempCustomization.itemPrice) *
                          parseFloat(TempCustomization.itemQty);
                        TempCustomization.addons_price.map((item) => {
                          if (!isNaN(parseFloat(item)))
                            total +=
                              parseFloat(item) *
                              parseFloat(TempCustomization.itemQty);
                        });
                        TempCustomization.radioprice.map((item) => {
                          if (!isNaN(parseFloat(item)))
                            total +=
                              parseFloat(item) *
                              parseFloat(TempCustomization.itemQty);
                        });
                        TempCustomization.variant_price.map((item) => {
                          if (!isNaN(parseFloat(item)))
                            total +=
                              parseFloat(item) *
                              parseFloat(TempCustomization.itemQty);
                        });
                        TempCustomization.totalPrice = total;
                        sql.addaddons(
                          TempCustomization.addons_id.toString(),
                          TempCustomization.addonsName.toString(),
                          TempCustomization.addons_price.toString(),
                          total,
                          customization.sqlId
                        );
                        setCustomizedItemModal(false);
                        getAllItem();
                      }
                    }}
                  >
                    <Text
                      style={{
                        color: LocalConfig.COLOR.WHITE,
                        textAlign: "left",
                        fontFamily: LocalConfig.FONTS.Proxima_Nova_Bold,
                        fontSize: 15,
                        flex: 1,
                      }}
                    >
                      {ingreItem.item_name}{" "}
                      {ingreItem.price != "0"
                        ? `\u20B9 ${ingreItem.price}`
                        : ""}
                    </Text>
                    <Checkbox
                      color={LocalConfig.COLOR.UI_COLOR}
                      uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                      status={
                        customization.addons_id.includes(ingreItem.id)
                          ? "checked"
                          : "unchecked"
                      }
                    />
                  </TouchableOpacity>
                ))}
              {customizedItemSelectedRes?.variant?.length > 0 &&
                customizedItemSelectedRes.variant.map(
                  (variantItem, variantIndex) =>
                    variantItem.status == 1 ? (
                      <View
                        key={variantIndex}
                        style={{
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE,
                            textAlign: "left",
                            fontFamily: LocalConfig.FONTS.verdanab,
                            fontSize: 15,
                            paddingHorizontal: 20,
                          }}
                        >
                          {variantItem.heading}
                        </Text>
                        {variantItem.data.length > 0 &&
                          variantItem.data.map((dataItem, dataIndex) => (
                            <View
                              key={dataIndex}
                              style={{
                                flexDirection: "column",
                                paddingHorizontal: 20,
                              }}
                            >
                              <RadioButton.Group
                                value={customization.radioid[0]}
                                onValueChange={(value) => {
                                  let TempCustomization = customization;
                                  var total =
                                    parseFloat(TempCustomization.itemPrice) *
                                    parseFloat(TempCustomization.itemQty);
                                  TempCustomization.addons_price.map((item) => {
                                    if (!isNaN(parseFloat(item)))
                                      total +=
                                        parseFloat(item) *
                                        parseFloat(TempCustomization.itemQty);
                                  });
                                  if (!isNaN(parseFloat(dataItem.price)))
                                    total +=
                                      parseFloat(dataItem.price) *
                                      parseFloat(TempCustomization.itemQty);
                                  TempCustomization.variant_price.map(
                                    (item) => {
                                      if (!isNaN(parseFloat(item)))
                                        total +=
                                          parseFloat(item) *
                                          parseFloat(TempCustomization.itemQty);
                                    }
                                  );
                                  TempCustomization.totalPrice = total;
                                  // varid, varprice, radioid, radioprice, tot, id
                                  // sql.radio
                                  sql.radio(
                                    TempCustomization.variant_id.toString(),
                                    TempCustomization.variant_price.toString(),
                                    dataItem.id,
                                    dataItem.price,
                                    total,
                                    TempCustomization.sqlId
                                  );
                                  setCustomizedItemModal(false);
                                  getAllItem();
                                }}
                              >
                                <RadioButton.Item
                                  labelStyle={{
                                    fontSize: 14.5,
                                    fontFamily: "Proxima Nova Font",
                                    color: LocalConfig.COLOR.WHITE,
                                  }}
                                  label={`${dataItem.variant_name} ${
                                    dataItem.price != 0
                                      ? `\u20B9 ` + dataItem.price
                                      : ""
                                  }`}
                                  mode={"android"}
                                  value={dataItem.id}
                                  uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                                  color={LocalConfig.COLOR.UI_COLOR}
                                ></RadioButton.Item>
                              </RadioButton.Group>
                            </View>
                          ))}
                      </View>
                    ) : (
                      variantItem.status == 0 && (
                        <View
                          key={variantIndex}
                          style={{
                            paddingVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: LocalConfig.COLOR.WHITE,
                              textAlign: "left",
                              fontFamily: LocalConfig.FONTS.verdanab,
                              fontSize: 15,
                              paddingHorizontal: 20,
                            }}
                          >
                            {variantItem.heading}
                          </Text>
                          {variantItem.data.length > 0 &&
                            variantItem.data.map((dataItem, dataIndex) => (
                              <TouchableOpacity
                                onPress={() => {
                                  if (
                                    customization.variant_id.includes(
                                      dataItem.id
                                    )
                                  ) {
                                    let TempCustomization = customization;
                                    TempCustomization.variantName.splice(
                                      TempCustomization.variant_id.indexOf(
                                        dataItem.id
                                      )
                                    );
                                    TempCustomization.variant_id.splice(
                                      TempCustomization.variant_id.indexOf(
                                        dataItem.id
                                      )
                                    );
                                    TempCustomization.variant_price.splice(
                                      TempCustomization.variant_id.indexOf(
                                        dataItem.id
                                      )
                                    );
                                    var total =
                                      parseFloat(TempCustomization.itemPrice) *
                                      parseFloat(TempCustomization.itemQty);
                                    TempCustomization.addons_price.map(
                                      (item) => {
                                        if (!isNaN(parseFloat(item)))
                                          total +=
                                            parseFloat(item) *
                                            parseFloat(
                                              TempCustomization.itemQty
                                            );
                                      }
                                    );
                                    TempCustomization.radioprice.map((item) => {
                                      if (!isNaN(parseFloat(item)))
                                        total +=
                                          parseFloat(item) *
                                          parseFloat(TempCustomization.itemQty);
                                    });
                                    TempCustomization.variant_price.map(
                                      (item) => {
                                        if (!isNaN(parseFloat(item)))
                                          total +=
                                            parseFloat(item) *
                                            parseFloat(
                                              TempCustomization.itemQty
                                            );
                                      }
                                    );
                                    TempCustomization.totalPrice = total;
                                    // // variant(varid, varname, varprice, varid1, varprice1, tot, id)
                                    sql.variant(
                                      TempCustomization.variant_id.toString(),
                                      TempCustomization.variantName.toString(),
                                      TempCustomization.variant_price.toString(),
                                      "",
                                      "",
                                      total,
                                      customization.sqlId
                                    );
                                    setCustomizedItemModal(false);
                                    getAllItem();
                                  } else {
                                    let TempCustomization = customization;
                                    TempCustomization.variant_id.push(
                                      dataItem.id
                                    );
                                    TempCustomization.variantName.push(
                                      dataItem.variant_name
                                    );
                                    TempCustomization.variant_price.push(
                                      dataItem.price
                                    );
                                    var total =
                                      parseFloat(TempCustomization.itemPrice) *
                                      parseFloat(TempCustomization.itemQty);
                                    TempCustomization.addons_price.map(
                                      (item) => {
                                        if (!isNaN(parseFloat(item)))
                                          total +=
                                            parseFloat(item) *
                                            parseFloat(
                                              TempCustomization.itemQty
                                            );
                                      }
                                    );
                                    TempCustomization.radioprice.map((item) => {
                                      if (!isNaN(parseFloat(item)))
                                        total +=
                                          parseFloat(item) *
                                          parseFloat(TempCustomization.itemQty);
                                    });
                                    TempCustomization.variant_price.map(
                                      (item) => {
                                        if (!isNaN(parseFloat(item)))
                                          total +=
                                            parseFloat(item) *
                                            parseFloat(
                                              TempCustomization.itemQty
                                            );
                                      }
                                    );
                                    TempCustomization.totalPrice = total;
                                    sql.variant(
                                      TempCustomization.variant_id.toString(),
                                      TempCustomization.variantName.toString(),
                                      TempCustomization.variant_price.toString(),
                                      "",
                                      "",
                                      total,
                                      customization.sqlId
                                    );
                                    setCustomizedItemModal(false);
                                    getAllItem();
                                  }
                                }}
                                key={dataIndex}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingHorizontal: 35,
                                }}
                              >
                                <Text
                                  style={{
                                    color: LocalConfig.COLOR.WHITE,
                                    textAlign: "left",
                                    fontFamily:
                                      LocalConfig.FONTS.Proxima_Nova_Bold,
                                    fontSize: 15,
                                    flex: 1,
                                  }}
                                >
                                  {dataItem.variant_name}{" "}
                                  {dataItem.price != "0"
                                    ? `\u20B9 ${dataItem.price}`
                                    : ""}
                                </Text>
                                <Checkbox
                                  color={LocalConfig.COLOR.UI_COLOR}
                                  uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                                  status={
                                    customization.variant_id.includes(
                                      dataItem.id
                                    )
                                      ? "checked"
                                      : "unchecked"
                                  }
                                />
                              </TouchableOpacity>
                            ))}
                        </View>
                      )
                    )
                )}
            </View>
            {/* <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: LocalConfig.FONTS.verdanab
                }}
              >{`\u20B9${customization.totalPrice.toFixed(2)}`}</Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: LocalConfig.FONTS.verdanab
                }}
              >Update</Text>
            </View> */}
          </View>
        </Modal>
        {/* Customized Modal Ends */}

        {/* COUPON MODAL STARTS */}
        <Modal visible={couponModal} transparent={true}>
          <BlurView
            style={{
              position: "absolute",
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
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                padding: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  flex: 1,
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: LocalConfig.FONTS.verdanab,
                  fontSize: 15,
                  textAlign: "center",
                  padding: 5,
                }}
              >
                COUPON
              </Text>
              <TouchableOpacity
                onPress={() => handleCouponModal({ open: false })}
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="close"
                  color={LocalConfig.COLOR.BLACK}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            {couponData.length == 0 ? (
              <View
                style={{
                  height: 200,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: LocalConfig.COLOR.BLACK,
                }}
              >
                {!gettingCouponData ? (
                  <Text
                    style={{
                      color: LocalConfig.COLOR.WHITE,
                      fontFamily: LocalConfig.FONTS.Proxima_Nova_Bold,
                      fontSize: 15,
                    }}
                  >
                    NO COUPONS AVAILABLE
                  </Text>
                ) : (
                  <ActivityIndicator color={LocalConfig.COLOR.WHITE} />
                )}
              </View>
            ) : (
              <View style={{}}>
                {couponData.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: LocalConfig.COLOR.BLACK,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        flex: 2,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 2,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="brightness-percent"
                          size={23}
                          color={LocalConfig.COLOR.UI_COLOR}
                          style={{}}
                        />
                        <Text
                          style={{
                            color: LocalConfig.COLOR.WHITE,
                            fontFamily: LocalConfig.FONTS.Proxima_Nova_Bold,
                            paddingHorizontal: 5,
                          }}
                        >
                          {item.promo_code}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: LocalConfig.COLOR.WHITE,
                          fontFamily: LocalConfig.FONTS.Proxima_Nova_Bold,
                          fontSize: 15,
                        }}
                      >
                        Discount :{" "}
                        {item.promo_type == "amount"
                          ? `\u20B9${item.discount_pa}`
                          : `${parseInt(item.discount_pa)}%`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        disabled={
                          parseFloat(item.discount_pa) > item_Total &&
                          item.promo_type == "amount"
                            ? false
                            : item_Total < parseFloat(item.limit_price) &&
                              item.promo_type == "amount"
                            ? true
                            : false
                        }
                        onPress={() => handleCouponApply({ item })}
                        // activeOpacity={1}
                        style={{
                          width: "100%",
                          borderRadius: 5,
                          backgroundColor:
                            parseFloat(item.discount_pa) > item_Total &&
                            item.promo_type == "amount"
                              ? LocalConfig.COLOR.UI_COLOR_LITE
                              : item_Total < parseFloat(item.limit_price) &&
                                item.promo_type == "amount"
                              ? LocalConfig.COLOR.UI_COLOR_LITE
                              : LocalConfig.COLOR.UI_COLOR,
                        }}
                      >
                        <Text
                          style={{
                            color: LocalConfig.COLOR.BLACK,
                            fontFamily: LocalConfig.FONTS.Proxima_Nova_Bold,
                            padding: 5,
                            textAlign: "center",
                          }}
                        >
                          {parseFloat(item.discount_pa) > item_Total &&
                          item.promo_type == "amount"
                            ? `Item total is \u20B9${item_Total}`
                            : item_Total < parseFloat(item.limit_price) &&
                              item.promo_type == "amount"
                            ? `Miniumum amount to Apply \u20B9${item.limit_price}`
                            : `APPLY`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Modal>
        {/* COUPON MODAL ENDS */}
        {/* Payment Modal Starts */}
        <Modal
          visible={paymentModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => handlePaymentModal({ open: false })}
        >
          <BlurView
            style={{
              position: "absolute",
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
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                padding: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  flex: 3,
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: LocalConfig.FONTS.verdanab,
                  fontSize: 15,
                  textAlign: "center",
                  padding: 5,
                }}
              >
                Select Payment
              </Text>
              <TouchableOpacity
                onPress={() => handlePaymentModal({ open: false })}
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="close"
                  color={LocalConfig.COLOR.BLACK}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: LocalConfig.COLOR.BLACK,
                justifyContent: "center",
                padding: 20,
                // borderRadius: 20,
              }}
            >
              <Image
                style={{
                  height: 140,
                  alignSelf: "center",
                  borderRadius: 20,
                  width: "50%",
                  display: "none",
                }}
                source={require("../assests/Credit.png")}
                resizeMode="center"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  display: "none",
                }}
              >
                {branchStatus.onlinpayment == 1 && (
                  <TouchableOpacity
                    onPress={() => handlePaymentType({ paymentType: "card" })}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Checkbox
                      color={LocalConfig.COLOR.UI_COLOR}
                      uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                      status={
                        paymentType == "card" || payId == "payconnecting"
                          ? "checked"
                          : "unchecked"
                      }
                    />
                    <Text
                      style={{
                        color: LocalConfig.COLOR.WHITE,
                        fontFamily: LocalConfig.FONTS.Proxima_Nova_Bold,
                        fontSize: 15,
                      }}
                    >
                      Online Payment
                    </Text>
                  </TouchableOpacity>
                )}
                {branchStatus.cashon == 1 && (
                  <TouchableOpacity
                    disabled={true}
                    onPress={() => handlePaymentType({ paymentType: "cash" })}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Checkbox
                      color={LocalConfig.COLOR.UI_COLOR}
                      uncheckedColor={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                      status={
                        paymentType == "cash" && payId == "Cash On Delivery"
                          ? "checked"
                          : "unchecked"
                      }
                    />
                    <Text
                      style={{
                        color: LocalConfig.COLOR.WHITE,
                        fontFamily: LocalConfig.FONTS.Proxima_Nova_Bold,
                        fontSize: 15,
                      }}
                    >
                      Cash On Delivery
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {(branchStatus.razorpay == 1 || branchStatus.cashfree == 1) &&
                paymentType == "card" && (
                  <Text
                    style={{
                      color: LocalConfig.COLOR.WHITE,
                      fontFamily: LocalConfig.FONTS.Proxima_Nova_Bold,
                      fontSize: 15,
                      paddingBottom: 15,
                      textAlign: "center",
                    }}
                  >
                    Select Payment Mode
                  </Text>
                )}
              <View
                style={
                  {
                    // justifyContent: 'space-between',
                    // alignItems: 'center',
                  }
                }
              >
                {/*  REACT NATIVE PAPER RADIOBUTTON START */}
                <View>
                  <TouchableRipple
                    onPress={() => {
                      setPaymentMode("cashfree");
                      handlePaymentMethod({ gateway: "cashfree" });
                    }}
                  >
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <RadioButton
                          onPress={() => {
                            setPaymentMode("cashfree");
                            handlePaymentMethod({ gateway: "cashfree" });
                          }}
                          color={LocalConfig.COLOR.UI_COLOR}
                          uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                          value="cashfree"
                          status={
                            paymentMode === "cashfree" ? "checked" : "unchecked"
                          }
                        />
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            padding: 5,
                            borderRadius: 10,
                            elevation: 20,
                            margin: 5,
                          }}
                        >
                          <Image
                            resizeMode="stretch"
                            style={{
                              width: 125,
                              height: 35,
                              alignSelf: "center",
                            }}
                            source={require(`../assests/cashfree.png`)}
                          />
                        </View>
                      </View>
                      {/* {paymentMode == "cashfree" && <TouchableOpacity
                        style={{
                          backgroundColor: LocalConfig.COLOR.UI_COLOR,
                          marginVertical: 10,
                          marginHorizontal: 5,
                          padding: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 10,
                          width: "70%",
                          alignSelf: 'center'
                        }}
                      >
                        <Text style={{ color: LocalConfig.COLOR.BLACK }}>Cashfree</Text>
                      </TouchableOpacity>} */}
                    </View>
                  </TouchableRipple>
                  <TouchableRipple
                    onPress={() => {
                      setPaymentMode("razorpay");
                      handlePaymentMethod({ gateway: "razorpay" });
                    }}
                  >
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <RadioButton
                          onPress={() => {
                            setPaymentMode("razorpay");
                            handlePaymentMethod({ gateway: "razorpay" });
                          }}
                          color={LocalConfig.COLOR.UI_COLOR}
                          uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                          value="razorpay"
                          status={
                            paymentMode === "razorpay" ? "checked" : "unchecked"
                          }
                        />
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: LocalConfig.COLOR.UI_COLOR,
                            padding: 5,
                            borderRadius: 10,
                            elevation: 20,
                            margin: 5,
                          }}
                        >
                          <Image
                            resizeMode="stretch"
                            style={{
                              width: 125,
                              height: 35,
                              alignSelf: "center",
                            }}
                            source={require(`../assests/razorpay.png`)}
                          />
                        </View>
                      </View>
                      {/* {paymentMode == "razorpay" && <TouchableOpacity
                        style={{
                          backgroundColor: LocalConfig.COLOR.UI_COLOR,
                          marginVertical: 10,
                          marginHorizontal: 5,
                          padding: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 10,
                          width: "70%",
                          alignSelf: 'center'
                        }}
                      >
                        <Text style={{ color: LocalConfig.COLOR.BLACK }}>Razorpay</Text>
                      </TouchableOpacity>} */}
                    </View>
                  </TouchableRipple>
                </View>

                {/* REACT NATIVE PAPER RADIOBUTTON END */}

                {/* {(branchStatus.cashfree == 1 && paymentType == 'card') && <TouchableOpacity
                  disabled={true}
                  style={{
                    backgroundColor: LocalConfig.COLOR.UI_COLOR,
                    padding: 5,
                    borderRadius: 10,
                    elevation: 20,
                    margin: 5
                  }}
                  onPress={() => handlePaymentMethod({ gateway: 'cashfree' })}
                >
                  <Image resizeMode='stretch' style={{ width: 150, height: 48, alignSelf: 'center' }} source={require(`../assests/cashfree.png`)} />
                </TouchableOpacity>}
                {(branchStatus.razorpay == 1 && paymentType == 'card') && <TouchableOpacity
                  disabled={true}
                  style={{
                    backgroundColor: LocalConfig.COLOR.UI_COLOR,
                    padding: 5,
                    borderRadius: 10,
                    elevation: 20,
                    margin: 5
                  }}
                  onPress={() => handlePaymentMethod({ gateway: 'razorpay' })}
                >
                  <Image resizeMode='stretch' style={{ width: 150, height: 40, alignSelf: 'center' }} source={require(`../assests/razorpay.png`)} />
                </TouchableOpacity>}
                {(branchStatus.paytm == 1 && paymentType == 'card') && <TouchableOpacity
                  disabled={true}
                  style={{
                    backgroundColor: LocalConfig.COLOR.UI_COLOR,
                    padding: 5,
                    borderRadius: 10,
                    elevation: 20,
                    margin: 5
                  }}
                  onPress={() => handlePaymentMethod({ gateway: 'payTm' })}
                >
                  <Image resizeMode='stretch' style={{ width: 150, height: 40, alignSelf: 'center' }} source={require(`../assests/paytm.png`)} />
                </TouchableOpacity>} */}
              </View>
            </View>
            <TouchableOpacity
              disabled={true} // thiyagu only
              // disabled={(paymentType == 'card')}
              onPress={() => handleOrder("cash", "cash")}
              style={{
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                paddingVertical: 15,
                alignItems: "center",
                // justifyContent: 'space-between',
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: "verdanab",
                  paddingHorizontal: 10,
                }}
              >
                Total {`\u20B9${billTotal.toFixed(2)}`}
              </Text>
              {/* <View style={{ flexDirection: 'row', paddingHorizontal: 10, display: 'none' }}>
                <Text style={{ textAlign: 'center', color: LocalConfig.COLOR.BLACK, fontFamily: 'verdanab' }}>{paymentType == 'card' ? 'Start Payment' : 'Place Order'}</Text>
              </View> */}
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Payment Modal Ends */}
        {/* Custom Time Date Picker Starts */}
        <DatePicker
          modal
          title={`Select Your ${
            deliveryType == "home" ? `Delivery` : `Pickup`
          } Time`}
          minimumDate={FORMATDATE(deliveryType == "self" ? 15 : 60)}
          open={!datePicker}
          date={FORMATDATE(deliveryType == "self" ? 15 : 60)}
          mode="datetime"
          onConfirm={(tempDate) => {
            if (deliveryType == "home") setDeliveryTime(tempDate);
            else setPickupTime(tempDate);
            setIsCustomDeliveryTime("custom");
          }}
          onCancel={() => {
            // this.setState({ open: false });
          }}
        />
        {/* Custom Time Date Picker Ends */}
      </ScrollView>
      {/* Login */}
      {userId == null ? (
        <TouchableOpacity
          onPress={() => setLoginModal(true)}
          style={{
            backgroundColor: LocalConfig.COLOR.UI_COLOR,
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: LocalConfig.COLOR.BLACK,
              fontFamily: "verdanab",
            }}
          >
            LOGIN TO CONTINUE
          </Text>
        </TouchableOpacity>
      ) : addressId == null && deliveryType == "home" ? (
        <TouchableOpacity
          onPress={() => props.navigation.navigate("LocationDetails")}
          style={{
            backgroundColor: LocalConfig.COLOR.UI_COLOR,
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: LocalConfig.COLOR.BLACK,
              fontFamily: "verdanab",
            }}
          >
            SELECT ADDRESS TO PLACE ORDER
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={isNaN(billTotal)}
          onPress={() => {
            if (item_Total <= branchStatus.min_amount)
              Alert.alert(
                "Alert",
                `Since Your Item Total is ${`\u20B9${item_Total.toFixed(
                  2
                )}`} and it Must be Higher Then ${`\u20B9${branchStatus.min_amount}`} to place you order`
              );
            else if (deliveryType == "self" && selfPickuperName == "")
              Alert.alert("Alert", `Please Add Pickuper Name To Place Order`);
            else handlePaymentModal({ open: true });
          }}
          style={{
            backgroundColor: LocalConfig.COLOR.UI_COLOR,
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: LocalConfig.COLOR.BLACK,
              fontFamily: "verdanab",
              paddingHorizontal: 10,
            }}
          >
            Total {`\u20B9${billTotal.toFixed(2)}`}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: LocalConfig.COLOR.BLACK,
                fontFamily: "verdanab",
              }}
            >
              Next
            </Text>
            <Ionicons
              name="caret-forward"
              color={LocalConfig.COLOR.BLACK}
              size={16}
              style={{}}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  headder: {
    flexDirection: "row",
    backgroundColor: LocalConfig.COLOR.BLACK,
    padding: 10,
  },
  headderText: {
    flex: 1,
    color: LocalConfig.COLOR.UI_COLOR,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "verdanab",
  },
  cartItemView: {
    margin: 10,
  },
  cartItemText: {
    color: LocalConfig.COLOR.WHITE,
    fontSize: 12,
    maxWidth: "95%",
  },
  cartCustomText: {
    color: LocalConfig.COLOR.WHITE_LIGHT,
    fontSize: 12,
    fontWeight: "bold",
  },
});
