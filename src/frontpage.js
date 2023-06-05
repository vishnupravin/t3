import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  PermissionsAndroid,
  ToastAndroid,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance, getPreciseDistance } from 'geolib';
import { Button } from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import LocalConfig from '../LocalConfig';
const { width, height } = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;
//https://www.npmjs.com/package/react-native-android-location-services-dialog-box
export default class LocationMap extends React.Component {
  constructor(props) {
    super(props);
    searchText: '';
    mapView: '';
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
      forceRefresh: 0,
      searchText: '',
      mapView: '',
      userLocation: '',
      regionChangeProgress: false,
      isMapReady: true,
      dataSource: '',
      dataSource1: '',
      dataSource2: '',
      distance: '',
      distance1: '',
      bid: '',
      espstatus: false,
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
      // ToastAndroid.show(
      //   'Location permission denied by user.',
      //   ToastAndroid.LONG,
      // );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      // ToastAndroid.show(
      //   'Location permission revoked by user. fpage',
      //   ToastAndroid.LONG,
      // );
    }
    return false;
  };
  async componentDidMount() {
    this.hasLocationPermission();
    let ok = Boolean(await AsyncStorage.getItem('espstatus'));
    this.setState({ espstatus: ok });
  }
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
        this.getAddress(lat, long);
        // var dis = getPreciseDistance(
        //   {latitude: lat, longitude: long},
        //   {latitude: this.state.dataSource, longitude: this.state.dataSource1},
        // );
        // this.setState({distance1:(dis/1000)})
        //
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
  getAddress = (lat, long) => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      lat +
      ',' +
      long +
      '&key=' +
      'AIzaSyAIqezs6nT9_u1SpcUMXRv86v9RQgQPS5E',
    )
      .then(response => response.json())
      .then(responseJson => {
        var addr = JSON.stringify(
          responseJson.results[0].formatted_address,
        ).replace(/"/g, '');
        this.setState({
          address: JSON.stringify(
            responseJson.results[0].formatted_address,
          ).replace(/"/g, ''),
        });
        this.timeout(addr, lat, long);
      });
  };
  timeout = (addr, lat, long) => {
    setTimeout(() => {
      AsyncStorage.setItem('loclat', JSON.stringify(lat));
      AsyncStorage.setItem('loclong', JSON.stringify(long));
      this.props.navigation.replace('Branch', {
        address: addr,
        lat: lat,
        long: long,
      });
    }, 500);
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: LocalConfig.COLOR.BLACK,
            marginTop: '-35%',
          }}>
          <LottieView source={require('./animation.json')} autoPlay loop />
          <KeyboardAvoidingView style={styles.footer}>
            <View style={{ flexDirection: 'row', margin: 10, marginLeft: '27%' }}>
              <Text style={styles.addressText}>FETCHING LOCATION</Text>
            </View>
            <Text
              style={{
                marginBottom: '4%',
                marginLeft: '7%',
                width: '90%',
                minHeight: 70,
                alignSelf: 'center',
                fontSize: 17,
                color: LocalConfig.COLOR.UI_COLOR,
                flex: 0.5,
                alignContent: 'flex-start',
                textAlignVertical: 'top',
                fontFamily: 'Proxima Nova Bold',
              }}>
              {this.state.address}
            </Text>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centerElement: { justifyContent: 'center', alignItems: 'center' },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  addressText: {
    fontFamily: 'verdanab',
    color: LocalConfig.COLOR.WHITE,
    margin: 4,
    letterSpacing: 0.3,
  },
  footer: {
    backgroundColor: LocalConfig.COLOR.BLACK,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    height: '30%',
  },
  panelFill: {
    position: 'absolute',
    top: 0,
    alignSelf: 'stretch',
    right: 0,
    left: 0,
    width: '93%',
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 50 / 2,
    backgroundColor: LocalConfig.COLOR.UI_COLOR,
  },
  pinText: {
    color: 'white',
    fontFamily: 'Proxima Nova Font',
    textAlign: 'center',
    fontSize: 15,
  },
  panel: {
    position: 'absolute',
    top: 5,
    alignSelf: 'stretch',
    right: 0,
    left: '5%',
    flex: 1,
    width: '75%',
  },
  panel1: {
    position: 'absolute',
    top: '1%',
    alignSelf: 'stretch',
    right: 0,
    left: '50%',
    flex: 1,
    width: '80%',
  },
});
