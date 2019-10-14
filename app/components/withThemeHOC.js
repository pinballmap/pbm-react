import React, { useContext } from 'react'
import { ThemeContext } from 'react-native-elements'

export const withThemeHOC = (Component) => {
    return (props) => {
        const theme = useContext(ThemeContext)

        return <Component theme={theme} {...props} />
    }
}