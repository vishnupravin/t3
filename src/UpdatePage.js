import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Pressable } from 'react-native';
import { Image } from 'react-native';
import {
  ImageBackground,
  View,
  StyleSheet,
  Text,
  Alert,
  BackHandler,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LocalConfig from '../LocalConfig';

export default class UpdatePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hi: '',
    };
  }

  backAction = () => {
    Alert.alert('Alert !', 'Are you sure you want exit the app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };
  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }

  Linking = () => {
    Linking.openURL(
      `https://play.google.com/store/apps/details?id=${LocalConfig.PLAYSTOREID}`,
    );
  };

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={require('../assests/update1.jpg')}
        blurRadius={7}>
        <View style={{ alignItems: 'center', JustifyContent: 'flex-start', flex: 1, }}>
          <View style={{

          }}>
          </View>
          <View
            style={{
              padding: 10,
              justifyContent: 'flex-start',
              alignItems: 'center',
              flex: 1,
            }}>
            <Image
              source={require('../assests/Logo.png')}
              style={{
                width: 200,
                height: 200,
                resizeMode: 'center',
                borderRadius: 15,
                shadowColor: 'rgba(0, 0, 0, 0.90)',
                shadowOffset: { width: -1, height: 1 },
                shadowRadius: 10,
                elevation: 10
              }}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              width: '100%',
            }}>
            <Text
              style={{
                color: LocalConfig.COLOR.WHITE,
                fontSize: 20,
                fontFamily: 'Proxima Nova Bold',
                width: '70%',
                textAlign: 'center',
                textShadowColor: 'rgba(0, 0, 0, 0.90)',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 10,
              }}>
              Please Update Your App For Better Experience
            </Text>

            <Pressable
              style={{
                height: 40,
                width: 'auto',
                borderRadius: 16,
                backgroundColor: LocalConfig.COLOR.UI_COLOR,
                padding: 10,
              }}
              onPress={this.Linking}>
              <Text
                style={{
                  color: LocalConfig.COLOR.BLACK,
                  width: 200,
                  fontSize: 16,
                  textAlign: 'center',
                  fontFamily: 'verdanab',
                }}>
                UPDATE
              </Text>
            </Pressable>
            {/* {!this.props.route.params.skip && */}
            {this.props.route.params.confirm == 0 && (
              <TouchableOpacity
                onPress={() =>
                  AsyncStorage.getItem('user_id').then(value => {
                    this.props.navigation.replace(
                      value === null ? 'Auth' : 'frontpage',
                    );
                  })
                }
                style={{
                  backgroundColor: LocalConfig.COLOR.UI_COLOR_LITE_TWICE,
                  marginTop: 40,
                  justifyContent: 'space-evenly',
                  marginLeft: '55%',
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                  borderRadius: 20,
                  elevation: 10,
                  opacity: 0.8,
                }}>
                <Text
                  style={{
                    color: LocalConfig.COLOR.BLACK,
                    fontSize: 12,
                    textAlign: 'right',
                    fontFamily: 'verdanab',
                  }}>
                  SKIP {` >`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
  },
});
