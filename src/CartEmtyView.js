import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native'
import { Button } from 'react-native'
import LocalConfig from '../LocalConfig'
import { Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native'

const CartEmtyView = ({ props }) => {
    return <View
        style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: LocalConfig.COLOR.BLACK,
        }}>
        <View
            style={{
                borderRadius:
                    Math.round(
                        Dimensions.get('window').width +
                        Dimensions.get('window').height,
                    ) / 2,
                width: Dimensions.get('window').width * 1,
                height: Dimensions.get('window').width * 1,
                backgroundColor: LocalConfig.COLOR.BLACK,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <ImageBackground
                style={{
                    marginTop: '1%',
                    height: 190,
                    alignSelf: 'stretch',
                    width: '100%',
                }}
                source={require('../assests/cart.jpg')}
                resizeMode="center"
            />
            <Text
                style={{
                    color: LocalConfig.COLOR.WHITE,
                    fontFamily: 'Proxima Nova Bold',
                    marginBottom: '5%',
                    fontSize: 16,
                }}>
                {' '}
                We Will Meet You With Fresh Food....
            </Text>
            <Text
                style={{
                    color: LocalConfig.COLOR.WHITE,
                    fontFamily: 'Proxima Nova Font',
                    marginBottom: '0.5%',
                    fontSize: 13,
                }}>
                Your cart is empty
            </Text>
            <Text
                style={{
                    color: LocalConfig.COLOR.WHITE,
                    fontFamily: 'Proxima Nova Font',
                    marginBottom: '2%',
                    fontSize: 13,
                }}>
                Add something from the products
            </Text>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('HomeScreen')}
                style={{
                    borderColor: LocalConfig.COLOR.UI_COLOR,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    shadowOffset: {
                        width: 5,
                        height: 3,
                    },
                }}
            >
                <Text
                    style={{
                        color: LocalConfig.COLOR.UI_COLOR,
                        fontSize: 13,
                        fontFamily: 'verdanab',
                    }}>
                    BROWSE FRESH FOOD
                </Text>
            </TouchableOpacity>
        </View>
    </View>

}

export default CartEmtyView

const styles = StyleSheet.create({})