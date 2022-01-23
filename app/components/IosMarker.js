import React from 'react'
import { View } from "react-native"
import Text from './PbmText'
import PropTypes from "prop-types"

const IosMarker = ({numMachines}) => {
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
            borderColor: '#fee7f5',
            backgroundColor: '#616182'
        }}>
            <Text style={{
                color: '#f5f5ff',
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
