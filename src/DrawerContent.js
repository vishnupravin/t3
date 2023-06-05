import React, { useState, createRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { Avatar, Title, Drawer, List } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqlservice from './sql';
import LocalConfig from '../LocalConfig';
import { Linking } from 'react-native';
import CartScreen from './CartScreen';
import { useSelector } from 'react-redux';
export function DrawerContent(props) {
  const sql = new sqlservice();
  const [token, setToken] = useState('');
  const [esp, setEsp] = useState(false);
  const isLogin = useSelector(state => state.isLogin);
  React.useEffect(() => {
    getKey();
    const unsubscribe = props.navigation.addListener('focus', () => {
      getKey();
      // Alert.alert('Refreshed');
    });
    return unsubscribe;
  }, []);
  const getKey = async () => {
    try {
      const key = await AsyncStorage.getItem('user_id');
      const setEspAsyncStorage =
        (await AsyncStorage.getItem('espstatus')) == 'true';
      setToken(key);
      setEsp(setEspAsyncStorage);
    } catch (error) { }
  };
  return (
    <ScrollView style={{ backgroundColor: LocalConfig.COLOR.BLACK }}>
      <View style={{ flex: 1 }}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'column', marginTop: 50 }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('ProfileScreen')}>
                <Avatar.Image
                  style={{ backgroundColor: LocalConfig.COLOR.UI_COLOR }}
                  source={require('../assests/usericon3.png')}
                  size={50}
                />
              </TouchableOpacity>
              <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                <Title style={styles.title}>{`${LocalConfig.APP_NAME}`}</Title>
              </View>
            </View>
          </View>
          <List.Item
            style={{
              paddingHorizontal: 35,
              paddingTop: 4,
              marginLeft: -19,
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
            title={`Home`}
            titleStyle={{
              fontSize: 14,
              fontFamily: 'Proxima Nova Font',
              color: LocalConfig.COLOR.WHITE,
            }}
            theme={{ colors: { text: '#696969' } }}
            left={props => (
              <List.Icon
                {...props}
                icon="home"
                color={LocalConfig.COLOR.WHITE}
              />
            )}
            onPress={() => {
              props.navigation.navigate('HomeScreen');
            }}
          />
          <View
            style={{
              borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
              borderBottomWidth: 0.7,
            }}
          />
          <List.Item
            style={{
              paddingHorizontal: 35,
              paddingTop: 4,
              marginLeft: -19,
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
            title="Cart"
            titleStyle={{
              fontSize: 14,
              fontFamily: 'Proxima Nova Font',
              color: LocalConfig.COLOR.WHITE,
            }}
            theme={{ colors: { text: '#696969' } }}
            left={props => (
              <List.Icon
                {...props}
                icon="cart"
                color={LocalConfig.COLOR.WHITE}
              />
            )}
            onPress={() => {
              props.navigation.navigate('CartScreen');
            }}
          />
          <View
            style={{
              borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
              borderBottomWidth: 0.5,
            }}
          />
          <List.Item
            style={{
              paddingHorizontal: 35,
              paddingTop: 4,
              marginLeft: -19,
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
            title="Recent Orders"
            titleStyle={{
              fontSize: 14,
              fontFamily: 'Proxima Nova Font',
              color: LocalConfig.COLOR.WHITE,
            }}
            theme={{ colors: { text: '#696969' } }}
            left={props => (
              <List.Icon
                {...props}
                icon="clock"
                color={LocalConfig.COLOR.WHITE}
              />
            )}
            onPress={() => {
              props.navigation.navigate('OrderHistory');
            }}
          />
          <View
            style={{
              borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
              borderBottomWidth: 0.5,
            }}
          />
          <List.Item
            style={{
              paddingHorizontal: 35,
              paddingTop: 4,
              marginLeft: -19,
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
            title="Feedback"
            titleStyle={{
              fontSize: 14,
              fontFamily: 'Proxima Nova Font',
              color: LocalConfig.COLOR.WHITE,
            }}
            theme={{ colors: { text: '#696969' } }}
            left={props => (
              <List.Icon
                {...props}
                icon="chat"
                color={LocalConfig.COLOR.WHITE}
              />
            )}
            onPress={() => {
              props.navigation.navigate('Feedback');
            }}
          />
          <View
            style={{
              borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
              borderBottomWidth: 0.5,
            }}
          />
          <List.Item
            style={{
              paddingHorizontal: 35,
              paddingTop: 4,
              marginLeft: -19,
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
            title="Customer Care"
            titleStyle={{
              fontSize: 14,
              fontFamily: 'Proxima Nova Font',
              color: LocalConfig.COLOR.WHITE,
            }}
            theme={{ colors: { text: '#696969' } }}
            left={props => (
              <List.Icon
                {...props}
                icon="account-voice"
                color={LocalConfig.COLOR.WHITE}
              />
            )}
            onPress={() => {
              props.navigation.navigate('CustomerCare');
            }}
          />
          <View
            style={{
              borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
              borderBottomWidth: 0.5,
            }}
          />
          <List.Item
            style={{
              paddingHorizontal: 35,
              paddingTop: 4,
              marginLeft: -19,
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
            title="Terms Of Use"
            titleStyle={{
              fontSize: 14,
              fontFamily: 'Proxima Nova Font',
              color: LocalConfig.COLOR.WHITE,
            }}
            theme={{ colors: { text: '#696969' } }}
            left={props => (
              <List.Icon
                {...props}
                icon="help-circle"
                color={LocalConfig.COLOR.WHITE}
              />
            )}
            onPress={() => {
              props.navigation.navigate('TermsOfUse');
            }}
          />
          <View
            style={{
              borderBottomColor: LocalConfig.COLOR.WHITE_LIGHT,
              borderBottomWidth: 0.5,
            }}
          />
          <List.Item
            style={{
              paddingHorizontal: 35,
              paddingTop: 4,
              marginLeft: -19,
              backgroundColor: LocalConfig.COLOR.BLACK,
            }}
            title="About Us"
            titleStyle={{
              fontSize: 14,
              fontFamily: 'Proxima Nova Font',
              color: LocalConfig.COLOR.WHITE,
            }}
            theme={{ colors: { text: '#696969' } }}
            left={props => (
              <List.Icon
                {...props}
                icon="information"
                color={LocalConfig.COLOR.WHITE}
              />
            )}
            onPress={() => {
              props.navigation.navigate('Aboutus');
            }}
          />
        </View>
        {(token !== null || isLogin) && (
          <Drawer.Section
            style={[
              styles.bottomDrawerSection,
              { backgroundColor: LocalConfig.COLOR.BLACK },
            ]}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="log-out"
                  color={LocalConfig.COLOR.WHITE}
                  size={size}
                  style={{ marginLeft: '3%' }}
                />
              )}
              label="Sign Out"
              labelStyle={{
                fontSize: 14,
                fontFamily: 'Proxima Nova Font',
                color: LocalConfig.COLOR.WHITE,
              }}
              onPress={() => Alert.alert('Hey!', 'Are you sure want to logout?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes', onPress: () => {
                    AsyncStorage.clear();
                    sql.deleteallrows();
                    props.navigation.replace('SplashScreen');
                  }
                },
              ])
              }
            />
          </Drawer.Section>
        )}
        <TouchableOpacity
          style={{
            marginTop: 120,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ececec',
            marginHorizontal: '25%',
            padding: 5,
            borderRadius: 10,
          }}
          onPress={() => {
            Linking.openURL(LocalConfig.POWERD_BY_URL);
          }}>
          <Text style={{ fontSize: 10, color: LocalConfig.COLOR.BLACK }}>
            Powerd by
          </Text>
          <Text style={{ fontSize: 10, color: LocalConfig.COLOR.BLACK }}>
            Falcon Square Pvt. Ltd.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    height: 160,
    backgroundColor: LocalConfig.COLOR.UI_COLOR,
  },
  title: {
    fontFamily: 'verdanab',
    fontSize: 13,
    marginTop: 10,
    color: LocalConfig.COLOR.BLACK,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: '10%',
    color: 'black',
    fontFamily: 'sans-serif',
    fontSize: 150,
  },
  bottomDrawerSection: {
    marginBottom: 22,
    borderTopColor: LocalConfig.COLOR.BLACK_LIGHT,
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
