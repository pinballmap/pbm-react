import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Button,
    StyleSheet, 
    Text, 
    View, 
    WebView,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '../components'

class Blog extends Component {
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Blog',
            drawerIcon: () => <MaterialCommunityIcons name='book-open-variant' style={[s.drawerIcon]} />,
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Blog',
            headerStyle: {
                backgroundColor:'#f5fbff',                
            },
            headerTintColor: '#4b5862'
        }
    }
     
    render(){
        return(
            <View style={{flex: 1,backgroundColor:'#f5fbff'}}>
                <WebView
                    source={{uri: 'http://blog.pinballmap.com/'}}
                    style={{marginTop: 20}}
                />
            </View>)
    }
}

const s = StyleSheet.create({ 
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
})

Blog.propTypes = {
    navigation: PropTypes.object,
}

export default Blog