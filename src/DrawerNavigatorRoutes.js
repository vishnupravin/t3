import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './DrawerContent';
import Icon from 'react-native-vector-icons/Ionicons';
import MainTabScreen from './MainTabScreen';
import PrivacyPolicy from './PrivacyPolicy';
import CustomerCare from './CustomerCare';
import AddNewAddress from './AddNewAddress';
import LocationDetails from './LocationDetails';
import LocationMap from './LocationMap';
import ChooseLocation from './ChooseLocation';
import OrderHistory from './OrderHistory';
import CancellationPolicy from './CancellationPolicy';
import TermsAndConditions from './TermsAndConditions';
import Feedback from './Feedback';
import OrderHistory2 from './OrderHistory2';
import LocationMap1 from './LocationMap1';
import CartScreen from './CartScreen';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import ProfileScreen from './ProfileScreen';
import AddNewAddress1 from './AddNewAddress1';
import OrderFinish from './OrderFinish';
import Branch from './Branch';
import UpdatePage from './UpdatePage';
import TermsOfUse from './TermsOfUse';
import Aboutus from './Aboutus';
import DeliveryPolicy from './DeliveryPolicy';
//import LocationDetails from './LocationDetails'
const Drawer = createDrawerNavigator();
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const DrawerNavigatorRoutes = props => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#fb5607',
        headerTitleStyle: {
          fontFamily: 'Helvetica-Bold',
          fontSize: 14,
          marginLeft: '10%',
        },
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="CustomerCare"
        component={CustomerCare}
        options={{
          headerShown: false,
          transitionSpec: { open: config, close: config },
        }}
      />
      <Drawer.Screen
        name="Branch"
        component={Branch}
        options={{ headerShown: false }}
      />
      {/* <Drawer.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ headerShown: false }}
      /> */}
      <Drawer.Screen
        name="AddNewAddress"
        component={AddNewAddress}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="AddNewAddress1"
        component={AddNewAddress1}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="LocationMap"
        component={LocationMap}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="LocationMap1"
        component={LocationMap1}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="ChooseLocation"
        component={ChooseLocation}
        options={{ headerShown: false }}
      />
      {/* <Drawer.Screen
        name="CancellationPolicy"
        component={CancellationPolicy}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{ headerShown: false }}
      /> */}
      {/* <Drawer.Screen
        name="Feedback"
        component={Feedback}
        options={{ headerShown: false }}
      /> */}
      <Drawer.Screen
        name="OrderHistory2"
        component={OrderHistory2}
        options={{ headerShown: false }}
      />
      {/* <Drawer.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{ headerShown: false }}
      /> */}
      <Drawer.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          headerShown: false,
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="OrderFinish"
        component={OrderFinish}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="LocationDetails"
        component={LocationDetails}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="UpdatePage"
        component={UpdatePage}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Aboutus"
        component={Aboutus}
        options={{ headerShown: false }}
      />
      {/* <Drawer.Screen
        name="TermsOfUse"
        component={TermsOfUse}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="DeliveryPolicy"
        component={DeliveryPolicy}
        options={{ headerShown: false }}
      /> */}
    </Drawer.Navigator>
  );
};
export default DrawerNavigatorRoutes;
