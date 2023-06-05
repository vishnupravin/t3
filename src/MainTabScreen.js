import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import LocationDetails from './LocationDetails';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
// import CartScreen from './CartScreen'
import CartScreen from '../src/CartScreen';
import SearchScreen from './SearchScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import LocalConfig from '../LocalConfig';
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const SearchStack = createStackNavigator();
const CartStack = createStackNavigator();
const HomeStackScreen = ({navigation}) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: LocalConfig.COLOR.UI_COLOR_LITE,
        headerTitleStyle: {
          fontWeight: 'normal',
          fontSize: 14,
          marginLeft: 60,
        },
      }}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: LocalConfig.APP_NAME,
          headerLeft: () => (
            <Icon
              name="ios-menu-outline"
              style={{marginLeft: 10}}
              color={LocalConfig.COLOR.UI_COLOR_LITE}
              size={25}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerRight: () => (
            <Icon
              name="ios-cart-sharp"
              style={{marginRight: 10}}
              color={LocalConfig.COLOR.UI_COLOR_LITE}
              size={25}
              onPress={() => navigation.navigate('CartScreen')}
            />
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};
const ProfileStackScreen = ({navigation}) => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          ...TransitionPresets.ModalSlideFromBottomIOS,
          headerLeft: () => (
            <Icon
              name="menu"
              color={LocalConfig.COLOR.UI_COLOR_LITE}
              size={25}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
    </ProfileStack.Navigator>
  );
};
const SearchStackScreen = ({navigation}) => {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <SearchStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: 'Search',
          headerLeft: () => (
            <Icon
              name="menu"
              color={LocalConfig.COLOR.UI_COLOR_LITE}
              size={25}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
    </SearchStack.Navigator>
  );
};
const CartStackScreen = ({navigation}) => {
  return (
    <CartStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <CartStack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          title: 'Manage',
          headerLeft: () => (
            <Icon
              name="ios-menu-outline"
              color={LocalConfig.COLOR.UI_COLOR_LITE}
              size={25}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerRight: () => (
            <Icon
              name="ios-cart-sharp"
              style={{marginRight: 10}}
              color={LocalConfig.COLOR.UI_COLOR_LITE}
              size={25}
              onPress={() => navigation.navigate('LocationMap')}
            />
          ),
        }}
      />
    </CartStack.Navigator>
  );
};
const MainTabScreen = ({navigation}) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={LocalConfig.COLOR.UI_COLOR_LITE}
      inactiveColor="#e5e5e5"
      barStyle={{backgroundColor: '#ffffff'}}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: LocalConfig.COLOR.UI_COLOR_LITE,
          tabBarIcon: ({color}) => (
            <Icon name="ios-home" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: LocalConfig.COLOR.UI_COLOR_LITE,
          tabBarIcon: ({color}) => (
            <Icon name="ios-search" color={color} size={25} />
          ),
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Tab.Screen
        name="Location"
        component={LocationDetails}
        options={{
          tabBarLabel: 'Address',
          tabBarIcon: LocalConfig.COLOR.UI_COLOR_LITE,
          tabBarIcon: ({color}) => (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('LocationDetails')}>
              <Icon name="ios-location-outline" color={color} size={25} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: LocalConfig.COLOR.UI_COLOR_LITE,
          tabBarIcon: ({color}) => (
            <Icon name="ios-person" color={color} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default MainTabScreen;
