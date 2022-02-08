import React, { useContext } from 'react'
import { View } from "react-native"
import Text from './PbmText'
import PropTypes from "prop-types"
import { ThemeContext } from '../theme-context'

const IosMarker = ({numMachines}) => {
    const { theme } = useContext(ThemeContext)

    let dotFontMargin, dotWidthHeight
    if (numMachines < 10) {
        dotFontMargin = 2
        dotWidthHeight = 32
    } else if (numMachines < 20) {
        dotFontMargin = 4
        dotWidthHeight = 36
    } else if (numMachines < 100) {
        dotFontMargin = 6
        dotWidthHeight = 40
    } else {
        dotFontMargin = 9
        dotWidthHeight = 46
    }
    return (
        <View style={{
            width: dotWidthHeight,
            height: dotWidthHeight,
            borderRadius: dotWidthHeight / 2,
            borderWidth: 2,
            borderColor: theme.pink2,
            backgroundColor: theme.text2,
        }}>
            <Text style={{
                color: theme.base2,
                fontFamily: 'boldFont',
                textAlign: 'center',
                fontSize: 18,
                marginTop: dotFontMargin}}>
                {numMachines}
            </Text>
        </View>
    )
}

IosMarker.propTypes = {
    numMachines: PropTypes.number,
}

export default IosMarker
