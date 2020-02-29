import React, { useContext } from 'react'
import { ThemeContext } from '../theme-context'

const withThemeHOC = (Component) => {
    return (props) => {
        const { theme } = useContext(ThemeContext)

        return <Component theme={theme} {...props} />
    }
}

export default withThemeHOC