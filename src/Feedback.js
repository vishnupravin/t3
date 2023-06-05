import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalConfig from '../LocalConfig';
export default class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 0,
      rating: '',
      msg: '',
      uid: '',
      bid: '',
    };
    this.myTextInput = React.createRef();
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }
  componentDidMount = async () => {
    try {
      const key = await AsyncStorage.getItem('user_id');
      const key3 = await AsyncStorage.getItem('branch_id');
      this.setState({ uid: key });
      this.setState({ bid: key3 });
    } catch (error) { }
  };
  InsertDataToServer = () => {
    const { rating } = this.state;
    const { msg } = this.state;
    const { bid } = this.state;
    fetch(
      `${LocalConfig.API_URL}admin/api/feedback.php?uid=` +
      this.state.uid +
      '&&rating=' +
      rating +
      '&&msg=' +
      msg +
      '&&branch=' +
      bid,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          msg: msg,
          branch: bid,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        Alert.alert('Thanks for your Feedback');
        this.myTextInput.current.clear();
        this.onStarRatingPress(null);
      })
      .catch(error => {
        console.error(error);
      });
  };
  ratingCompleted(rating) { }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: LocalConfig.COLOR.BLACK }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '10%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons
              name="arrow-back"
              size={23}
              color={LocalConfig.COLOR.UI_COLOR}
              style={{ marginTop: '7%' }}
              onPress={() => {
                this.myTextInput.current.clear();
                this.onStarRatingPress(0);
                this.props.navigation.goBack()
              }}
            />
          </View>
          <View
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: LocalConfig.COLOR.UI_COLOR,
                marginLeft: '35%',
                fontFamily: 'verdanab',
              }}>
              FEEDBACK
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
            borderBottomWidth: 0.7,
          }}
        />
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: 20,
          }}>
          <Text
            style={{
              color: LocalConfig.COLOR.WHITE_LIGHT,
              fontSize: 15,
              marginTop: 6,
              letterSpacing: 0.8,
              fontFamily: 'Proxima Nova Font',
              fontWeight: 'bold',
            }}>
            Thank you for your feedback...
          </Text>
          <View
            style={{
              marginTop: '2%',
              marginBottom: '10%',
            }}>
            <AirbnbRating
              selectedColor={LocalConfig.COLOR.UI_COLOR}
              count={5}
              reviews={[
                '😥  BAD',
                '☹️ POOR',
                '😇  AVERAGE',
                '😎  GOOD',
                '😍  EXCELLENT',
              ]}
              defaultRating={0}
              reviewColor={LocalConfig.COLOR.WHITE}
              reviewSize={15}
              size={35}
              unSelectedColor={LocalConfig.COLOR.WHITE}
              onFinishRating={rating => this.setState({ rating })}
            />
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder={'Feedback'}
            placeholderTextColor={LocalConfig.COLOR.UI_COLOR}
            maxLength={150}
            multiline={true}
            ref={this.myTextInput}
            onChangeText={msg => this.setState({ msg })}
            style={{
              textAlign: 'center',
              borderWidth: 0.5,
              width: '80%',
              borderColor: '#adb5bd',
              borderRadius: 7,
              backgroundColor: LocalConfig.COLOR.BLACK,
              height: 160,
              color: LocalConfig.COLOR.WHITE,
              marginBottom: '6%',
            }}
          />
          <TouchableOpacity
            style={{
              height: 40,
              width: '60%',
              borderRadius: 16,
              backgroundColor: LocalConfig.COLOR.UI_COLOR,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => Alert.alert('Thanks for your Feedback')}>
            <Text
              style={{
                color: LocalConfig.COLOR.BLACK,
                fontSize: 16,
                textAlign: 'center',
                fontFamily: 'verdanab',
              }}
              onPress={this.InsertDataToServer}>
              SUBMIT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
