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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, MAP_TYPES, Circle } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance, getPreciseDistance } from 'geolib';
import { Button } from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import LocalConfig from '../LocalConfig';
import { ActivityIndicator } from 'react-native';
import { postData } from '../Functions';
const { width, height } = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
//https://www.npmjs.com/package/react-native-android-location-services-dialog-box
export default class LocationMap extends React.Component {
  constructor(props) {
    super(props);
    searchText: '';
    mapView: '';
    this.state = {
      region: {
        latitude: LocalConfig.MAIN_LOCATION.latitude,
        longitude: LocalConfig.MAIN_LOCATION.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      listViewDisplayed: true,
      address: '',
      showAddress: false,
      search: '',
      currentLat: '',
      currentLng: '',
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
      branchLat: undefined,
      branchLan: undefined,
      branch_km: NaN,
      showPin: false,
      loading: false
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
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };
  componentDidMount() {
    this.hasLocationPermission();
    this.getid();
  }
  getid = async () => {
    try {
      const key3 = await AsyncStorage.getItem('branch_id');
      //
      this.setState({ bid: key3 });
      this.view1();
      this.view();
    } catch (error) { }
  };
  location() {
    Geolocation.getCurrentPosition(
      position => {
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        var region = {
          latitude: this.props?.route?.params?.latlng ? Number(this.props?.route?.params?.latlng.split(",")[0]) : lat,
          longitude: this.props?.route?.params?.latlng ? Number(this.props?.route?.params?.latlng.split(",")[1]) : long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        this.setState({ region: region });
        //
        this.goToInitialLocation(this.state.region);
        var dis = getPreciseDistance(
          { latitude: lat, longitude: long },
          { latitude: this.state.dataSource, longitude: this.state.dataSource1 },
        );
        this.setState({ distance1: dis / 1000 });
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
    this.mapView.animateToRegion(initialRegion, 1000);
  };
  onRegionChange = region => {
    this.setState(
      {
        region: region,
        forceRefresh: Math.floor(Math.random() * 100),
        regionChangeProgress: true,
      },
      this.calculatedis, //callback
    );
  };
  editAddress = () => {
    this.setState({ loading: true })
    const API = `${LocalConfig.API_URL}admin/api/add_address.php?aid=${this.props.route.params.id}&uid=${this.props.route.params.uid}&type=${this.props.route.params.type}&name=${this.props.route.params.name}&latlng=${`${this.state.region.latitude},${this.state.region.longitude}`}&line1=${this.state.userLocation}&landmark=${this.props.route.params.landmark}&bid=${this.props.route.params.bid}&addiphne=${this.props.route.params.aditional_number}`
    postData(API).then(res => {
      if (res.data.success) {
        this.refreshScreen();
        this.props.navigation.navigate('LocationDetails');
      } else {
        Alert.alert("Ooops!", "Something went wrong")
      }
      this.setState({ loading: false })
    })
  }
  getAddress = () => {
    console.log('https://maps.googleapis.com/maps/api/geocode/json?address=' +
      this.state.region.latitude +
      ',' +
      this.state.region.longitude +
      '&key=' +
      'AIzaSyAIqezs6nT9_u1SpcUMXRv86v9RQgQPS5E')
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      this.state.region.latitude +
      ',' +
      this.state.region.longitude +
      '&key=' +
      'AIzaSyAIqezs6nT9_u1SpcUMXRv86v9RQgQPS5E',
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.results.length > 0)
          this.setState({
            userLocation: JSON.stringify(
              responseJson.results[0].formatted_address,
            ).replace(/"/g, ''),
          });
      });
  };
  view() {
    fetch(
      `${LocalConfig.API_URL}admin/api/get_fssai.php?flag=4&&branch=` +
      this.state.bid,
    )
      .then(response => response.json())
      .then(responseJson => {
        var lat = parseFloat(responseJson.data.lat);
        var long = parseFloat(responseJson.data.lng);

        var region = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        this.setState({ region: region });
        this.setState({
          dataSource: responseJson.data.lat,
          dataSource2: responseJson.data.lng,
        });
        this.getAddress();
      })
      .catch(); //to catch the errors if any
  }
  async view1() {
    await fetch(
      `${LocalConfig.API_URL}admin/api/get_fssai.php?flag=4&&branch=` +
      this.state.bid,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource1: responseJson.data.km,
          branch_km: responseJson.data.km,
          branchLat: Number(responseJson.data.lat),
          branchLan: Number(responseJson.data.lng),
        });
      })
      .catch(); //to catch the errors if any
  }
  calculatedis() {
    var dis = getPreciseDistance(
      { latitude: this.state.dataSource, longitude: this.state.dataSource2 },
      {
        latitude: Number(this.state.region.latitude),
        longitude: Number(this.state.region.longitude),
      },
    );
    this.setState({ distance: dis / 1000 });
    if (dis / 1000 > this.state.dataSource1) {
      alert(
        'sorry for the inconvenience ' +
        'Our service not available for your location ' +
        'our service only available around ' +
        this.state.dataSource1 +
        'km.You may change your location and enter correct address while changing.',
      );
    } else {
      this.getAddress();
      this.setState({ showPin: true })
    }
  }
  render() {
    const { region } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: LocalConfig.COLOR.BLACK }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: LocalConfig.COLOR.BLACK,
          }}>
          <View style={[styles.centerElement, { width: '10%', height: 50 }]}>
            <Ionicons
              name="arrow-back"
              size={23}
              color={LocalConfig.COLOR.UI_COLOR}
              style={{ marginTop: '7%' }}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={[styles.centerElement, { height: 50 }]}>
            <Text
              style={{
                fontSize: 15,
                color: LocalConfig.COLOR.UI_COLOR,
                marginLeft: '30%',
                fontFamily: 'verdanab',
              }}>
              {this.props?.route?.params?.latlng ? "EDIT" : "ADD"} ADDRESS
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#D8D8D8',
            borderBottomWidth: 0.4,
          }}
        />
        <View style={styles.map}>
          <MapView
            ref={ref => (this.mapView = ref)}
            onMapReady={() => this.setState({ isMapReady: true, marginTop: 0 })}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            style={styles.map}
            initialRegion={this.state.region}
            mapType={MAP_TYPES.HYBRID}
            onRegionChangeComplete={this.onRegionChange}>
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              title={'Your Location'}
            />
            <Circle
              center={{
                latitude:
                  this.state.branchLat || LocalConfig.MAIN_LOCATION.latitude,
                longitude:
                  this.state.branchLan || LocalConfig.MAIN_LOCATION.longitude,
              }}
              radius={this.state.branch_km * 850 || 20000}
              fillColor={`rgba(66,133,244,0.1)`}
              strokeColor={`rgba(66,133,244,0.5)`}
            />
          </MapView>
          <View
            style={{
              left: '50%',
              paddingVertical: 30,
              paddingHorizontal: 30,
              elevation: 10,
              marginLeft: -30,
              marginTop: 180,
              position: 'absolute',
            }}></View>
          <View style={styles.panel}>
            <GooglePlacesAutocomplete
              currentLocation={false}
              enableHighAccuracyLocation={true}
              ref={c => (this.searchText = c)}
              placeholder="Search for a location"
              minLength={2}
              autoFocus={false}
              returnKeyType={'search'}
              listViewDisplayed={this.state.listViewDisplayed}
              fetchDetails={true}
              renderDescription={row => row.description}
              enablePoweredByContainer={false}
              listUnderlayColor="lightgrey"
              onPress={(data, details) => {
                const lat = parseFloat(details.geometry.location.lat);
                const lng = parseFloat(details.geometry.location.lng);
                const northeastLat = parseFloat(
                  details.geometry.viewport.northeast.lat,
                );
                const southwestLat = parseFloat(
                  details.geometry.viewport.southwest.lat,
                );
                const latDelta = northeastLat - southwestLat;
                const lngDelta = latDelta * ASPECT_RATIO;
                this.setState({
                  listViewDisplayed: true,
                  userLocation: data.description,
                  currentLat: details.geometry.location.lat,
                  currentLng: details.geometry.location.lng,
                  region: {
                    latitudeDelta: latDelta,
                    longitudeDelta: lngDelta,
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  },
                });
                this.searchText.setAddressText('');
                this.goToInitialLocation(this.state.region);
              }}
              textInputProps={{
                placeholderTextColor: '#808080',
                color: 'black',
                fontFamily: 'Proxima Nova Font',
                onChangeText: text => {
                  //;
                  this.setState({ listViewDisplayed: true });
                },
              }}
              getDefaultValue={() => {
                return '';
              }}
              query={{
                key: 'AIzaSyAIqezs6nT9_u1SpcUMXRv86v9RQgQPS5E',
                language: 'en',
                components: 'country:ind',
              }}
              styles={{
                description: {
                  fontFamily: 'Calibri',
                  color: 'black',
                  fontSize: 12,
                },
                predefinedPlacesDescription: {
                  color: 'black',
                },
                listView: {
                  position: 'absolute',
                  marginTop: 44,
                  backgroundColor: 'white',
                  borderBottomEndRadius: 15,
                  elevation: 2,
                },
              }}
              nearbyPlacesAPI="GooglePlacesSearch"
              GooglePlacesSearchQuery={{
                rankby: 'distance',
                types: 'building',
              }}
              filterReverseGeocodingByTypes={[
                'locality',
                'administrative_area_level_3',
              ]}
              debounce={200}
            />
          </View>
          <KeyboardAvoidingView style={styles.footer}>
            <View style={{ flexDirection: 'row', margin: 10 }}>
              <Text style={styles.addressText}>Address</Text>
            </View>
            <TextInput
              multiline={true}
              editable={false}
              clearButtonMode="while-editing"
              style={{
                marginBottom: '4%',
                width: '90%',
                minHeight: 70,
                alignSelf: 'center',
                borderColor: 'white',
                borderWidth: 0.3,
                fontSize: 15,
                color: LocalConfig.COLOR.WHITE,
                borderRadius: 5,
                flex: 0.5,
                alignContent: 'flex-start',
                textAlignVertical: 'top',
                fontFamily: 'Proxima Nova Font',
              }}
              onChangeText={text => this.setState({ userLocation: text })}
              value={this.state.userLocation}
            />
            {isNaN(this.state.distance) &&
              this.state.showPin &&
              this.state.distance1 < this.state.dataSource1 ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AddNewAddress', {
                    location: this.state.userLocation,
                    lat: this.state.region.latitude,
                    long: this.state.region.longitude,
                  });
                  this.refreshScreen();
                }}
                style={{
                  width: '85%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  borderRadius: 16.5,
                  shadowColor: 'rgba(0,0,0, .4)', // IOS
                  shadowOffset: { height: 1, width: 1 }, // IOS
                  shadowOpacity: 1, // IOS
                  shadowRadius: 1, //IOS
                  elevation: 2, // Android
                  paddingVertical: 7,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'verdanab',
                    fontSize: 12,
                    paddingVertical: 7,
                  }}>
                  PIN YOUR LOCATION
                </Text>
              </TouchableOpacity>
            ) : (
              this.state.distance < this.state.dataSource1 && this.state.showPin && (
                <TouchableOpacity
                  onPress={() => {
                    if (this.props?.route?.params?.latlng) {
                      this.editAddress()
                    } else {
                      this.props.navigation.navigate('AddNewAddress', {
                        location: this.state.userLocation,
                        lat: this.state.region.latitude,
                        long: this.state.region.longitude,
                      });
                      this.refreshScreen();
                    }
                  }}
                  style={{
                    width: '85%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    backgroundColor: LocalConfig.COLOR.UI_COLOR,
                    borderRadius: 16.5,
                    shadowColor: 'rgba(0,0,0, .4)', // IOS
                    shadowOffset: { height: 1, width: 1 }, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    elevation: 2, // Android
                    paddingVertical: 7,
                  }}>
                  {this.state.loading ?
                    <ActivityIndicator
                      color={LocalConfig.COLOR.BLACK}
                    /> :
                    <Text
                      style={{
                        color: LocalConfig.COLOR.BLACK,
                        fontFamily: 'verdanab',
                        fontSize: 12,
                        paddingVertical: 7,
                      }}>
                      {this.props?.route?.params?.latlng ? "COMFORM THIS LOCATION" : "PIN YOUR LOCATION"}
                    </Text>
                  }
                </TouchableOpacity>
              )
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
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
