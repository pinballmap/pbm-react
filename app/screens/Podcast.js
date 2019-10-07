import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    ActivityIndicator,
    StyleSheet, 
    View
} from 'react-native'
import { WebView } from 'react-native-webview'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '../components'

class Podcast extends Component {
    state = { loading: true }

    static navigationOptions = ({ navigation }) => {
        return {
            drawerLabel: 'Podcast',
            drawerIcon: () => <MaterialCommunityIcons name='radio-tower' style={[s.drawerIcon]} />, 
            headerLeft: <HeaderBackButton navigation={navigation}/>,
            title: 'Podcast',
            headerRight:<View style={{padding:6}}></View>,
        }
    }

    render(){
        return(
            <View style={{ flex: 1,backgroundColor:'#f5fbff' }}>
                {this.state.loading && (
                    <View style={{flex: 1, padding: 20,backgroundColor:'#f5fbff'}}>
                        <ActivityIndicator/>
                    </View>
                )}
                <WebView
                    onLoad={() => this.setState({loading: false})}
                    style={{ flex: 1 }}
                    source={{uri: 'http://pod.pinballmap.com/'}}
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

Podcast.propTypes = {
    navigation: PropTypes.object,
}

export default Podcast
