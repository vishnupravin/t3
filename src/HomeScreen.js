import React, { createRef, Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  BackHandler,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Appearance,
  Alert,
  RefreshControl,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { List, Button, RadioButton, FAB } from "react-native-paper";
import CheckBox from "@react-native-community/checkbox";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import sqlservice from "./sql";
import Modal from "react-native-modal";
import { BlurView } from "@react-native-community/blur";
import IconBadge from "react-native-icon-badge";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/Entypo";
import { Grayscale } from "react-native-color-matrix-image-filters";
import { getPreciseDistance } from "geolib";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalConfig from "../LocalConfig";
import { postData } from "../Functions";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllItems,
  addFreeItem,
  addToCart,
  checkItem,
  deleteItem,
  reduxAddaddonsItem,
  removeromCart,
} from "./Redux/Actions";
import HomeScreenLoading from "./HomeScreenLoading";
import { useCallback } from "react";
import { TouchableNativeFeedback } from "react-native";
const sql = new sqlservice();
const menu_item_icon_IMAGE = `${LocalConfig.API_URL}admin/images/menu_item_icon/`;
const branch_IMAGE = `${LocalConfig.API_URL}admin/images/branch/`;
const banner_IMAGE = `${LocalConfig.API_URL}admin/images/banner/`;
export default function HomeScreen(props) {
  const [branchmodal, setBranchmodal] = useState(false);
  const [swipeDownRefresh, setSwipeDownRefresh] = useState(false);
  const [presentBranch, setPresentBranch] = useState(null);
  const [presentBranchName, setPresentBranchName] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [wholeCat3Input, setWholeCat3Input] = useState(0);
  const [todaySpecial, setTodaySpecial] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [topPics, setTopPics] = useState([]);
  const [itemModelItem, setItemModelItem] = useState({
    item: undefined,
    catIndex: undefined,
    itemIndex: undefined,
    quantity: undefined,
  });
  const [itemModel, setItemModel] = useState(false);
  const [allProcessFinished, setAllProcessFinished] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loadingItem, setLoadingItem] = useState(null);
  const [addonsModal, setAddonsModal] = useState(false);
  const [repeatModal, setRepeatModal] = useState(true);
  const [repeatModalItem, setRepeatModalItem] = useState({
    item: undefined,
    catIndex: undefined,
    itemIndex: undefined,
    price: undefined,
  });
  const [addonsModalItem, setAddonsModalItem] = useState({
    item: undefined,
    catIndex: undefined,
    itemIndex: undefined,
    variant: undefined,
    ingredient: undefined,
    totel: undefined,
  });
  const [addonsSeleted, setAddonsSeleted] = useState({
    radioButton: { price: [], id: [], name: [] },
    CheckBoxes: { price: [], id: [], name: [] },
    ingrediant: { price: [], id: [], name: [] },
  });
  const [showMore, setShowMore] = useState({ id: null, description: null });
  const [fssaiDeatils, setFssaiDetails] = useState(true);
  const [openFirstList, setOpenFirstList] = useState(true);
  // COUPON state starts
  const [couponInfoItem, setCouponInfoItem] = useState({});
  const [couponInfoModal, setCouponInfoModal] = useState(false);
  const [meatInput, setMeatInput] = useState(0);
  const [meatInputModal, setMeatInputModal] = useState(false);
  const [meatInputModalItem, setMeatInputModalItem] = useState({
    item: {},
    catIndex: undefined,
    itemIndex: undefined,
  });
  const dispatch = useDispatch();
  const getSomeItemsState = (state) => state.items;
  const getTotelPrice = (state) => state.TotelPrice;
  const allMenuFromRedux = useSelector(getSomeItemsState) || [];
  const TotelPrice = useSelector(getTotelPrice) || { items: 0, price: 0 };
  const openCouponInfoModal = ({ item = {}, canIOpen = false }) => {
    if (canIOpen) {
      setCouponInfoModal(true);
      setCouponInfoItem(item);
    } else {
      setCouponInfoModal(false);
      setCouponInfoItem({});
    }
  };
  const refreshME = () => {
    setRefresh(!refresh);
  };
  const addaddonsItem = ({
    catIndex,
    item,
    itemIndex,
    addonsSeleted,
    qty,
    price,
  }) => {
    dispatch(
      reduxAddaddonsItem({
        catIndex,
        item: item,
        itemIndex,
        addonsSeleted,
        qty,
        price: parseFloat(price),
      })
    );
    setAddonsSeleted({
      radioButton: { price: [], id: [], name: [] },
      CheckBoxes: { price: [], id: [], name: [] },
      ingrediant: { price: [], id: [], name: [] },
    });
    setAddonsModalItem({
      item: undefined,
      catIndex: undefined,
      itemIndex: undefined,
      variant: undefined,
      totel: undefined,
    });
    setItemModel(false);
    setLoadingItem(null);
    setAddonsModal(true);
    refreshME();
  };
  const refreshWholeData = () => {
    setSwipeDownRefresh(true);
    getbranchList();
    setAllProcessFinished(false);
  };
  /*customized task */
  const addingItem = async ({
    catIndex,
    item,
    itemIndex,
    price,
    repeat = false,
  }) => {
    const ADDItem = ({ qty, type, isFree = false }) => {
      dispatch(
        addToCart([
          catIndex,
          itemIndex,
          qty,
          parseFloat(price),
          item,
          type,
          isFree,
        ])
      );
      refreshME();
      setAddonsSeleted({
        radioButton: { price: [], id: [], name: [] },
        CheckBoxes: { price: [], id: [], name: [] },
        ingrediant: { price: [], id: [], name: [] },
      });
      setAddonsModalItem({
        item: undefined,
        catIndex: undefined,
        itemIndex: undefined,
        variant: undefined,
        ingredient: undefined,
        totel: undefined,
      });
      setAddonsModal(false);
      setLoadingItem(null);
      setItemModelItem({
        catIndex: itemModelItem.catIndex,
        item: itemModelItem.item,
        itemIndex: itemModelItem.itemIndex,
        quantity: qty,
      });
      setMeatInput(0);
      setMeatInputModal(false);
    };
    var qty;
    if (item.ingrecount > 0) {
      setLoadingItem(item.id);
      sql.getItem(item.id).then(async (res) => {
        if (res.rows.length > 0 && !repeat) {
          setRepeatModal(true);
          setRepeatModalItem({
            catIndex,
            item,
            itemIndex,
            price,
            qty,
          });
          setLoadingItem(false);
        } else {
          const ADD_ONS_ITEM_API = `${LocalConfig.API_URL}/admin/api/ingredientsnew.php?category=${item.category}&menu_id=${item.id}`;
          await postData(ADD_ONS_ITEM_API).then((res) => {
            var myObj = { id: [], price: [], name: [] };
            res.variant.map((eachVariant) => {
              if (eachVariant.data.length > 0) {
                if (eachVariant.status == 1 && eachVariant.data[0].id) {
                  let pushed = true;
                  eachVariant.data.map((variantItem, variantIndex) => {
                    if (variantItem.selection == 1) {
                      myObj.id.push(eachVariant.data[variantIndex].id);
                      myObj.price.push(eachVariant.data[variantIndex].price);
                      myObj.name.push(
                        eachVariant.data[variantIndex].variant_name
                      );
                      pushed = !pushed;
                    }
                  });
                  if (!pushed) {
                    myObj.id.push(eachVariant.data[0].id);
                    myObj.price.push(eachVariant.data[0].price);
                    myObj.name.push(eachVariant.data[0].variant_name);
                  }
                }
              }
            });
            var totel = parseFloat(item.price) || parseFloat(item.dprice);
            myObj.price.map((radioButtonPrice) => {
              if (
                radioButtonPrice != "" &&
                !isNaN(parseFloat(radioButtonPrice))
              )
                totel += parseFloat(radioButtonPrice);
            });
            setAddonsSeleted({
              radioButton: myObj,
              CheckBoxes: { id: [], price: [], name: [] },
              ingrediant: { price: [], id: [], name: [] },
            });
            setAddonsModalItem({
              item: item,
              catIndex,
              itemIndex,
              variant: res.variant,
              ingredient: res.ingre,
              totel: totel,
            });
            // setItemModel(true);
            setLoadingItem(null);
            setAddonsModal(true);
          });
        }
      });
    } else {
      sql.getItem(item.id).then((res) => {
        if (res.rows.length <= 0) {
          if (
            allMenuFromRedux[catIndex].data[itemIndex].wholecat == 5 ||
            allMenuFromRedux[catIndex].data[itemIndex].wholecat == 1
          ) {
            qty = parseInt(allMenuFromRedux[catIndex].data[itemIndex].qty) + 1;
            ADDItem({ qty, type: "add" });
          } else if (allMenuFromRedux[catIndex].data[itemIndex].wholecat == 2) {
            qty =
              parseInt(allMenuFromRedux[catIndex].data[itemIndex].qty) + 0.25;
            ADDItem({ qty, type: "add" });
          } else if (allMenuFromRedux[catIndex].data[itemIndex].wholecat == 3) {
            if (!meatInputModal) {
              setMeatInput(allMenuFromRedux[catIndex].data[itemIndex].qty);
              setMeatInputModal(true);
              setMeatInputModalItem({
                item: allMenuFromRedux[catIndex].data[itemIndex],
                catIndex,
                itemIndex,
              });
            } else {
              ADDItem({ qty: parseFloat(meatInput), type: "add" });
            }
          }
        } else if (res.rows.length > 0) {
          if (
            allMenuFromRedux[catIndex].data[itemIndex].wholecat == 5 ||
            allMenuFromRedux[catIndex].data[itemIndex].wholecat == 1
          ) {
            qty = parseInt(allMenuFromRedux[catIndex].data[itemIndex].qty) + 1;
            ADDItem({ qty: qty, type: "update" });
          } else if (allMenuFromRedux[catIndex].data[itemIndex].wholecat == 2) {
            qty =
              parseFloat(allMenuFromRedux[catIndex].data[itemIndex].qty) + 0.25;
            ADDItem({ qty: qty, type: "update" });
          } else if (allMenuFromRedux[catIndex].data[itemIndex].wholecat == 3) {
            if (!meatInputModal) {
              setMeatInput(allMenuFromRedux[catIndex].data[itemIndex].qty);
              setMeatInputModal(true);
              setMeatInputModalItem({
                item: allMenuFromRedux[catIndex].data[itemIndex],
                catIndex,
                itemIndex,
              });
            } else {
              ADDItem({ qty: meatInput, type: "update" });
            }
          }
        }
      });
    }
  };
  const openItemModal = ({ item, disable = false, modal = true }) => {
    if (disable) {
      setAddonsModalItem({
        item: undefined,
        catIndex: undefined,
        itemIndex: undefined,
        variant: undefined,
        totel: undefined,
      });
      setItemModel(false);
    } else {
      for (let catIndex = 0; catIndex < allMenuFromRedux.length; catIndex++) {
        for (
          let itemIndex = 0;
          itemIndex < allMenuFromRedux[catIndex].data.length;
          itemIndex++
        ) {
          if (allMenuFromRedux[catIndex].data[itemIndex].id == item.id) {
            item.sqlid = allMenuFromRedux[catIndex].data[itemIndex].sqlid;
            item.qty = allMenuFromRedux[catIndex].data[itemIndex].qty;
            setItemModelItem({
              item,
              catIndex,
              itemIndex,
              quantity: allMenuFromRedux[catIndex].data[itemIndex].qty,
            });
            if (modal) setItemModel(true);
          }
        }
      }
    }
  };
  const removingItem = ({ catIndex, item, itemIndex, price }) => {
    const MinusItem = ({ qty }) => {
      dispatch(removeromCart([catIndex, itemIndex, qty, price, item]));
      refreshME();
      setLoadingItem(null);
      setItemModelItem({
        catIndex: itemModelItem.catIndex,
        item: itemModelItem.item,
        itemIndex: itemModelItem.itemIndex,
        quantity: qty,
      });
      openItemModal({ item: item, modal: false });
    };
    var qty;
    if (item.wholecat == 5 || item.wholecat == 1) {
      qty = parseInt(allMenuFromRedux[catIndex].data[itemIndex].qty) - 1;
    } else if (item.wholecat == 2)
      qty = parseFloat(allMenuFromRedux[catIndex].data[itemIndex].qty) - 0.25;
    if (qty > 0) {
      sql.getItem(item.id).then((res) => {
        if (res.rows.length <= 1) {
          MinusItem({ qty });
        } else if (res.rows.length > 0) {
          Alert.alert(
            "Alert",
            "You have added more then one item, Please update from your cart page."
          );
        }
      });
    } else {
      dispatch(deleteItem([catIndex, itemIndex, 0, price, item]));
    }

    setTimeout(() => {
      setLoadingItem(null);
      refreshME();
    }, 50);
  };
  const getData = async ({ presentBranch }) => {
    const TOP_ITEMS_API = `${LocalConfig.API_URL}/admin/api/wholelist_test.php?branch=${presentBranch}`;
    await postData(TOP_ITEMS_API).then((TOP_ITEMS_RES) => {
      setTodaySpecial(TOP_ITEMS_RES.wholelist.todaysspl);
      setTopPics(TOP_ITEMS_RES.wholelist.top_picks);
    });
    const WHOLE_DATA_API = `${LocalConfig.API_URL}/admin/api/categorywithitem_test.php?branch=${presentBranch}`;
    await postData(WHOLE_DATA_API).then(async (WHOLE_DATA) => {
      dispatch(addAllItems(WHOLE_DATA.menu_category));
    });
    const BANNER_DATA_API = `${LocalConfig.API_URL}/admin/api/banner.php?branch=${presentBranch}`;
    await postData(BANNER_DATA_API).then((BANNER_DATA) => {
      setBannerList(BANNER_DATA.banner);
    });
    const FSSAI_DATA_API = `${LocalConfig.API_URL}/admin/api/get_fssai.php?flag=3&&branch=${presentBranch}`;
    await postData(FSSAI_DATA_API).then((res) => {
      setFssaiDetails(res.data);
    });
    setAllProcessFinished(true);
    setSwipeDownRefresh(false);
  };
  const getbranchList = async () => {
    setAllProcessFinished(false);
    setBranchmodal(false);
    setOpenFirstList(true);
    await AsyncStorage.getItem("branch_id").then((presentBranch) => {
      const api = `${LocalConfig.API_URL}/admin/api/branchlist.php`;
      postData(api).then((responseJson) => {
        responseJson.branch.map((branchers) => {
          if (branchers.id == presentBranch) {
            setPresentBranchName(branchers.branch_name);
          }
        });
        function calcCrow(lat1, lon1, lat2, lon2) {
          // Converts numeric degrees to radians
          function toRad(Value) {
            return (Value * Math.PI) / 180;
          }
          var R = 6371; // km
          var dLat = toRad(lat2 - lat1);
          var dLon = toRad(lon2 - lon1);
          var lat1 = toRad(lat1);
          var lat2 = toRad(lat2);

          var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
              Math.sin(dLon / 2) *
              Math.cos(lat1) *
              Math.cos(lat2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = R * c;
          return d.toFixed(2);
        }
        AsyncStorage.getItem("loclat").then((loclat) => {
          AsyncStorage.getItem("loclong").then((loclong) => {
            // responseJson.branch.map(
            //   (item, index) =>
            //   (item.km = calcCrow(
            //     loclat,
            //     loclong,
            //     responseJson.branch[index].latlog.split(',')[0],
            //     responseJson.branch[index].latlog.split(',')[1],
            //   )),
            // );
            setBranchList(
              responseJson.branch.sort(function (a, b) {
                return a.id - b.id;
              })
            );
          });
        });
        setPresentBranch(presentBranch);
        getData({ presentBranch });
      });
    });
  };
  useEffect(() => {
    if (branchList.length <= 0) {
      getbranchList();
    }
  });
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      getbranchList();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);
  return (
    <View
      style={{
        backgroundColor: LocalConfig.COLOR.BLACK,
        flex: 1,
      }}
    >
      <StatusBar backgroundColor={LocalConfig.COLOR.UI_COLOR} />
      {/* TOP HEADER VIEW */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: LocalConfig.COLOR.BLACK,
          height: 50,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 0.3 }} />
          <Icon
            name="ios-menu-outline"
            size={28}
            color={LocalConfig.COLOR.UI_COLOR}
            onPress={() => props.navigation.openDrawer()}
            style={{ flex: 1 }}
          />
        </View>
        <View
          style={{
            flex: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {allProcessFinished ? (
            <Text
              style={{
                color: LocalConfig.COLOR.UI_COLOR,
                fontSize: 18,
                fontFamily: "verdanab",
              }}
            >
              {presentBranchName || ""}
            </Text>
          ) : (
            <SkeletonPlaceholder
              backgroundColor={LocalConfig.COLOR.BLACK}
              highlightColor={LocalConfig.COLOR.BLACK_LIGHT}
            >
              <SkeletonPlaceholder.Item
                width={Dimensions.get("screen").width / 3}
                height={20}
                padding={"3%"}
                borderRadius={4}
              />
            </SkeletonPlaceholder>
          )}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              allProcessFinished &&
              props.navigation.navigate("SearchScreen", {
                data: allMenuFromRedux,
              })
            }
          >
            <Icon
              name="ios-search"
              color={LocalConfig.COLOR.UI_COLOR}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setBranchmodal(true)}
          >
            <Icon2 name="shop" color={LocalConfig.COLOR.UI_COLOR} size={28} />
          </TouchableOpacity>
        </View>
      </View>
      {!allProcessFinished ? (
        <HomeScreenLoading />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={swipeDownRefresh}
              onRefresh={() => refreshWholeData()}
            />
          }
        >
          {/* IF LOCAL CONFIG IS IN PRODUCTION IS SHOWS THIS */}
          {(LocalConfig.IN_DEVELOPMENT || LocalConfig.PaymentIsTest) && (
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontWeight: "bold",
              }}
            >
              {LocalConfig.IN_DEVELOPMENT && "LocalConfig.IN_DEVELOPMENT"}{" "}
              {LocalConfig.PaymentIsTest && "Payment Is Test"}
            </Text>
          )}
          {/* BANNER VIEW */}
          {bannerList.length > 0 && (
            <View style={{ width: "100%" }}>
              <SwiperFlatList
                autoplay
                autoplayDelay={3}
                index={0}
                autoplayLoop
                data={bannerList}
                renderItem={(
                  { item } // Standard Image
                ) => (
                  <View style={{ width: Dimensions.get("window").width }}>
                    <Image
                      source={{ uri: banner_IMAGE + item.img }}
                      style={{
                        width: "100%",
                        height: 230,
                        borderRadius: 1,
                        marginTop: "0%",
                        marginLeft: "0%",
                      }}
                    />
                  </View>
                )}
                showPagination
              />
            </View>
          )}
          {/* TOP PICS */}
          <ScrollView horizontal={true}>
            {topPics.length > 0 &&
              topPics.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  // disabled={true}
                  onPress={() => openItemModal({ item: item, disable: false })}
                  style={{ padding: 10, alignItems: "center" }}
                >
                  {item.status == 0 ? (
                    <Grayscale>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 45,
                          marginVertical: 10,
                        }}
                        source={{ uri: menu_item_icon_IMAGE + item.menu_image }}
                        resizeMode="cover"
                      />
                    </Grayscale>
                  ) : (
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 45,
                        marginVertical: 10,
                      }}
                      source={{ uri: menu_item_icon_IMAGE + item.menu_image }}
                      resizeMode="cover"
                    />
                  )}
                  <Text
                    numberOfLines={2}
                    // style={{
                    //   color: LocalConfig.COLOR.WHITE_LIGHT,
                    //   paddingVertical: 8,
                    //   fontFamily: 'Proxima Nova Font',
                    //   textAlign: 'justify',
                    //   paddingRight: 8,
                    // }}
                    style={{
                      maxWidth: 80,
                      color: LocalConfig.COLOR.WHITE_LIGHT,
                      fontFamily: "Proxima Nova Font",
                      textTransform: "capitalize",
                      textAlign: "center",
                    }}
                  >
                    {item.menu_name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
          {/* SHOP BY CATEGORY */}
          {allMenuFromRedux.length > 0 && (
            <FlatList
              data={allMenuFromRedux}
              key={({ item, index }) => index}
              extraData={refresh}
              refreshing={refresh}
              renderSectionHeader={({ allItems }) => (
                <Text>{allItems.menu_name}</Text>
              )}
              renderItem={(catItem) => (
                <View>
                  <List.Section>
                    <List.Accordion
                      // title={catItem.item.cat_id == catItem.item.data[0].free_category ? `Buy ${catItem.item.data[0].coupon?.max_main_prdt_qty} Get ${catItem.item.data[0].coupon?.free_prdct_qty} Free ${catItem.item.data[0].coupon?.free_prdct != catItem.item.data[0].id ? catItem.item.data[0].coupon?.free_prdct_menu_name : catItem.item.data[0].menu_name}` : catItem.item.cat_name}
                      title={catItem.item.cat_name}
                      des={catItem.item.data.length}
                      expanded={catItem.index == 0 ? openFirstList : undefined}
                      titleStyle={{
                        fontFamily: "Verdana Bold",
                        fontSize: 14,
                        textTransform: "capitalize",
                      }}
                      onPress={() => {
                        if (catItem.index == 0)
                          setOpenFirstList(!openFirstList);
                      }}
                      style={{
                        backgroundColor: LocalConfig.COLOR.BLACK,
                      }}
                      theme={{
                        colors: {
                          // primary: catItem.item.cat_id == catItem.item.data[0].free_category ? LocalConfig.COLOR.UI_COLOR : LocalConfig.COLOR.WHITE,
                          primary: LocalConfig.COLOR.WHITE,
                          // text: catItem.item.cat_id == catItem.item.data[0].free_category ? LocalConfig.COLOR.UI_COLOR : LocalConfig.COLOR.WHITE,
                          text: LocalConfig.COLOR.WHITE,
                        },
                      }}
                    >
                      <FlatList
                        data={catItem.item.data}
                        renderSectionHeader={({ allItems }) => (
                          <Text style={{ color: LocalConfig.COLOR.WHITE }}>
                            {allItems.menu_name}
                          </Text>
                        )}
                        renderItem={({ item, index }) => (
                          <View>
                            {item.coupon?.active == 1 && index == 0 && (
                              <TouchableOpacity
                                onPress={() => {
                                  openCouponInfoModal({ item, canIOpen: true });
                                }}
                                style={{
                                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                                  padding: 10,
                                  width: "80%",
                                  borderRadius: 5,
                                  // marginVertical: 15,
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  alignSelf: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    color: LocalConfig.COLOR.BLACK,
                                    fontFamily: "Proxima Nova Font",
                                    textAlign: "center",
                                  }}
                                >
                                  Buy any {item.coupon?.max_main_prdt_qty} Get{" "}
                                  {item.coupon?.free_prdct_qty} Free{" "}
                                  {item.coupon?.free_prdct != item.id
                                    ? item.coupon?.free_prdct_menu_name
                                    : item.menu_name}
                                </Text>
                                <MaterialIcons
                                  name="touch-app"
                                  size={15}
                                  color={LocalConfig.COLOR.BLACK}
                                />
                              </TouchableOpacity>
                            )}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                margin: 15,
                                height:
                                  Math.round(Dimensions.get("screen").height) /
                                  6.5,
                              }}
                            >
                              <View
                                style={{
                                  flex: 2,
                                }}
                              >
                                <View
                                  style={{
                                    alignItems: "center",
                                    flexDirection: "row",
                                  }}
                                >
                                  <Image
                                    style={{
                                      width: 15,
                                      height: 15,
                                      marginRight: 5,
                                      backgroundColor: LocalConfig.COLOR.WHITE,
                                    }}
                                    resizeMode={"cover"}
                                    source={
                                      item.food_type == 2
                                        ? require("../assests/non_veg.png")
                                        : require("../assests/veg.png")
                                    }
                                  />
                                  <Text
                                    style={{
                                      color: LocalConfig.COLOR.WHITE,
                                      fontSize: 14,
                                      fontFamily: "verdanab",
                                    }}
                                  >
                                    {item.menu_name}
                                  </Text>
                                </View>
                                <View>
                                  <Text
                                    style={{
                                      color: LocalConfig.COLOR.WHITE,
                                      paddingTop: 8,
                                      fontFamily: "Proxima Nova Font",
                                    }}
                                  >
                                    {`\u20B9 ${item.price || item.dprice}`}
                                  </Text>
                                  {item.description != "" &&
                                    (showMore.id != item.id ? (
                                      <Text
                                        numberOfLines={2}
                                        onPress={(e) => {
                                          setShowMore({
                                            id: item.id,
                                            description: item.description,
                                          });
                                        }}
                                        style={{
                                          color: LocalConfig.COLOR.WHITE_LIGHT,
                                          paddingVertical: 8,
                                          fontFamily: "Proxima Nova Font",
                                          textAlign: "justify",
                                          paddingRight: 8,
                                        }}
                                      >
                                        {item.description}
                                      </Text>
                                    ) : (
                                      <Text
                                        onPress={(e) => {
                                          setShowMore({
                                            id: null,
                                            description: null,
                                          });
                                        }}
                                        style={{
                                          color: LocalConfig.COLOR.BLACK_LIGHT,
                                          paddingVertical: 8,
                                          fontFamily: "Proxima Nova Font",
                                          textAlign: "justify",
                                          paddingRight: 8,
                                        }}
                                      >
                                        {showMore.description}
                                      </Text>
                                    ))}
                                </View>
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {item.status == 0 && item.menu_image != "" ? (
                                  <Grayscale>
                                    <TouchableOpacity
                                      onPress={() => openItemModal({ item })}
                                    >
                                      <Image
                                        onError={(error) => {
                                          item.menu_image = "NoImage.png";
                                        }}
                                        style={{
                                          width:
                                            (Dimensions.get("window").width /
                                              100) *
                                            30,
                                          height:
                                            (Dimensions.get("window").width /
                                              100) *
                                            25,
                                          borderRadius: 5,
                                        }}
                                        source={{
                                          uri:
                                            menu_item_icon_IMAGE +
                                            item.menu_image,
                                        }}
                                        resizeMode="cover"
                                      />
                                    </TouchableOpacity>
                                  </Grayscale>
                                ) : (
                                  item.menu_image != "" && (
                                    <TouchableOpacity
                                      onPress={() => openItemModal({ item })}
                                    >
                                      <Image
                                        onError={(error) => {
                                          item.menu_image = "NoImage.png";
                                        }}
                                        style={{
                                          width:
                                            (Dimensions.get("window").width /
                                              100) *
                                            30,
                                          height:
                                            (Dimensions.get("window").width /
                                              100) *
                                            25,
                                          borderRadius: 5,
                                        }}
                                        source={{
                                          uri:
                                            menu_item_icon_IMAGE +
                                            item.menu_image,
                                        }}
                                        resizeMode="cover"
                                      />
                                    </TouchableOpacity>
                                  )
                                )}
                                <View
                                  style={{
                                    backgroundColor:
                                      item.status == 0
                                        ? LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                                        : LocalConfig.COLOR.UI_COLOR,
                                    width:
                                      Math.round(
                                        Dimensions.get("screen").width
                                      ) / 4,
                                    marginTop: item.status != 0 ? "-10%" : 0,
                                    padding: 5,
                                    borderRadius: 5,
                                    elevation: 20,
                                    justifyContent: "center",
                                    alignSelf: "center",
                                  }}
                                >
                                  {item.status == 0 ? (
                                    item.timing_state == 0 ? (
                                      <Text
                                        style={{
                                          color: LocalConfig.COLOR.BLACK,
                                          fontFamily: "Proxima Nova Bold",
                                          textAlign: "center",
                                        }}
                                      >
                                        SOLD
                                      </Text>
                                    ) : (
                                      <Text
                                        style={{
                                          color: LocalConfig.COLOR.BLACK,
                                          fontFamily: "Proxima Nova Bold",
                                          textAlign: "center",
                                          fontSize: 12,
                                        }}
                                      >{`Next available at ${item.start}`}</Text>
                                    )
                                  ) : item.qty <= 0 ? (
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (loadingItem != item.id)
                                          addingItem({
                                            catIndex: catItem.index,
                                            item,
                                            itemIndex: index,
                                            price: item.dprice
                                              ? item.dprice
                                              : item.price,
                                          });
                                      }}
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color: LocalConfig.COLOR.BLACK,
                                          fontFamily: "Proxima Nova Bold",
                                          fontSize: 18,
                                        }}
                                      >
                                        {loadingItem != item.id ? (
                                          "ADD"
                                        ) : (
                                          <ActivityIndicator
                                            size={
                                              Math.round(
                                                Dimensions.get("screen").width
                                              ) / 20
                                            }
                                            color={LocalConfig.COLOR.BLACK}
                                          />
                                        )}
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                      }}
                                    >
                                      {loadingItem != item.id &&
                                        item.wholecat != 3 && (
                                          <MaterialIcons
                                            name="remove"
                                            size={20}
                                            color={LocalConfig.COLOR.BLACK}
                                            onPress={() => {
                                              if (loadingItem != item.id)
                                                removingItem({
                                                  catIndex: catItem.index,
                                                  item,
                                                  itemIndex: index,
                                                  price: item.price,
                                                });
                                            }}
                                          />
                                        )}
                                      {loadingItem != item.id &&
                                        item.wholecat == 3 &&
                                        item.ingrecount <= 0 && (
                                          <MaterialIcons
                                            name="edit"
                                            size={20}
                                            color={LocalConfig.COLOR.BLACK}
                                            onPress={() => {
                                              if (loadingItem != item.id) {
                                                addingItem({
                                                  catIndex: catItem.index,
                                                  item,
                                                  itemIndex: index,
                                                  price:
                                                    item.price || item.dprice,
                                                });
                                              }
                                            }}
                                          />
                                        )}
                                      <Text
                                        style={{
                                          color: LocalConfig.COLOR.BLACK,
                                          fontFamily: "Proxima Nova Bold",
                                          fontSize: 18,
                                          textAlign: "center",
                                        }}
                                      >
                                        {/* {item.qty} */}
                                        {loadingItem != item.id ? (
                                          item.qty
                                        ) : (
                                          <ActivityIndicator
                                            size={
                                              Math.round(
                                                Dimensions.get("screen").width
                                              ) / 20
                                            }
                                            color={LocalConfig.COLOR.BLACK}
                                          />
                                        )}
                                      </Text>
                                      {loadingItem != item.id &&
                                        item.wholecat != 3 && (
                                          <MaterialIcons
                                            name="add"
                                            size={20}
                                            color={LocalConfig.COLOR.BLACK}
                                            onPress={() => {
                                              if (loadingItem != item.id)
                                                addingItem({
                                                  catIndex: catItem.index,
                                                  item,
                                                  itemIndex: index,
                                                  price:
                                                    item.price || item.dprice,
                                                });
                                            }}
                                          />
                                        )}
                                      {loadingItem != item.id &&
                                        item.wholecat == 3 && (
                                          <MaterialIcons
                                            name="delete"
                                            size={20}
                                            color={LocalConfig.COLOR.BLACK}
                                            onPress={() => {
                                              if (loadingItem != item.id) {
                                                item.qty = 0;
                                                removingItem({
                                                  catIndex: catItem.index,
                                                  item,
                                                  itemIndex: index,
                                                  price: item.price,
                                                });
                                              }
                                            }}
                                          />
                                        )}
                                    </View>
                                  )}
                                </View>
                                {item.ingrecount > 0 && (
                                  <Text
                                    style={{
                                      color: LocalConfig.COLOR.BLACK_LIGHT,
                                    }}
                                  >
                                    customizable
                                  </Text>
                                )}
                              </View>
                            </View>
                            <View
                              style={{
                                width: "100%",
                                height: 0,
                                borderWidth: 0.3,
                                borderColor: LocalConfig.COLOR.WHITE,
                                backgroundColor: "rgba(0,0,0,0.02)",
                                elevation: 5,
                                alignSelf: "center",
                              }}
                            />
                          </View>
                        )}
                      />
                    </List.Accordion>
                  </List.Section>
                  {allMenuFromRedux.length == catItem.index + 1 &&
                    fssaiDeatils.register.fssai != "" && (
                      <View
                        style={{
                          backgroundColor: "rgba(206,212,218,0.5)",
                          padding: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={require("../assests/fssai.png")}
                            style={{ width: 50, height: 50 }}
                            resizeMode={"contain"}
                          />
                          <Text style={{ color: LocalConfig.COLOR.BLACK }}>
                            Lic.No. {fssaiDeatils.register.fssai}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontFamily: "verdanab",
                              color: LocalConfig.COLOR.BLACK,
                              fontSize: 15,
                            }}
                          >
                            {fssaiDeatils.branch_name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "Proxima Nova Font",
                              color: LocalConfig.COLOR.BLACK,
                              fontSize: 15,
                            }}
                          >
                            {fssaiDeatils.address}
                          </Text>
                        </View>
                      </View>
                    )}
                </View>
              )}
            />
          )}
        </ScrollView>
      )}
      {/* VIEW CART */}
      {TotelPrice.items > 0 && TotelPrice.price > 0 && (
        <TouchableOpacity
          activeOpacity={0}
          onPress={() => props.navigation.navigate("CartScreen")}
          style={{
            backgroundColor: LocalConfig.COLOR.UI_COLOR,
            height: (Dimensions.get("window").height / 100) * 7,
            display: "flex",
            // justifyContent: 'center',
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{ flex: 2, marginHorizontal: 10, alignItems: "flex-start" }}
          >
            <Text
              style={{ fontFamily: "verdanab", color: LocalConfig.COLOR.BLACK }}
            >
              TOTEL ITEMS
              {` ${TotelPrice.items} | \u20B9 ${TotelPrice.price.toFixed(2)}`}
            </Text>
          </View>
          <View
            style={{ flex: 1, marginHorizontal: 10, alignItems: "flex-end" }}
          >
            <Text
              style={{ fontFamily: "verdanab", color: LocalConfig.COLOR.BLACK }}
            >
              VIEW CART
            </Text>
          </View>
        </TouchableOpacity>
      )}
      {/* ITEM MODAL */}
      {itemModelItem.item && (
        <Modal
          visible={itemModel}
          onBackdropPress={() => openItemModal({ disable: true })}
          onRequestClose={() => openItemModal({ disable: true })}
          animationType={"slide"}
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
            width: "100%",
            margin: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
            height: Dimensions.get("window").height / 2,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                height: (Dimensions.get("window").height / 100) * 7,
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                alignItems: "center",
                width: Dimensions.get("window").width,
                justifyContent: "flex-end",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  flex: 10,
                  textAlign: "center",
                  fontFamily: "verdanab",
                  color: LocalConfig.COLOR.BLACK,
                }}
              >
                {`${itemModelItem.item.menu_name}`.toUpperCase()}
              </Text>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => openItemModal({ disable: true })}
              >
                <MaterialIcons
                  name="close"
                  size={25}
                  color={LocalConfig.COLOR.BLACK}
                />
              </TouchableOpacity>
            </View>
            <View>
              <View>
                {itemModelItem.item.status == 0 ? (
                  <Grayscale>
                    <Image
                      source={{
                        uri:
                          menu_item_icon_IMAGE + itemModelItem.item.menu_image,
                      }}
                      style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").width / 1.5,
                      }}
                      resizeMode={"stretch"}
                    />
                  </Grayscale>
                ) : (
                  <Image
                    source={{
                      uri: menu_item_icon_IMAGE + itemModelItem.item.menu_image,
                    }}
                    style={{
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").width / 1.5,
                    }}
                    resizeMode={"stretch"}
                  />
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: LocalConfig.COLOR.BLACK,
                  padding: Dimensions.get("window").width / 30,
                }}
              >
                <View style={{ flex: 4 }}>
                  <Text
                    style={{
                      fontFamily: "verdanab",
                      color: LocalConfig.COLOR.WHITE,
                      fontSize: 13,
                    }}
                  >
                    {`${itemModelItem.item.menu_name}`.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Proxima",
                      color: LocalConfig.COLOR.WHITE,
                      fontSize: 15,
                    }}
                  >
                    {`\u20B9 ${itemModelItem.item.price}`}
                  </Text>
                  {itemModelItem.item.description != "" &&
                    (showMore.id != itemModelItem.item.id ? (
                      <Text
                        numberOfLines={2}
                        onPress={(e) => {
                          setShowMore({
                            id: itemModelItem.item.id,
                            description: itemModelItem.item.description,
                          });
                        }}
                        style={{
                          color: LocalConfig.COLOR.WHITE_LIGHT,
                          paddingVertical: 8,
                          fontFamily: "Proxima Nova Font",
                          textAlign: "justify",
                          paddingRight: 8,
                        }}
                      >
                        {itemModelItem.item.description}
                      </Text>
                    ) : (
                      <Text
                        onPress={(e) => {
                          setShowMore({
                            id: null,
                            description: null,
                          });
                        }}
                        style={{
                          color: LocalConfig.COLOR.BLACK_LIGHT,
                          paddingVertical: 8,
                          fontFamily: "Proxima Nova Font",
                          textAlign: "justify",
                          paddingRight: 8,
                        }}
                      >
                        {showMore.description}
                      </Text>
                    ))}
                </View>
                <View
                  style={{
                    flex: 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      marginVertical: 10,
                      elevation: 10,
                      backgroundColor:
                        itemModelItem.item.status == 0
                          ? LocalConfig.COLOR.UI_COLOR_LITE_TWICE
                          : LocalConfig.COLOR.UI_COLOR,
                      width: "100%",
                      padding: 8,
                      borderRadius: 8,
                      justifyContent: "center",
                    }}
                  >
                    {itemModelItem.item.status == 0 ? (
                      itemModelItem.item.timing_state == 0 ? (
                        <Text
                          style={{
                            color: LocalConfig.COLOR.BLACK,
                            fontFamily: "Proxima Nova Bold",
                            textAlign: "center",
                            fontSize: 15,
                          }}
                        >
                          SOLD
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: LocalConfig.COLOR.BLACK,
                            fontFamily: "Proxima Nova Bold",
                            textAlign: "center",
                          }}
                        >{`Next available at ${itemModelItem.item.start}`}</Text>
                      )
                    ) : allMenuFromRedux[itemModelItem.catIndex].data[
                        itemModelItem.itemIndex
                      ].qty <= 0 ? (
                      <TouchableOpacity
                        onPress={() => {
                          if (loadingItem != itemModelItem.item.id)
                            addingItem({
                              catIndex: itemModelItem.catIndex,
                              item: itemModelItem.item,
                              itemIndex: itemModelItem.itemIndex,
                              price:
                                itemModelItem.item.price ||
                                itemModelItem.item.dprice,
                            });
                        }}
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Text
                          style={{
                            color: LocalConfig.COLOR.BLACK,
                            fontFamily: "Proxima Nova Bold",
                            fontSize: 15,
                          }}
                        >
                          {loadingItem != itemModelItem.item.id ? (
                            `ADD`
                          ) : (
                            <ActivityIndicator
                              size={
                                Math.round(Dimensions.get("screen").width) / 20
                              }
                              color={LocalConfig.COLOR.BLACK}
                            />
                          )}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        {loadingItem != itemModelItem.item.id && (
                          <MaterialIcons
                            name="remove"
                            size={20}
                            color={LocalConfig.COLOR.BLACK}
                            onPress={() => {
                              removingItem({
                                catIndex: itemModelItem.catIndex,
                                item: allMenuFromRedux[itemModelItem.catIndex]
                                  .data[itemModelItem.itemIndex],
                                itemIndex: itemModelItem.itemIndex,
                                price: itemModelItem.item.price,
                              });
                            }}
                          />
                        )}
                        <Text
                          style={{
                            color: LocalConfig.COLOR.BLACK,
                            fontFamily: "Proxima Nova Bold",
                            fontSize: 18,
                            textAlign: "center",
                          }}
                        >
                          {loadingItem != itemModelItem.item.id ? (
                            allMenuFromRedux[itemModelItem.catIndex].data[
                              itemModelItem.itemIndex
                            ].qty
                          ) : (
                            <ActivityIndicator
                              size={
                                Math.round(Dimensions.get("screen").width) / 20
                              }
                              color={LocalConfig.COLOR.BLACK}
                            />
                          )}
                        </Text>
                        {loadingItem != itemModelItem.item.id && (
                          <MaterialIcons
                            name="add"
                            size={20}
                            color={LocalConfig.COLOR.BLACK}
                            onPress={() => {
                              addingItem({
                                catIndex: itemModelItem.catIndex,
                                item: itemModelItem.item,
                                itemIndex: itemModelItem.itemIndex,
                                price:
                                  itemModelItem.item.price ||
                                  itemModelItem.item.dprice,
                              });
                            }}
                          />
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {/* VARIENT MODAL */}
      {addonsModalItem.item != undefined && (
        <Modal
          visible={addonsModal}
          onBackdropPress={() => {
            setAddonsModalItem({
              item: undefined,
              catIndex: undefined,
              itemIndex: undefined,
              variant: undefined,
              ingredient: undefined,
              totel: undefined,
            });
            setLoadingItem(null);
            setAddonsModal(false);
            setAddonsSeleted({
              radioButton: { id: [], price: [] },
              CheckBoxes: { id: [], price: [] },
              ingrediant: { id: [], price: [] },
            });
          }}
          onRequestClose={() => {
            setAddonsModalItem({
              item: undefined,
              catIndex: undefined,
              itemIndex: undefined,
              variant: undefined,
              ingredient: undefined,
              totel: undefined,
            });
            setAddonsSeleted({
              radioButton: { id: [], price: [] },
              CheckBoxes: { id: [], price: [] },
              ingrediant: { id: [], price: [] },
            });
            setLoadingItem(null);
            setAddonsModal(false);
          }}
          animationType={"fade"}
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
            width: "100%",
            margin: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
            height: Dimensions.get("window").height / 2,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                height: (Dimensions.get("window").height / 100) * 7,
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                alignItems: "center",
                width: Dimensions.get("window").width,
                justifyContent: "center",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  flex: 10,
                  textAlign: "center",
                  fontFamily: "verdanab",
                  color: LocalConfig.COLOR.BLACK,
                }}
              >
                {`${addonsModalItem.item.menu_name}`.toUpperCase()}
              </Text>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setAddonsModalItem({
                    item: undefined,
                    catIndex: undefined,
                    itemIndex: undefined,
                    variant: undefined,
                    ingredient: undefined,
                    totel: undefined,
                  });
                  setAddonsSeleted({
                    radioButton: { id: [], price: [] },
                    CheckBoxes: { id: [], price: [] },
                    ingrediant: { id: [], price: [] },
                  });
                  setLoadingItem(null);
                  setAddonsModal(false);
                }}
              >
                <MaterialIcons
                  name="close"
                  size={25}
                  color={LocalConfig.COLOR.BLACK}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
          >
            {addonsModalItem.item.wholecat == 3 && (
              <TextInput
                style={{
                  height: 40,
                  margin: 12,
                  borderWidth: 1,
                  padding: 10,
                  borderColor: LocalConfig.COLOR.UI_COLOR,
                  borderRadius: 5,
                  color: LocalConfig.COLOR.WHITE,
                }}
                onChangeText={(qty) => setWholeCat3Input(qty)}
                keyboardType={"number-pad"}
                autoFocus={true}
                value={
                  wholeCat3Input <= 0 || isNaN(wholeCat3Input)
                    ? undefined
                    : `${wholeCat3Input}`
                }
                maxLength={5}
                placeholderTextColor={LocalConfig.COLOR.BLACK_LIGHT}
                placeholder={"Quantity"}
              />
            )}
            {addonsModalItem.ingredient?.length > 0 && (
              <Text
                style={{
                  fontSize: 18,
                  color: LocalConfig.COLOR.WHITE,
                  padding: 10,
                  fontFamily: "verdanab",
                }}
              >
                {"Addons"}
              </Text>
            )}
            <FlatList
              data={addonsModalItem.ingredient}
              renderItem={(ingrediant) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text
                    style={{
                      color: LocalConfig.COLOR.WHITE,
                      fontFamily: "Proxima Nova Font",
                    }}
                  >
                    {ingrediant.item.item_name}{" "}
                    {ingrediant.item.price != 0 &&
                      `\u20B9 ` + ingrediant.item.price}
                  </Text>
                  <CheckBox
                    value={addonsSeleted.ingrediant.id.includes(
                      ingrediant.item.id
                    )}
                    onValueChange={(ev) => {
                      var totel = parseFloat(addonsModalItem.item.price);
                      if (!ev) {
                        var myidArray = addonsSeleted.ingrediant.id;
                        var mypriceArray = addonsSeleted.ingrediant.price;
                        var mynameArray = addonsSeleted.ingrediant.name;
                        const index = myidArray.indexOf(ingrediant.item.id);
                        if (index > -1) {
                          myidArray.splice(index, 1); // 2nd parameter means remove one item only
                          mypriceArray.splice(index, 1); // 2nd parameter means remove one item only
                          mynameArray.splice(index, 1); // 2nd parameter means remove one item only
                        }
                        mypriceArray.map((radioButtonPrice) => {
                          if (radioButtonPrice != "")
                            totel += parseFloat(radioButtonPrice);
                        });
                        addonsSeleted.CheckBoxes.price.map(
                          (radioButtonPrice) => {
                            if (radioButtonPrice != "")
                              totel += parseFloat(radioButtonPrice);
                          }
                        );
                        addonsSeleted.radioButton.price.map(
                          (radioButtonPrice) => {
                            if (radioButtonPrice != "")
                              totel += parseFloat(radioButtonPrice);
                          }
                        );
                        setAddonsModalItem({
                          catIndex: addonsModalItem.catIndex,
                          ingredient: addonsModalItem.ingredient,
                          item: addonsModalItem.item,
                          itemIndex: addonsModalItem.itemIndex,
                          variant: addonsModalItem.variant,
                          totel,
                        });
                        setAddonsSeleted({
                          radioButton: addonsSeleted.radioButton,
                          CheckBoxes: addonsSeleted.CheckBoxes,
                          ingrediant: {
                            id: myidArray,
                            price: mypriceArray,
                            name: mynameArray,
                          },
                        });
                      } else {
                        // ADD NEW
                        var [myidArray, mypriceArray, mynameArray] = [
                          addonsSeleted.ingrediant.id,
                          addonsSeleted.ingrediant.price,
                          addonsSeleted.ingrediant.name,
                        ];
                        mypriceArray.push(ingrediant.item.price);
                        myidArray.push(ingrediant.item.id);
                        mynameArray.push(ingrediant.item.item_name);
                        setAddonsSeleted({
                          radioButton: addonsSeleted.radioButton,
                          CheckBoxes: addonsSeleted.CheckBoxes,
                          ingrediant: {
                            id: myidArray,
                            price: mypriceArray,
                            name: mynameArray,
                          },
                        });
                        mypriceArray.map((radioButtonPrice) => {
                          if (radioButtonPrice != "")
                            totel += parseFloat(radioButtonPrice);
                        });
                        addonsSeleted.CheckBoxes.price.map(
                          (radioButtonPrice) => {
                            if (radioButtonPrice != "")
                              totel += parseFloat(radioButtonPrice);
                          }
                        );
                        addonsSeleted.radioButton.price.map(
                          (radioButtonPrice) => {
                            if (radioButtonPrice != "")
                              totel += parseFloat(radioButtonPrice);
                          }
                        );
                        setAddonsModalItem({
                          catIndex: addonsModalItem.catIndex,
                          ingredient: addonsModalItem.ingredient,
                          item: addonsModalItem.item,
                          itemIndex: addonsModalItem.itemIndex,
                          variant: addonsModalItem.variant,
                          totel,
                        });
                      }
                    }}
                    key={ingrediant.index}
                    tintColors={{
                      true: LocalConfig.COLOR.UI_COLOR,
                      false: LocalConfig.COLOR.UI_COLOR,
                    }}
                  />
                </View>
              )}
            />
            <FlatList
              data={addonsModalItem.variant}
              renderItem={(variantItems) =>
                variantItems.item.data.length > 0 && (
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        color: LocalConfig.COLOR.WHITE,
                        padding: 10,
                        fontFamily: "verdanab",
                      }}
                    >
                      {variantItems.item.heading}
                    </Text>
                    {variantItems.item.status == 1 && (
                      <FlatList
                        data={variantItems.item.data}
                        renderItem={(radioButton) => (
                          <RadioButton.Group
                            onValueChange={(e) =>
                              variantItems.item.data.map((item) => {
                                var totel = parseFloat(
                                  addonsModalItem.item.price
                                );
                                var item = addonsSeleted.radioButton;
                                var itemIndex = item.id.indexOf(e);
                                if (itemIndex == -1) {
                                  // new value
                                  item.id[variantItems.index] =
                                    variantItems.item.data[
                                      radioButton.index
                                    ].id;
                                  item.price[variantItems.index] =
                                    variantItems.item.data[
                                      radioButton.index
                                    ].price;
                                  item.name[variantItems.index] =
                                    variantItems.item.data[
                                      radioButton.index
                                    ].variant_name;
                                  setAddonsSeleted({
                                    CheckBoxes: addonsSeleted.CheckBoxes,
                                    radioButton: item,
                                    ingrediant: addonsSeleted.ingrediant,
                                  });
                                }
                                addonsSeleted.radioButton.price.map(
                                  (radioButtonPrice) => {
                                    if (radioButtonPrice != "")
                                      totel += parseFloat(radioButtonPrice);
                                  }
                                );
                                addonsSeleted.ingrediant.price.map(
                                  (radioButtonPrice) => {
                                    if (radioButtonPrice != "")
                                      totel += parseFloat(radioButtonPrice);
                                  }
                                );
                                addonsSeleted.CheckBoxes.price.map(
                                  (radioButtonPrice) => {
                                    if (radioButtonPrice != "")
                                      totel += parseFloat(radioButtonPrice);
                                  }
                                );
                                setAddonsModalItem({
                                  catIndex: addonsModalItem.catIndex,
                                  ingredient: addonsModalItem.ingredient,
                                  item: addonsModalItem.item,
                                  itemIndex: addonsModalItem.itemIndex,
                                  variant: addonsModalItem.variant,
                                  totel,
                                });
                              })
                            }
                            value={
                              addonsSeleted.radioButton.id[variantItems.index]
                            }
                          >
                            <RadioButton.Item
                              labelStyle={{
                                fontSize: 14.5,
                                fontFamily: "Proxima Nova Font",
                                color: LocalConfig.COLOR.WHITE,
                              }}
                              // {ingrediant.item.price != 0 && `\u20B9 ` + ingrediant.item.price}
                              label={`${radioButton.item.variant_name} ${
                                radioButton.item.price != 0
                                  ? `\u20B9 ` + radioButton.item.price
                                  : ""
                              }`}
                              mode={"android"}
                              value={radioButton.item.id}
                              uncheckedColor={LocalConfig.COLOR.UI_COLOR}
                              color={LocalConfig.COLOR.UI_COLOR}
                            />
                          </RadioButton.Group>
                        )}
                      />
                    )}
                    {variantItems.item.status == 0 && (
                      <FlatList
                        data={variantItems.item.data}
                        key={({ item, index }) => index}
                        renderItem={(radioButton) => (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingVertical: 10,
                              paddingHorizontal: 20,
                            }}
                          >
                            <Text
                              style={{
                                color: LocalConfig.COLOR.WHITE,
                                fontFamily: "Proxima Nova Font",
                              }}
                            >
                              {`${radioButton.item.variant_name} ${
                                radioButton.item.price != 0
                                  ? `\u20B9 ` + radioButton.item.price
                                  : ""
                              }`}
                            </Text>
                            <CheckBox
                              value={addonsSeleted.CheckBoxes.id.includes(
                                radioButton.item.id
                              )}
                              onValueChange={(ev) => {
                                var totel = parseFloat(
                                  addonsModalItem.item.price
                                );
                                if (!ev) {
                                  var myidArray = addonsSeleted.CheckBoxes.id;
                                  var mypriceArray =
                                    addonsSeleted.CheckBoxes.price;
                                  var mynameArray =
                                    addonsSeleted.CheckBoxes.name;
                                  const index = myidArray.indexOf(
                                    radioButton.item.id
                                  );
                                  if (index > -1) {
                                    myidArray.splice(index, 1); // 2nd parameter means remove one item only
                                    mypriceArray.splice(index, 1); // 2nd parameter means remove one item only
                                    mynameArray.splice(index, 1); // 2nd parameter means remove one item only
                                  }
                                  setAddonsSeleted({
                                    radioButton: addonsSeleted.radioButton,
                                    CheckBoxes: {
                                      id: myidArray,
                                      price: mypriceArray,
                                      name: mynameArray,
                                    },
                                    ingrediant: addonsSeleted.ingrediant,
                                  });
                                  mypriceArray.map((CheckBoxesPrice) => {
                                    if (CheckBoxesPrice != "")
                                      totel += parseFloat(CheckBoxesPrice);
                                  });
                                  addonsSeleted.ingrediant.price.map(
                                    (radioButtonPrice) => {
                                      if (radioButtonPrice != "")
                                        totel += parseFloat(radioButtonPrice);
                                    }
                                  );
                                  addonsSeleted.radioButton.price.map(
                                    (radioButtonPrice) => {
                                      if (radioButtonPrice != "")
                                        totel += parseFloat(radioButtonPrice);
                                    }
                                  );
                                  setAddonsModalItem({
                                    catIndex: addonsModalItem.catIndex,
                                    ingredient: addonsModalItem.ingredient,
                                    item: addonsModalItem.item,
                                    itemIndex: addonsModalItem.itemIndex,
                                    variant: addonsModalItem.variant,
                                    totel,
                                  });
                                } else {
                                  // ADD NEW
                                  var [myidArray, mypriceArray, mynameArray] = [
                                    addonsSeleted.CheckBoxes.id,
                                    addonsSeleted.CheckBoxes.price,
                                    addonsSeleted.CheckBoxes.name,
                                  ];
                                  mypriceArray.push(radioButton.item.price);
                                  myidArray.push(radioButton.item.id);
                                  mynameArray.push(
                                    radioButton.item.variant_name
                                  );
                                  setAddonsSeleted({
                                    radioButton: addonsSeleted.radioButton,
                                    CheckBoxes: {
                                      id: myidArray,
                                      price: mypriceArray,
                                      name: mynameArray,
                                    },
                                    ingrediant: addonsSeleted.ingrediant,
                                  });
                                  mypriceArray.map((radioButtonPrice) => {
                                    if (radioButtonPrice != "")
                                      totel += parseFloat(radioButtonPrice);
                                  });
                                  addonsSeleted.ingrediant.price.map(
                                    (radioButtonPrice) => {
                                      if (radioButtonPrice != "")
                                        totel += parseFloat(radioButtonPrice);
                                    }
                                  );
                                  addonsSeleted.radioButton.price.map(
                                    (radioButtonPrice) => {
                                      if (radioButtonPrice != "")
                                        totel += parseFloat(radioButtonPrice);
                                    }
                                  );
                                  setAddonsModalItem({
                                    catIndex: addonsModalItem.catIndex,
                                    ingredient: addonsModalItem.ingredient,
                                    item: addonsModalItem.item,
                                    itemIndex: addonsModalItem.itemIndex,
                                    variant: addonsModalItem.variant,
                                    totel,
                                  });
                                }
                              }}
                              key={radioButton.index}
                              tintColors={{
                                true: LocalConfig.COLOR.UI_COLOR,
                                false: LocalConfig.COLOR.UI_COLOR,
                              }}
                            />
                          </View>
                        )}
                      />
                    )}
                  </View>
                )
              }
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              let qty;
              if (addonsModalItem.item.wholecat == 2) qty = 0.25;
              else if (addonsModalItem.item.wholecat == 3) qty = wholeCat3Input;
              else qty = 1;
              console.log(
                JSON.stringify({
                  catIndex: addonsModalItem.catIndex,
                  item: "addonsModalItem.item",
                  itemIndex: addonsModalItem.itemIndex,
                  addonsSeleted: addonsSeleted,
                  qty: qty,
                  price: addonsModalItem.totel,
                })
              );
              addaddonsItem({
                catIndex: addonsModalItem.catIndex,
                item: addonsModalItem.item,
                itemIndex: addonsModalItem.itemIndex,
                addonsSeleted: addonsSeleted,
                qty: qty,
                price: addonsModalItem.totel,
              });
            }}
            style={{
              backgroundColor: LocalConfig.COLOR.UI_COLOR,
              height: (Dimensions.get("window").height / 100) * 7,
              display: "flex",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Text
              style={{
                fontFamily: "verdanab",
                color: LocalConfig.COLOR.BLACK,
              }}
            >
              TOTEL | {`\u20B9 ${addonsModalItem.totel}`}
            </Text>
            <View />
            <Text
              style={{
                fontFamily: "verdanab",
                color: LocalConfig.COLOR.BLACK,
              }}
            >
              ADD ITEM
            </Text>
          </TouchableOpacity>
        </Modal>
      )}
      {/* BRANCH MODAL */}
      <Modal
        visible={branchmodal}
        onBackdropPress={() => setBranchmodal(false)}
        onRequestClose={() => setBranchmodal(false)}
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          width: "100%",
          margin: 0,
          backgroundColor: LocalConfig.COLOR.BLACK,
        }}
        animationType="slide"
        transparent={true}
      >
        {!branchList ? (
          <ActivityIndicator
            size={"large"}
            color={LocalConfig.COLOR.UI_COLOR}
          />
        ) : (
          <View style={{ backgroundColor: LocalConfig.COLOR.BLACK }}>
            <View
              style={{
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                padding: 15,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  //fontWeight: 'bold',
                  letterSpacing: 2,
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: "Proxima Nova Bold",
                }}
              >
                SELECT BRANCH
              </Text>
              <TouchableOpacity onPress={() => setBranchmodal(false)}>
                <View style={{}}>
                  <MaterialIcons
                    name="close"
                    size={25}
                    color={LocalConfig.COLOR.BLACK}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={branchList}
              style={{ backgroundColor: LocalConfig.COLOR.BLACK }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={async () => {
                    await AsyncStorage.setItem("branch_id", item.id).then(
                      () => {
                        getbranchList();
                        if (
                          presentBranch != item.id ||
                          LocalConfig.IN_DEVELOPMENT
                        )
                          sql.deleteallrows();
                      }
                    );
                  }}
                  style={{
                    flexDirection: "row",
                    backgroundColor: LocalConfig.COLOR.BLACK,
                    margin: 7,
                    borderRadius: 5,
                    borderWidth: presentBranch == item.id ? 2 : 1,
                    elevation: 10,
                    borderColor:
                      presentBranch == item.id
                        ? LocalConfig.COLOR.UI_COLOR
                        : LocalConfig.COLOR.WHITE,
                  }}
                >
                  <View style={{ flex: 1, alignItems: "center" }}>
                    {item.open_status == 1 ? (
                      <Image
                        source={{
                          uri: branch_IMAGE + item.image,
                        }}
                        style={{
                          width: "65%",
                          height: 120,
                          borderRadius: 9,
                          marginVertical: "5%",
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Grayscale>
                        <Image
                          source={{
                            uri: branch_IMAGE + item.image,
                          }}
                          style={{
                            width: "65%",
                            height: 120,
                            borderRadius: 9,
                            marginVertical: "5%",
                          }}
                          resizeMode="cover"
                        />
                      </Grayscale>
                    )}
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        //fontWeight: 'bold',
                        color: LocalConfig.COLOR.WHITE,
                        fontSize: 18,
                        fontFamily: "Proxima Nova Bold",
                      }}
                    >
                      {item.branch_name}
                    </Text>
                    <Text
                      style={{
                        //fontWeight: 'bold',
                        color: LocalConfig.COLOR.BLACK_LIGHT,
                        fontSize: 13,
                        fontFamily: "Proxima Nova Bold",
                      }}
                    >
                      {item.km} KM
                    </Text>
                    <Text
                      style={{
                        //fontWeight: 'bold',
                        color: LocalConfig.COLOR.BLACK_LIGHT,
                        fontSize: 13,
                        fontFamily: "Proxima Nova Bold",
                      }}
                    >
                      {item.open_status == 1
                        ? item.homedelivery
                          ? "Self Pickup and Home Delivery Available"
                          : "Only self pickup available"
                        : "Branch is currently closed"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </Modal>
      {/* REPEAT MODAL */}
      {repeatModalItem.item && (
        <Modal
          visible={repeatModal}
          onBackdropPress={() => {
            setRepeatModal(false);
            setRepeatModalItem({
              item: undefined,
              catIndex: undefined,
              itemIndex: undefined,
              price: undefined,
            });
          }}
          onRequestClose={() => {
            setRepeatModal(false);
            setRepeatModalItem({
              item: undefined,
              catIndex: undefined,
              itemIndex: undefined,
              price: undefined,
            });
          }}
          style={{
            justifyContent: "flex-end",
            flex: 1,
            width: "100%",
            margin: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          animationType="slide"
          transparent={true}
        >
          <View>
            <View
              style={{
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                padding: 15,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  //fontWeight: 'bold',
                  letterSpacing: 2,
                  color: LocalConfig.COLOR.BLACK,
                  fontFamily: "verdanab",
                }}
              >
                {`${repeatModalItem.item.menu_name}`.toUpperCase()}
              </Text>
              <TouchableOpacity onPress={() => setRepeatModal(false)}>
                <View style={{}}>
                  <MaterialIcons
                    name="close"
                    size={25}
                    color={LocalConfig.COLOR.BLACK}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: LocalConfig.COLOR.BLACK,
                paddingVertical: 30,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: LocalConfig.COLOR.BLACK,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  margin: 10,
                  borderColor: LocalConfig.COLOR.UI_COLOR,
                  borderWidth: 2,
                  borderRadius: 10,
                }}
                onPress={() => {
                  addingItem({
                    catIndex: repeatModalItem.catIndex,
                    item: repeatModalItem.item,
                    itemIndex: repeatModalItem.itemIndex,
                    price: repeatModalItem.price || repeatModalItem.dprice,
                    repeat: true,
                  });
                  setRepeatModal(false);
                  setRepeatModalItem({
                    item: undefined,
                    catIndex: undefined,
                    itemIndex: undefined,
                    price: undefined,
                  });
                }}
              >
                <Text
                  style={{
                    fontFamily: "verdanab",
                    color: LocalConfig.COLOR.UI_COLOR,
                  }}
                >
                  I'LL CHOOSE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  margin: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  var qty;
                  if (
                    // repeatModalItem.item.wholecat == 3 ||
                    repeatModalItem.item.wholecat == 5 ||
                    repeatModalItem.item.wholecat == 1
                  ) {
                    qty = parseFloat(repeatModalItem.item.qty) + 1;
                  } else {
                    var qty;
                    qty = parseFloat(repeatModalItem.item.qty) + 0.25;
                  }
                  dispatch(
                    addToCart([
                      repeatModalItem.catIndex,
                      repeatModalItem.itemIndex,
                      qty,
                      repeatModalItem.price,
                      repeatModalItem.item,
                      "update",
                    ])
                  );
                  setRepeatModalItem({
                    item: undefined,
                    catIndex: undefined,
                    itemIndex: undefined,
                    price: undefined,
                  });
                  refreshME();
                }}
              >
                <Text
                  style={{
                    fontFamily: "verdanab",
                    color: LocalConfig.COLOR.BLACK,
                  }}
                >
                  REPEAT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <Modal
        visible={couponInfoModal}
        onBackdropPress={() => openCouponInfoModal({})}
        onRequestClose={() => openCouponInfoModal({})}
        style={{
          justifyContent: "center",
          flex: 1,
          margin: 10,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
        }}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            backgroundColor: LocalConfig.COLOR.UI_COLOR,
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            padding: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TouchableOpacity onPress={() => openCouponInfoModal({})}>
            <View style={{}}>
              <MaterialIcons
                name="close"
                size={25}
                color={LocalConfig.COLOR.BLACK}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: LocalConfig.COLOR.BLACK,
            width: "100%",
            borderColor: LocalConfig.COLOR.UI_COLOR,
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderRightWidth: 2,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Text
            style={{
              color: LocalConfig.COLOR.WHITE,
              fontSize: 14,
              backgroundColor: LocalConfig.COLOR.UI_COLOR_LITE,
              opacity: 0.5,
              marginHorizontal: 3,
              paddingHorizontal: 10,
              borderLeftWidth: 3,
              borderColor: LocalConfig.COLOR.UI_COLOR,
              maxWidth: "30%",
              padding: 5,
            }}
          >
            Upto {couponInfoItem.coupon?.max_free_prdt_qty}
          </Text>
          <Text
            style={{
              color: LocalConfig.COLOR.WHITE,
              fontFamily: "verdanab",
              textAlign: "justify",
              fontSize: 15,
            }}
          >
            Buy {couponInfoItem.coupon?.max_main_prdt_qty} products and get up
            to {couponInfoItem.coupon?.free_prdct_qty}{" "}
            {couponInfoItem.coupon?.free_prdct != couponInfoItem.id &&
              `${couponInfoItem.coupon?.free_prdct_menu_name} `}
            for free! When you add {couponInfoItem.coupon?.max_main_prdt_qty} or
            more products to your cart, we'll include{" "}
            {couponInfoItem.coupon?.free_prdct_qty}
            {couponInfoItem.coupon?.free_prdct != couponInfoItem.id &&
              ` ${couponInfoItem.coupon?.free_prdct_menu_name} `}
            , and its cost will be discounted at checkout until a maximum of{" "}
            {couponInfoItem.coupon?.max_free_prdt_qty} free products have been
            applied. Plus, with no extra cost, as 1 item price{" "}
            {`\u20B9${couponInfoItem.price}`}. This promotion is valid for a
            limited time only, so start shopping now to take advantage of this
            great offer!
          </Text>
        </View>
      </Modal>
      <Modal
        visible={meatInputModal}
        onBackdropPress={() => setMeatInputModal(false)}
        onRequestClose={() => setMeatInputModal(false)}
        style={{
          justifyContent: "center",
          flex: 1,
          margin: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
        }}
        animationType="slide"
        transparent={true}
      >
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
        <View
          style={{
            backgroundColor: LocalConfig.COLOR.UI_COLOR,
            padding: 10,
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                padding: 5,
                textAlign: "left",
                fontFamily: "verdanab",
                color: LocalConfig.COLOR.BLACK,
              }}
            >
              {meatInputModalItem.item.menu_name}
            </Text>
            <TouchableNativeFeedback onPress={() => setMeatInputModal(false)}>
              <MaterialIcons name="close" color={LocalConfig.COLOR.BLACK} />
            </TouchableNativeFeedback>
          </View>
          <Image
            source={{
              uri: menu_item_icon_IMAGE + meatInputModalItem.item.menu_image,
            }}
            style={{
              width: Dimensions.get("window").width / 2,
              height: Dimensions.get("window").width / 2,
              borderRadius: 20,
            }}
            resizeMode={"stretch"}
          />
          <TextInput
            placeholder={"Enter Your Quantity"}
            placeholderTextColor={LocalConfig.COLOR.BLACK}
            onChangeText={(qty) => setMeatInput(qty)}
            keyboardType={"number-pad"}
            value={meatInput > 0 ? meatInput : undefined}
            style={{
              color: LocalConfig.COLOR.BLACK,
            }}
          />
          <TouchableOpacity
            disabled={
              meatInput * parseFloat(meatInputModalItem.item.dprice) <= 0
            }
            style={{
              padding: 10,
              borderRadius: 20,
              backgroundColor: LocalConfig.COLOR.BLACK,
              width: Dimensions.get("window").width / 2,
            }}
            onPress={() =>
              addingItem({
                catIndex: meatInputModalItem.catIndex,
                item: meatInputModalItem.item,
                itemIndex: meatInputModalItem.itemIndex,
                price: parseFloat(meatInputModalItem.item.dprice),
              })
            }
          >
            <Text
              style={{
                color: LocalConfig.COLOR.UI_COLOR,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              ADD
              {meatInput > 0 &&
                ` \u20B9${(
                  meatInput * parseFloat(meatInputModalItem.item.dprice)
                ).toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
