import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class SuggestLocation extends Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Suggest Location', 
            headerLeft: <HeaderBackButton tintColor="#000e18" onPress={() => navigation.goBack(null)} title="Map" />,
            title: 'Suggest Location',
        }
    }
     
    render(){
        return(
            <View style={{marginTop: 300, flex: 1}}>
                <Button
                    onPress={ () => this.props.navigation.navigate('Map') }
                    style={{width:30, paddingTop: 15}}
                    title="Back to Map"
                />
                <Text>Suggest Location</Text>
            </View>)
    }
}

SuggestLocation.propTypes = {
    navigation: PropTypes.object,
}

export default SuggestLocation