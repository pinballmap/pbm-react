import React, { useContext } from 'react'
import { 
    ActivityIndicator,
    StyleSheet, 
    View,
} from 'react-native'
import { ThemeContext } from '../theme-context'

const styledActivityIndicator = () => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    return (
        <View style={s.container}>
            <ActivityIndicator />
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20,
        backgroundColor:theme.backgroundColor,
    },
})

export default styledActivityIndicator