import React from 'react'
import { ImageBackground } from "react-native"
import Text from './PbmText'
import PropTypes from "prop-types"
import markerDotHeart from '../assets/images/markerdot-heart.png'

const IosHeartMarker = ({numMachines}) => {
    let dotFontMargin, dotWidthHeight
    if (numMachines < 10) {
        dotFontMargin = 5
        dotWidthHeight = 32
    } else if (numMachines < 20) {
        dotFontMargin = 5
        dotWidthHeight = 36
    } else if (numMachines < 100) {
        dotFontMargin = 6
        dotWidthHeight = 40
    } else {
        dotFontMargin = 8
        dotWidthHeight = 46
    }
    return (
        <ImageBackground style={{width: dotWidthHeight, height: dotWidthHeight}}source={markerDotHeart} >
            <Text style={{
                color: 'white',
                fontWeight:'bold',
                textAlign:'center',
                fontSize: 16,
                marginTop:dotFontMargin}}>
                {numMachines}
            </Text>
        </ImageBackground>
    )
}

IosHeartMarker.propTypes = {
    numMachines: PropTypes.number,
}

export default IosHeartMarker
