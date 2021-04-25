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
            <View style={loading ? {display: 'none'} : {flex: 1}}>
                <WebView
                    onLoad={() => setLoading(false)}
                    source={{uri: 'http://pod.pinballmap.com/'}}
                />
            </View>
            {loading && <ActivityIndicator/>}
        </Fragment>
    )

}

Podcast.navigationOptions = ({ navigation, theme }) => ({
    drawerLabel: 'Podcast',
    drawerIcon: () => <MaterialCommunityIcons name='radio-tower' style={{fontSize: 24,color: '#95867c'}} />,
    headerLeft: <HeaderBackButton navigation={navigation}/>,
    title: 'Podcast',
    headerRight:<View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
        borderBottomWidth: 0,
        elevation: 0
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
    headerTitleStyle: {
        textAlign: 'center',
        flex: 1,
    },
    gesturesEnabled: true
})

Podcast.propTypes = {
    navigation: PropTypes.object,
}

export default Podcast
