import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import LocalConfig from '../LocalConfig'
export default class App extends React.Component {
  state = {
    email: "",
    password: ""
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Quick To Home</Text>
        <View style={styles.inputView} >
          <TextInput
            style={styles.inputText}
            placeholder="Enter Your Email"
            placeholderTextColor="#003f5c"
            onChangeText={text => this.setState({ email: text })} />
        </View>
        <View style={styles.inputView} >
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Enter Your Mobile Number"
            placeholderTextColor="#003f5c"
            onChangeText={text => this.setState({ password: text })} />
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: "bold",
    fontSize: 30,
    color: LocalConfig.COLOR.UI_COLOR_LITE,
    marginBottom: 40
  },
  inputView: {
    width: "80%",
    backgroundColor: "#fff",
    borderColor: '#808080',
    borderRadius: 25,
    borderWidth: 0.3,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "white"
  },
  forgot: {
    color: "white",
    fontSize: 11
  },
  loginBtn: {
    width: "80%",
    backgroundColor: LocalConfig.COLOR.UI_COLOR_LITE,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    color: "white"
  }
});