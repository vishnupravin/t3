import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import LottieView from 'lottie-react-native';
import LocalConfig from '../LocalConfig';
const { width, height } = Dimensions.get('window')
const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
export default class OrderFinishOrderFinish extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const order_no = this.props.route.params.orderid
        const type = this.props.route.params.type
        const deltime = this.props.route.params.deltime
        const deltime1 = moment().utcOffset('+06:30').format('LT')
        const deltime2 = moment().utcOffset('+06:15').format('LT')
        return (

            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#ffff', marginTop: '-95%' }}>
                    <LottieView source={require('./animation2.json')} autoPlay loop />
                    <KeyboardAvoidingView style={styles.footer}>

                        <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Bold', marginTop: '-20%', color: LocalConfig.COLOR.BLACK }}>Your order has been successfully placed</Text>
                        <View flexDirection='column'>
                            <View flexDirection='row' marginLeft='15%' >
                                <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '5%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>        Order No : </Text>
                                <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '5%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>{order_no}</Text>

                            </View>
                            <View flexDirection='row' marginLeft='15%'>
                                <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '3%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>Delivery Type : </Text>
                                <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '3%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>{type}</Text>
                            </View>
                            <View flexDirection='row' marginLeft='15%'>
                                {(deltime !== 'default') && (deltime !== 'default1') && <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '3%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>Delivery Time : </Text>}
                                {(deltime !== 'default') && (deltime !== 'default1') && <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '3%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>{deltime}</Text>}
                            </View>
                            <View flexDirection='row' marginLeft='15%'>
                                {deltime == 'default' && <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '3%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>Delivery Time : </Text>}
                                {deltime == 'default' && <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '3%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>{deltime1}</Text>}
                            </View>
                            <View flexDirection='row' marginLeft='15%'>
                                {deltime == 'default1' && <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '3%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>Delivery Time : </Text>}
                                {deltime == 'default1' && <Text style={{ fontSize: 17, fontFamily: 'Proxima Nova Font', marginTop: '3%', color: LocalConfig.COLOR.BLACK, width: '50%' }}>{deltime2}</Text>}
                            </View>
                        </View>
                        <TouchableOpacity style={{
                            height: 40,
                            width: "50%",
                            marginTop: '7%',
                            borderRadius: 19,
                            backgroundColor: "#da742c",
                            justifyContent: 'center',
                            alignItems: 'center',

                            shadowColor: "rgba(0,0,0, .4)", // IOS
                            shadowOffset: { height: 1, width: 1 }, // IOS
                            shadowOpacity: 1, // IOS
                            shadowRadius: 1, //IOS
                            elevation: 6, // Android 
                        }} onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Text style={{ color: '#ffffff', fontFamily: 'verdanab', fontSize: 12 }}>CONTINUE SHOPPING</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            height: 35,
                            width: "50%",
                            marginTop: '5%',
                            marginLeft: '35%',
                            borderRadius: 15,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }} onPress={() => this.props.navigation.navigate('OrderHistory2', { order_no: order_no })}>

                            <Text style={{ fontSize: 15, fontFamily: 'Proxima Nova Bold', color: LocalConfig.COLOR.BLACK }}>Okay, Go to Order</Text>
                            <Icon name="arrow-forward-outline" style={{ marginTop: '1%', marginLeft: '4%' }} color="#da742c" size={25} />
                        </TouchableOpacity>



                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>

        )

    }

}
const styles = StyleSheet.create({


    container: {
        flex: 1,
        backgroundColor: '#fbfbfb',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

    },
    footer: {
        backgroundColor: "white",
        bottom: 0,
        position: "absolute",
        width: "100%",
        height: "37%",
        justifyContent: 'center',
        alignItems: 'center',
    },
})