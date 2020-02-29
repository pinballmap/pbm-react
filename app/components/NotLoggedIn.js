import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { 
    StyleSheet, 
    Text, 
    View,
} from 'react-native'
import { ThemeContext } from '../theme-context'
import PbmButton from './PbmButton'

const NotLoggedIn = ({ onPress, text, title }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    return (
        <View style={s.container}>
            <Text style={s.pageTitle}>{title}</Text>
            <Text style={s.hiya}>{text}</Text>
            <PbmButton
                title={"Log In"} 
                onPress={onPress}
                accessibilityLabel="Log In"
            />
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    pageTitle: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
        paddingBottom: 15,
        paddingTop: 10,
        color: theme.pbmText
    },
    hiya: {
        fontStyle: 'italic',
        paddingHorizontal: 15,
        paddingBottom: 10,
        color: theme.buttonTextColor,
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

