import React from 'react'
import { ImageBackground } from "react-native"
import Text from './PbmText'
import PropTypes from "prop-types"
import markerDotHeart from '../assets/images/markerdot-heart.png'

const IosHeartMarker = ({ numMachines }) => {
    let dotFontMargin, dotWidth
    if (numMachines < 10) {
        dotFontMargin = 5
        dotWidth = 40
    } else if (numMachines < 20) {
        dotFontMargin = 5
        dotWidth = 44
    } else if (numMachines < 100) {
        dotFontMargin = 6
        dotWidth = 48
    } else {
        dotFontMargin = 8
        dotWidth = 56
    }
    return (
        <ImageBackground style={{ width: dotWidth, height: dotWidth * .872 }} source={markerDotHeart} >
            <Text style={{
                color: 'black',
                fontFamily: 'boldFont',
                textAlign: 'center',
                fontSize: 18,
                marginTop: dotFontMargin
            }}>
                {numMachines}
            </Text>
        </ImageBackground>
    )
}

IosHeartMarker.propTypes = {
    numMachines: PropTypes.number,
}

export default IosHeartMarker
