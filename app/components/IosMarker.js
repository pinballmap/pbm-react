import React from 'react'
import {View} from "react-native"
import Text from './PbmText'
import PropTypes from "prop-types"

const IosMarker = ({numMachines}) => {
    let dotFontMargin, dotWidthHeight
    if (numMachines < 10) {
        dotFontMargin = 0
        dotWidthHeight = 32
    } else if (numMachines < 20) {
        dotFontMargin = 2
        dotWidthHeight = 36
    } else if (numMachines < 100) {
        dotFontMargin = 4
        dotWidthHeight = 40
    } else {
        dotFontMargin = 7
        dotWidthHeight = 46
    }
    return (
        <View style={{
            width: dotWidthHeight,
            height: dotWidthHeight,
            borderRadius: dotWidthHeight / 2,
            borderWidth: 3,
            borderColor: '#d2e5fa',
            backgroundColor: '#78b6fb',
            elevation: 1,
        }}>
            <Text style={{
                color: 'white',
                fontWeight:'bold',
                textAlign:'center',
                fontSize: 20,
                marginTop:dotFontMargin}}>
                {numMachines}
            </Text>
        </View>
    )
}

IosMarker.propTypes = {
    numMachines: PropTypes.number,
}

export default IosMarker
