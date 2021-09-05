import React from 'react'
import {Platform, View} from "react-native"
import Text from './PbmText'
import PropTypes from "prop-types"

const IosMarker = ({numMachines}) => {
    let dotFontMargin, dotWidthHeight
    if (numMachines < 10) {
        dotFontMargin = 3
        dotWidthHeight = 32
    } else if (numMachines < 20) {
        dotFontMargin = 5
        dotWidthHeight = 36
    } else if (numMachines < 100) {
        dotFontMargin = 7
        dotWidthHeight = 40
    } else {
        dotFontMargin = 10
        dotWidthHeight = 46
    }
    return (
        <View style={{
            width: dotWidthHeight,
            height: dotWidthHeight,
            borderRadius: dotWidthHeight / 2,
            borderWidth: 2,
            borderColor: '#d2e5fa',
            backgroundColor: '#78b6fb'
        }}>
            <Text style={{
                color: 'white',
                fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
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
