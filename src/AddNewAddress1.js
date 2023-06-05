import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Button, FAB, Portal, Provider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Icon} from 'react-native-elements';
import LocalConfig from '../LocalConfig';
export default class AddNewAddress1 extends React.Component {
  // const [state, setState] = React.useState({ open: false });
  // const onStateChange = ({ open }) => setState({ open });
  // const { open } = state;
  // const location =route.params.location
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.route.params.name,
      type: '',
      line1: this.props.route.params.location,
      latlng: this.props.route.params.lat + ',' + this.props.route.params.long,
      landmark: this.props.route.params.landmark,
      addiphne: this.props.route.params.aditional_number,
      line2: 'test',
      city: 'test',
      state: 'test',
      pincode: 'test',
    };
    this.refreshScreen = this.refreshScreen.bind(this);
  }

  refreshScreen() {
    this.componentDidMount();
  }

  componentDidMount = async () => {
    this.setState({type: this.props.route.params.type});
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({type: this.props.route.params.type});
    });
  };
  componentWillUnmount() {
    this._unsubscribe();
  }
  InsertDataToServer = () => {
    const id = this.props.route.params.id;
    const uid = this.props.route.params.uid;
    const bid = this.props.route.params.bid;
    const {type} = this.state;
    const {name} = this.state;
    const {latlng} = this.state;
    const {line1} = this.state;
    const {landmark} = this.state;
    const {addiphne} = this.state;
    fetch(
      `${LocalConfig.API_URL}admin/api/add_address.php?aid=` +
        id +
        '&&uid=' +
        uid +
        '&&type=' +
        type +
        '&&name=' +
        name +
        '&&latlng=' +
        latlng +
        '&&line1=' +
        line1 +
        '&&landmark=' +
        landmark +
        '&&addiphne=' +
        addiphne +
        '&&bid=' +
        bid,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          uid: uid,
          bid: bid,
          type: type,
          name: 'default',
          latlng: latlng,
          line1: line1,
          landmark: landmark,
          addiphne: addiphne,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        // Showing response message coming from server after inserting records.
        this.props.navigation.navigate('LocationDetails');
      })
      .catch(error => {
        console.error(error);
      });
  };
  render() {
    const line1 = this.props.route.params.location;
    const type = this.props.route.params.type;
    const addiphne = this.props.route.params.aditional_number;
    const landmark = this.props.route.params.landmark;
    const name = this.props.route.params.name;
    const {open} = this.state;
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Provider>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff',
              marginBottom: 10,
            }}>
            <View style={[styles.centerElement, {width: 50, height: 50}]}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={LocalConfig.COLOR.UI_COLOR}
                onPress={() =>
                  this.props.navigation.navigate('LocationDetails')
                }
              />
            </View>
            <View style={[styles.centerElement, {height: 50}]}>
              <Text
                style={{
                  fontSize: 15,
                  color: LocalConfig.COLOR.UI_COLOR,
                  marginLeft: '26%',
                  fontFamily: 'verdanab',
                }}>
                EDIT ADDRESS
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: '#e6e6e6',
              borderBottomWidth: 0.8,
              marginTop: -9,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'space-between',
              marginTop: '5%',
            }}>
            <View style={{flexDirection: 'column', marginLeft: '-1%'}}>
              {this.state.type == 'DELIVERY TO HOME' ? (
                <Icon
                  raised
                  name="home"
                  type="font-awesome"
                  color={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                  onPress={type => this.setState({type: 'DELIVERY TO HOME'})}
                />
              ) : (
                <Icon
                  raised
                  name="home"
                  type="font-awesome"
                  color={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                  onPress={type => this.setState({type: 'DELIVERY TO HOME'})}
                />
              )}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#80808c',
                  fontFamily: 'Proxima Nova Font',
                }}>
                HOME
              </Text>
            </View>
            <View style={{flexDirection: 'column', marginLeft: '15%'}}>
              {this.state.type == 'DELIVERY TO WORK' ? (
                <Icon
                  raised
                  name="work"
                  type="MaterialIcons"
                  color={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                  onPress={type => this.setState({type: 'DELIVERY TO WORK'})}
                />
              ) : (
                <Icon
                  raised
                  name="work"
                  type="MaterialIcons"
                  color={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                  onPress={type => this.setState({type: 'DELIVERY TO WORK'})}
                />
              )}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#80808c',
                  fontFamily: 'Proxima Nova Font',
                }}>
                OFFICE
              </Text>
            </View>
            <View style={{flexDirection: 'column', marginLeft: '15%'}}>
              {this.state.type == 'DELIVERY TO OTHER' ? (
                <Icon
                  raised
                  name="location-arrow"
                  type="font-awesome"
                  color={LocalConfig.COLOR.UI_COLOR_LITE_TWICE}
                  onPress={type => this.setState({type: 'DELIVERY TO OTHER'})}
                />
              ) : (
                <Icon
                  raised
                  name="location-arrow"
                  type="font-awesome"
                  color="#d1c4a1"
                  onPress={type => this.setState({type: 'DELIVERY TO OTHER'})}
                />
              )}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#80808c',
                  fontFamily: 'Proxima Nova Font',
                }}>
                OTHER
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 15,
                color: '#bfbfbf',
                marginLeft: '14%',
                marginTop: '10%',
                fontFamily: 'Proxima Nova Font',
                marginBottom: '7%',
              }}>
              Enter your delivery address details here
            </Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 15,
                color: '#808080',
                marginLeft: '6%',
                fontFamily: 'Proxima Nova Font',
              }}>
              Address
            </Text>
            <TextInput
              style={{
                fontSize: 15,
                marginLeft: 25,
                marginTop: 5,
                fontFamily: 'Proxima Nova Font',
                color: `#808080`,
              }}
              multiline={true}
              placeholder="Address"
              placeholderTextColor="#bfbfbf"
              onChangeText={line1 => this.setState({line1})}>
              {line1}
            </TextInput>
            <View
              style={{
                borderBottomColor: '#e6e6e6',
                borderBottomWidth: 0.8,
                marginTop: -9,
                marginLeft: 15,
                marginRight: 25,
                marginBottom: 27,
              }}
            />
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 15,
                color: '#808080',
                marginLeft: '6%',
                fontFamily: 'Proxima Nova Font',
              }}>
              Additional Number
            </Text>
            <TextInput
              style={{
                fontSize: 15,
                marginLeft: 25,
                marginTop: 5,
                fontFamily: 'Proxima Nova Font',
                color: `#808080`,
              }}
              keyboardType="numeric"
              maxLength={10}
              placeholder="Additional Number"
              placeholderTextColor="#bfbfbf"
              onChangeText={addiphne => this.setState({addiphne})}>
              {addiphne}{' '}
            </TextInput>
            <View
              style={{
                borderBottomColor: '#e6e6e6',
                borderBottomWidth: 0.8,
                marginTop: -9,
                marginLeft: 15,
                marginRight: 25,
                marginBottom: 27,
              }}
            />
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 15,
                color: '#808080',
                marginLeft: '6%',
                fontFamily: 'Proxima Nova Font',
              }}>
              Landmark
            </Text>
            <TextInput
              style={{
                fontSize: 15,
                marginLeft: 25,
                marginTop: 5,
                fontFamily: 'Proxima Nova Font',
                color: `#808080`,
              }}
              placeholder="Landmark"
              placeholderTextColor="#bfbfbf"
              onChangeText={landmark => this.setState({landmark})}>
              {landmark}
            </TextInput>
            {/* <TextInput style={{
  fontSize:15,
  marginLeft:25,
  marginTop:5,
  color:`#808080`
}}
placeholder='Additional Number'
placeholderTextColor='#bfbfbf' onChangeText={additionalphn => this.setState({additionalphn})} ></TextInput> */}
            <View
              style={{
                borderBottomColor: '#e6e6e6',
                borderBottomWidth: 0.8,
                marginTop: -9,
                marginLeft: 15,
                marginRight: 25,
                marginBottom: 7,
              }}
            />
            <Button
              style={{
                paddingVertical: -6,
                marginTop: 40,
                marginLeft: '5%',
                marginRight: '5%',
              }}
              mode="contained"
              color={LocalConfig.COLOR.UI_COLOR}
              onPress={() => {
                if (
                  this.state.addiphne.length == 0 ||
                  this.state.landmark.length == 0 ||
                  this.state.type.length == 0 ||
                  this.state.line1.length == 0
                ) {
                  alert('Please fill all details');
                } else {
                  this.InsertDataToServer();
                }
              }}>
              {' '}
              <Text
                style={{color: `#fff`, fontSize: 13, fontFamily: 'verdanab'}}>
                Save ADDRESS
              </Text>
            </Button>
          </View>
        </Provider>
      </ScrollView>
    );
  }
}
const theme = {
  colors: {
    primary: LocalConfig.COLOR.UI_COLOR_LITE_TWICE,
  },
};
const styles = StyleSheet.create({
  centerElement: {justifyContent: 'center', alignItems: 'center'},
  item3: {
    width: '60%',
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});
