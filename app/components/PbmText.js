import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { 
    StyleSheet, 
    Text 
} from 'react-native'
import { ThemeContext } from 'react-native-elements'

const PbmText = ({ style, onPress, children }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    return (
        <Text style={[s.text, style]} onPress={onPress}>
            {children}
        </Text>
    )
}

PbmText.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    onPress: PropTypes.func, 
    children: PropTypes.node,
}

const getStyles = (theme) => StyleSheet.create({
    text: {
        color: theme.pbmText
    },
})

export default PbmText
