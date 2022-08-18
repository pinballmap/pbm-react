import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
    View
} from 'react-native'
import { WebView } from 'react-native-webview'
import {
    ActivityIndicator,
} from '../components'

const Podcast = () => {
    const [loading, setLoading] = useState(true)

    return (
        <Fragment>
            <View style={loading ? { display: 'none' } : { flex: 1 }}>
                <WebView
                    onLoad={() => setLoading(false)}
                    source={{ uri: 'https://pod.pinballmap.com/' }}
                    androidHardwareAccelerationDisabled={true}
                />
            </View>
            {loading && <ActivityIndicator />}
        </Fragment>
    )

}

Podcast.propTypes = {
    navigation: PropTypes.object,
}

export default Podcast
