import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    ActivityIndicator,
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

    constructor(props) {
        super(props);
        this.state = { visible: true };
    }
    
    hideSpinner() {
        this.setState({ visible: false });
    }
    
    render() {
        return (
            <View style={{ flex: 1,backgroundColor:'#f5fbff' }}>
                <WebView
                    onLoad={() => this.hideSpinner()}
                    style={{ flex: 1 }}
                    source={{uri: 'http://blog.pinballmap.com/'}}
                />
                {this.state.visible && (
                <View style={{flex: 1, padding: 20,backgroundColor:'#f5fbff'}}>
                    <ActivityIndicator/>
                </View>
                )}
            </View>
        );
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