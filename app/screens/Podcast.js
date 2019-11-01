import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
    View
} from 'react-native'
import { WebView } from 'react-native-webview'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { 
    ActivityIndicator,
    HeaderBackButton, 
} from '../components'

const Podcast = () => {
    const [loading, setLoading] = useState(true)

    return(
        <Fragment>
            {loading && <ActivityIndicator/>}
            <WebView
                onLoad={() => setLoading(false)}
                style={{ flex: 1 }}
                source={{uri: 'http://pod.pinballmap.com/'}}
            />
        </Fragment>
    )

}

Podcast.navigationOptions = ({ navigation, theme }) => ({
    drawerLabel: 'Podcast',
    drawerIcon: () => <MaterialCommunityIcons name='radio-tower' style={{fontSize: 24,color: '#6a7d8a'}} />, 
    headerLeft: <HeaderBackButton navigation={navigation}/>,
    title: 'Podcast',
    headerRight:<View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#2a211c' : '#f5fbff',
    },
    headerTintColor: theme === 'dark' ? '#9a836a' : '#4b5862'
})

Podcast.propTypes = {
    navigation: PropTypes.object,
}

export default Podcast
