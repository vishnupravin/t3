import React, {Component} from 'react';
import {
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
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDistance, getPreciseDistance} from 'geolib';
import {Button} from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import LocalConfig from '../LocalConfig';
const {width, height} = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;
export default class LocationMap extends React.Component {
  constructor(props) {
    super(props);
    searchText: '';
    mapView: '';
    const latlng = this.props.route.params.latlng.split(',');
    const lat = latlng[0];
    const log = latlng[1];
    this.state = {
      region: {
        latitude: Number(lat),
        longitude: Number(log),
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      region1: {
        latitude: Number(lat),
        longitude: Number(log),
        latitudeDelta: 0,
        longitudeDelta: 0,
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
      distance: 0,
      distance1: 0,
    };
    this.refreshScreen = this.refreshScreen.bind(this);
  }
  refreshScreen() {
    const latlng = this.props.route.params.latlng.split(',');
    const lat = latlng[0];
    const log = latlng[1];
    var region = {
      latitude: Number(lat),
      longitude: Number(log),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    this.setState({region: region});
    this.onRegionChange(region);
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
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.hasLocationPermission();
      this.refreshScreen();
    });
  }
  UNSAFE_componentWillMount() {
    this._unsubscribe();
  }
  location() {
    Geolocation.getCurrentPosition(
      position => {
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        var region = {
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        var region1 = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        this.setState({region: region});
        this.setState({region1: region1});
        var dis = getPreciseDistance(
          {latitude: lat, longitude: long},
          {latitude: 11.087873, longitude: 77.033079},
        );
        this.setState({distance1: dis / 1000});
      },
      error => alert(JSON.stringify(error)),
      {
        enableHighAccuracy: false,
        timeout: 100000,
        maximumAge: 360000,
      },
    );
  }
  goToInitialLocation = region => {
    let initialRegion = Object.assign({}, region);
    initialRegion['latitudeDelta'] = 0.005;
    initialRegion['longitudeDelta'] = 0.005;
    this.mapView.animateToRegion(initialRegion, 2000);
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
  UNSAFE_componentWillMount() {
    this.view();
    this.view1();
    this.getAddress();
  }
  getAddress = () => {
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
        this.setState({
          userLocation: JSON.stringify(
            responseJson.results[0].formatted_address,
          ).replace(/"/g, ''),
        });
      });
  };
  view() {
    const bid = this.props.route.params.bid;
    fetch(`${LocalConfig.API_URL}admin/api/get_fssai.php?flag=4&&branch=` + bid)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: responseJson.data.lat,
          dataSource2: responseJson.data.lng,
        });
      })
      .catch(); //to catch the errors if any
  }
  view1() {
    const bid = this.props.route.params.bid;
    fetch(`${LocalConfig.API_URL}admin/api/get_fssai.php?flag=4&&branch=` + bid)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource1: responseJson.data.km,
        });
      })
      .catch(); //to catch the errors if any
  }
  calculatedis() {
    var dis = getPreciseDistance(
      {latitude: this.state.dataSource, longitude: this.state.dataSource2},
      {
        latitude: parseFloat(this.state.region.latitude),
        longitude: parseFloat(this.state.region.longitude),
      },
    );
    this.setState({distance: dis / 1000});
    if (dis / 1000 > this.state.dataSource1) {
      alert(
        'sorry for the inconvenience.Our service not available for your location.our service only available around 8km.You may change your location and enter correct address while changing.',
      );
    } else {
      this.getAddress();
    }
  }
  render() {
    const {region} = this.state;
    const id = this.props.route.params.id;
    const type = this.props.route.params.type;
    const aditional_number = this.props.route.params.aditional_number;
    const landmark = this.props.route.params.landmark;
    const uid = this.props.route.params.uid;
    const name = this.props.route.params.name;
    const bid = this.props.route.params.bid;
    return (
      <View style={{flex: 1, backgroundColor: '#ffff'}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            marginBottom: 0,
          }}>
          <View style={[styles.centerElement, {width: '10%', height: 50}]}>
            <Ionicons
              name="arrow-back"
              size={23}
              color={LocalConfig.COLOR.UI_COLOR}
              style={{marginTop: '7%'}}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={[styles.centerElement, {height: 50}]}>
            <Text
              style={{
                fontSize: 15,
                color: LocalConfig.COLOR.UI_COLOR,
                marginLeft: '30%',
                fontFamily: 'verdanab',
              }}>
              EDIT ADDRESS
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
            onMapReady={() => this.setState({isMapReady: true, marginTop: 0})}
            showsMyLocationButton={true}
            style={styles.map}
            initialRegion={this.state.region}
            onRegionChangeComplete={this.onRegionChange}>
            <MapView.Marker
              coordinate={{
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude,
              }}
              title={'Your Location'}
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
                this.setState({
                  listViewDisplayed: true,
                  userLocation: data.description,
                  currentLat: details.geometry.location.lat,
                  currentLng: details.geometry.location.lng,
                  region: {
                    latitudeDelta,
                    longitudeDelta,
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  },
                });
                this.searchText.setAddressText('');
                this.goToInitialLocation(this.state.region);
              }}
              textInputProps={{
                placeholderTextColor: '#808080',
                fontFamily: 'Proxima Nova Font',
                color: 'black',
                onChangeText: text => {
                  this.setState({listViewDisplayed: true});
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
          <View style={styles.panel1}>
            <TouchableOpacity
              onPress={() => {
                this.refreshScreen();
                this.goToInitialLocation(this.state.region1);
              }}
              style={{
                width: '15%',
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: 13.5,
                shadowColor: 'rgba(0,0,0, .4)', // IOS
                shadowOffset: {height: 1, width: 1}, // IOS
                shadowOpacity: 1, // IOS
                shadowRadius: 1, //IOS
                elevation: 2, // Android
              }}>
              <Icon1
                style={{marginTop: '15%', marginBottom: '15%'}}
                name="my-location"
                size={30}
                color={LocalConfig.COLOR.UI_COLOR}
              />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView style={styles.footer}>
            <View style={{flexDirection: 'row', margin: 10}}>
              <Icon
                name="location"
                size={20}
                color={LocalConfig.COLOR.UI_COLOR}
                type="ionicon"
                style={{
                  padding: 5,
                }}
              />
              <Text style={styles.addressText}>Address</Text>
            </View>
            <TextInput
              multiline={true}
              clearButtonMode="while-editing"
              style={{
                marginBottom: '4%',
                width: '90%',
                minHeight: 70,
                alignSelf: 'center',
                borderColor: 'white',
                borderWidth: 0.3,
                fontSize: 15,
                color: 'black',
                borderRadius: 5,
                flex: 0.5,
                alignContent: 'flex-start',
                textAlignVertical: 'top',
                fontFamily: 'Proxima Nova Font',
              }}
              onChangeText={text => this.setState({userLocation: text})}
              value={this.state.userLocation}
            />
            {isNaN(this.state.distance) &&
            this.state.distance1 < this.state.dataSource1 ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('AddNewAddress1', {
                    location: this.state.userLocation,
                    lat: this.state.region.latitude,
                    long: this.state.region.longitude,
                    id: id,
                    type: type,
                    aditional_number: aditional_number,
                    landmark: landmark,
                    uid: uid,
                    name: name,
                    bid: bid,
                  })
                }
                style={{
                  width: '85%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor: LocalConfig.COLOR.UI_COLOR,
                  borderRadius: 16.5,
                  shadowColor: 'rgba(0,0,0, .4)', // IOS
                  shadowOffset: {height: 1, width: 1}, // IOS
                  shadowOpacity: 1, // IOS
                  shadowRadius: 1, //IOS
                  elevation: 2, // Android
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
              this.state.distance < this.state.dataSource1 && (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('AddNewAddress1', {
                      location: this.state.userLocation,
                      lat: this.state.region.latitude,
                      long: this.state.region.longitude,
                      id: id,
                      type: type,
                      aditional_number: aditional_number,
                      landmark: landmark,
                      uid: uid,
                      name: name,
                      bid: bid,
                    })
                  }
                  style={{
                    width: '85%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    backgroundColor: LocalConfig.COLOR.UI_COLOR,
                    borderRadius: 16.5,
                    shadowColor: 'rgba(0,0,0, .4)', // IOS
                    shadowOffset: {height: 1, width: 1}, // IOS
                    shadowOpacity: 1, // IOS
                    shadowRadius: 1, //IOS
                    elevation: 2, // Android
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
  centerElement: {justifyContent: 'center', alignItems: 'center'},
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  addressText: {
    color: 'black',
    margin: 4,
    fontFamily: 'verdanab',
    letterSpacing: 0.3,
  },
  footer: {
    backgroundColor: 'white',
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
