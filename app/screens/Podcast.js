import React, { Fragment, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
    ActivityIndicator,
    StyleSheet, 
    View
} from 'react-native'
import { WebView } from 'react-native-webview'
import { ThemeContext } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '../components'

const Podcast = () => {
    const [loading, setLoading] = useState(true)
    const { theme } = useContext(ThemeContext)

    return(
        <Fragment>
            {loading && (
                <View style={{height: '100%', padding: 30, backgroundColor:theme.backgroundColor}}>
                    <ActivityIndicator/>
                </View>
            )}
            <WebView
                onLoad={() => setLoading(false)}
                style={{ flex: 1 }}
                source={{uri: 'http://pod.pinballmap.com/'}}
            />
        </Fragment>
    )

}

Podcast.navigationOptions = ({ navigation }) => ({
    drawerLabel: 'Podcast',
    drawerIcon: () => <MaterialCommunityIcons name='radio-tower' style={[s.drawerIcon]} />, 
    headerLeft: <HeaderBackButton navigation={navigation}/>,
    title: 'Podcast',
    headerRight:<View style={{padding:6}}></View>,
})

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
