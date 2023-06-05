import { View, Text, TextInput } from 'react-native'
import React from 'react'
import LocalConfig from '../LocalConfig'

const Test = () => {
    const [textinput, setTextinput] = React.useState(" ")
    return (
        <View style={{ margin: "5%", justifyContent: 'center', flex: 1 }}>
            <Text>{textinput == "" ? "Text Input value goes here" : textinput}</Text>
            <TextInput
                onChangeText={(text) => {
                    setTextinput(text)
                }}
                value={textinput}
                placeholder={`write  a text here`}
                style={{
                    textAlign: 'center', fontSize: 15, borderColor: LocalConfig.COLOR.UI_COLOR,
                    borderWidth: 1.5, padding: '1%'
                }}
                autoFocus={true}
            />
        </View>
    )
}

export default Test