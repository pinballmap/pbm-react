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

const Blog = () => {
    const [loading, setLoading] = useState(true)
    
    return (
        <Fragment>
            <View style={loading ? {display: 'none'} : {flex: 1}}>
                <WebView
                    onLoad={() => setLoading(false)}
                    source={{uri: 'http://blog.pinballmap.com/'}}
                />
            </View>
            {loading && <ActivityIndicator/>}
        </Fragment>
    )   
}

Blog.navigationOptions = ({ navigation, theme }) => ({
    drawerLabel: 'Blog',
    drawerIcon: () => <MaterialCommunityIcons name='book-open-variant' style={{fontSize: 24,color: '#6a7d8a'}} />,
    headerLeft: <HeaderBackButton navigation={navigation} />,
    title: 'Blog',
    headerRight:<View style={{padding:6}}></View>,
    headerStyle: {
        backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5fbff',
    },
    headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',
    headerTitleStyle: {
        textAlign: 'center', 
        flex: 1
    },
    gesturesEnabled: true
})

Blog.propTypes = {
    navigation: PropTypes.object,
}

export default Blog
