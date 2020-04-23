import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ScrollView } from 'react-native'
import { ThemeContext } from '../theme-context'

const Screen = (props) => {
    const { theme } = useContext(ThemeContext)
    
    return (
        <ScrollView 
            {...props} 
            scrollIndicatorInsets={{ right: 1 }}
            style={{ flex: 1,backgroundColor: theme.backgroundColor }}
        >
            {props.children}
        </ScrollView>
    )
}

Screen.propTypes = {
    children: PropTypes.node,
}

export default Screen
