import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { 
    StyleSheet, 
    Text, 
    View,
} from 'react-native'
import { ThemeContext } from 'react-native-elements'
import PbmButton from './PbmButton'

const NotLoggedIn = ({ onPress, text, title }) => {
    const { theme } = useContext(ThemeContext)

    return (
        <View style={s(theme).container}>
            <Text style={s(theme).pageTitle}>{title}</Text>
            <Text style={s(theme).hiya}>{text}</Text>
            <PbmButton
                title={"Log In"} 
                onPress={onPress}
                accessibilityLabel="Log In"
            />
        </View>
    )
}


const s = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    pageTitle: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
        paddingBottom: 15,
        paddingTop: 10
    },
    hiya: {
        fontStyle: 'italic',
        paddingHorizontal: 15,
        paddingBottom: 10,
        color: '#4b5862',
        textAlign: 'center'
    },
})

NotLoggedIn.propTypes = {
    navigation: PropTypes.object,
    text: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func
}

export default NotLoggedIn

