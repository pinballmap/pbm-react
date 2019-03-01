import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Text, View } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class Events extends Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Events', 
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} />,
            title: 'Events',
            headerStyle: {
                backgroundColor:'#f5fbff',               
            },
            headerTintColor: '#4b5862'
        }
    }
     
    render(){
        return(
            <View style={{marginTop: 300, flex: 1,backgroundColor:'#f5fbff'}}>
                <Button
                    onPress={ () => this.props.navigation.navigate('Map') }
                    style={{width:30, paddingTop: 15}}
                    title="Back to Map"
                />
                <Text>Events</Text>
            </View>)
    }
}

Events.propTypes = {
    navigation: PropTypes.object,
}

export default Events