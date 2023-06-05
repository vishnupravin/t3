import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, FAB, Portal, Provider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalConfig from "../LocalConfig";
export default class AddNewAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      type: "DELIVERY TO HOME",
      line1: this.props.route.params.location,
      latlng: this.props.route.params.lat + "," + this.props.route.params.long,

      landmark: "",
      addiphne: "",
      line2: "test",
      city: "test",
      state: "test",
      pincode: "test",
      uid: "",
      bid: "",

      fetchingapi: false,
    };
  }
  componentDidMount = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const branch_id = await AsyncStorage.getItem("branch_id");

      this.setState({
        uid: user_id,
        bid: branch_id,

        line1: this.props.route.params.location,
        latlng:
          this.props.route.params.lat + "," + this.props.route.params.long,
      });
    } catch (error) {}
  };
  refreshScreen() {
    this.componentDidMount();
  }
  InsertDataToServer = async () => {
    const { uid, type, name, landmark, addiphne, bid } = this.state;
    const line1 = this.props.route.params.location;
    const latlng =
      this.props.route.params.lat + "," + this.props.route.params.long;
    const Api =
      `${LocalConfig.API_URL}admin/api/add_address.php?uid=` +
      uid +
      "&&type=" +
      type +
      "&&name=" +
      name +
      "&&latlng=" +
      latlng +
      "&&line1=" +
      line1 +
      "&&landmark=" +
      landmark +
      "&&addiphne=" +
      addiphne +
      "&&bid=" +
      bid;
    const mobile_no = await AsyncStorage.getItem("mobile_no");
    console.log(mobile_no);

    if (mobile_no === addiphne) {
      // check if mobile
      fetch(Api, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          type: type,
          name: "default",
          latlng: latlng,
          line1: line1,
          landmark: landmark,
          addiphne: addiphne,
          bid: bid,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.data.success == "1") {
            this.setState({ fetchingapi: false });
            this.refreshScreen();
            this.props.navigation.navigate("LocationDetails");
          } else {
            Alert.alert("Oops!", res.data.register);
            this.setState({ fetchingapi: false });
          }
        });
    } else {
      // same num. error

      Alert.alert("?","please change new number");
      this.setState({ fetchingapi: false });
    }
  };
  render() {
    const line1 = this.props.route.params.location;
    const { open } = this.state;
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: LocalConfig.COLOR.BLACK,
        }}
      >
        <Provider>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: LocalConfig.COLOR.BLACK,
              marginBottom: 10,
            }}
          >
            <View style={[styles.centerElement, { width: 50, height: 50 }]}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={LocalConfig.COLOR.UI_COLOR}
                onPress={() =>
                  this.props.navigation.navigate("LocationDetails")
                }
              />
            </View>
            <View style={[styles.centerElement, { height: 50 }]}>
              <Text
                style={{
                  fontSize: 15,
                  color: LocalConfig.COLOR.UI_COLOR,
                  marginLeft: "20%",
                  fontFamily: "verdanab",
                }}
              >
                ADD NEW ADDRESS
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: LocalConfig.COLOR.BLACK,
              borderBottomWidth: 0.8,
              marginTop: -9,
            }}
          />
          <View
            style={{
              backgroundColor: LocalConfig.COLOR.BLACK,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "space-between",
              paddingTop: "5%",
            }}
          >
            <View style={{ flexDirection: "column", marginLeft: "-1%" }}>
              {this.state.type == "DELIVERY TO HOME" ? (
                <Icon
                  raised
                  name="home"
                  type="font-awesome"
                  color={LocalConfig.COLOR.UI_COLOR}
                  onPress={(type) =>
                    this.setState({ type: "DELIVERY TO HOME" })
                  }
                />
              ) : (
                <Icon
                  raised
                  name="home"
                  type="font-awesome"
                  color={LocalConfig.COLOR.BLACK}
                  onPress={(type) =>
                    this.setState({ type: "DELIVERY TO HOME" })
                  }
                />
              )}
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: "#80808c",
                  fontFamily: "Proxima Nova Font",
                }}
              >
                HOME
              </Text>
            </View>
            <View style={{ flexDirection: "column", marginLeft: "15%" }}>
              {this.state.type == "DELIVERY TO WORK" ? (
                <Icon
                  raised
                  name="work"
                  type="MaterialIcons"
                  color={LocalConfig.COLOR.UI_COLOR}
                  onPress={(type) =>
                    this.setState({ type: "DELIVERY TO WORK" })
                  }
                />
              ) : (
                <Icon
                  raised
                  name="work"
                  type="MaterialIcons"
                  color={LocalConfig.COLOR.BLACK}
                  onPress={(type) =>
                    this.setState({ type: "DELIVERY TO WORK" })
                  }
                />
              )}
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: "#80808c",
                  fontFamily: "Proxima Nova Font",
                }}
              >
                OFFICE
              </Text>
            </View>
            <View style={{ flexDirection: "column", marginLeft: "15%" }}>
              {this.state.type == "DELIVERY TO OTHER" ? (
                <Icon
                  raised
                  name="location-arrow"
                  type="font-awesome"
                  color={LocalConfig.COLOR.UI_COLOR}
                  onPress={(type) =>
                    this.setState({ type: "DELIVERY TO OTHER" })
                  }
                />
              ) : (
                <Icon
                  raised
                  name="location-arrow"
                  type="font-awesome"
                  color={LocalConfig.COLOR.BLACK}
                  onPress={(type) =>
                    this.setState({ type: "DELIVERY TO OTHER" })
                  }
                />
              )}
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: "#80808c",
                  fontFamily: "Proxima Nova Font",
                }}
              >
                OTHER
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 15,
                color: "#bfbfbf",
                textAlign: "center",
                paddingVertical: 20,
                backgroundColor: LocalConfig.COLOR.BLACK,
              }}
            >
              Enter your delivery address details here
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#808080",
                marginLeft: "6%",
                fontFamily: "Proxima Nova Font",
              }}
            >
              Address
            </Text>
            <TextInput
              style={{
                fontSize: 15,
                marginLeft: 25,
                marginTop: 5,
                color: LocalConfig.COLOR.WHITE,
                fontFamily: "Proxima Nova Font",
              }}
              multiline={true}
              placeholder="Address"
              placeholderTextColor="#bfbfbf"
              onChangeText={(line1) => this.setState({ line1 })}
            >
              {line1}
            </TextInput>
            <View
              style={{
                borderBottomColor: "#e6e6e6",
                borderBottomWidth: 0.8,
                marginTop: -9,
                marginLeft: 15,
                marginRight: 25,
                marginBottom: 27,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#808080",
                marginLeft: "6%",
                fontFamily: "Proxima Nova Font",
              }}
            >
              Name
            </Text>
            <TextInput
              style={{
                fontSize: 15,
                marginLeft: 25,
                marginTop: 5,
                color: LocalConfig.COLOR.WHITE,
                fontFamily: "Proxima Nova Font",
              }}
              multiline={true}
              placeholder="Name"
              placeholderTextColor="#bfbfbf"
              onChangeText={(name) => this.setState({ name })}
            >
              {this.state.name}
            </TextInput>
            <View
              style={{
                borderBottomColor: "#e6e6e6",
                borderBottomWidth: 0.8,
                marginTop: -9,
                marginLeft: 15,
                marginRight: 25,
                marginBottom: 27,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#808080",
                marginLeft: "6%",
                fontFamily: "Proxima Nova Font",
              }}
            >
              Additional number
            </Text>
            <TextInput
              style={{
                fontSize: 15,
                marginLeft: 25,
                marginTop: 5,
                fontFamily: "Proxima Nova Font",
                color: LocalConfig.COLOR.WHITE,
              }}
              keyboardType="numeric"
              maxLength={10}
              placeholder="Additional Number"
              placeholderTextColor="#bfbfbf"
              onChangeText={(addiphne) => this.setState({ addiphne })}
            ></TextInput>
            <View
              style={{
                borderBottomColor: "#e6e6e6",
                borderBottomWidth: 0.8,
                marginTop: -9,
                marginLeft: 15,
                marginRight: 25,
                marginBottom: 27,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#808080",
                marginLeft: "6%",
                fontFamily: "Proxima Nova Font",
              }}
            >
              Landmark
            </Text>
            <TextInput
              style={{
                fontSize: 15,
                marginLeft: 25,
                marginTop: 5,
                fontFamily: "Proxima Nova Font",
                color: LocalConfig.COLOR.WHITE,
              }}
              placeholder="Landmark"
              placeholderTextColor="#bfbfbf"
              onChangeText={(landmark) => this.setState({ landmark })}
            ></TextInput>
            <View
              style={{
                borderBottomColor: "#e6e6e6",
                borderBottomWidth: 0.8,
                marginTop: -9,
                marginLeft: 15,
                marginRight: 25,
                marginBottom: 7,
              }}
            />
            <Pressable
              style={{
                paddingVertical: 10,
                marginTop: 40,
                marginHorizontal: "5%",
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
              onPress={() => {
                if (
                  this.state.addiphne.length < 10 ||
                  this.state.landmark.length == 0 ||
                  this.state.type.length == 0 ||
                  this.state.line1.length == 0 ||
                  this.state.name.length == 0
                ) {
                  alert("Please fill all and correct details");
                } else {
                  this.setState({ fetchingapi: true });
                  this.InsertDataToServer();
                }
              }}
              disabled={this.state.fetchingapi}
            >
              {this.state.fetchingapi ? (
                <ActivityIndicator
                  animating={true}
                  color={LocalConfig.COLOR.BLACK}
                  size="small"
                />
              ) : (
                <Text
                  style={{
                    color: LocalConfig.COLOR.BLACK,
                    fontSize: 13,
                    fontFamily: "verdanab",
                  }}
                >
                  SAVE ADDRESS
                </Text>
              )}
            </Pressable>
          </View>
        </Provider>
      </ScrollView>
    );
  }
}
const theme = {
  colors: {
    primary: LocalConfig.COLOR.UI_COLOR,
  },
};
const styles = StyleSheet.create({
  centerElement: { justifyContent: "center", alignItems: "center" },
  item3: {
    width: "60%",
  },
  container2: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
});
