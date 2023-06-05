const COLOR = {
  // UI_COLOR: '#fff112',
  UI_COLOR: '#FFC107',
  // UI_COLOR_LITE: '#fff670',
  UI_COLOR_LITE: '#ffd96a',
  // UI_COLOR_LITE_TWICE: '#fffab7',
  UI_COLOR_LITE_TWICE: '#ffd96a',
  WHITE: '#ffffff',
  WHITE_LIGHT: '#e6e6e6',
  BLACK_LIGHT: '#999999',
  BLACK_LIGHT_LITER: '#323232',
  // BLACK: '#1e1e1e',
  BLACK: '#000000',
  red: '#f00'
};
const FONTS = {
  verdanab: "verdanab",
  Proxima_Nova_Font: 'Proxima Nova Font',
  Proxima_Nova_Bold: 'Proxima Nova Bold'
}
const POWERD_BY_URL = `https://falconsquare.in`;
const APP_NAME = 'Thiyagu Restaurant';
const IN_DEVELOPMENT = false;
const PaymentIsTest = true; // make sure you changed in server key.
const API_URL = PaymentIsTest ? 'https://falconsquare.in/RN_test/thiyagu-test/' : 'https://falconsquare.in/thiyagu-new/';
const API_KEYS = {
  razorpayApiKey: PaymentIsTest ? 'rzp_test_bnXgbr8mI9gpqf' : 'rzp_live_qtljHq8knboesV',
  cashFree: {
    clientId: PaymentIsTest ? '117651ad9f3eaf3789512567cd156711' : '166966b1be4d9245e1de56269d669661',
    env: PaymentIsTest ? 'TEST' : 'PROD',
    clientIdLive: '166966b1be4d9245e1de56269d669661',
    envLive: 'PROD'
  }
};
const PLAYSTOREID = `com.falconsquare.mypracto`;
const MAIN_LOCATION = {
  latitude: 11.087254608123905,
  longitude: 77.12265084029549,
};
export default {
  COLOR,
  API_URL,
  APP_NAME,
  API_KEYS,
  POWERD_BY_URL,
  MAIN_LOCATION,
  PLAYSTOREID,
  IN_DEVELOPMENT,
  FONTS,
  PaymentIsTest
};
