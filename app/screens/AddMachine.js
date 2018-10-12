import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class AddMachine extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#888888" onPress={() => navigation.goBack(null)} />,
            //title: <Text>{navigation.getParam('locationName')}</Text>,
        }
    };

    render() {
        return (
            <View>
                <Text>Add Machine Screen</Text>
            </View>)
    }
}

export default AddMachine
