import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    ActivityIndicator,
    Platform,
    StyleSheet,  
    View, 
    WebView,
} from 'react-native'
import { Constants } from 'expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '../components'

class Blog extends Component {
    state = { loading: true }
  
    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Blog',
            drawerIcon: () => <MaterialCommunityIcons name='book-open-variant' style={[s.drawerIcon]} />,
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Blog',
            headerStyle: {
                backgroundColor:'#f5fbff',
                height: Expo.Constants.statusBarHeight > 40 ? 60 : Platform.OS === 'android' ? 56 : Platform.OS === 'ios' ? 44 : null, 
                paddingTop: Expo.Constants.statusBarHeight > 40 ? 30 : '',                
            },
            headerTintColor: '#4b5862'
        }
    }
    
    render() {
        return (
            <View style={{ flex: 1,backgroundColor:'#f5fbff' }}>
                {this.state.loading && (
                    <View style={{flex: 1, padding: 20,backgroundColor:'#f5fbff'}}>
                        <ActivityIndicator/>
                    </View>
                )}
                <WebView
                    onLoad={() => this.setState({loading: false})}
                    style={{ flex: 1 }}
                    source={{uri: 'http://blog.pinballmap.com/'}}
                />
            </View>
        )
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