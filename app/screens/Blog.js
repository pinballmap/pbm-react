import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
    View
} from 'react-native'
import { WebView } from 'react-native-webview'
import {
    ActivityIndicator,
} from '../components'

const Blog = () => {
    const [loading, setLoading] = useState(true)

    return (
        <Fragment>
            <View style={loading ? { display: 'none' } : { flex: 1 }}>
                <WebView
                    onLoad={() => setLoading(false)}
                    source={{ uri: 'https://blog.pinballmap.com/' }}
                    androidHardwareAccelerationDisabled={true}
                />
            </View>
            {loading && <ActivityIndicator />}
        </Fragment>
    )
}

Blog.propTypes = {
    navigation: PropTypes.object,
}

export default Blog
