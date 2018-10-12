import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class MachineDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
            //title: <Text>{navigation.getParam('locationName')}</Text>,
        }
    };

    render() {
        return (
            <View>
                <Text>Machine Details Screen</Text>
            </View>)
    }
}

export default MachineDetails
