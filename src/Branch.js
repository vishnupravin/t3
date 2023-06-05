import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  Text,
  Button,
  TextInput,
  Image,
  TouchableHighlight,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import sqlservice from './sql';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance, getPreciseDistance } from 'geolib';
import Icon from 'react-native-vector-icons/Ionicons';
import { FAB } from 'react-native-paper';
import LocalConfig from '../LocalConfig';
import { Dimensions } from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
const BASE_URL = `${LocalConfig.API_URL}admin/images/branch/`;
const curentPage = 'Branch';
let sql;
export default class Branch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      address: '',
      lat: '',
      lng: '',
      km: [],
      noOfBack: 0,
      espstatus: false,
      time: Date.now(),
      presentBranch: AsyncStorage.getItem('curentPage'),
      espBranchs: null,
    };
    this.refreshScreen = this.refreshScreen.bind(this);
    sql = new sqlservice();
  }
  async refreshScreen() {
    this.setState(() => {
      this.componentDidMount();
    });
  }
  backAction = async () => {
    await AsyncStorage.setItem('curentPage', curentPage);
    let cache = await AsyncStorage.getItem('curentPage');
    this.setState({ noOfBack: this.state.noOfBack + 1 });
    if (cache == curentPage && this.state.noOfBack > 1) {
      this.backHandler.remove();
      BackHandler.exitApp();
    } else if (cache == curentPage) {
      ToastAndroid.show('Press one more back to exit', ToastAndroid.SHORT);
    }
    return true;
  };
  componentDidMount = async () => {
    this.state.noOfBack = 0;
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.View();
  };
  componentWillUnmount = async () => {
    this.backHandler.remove();
    await AsyncStorage.setItem('curentPage', curentPage);
  };
  async View() {
    this.setState({ espstatus: await AsyncStorage.getItem('espstatus') });
    this.CurretBranchID = await AsyncStorage.getItem('branch_id');
    let esp = await AsyncStorage.getItem('espstatus');
    const { address, lat, long } = this.props.route.params;
    this.setState({ address: address, lat: lat, lng: long });

    const api = `${LocalConfig.API_URL}admin/api/branchlist.php`;
    fetch(api, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        if (LocalConfig.IN_DEVELOPMENT) responseJson.branch.map((item, index) => {
          if (index == 1) this.branch(item.id)
        })
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
        // AsyncStorage.getItem('loclat').then(loclat => {
          // AsyncStorage.getItem('loclong').then(loclong => {
            // responseJson.branch.map(
            //   (item, index) =>
            //   (item.km = calcCrow(
            //     loclat,
            //     loclong,
            //     responseJson.branch[index].latlog.split(',')[0],
            //     responseJson.branch[index].latlog.split(',')[1],
            //   )),
            // );
            // this.setState({
            //   data: responseJson.branch.sort(function (a, b) {
            //     return a.km - b.km;
            //   })
            // });
            this.setState({
              data: responseJson.branch.sort(function (a, b) {
                return a.id - b.id;
              })
            });
          // });
        // });
      });
    this.initviews();
  }
  initviews() {
    const { address, lat, long } = this.props.route.params;
    this.state.data.map(item => {
      let temp1 = [];
      for (let i = 0; i < this.state.data.length; i++) {
        const latlng = item.latlog.split(',');
        const lat1 = latlng[0];
        const log1 = latlng[1];
        var dis = getPreciseDistance(
          { latitude: lat, longitude: long },
          { latitude: lat1, longitude: log1 },
        );
        item.is_deleted = parseFloat((dis / 1000).toFixed(1));
        var string2 = this.state.km.toString();
        this.setState({ km: string2 });
      }
    });
  }
  branch = async id => {
    this.refreshScreen(false);
    const key3 = await AsyncStorage.getItem('branch_id');
    if (key3 == id) {
      AsyncStorage.setItem('branch_id', id);
      this.props.navigation.replace('DrawerNavigatorRoutes');
      //
    } else {
      sql
        .deleteallrows()
        .then(res => {
          //
        })
        .catch(err => {
          //alert(JSON.stringify(err))
        });
      AsyncStorage.setItem('branch_id', id);
      this.props.navigation.replace('DrawerNavigatorRoutes');
    }
  };
  cache = AsyncStorage.setItem('curentPage', curentPage);
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: LocalConfig.COLOR.BLACK }}>
        <View style={{ flexDirection: 'row' }}>
          <View flexDirection="row" style={{ height: 50 }}>
            <Icon
              name="location-sharp"
              size={20}
              style={{ marginTop: '4%', marginLeft: '2%' }}
              color={LocalConfig.COLOR.UI_COLOR}
            />
            <Text
              style={{
                fontSize: 12,
                color: LocalConfig.COLOR.UI_COLOR,
                fontFamily: 'verdanab',
                marginTop: '5%',
              }}>
              {' '}
              {`${this.state.address.slice(0, 42)}... `}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#f4f4f4',
            borderBottomWidth: 0.9,
            marginBottom: '3%',
          }}
        />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 14,
              color: LocalConfig.COLOR.UI_COLOR,
              fontFamily: 'verdanab',
            }}>
            SELECT SHOP
          </Text>
        </View>
        <ScrollView
          ref={view => {
            this.scrollView = view;
          }}>
          {this.state.data.map((item, index) => (
            <TouchableHighlight
              underlayColor="#fff"
              key={item.id}
              style={{
                backgroundColor: LocalConfig.COLOR.BLACK,
                borderColor: '#ffffff',
              }}
              onPress={async () => {
                this.branch(item.id);
              }}>
              <View
                flexDirection="row"
                style={
                  item.id == this.CurretBranchID
                    ? styles.branchLST
                    : styles.branchLSF
                }>
                <View style={{ width: '60%' }}>
                  {item.open_status == 1 ? <Image
                    source={{
                      uri: `${LocalConfig.API_URL}admin/images/branch/${item.image}`,
                    }}
                    style={{
                      width: '65%',
                      height: 120,
                      marginTop: '5%',
                      marginLeft: '5%',
                      borderRadius: 9,
                      marginBottom: '5%',
                    }}
                    resizeMode="cover"
                  />
                    :
                    <Grayscale>
                      <Image
                        source={{
                          uri: `${LocalConfig.API_URL}admin/images/branch/${item.image}`,
                        }}
                        style={{
                          width: '65%',
                          height: 120,
                          marginTop: '5%',
                          marginLeft: '5%',
                          borderRadius: 9,
                          marginBottom: '5%',
                        }}
                        resizeMode="cover"
                      />
                    </Grayscale>
                  }
                </View>
                <View flexDirection="column" style={{ width: '100%' }}>
                  <Text
                    style={{
                      textTransform: 'capitalize',
                      color: LocalConfig.COLOR.WHITE,
                      fontFamily: 'Proxima Nova Bold',
                      marginLeft: '-6%',
                      fontSize: 16,
                      marginTop: '5%',
                      width: Dimensions.get('screen').width / 2.7,
                    }}>
                    {item.branch_name}
                  </Text>
                  <Text
                    style={{
                      color: LocalConfig.COLOR.BLACK_LIGHT,
                      fontFamily: 'Proxima Nova Font',
                      marginLeft: '-6%',
                      fontSize: 15,
                      marginTop: '1%',
                    }}>
                    {item.km}{' '}
                    <Text style={{ color: LocalConfig.COLOR.BLACK_LIGHT }}>
                      KM
                    </Text>
                  </Text>
                  {item.open_status == 1 ? (parseFloat(item.is_deleted) <= parseFloat(item.km) &&
                    item.homedelivery == 1 ? (
                    <Text
                      style={{
                        color: LocalConfig.COLOR.BLACK_LIGHT,
                        fontFamily: 'Proxima Nova Font',
                        marginLeft: '-6%',
                        fontSize: 14,
                        marginTop: '1%',
                        width: '43%',
                        marginBottom: '3%',
                      }}>
                      Self Pickup and Home Delivery Available
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textTransform: 'capitalize',
                        color: LocalConfig.COLOR.BLACK_LIGHT,
                        fontFamily: 'Proxima Nova Font',
                        marginLeft: '-6%',
                        fontSize: 14,
                        marginTop: '1%',
                        width: '43%',
                        marginBottom: '3%',
                      }}>
                      Only self pickup available
                    </Text>
                  ))
                    :
                    <Text
                      style={{
                        textTransform: 'capitalize',
                        color: LocalConfig.COLOR.BLACK_LIGHT,
                        fontFamily: 'Proxima Nova Font',
                        marginLeft: '-6%',
                        fontSize: 14,
                        marginTop: '1%',
                        width: '43%',
                        marginBottom: '3%',
                      }}>
                      Branch is currently closed
                    </Text>
                  }
                </View>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
        <FAB
          color="black"
          style={styles.fab}
          small
          icon="arrow-down"
          onPress={() => {
            this.scrollView.scrollToEnd({ animated: true });
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#e5e5e5',
  },
  branchLST: {
    marginTop: '3%',
    marginLeft: '4%',
    marginBottom: '2%',
    width: '90%',
    backgroundColor: LocalConfig.COLOR.BLACK,
    elevation: 2,
    borderRadius: 5,
    justifyContent: 'space-between',
    shadowColor: LocalConfig.COLOR.UI_COLOR,
    borderWidth: 2,
    borderColor: LocalConfig.COLOR.UI_COLOR,
  },
  branchLSF: {
    marginTop: '3%',
    marginLeft: '4%',
    marginBottom: '2%',
    width: '90%',
    backgroundColor: LocalConfig.COLOR.BLACK,
    elevation: 2,
    borderRadius: 5,
    justifyContent: 'space-between',
    shadowColor: LocalConfig.COLOR.WHITE_LIGHT,
    borderWidth: 0.5,
    borderColor: LocalConfig.COLOR.WHITE_LIGHT,
  },
});
