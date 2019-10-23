import React, { useContext } from 'react'
import { ThemeContext } from 'react-native-elements'

const withThemeHOC = (Component) => {
    return (props) => {
        const theme = useContext(ThemeContext)

        return <Component theme={theme} {...props} />
    }
}

export default withThemeHOC