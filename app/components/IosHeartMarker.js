import React from 'react'
import { ImageBackground } from "react-native"
import Text from './PbmText'
import PropTypes from "prop-types"
import markerDotHeart from '../assets/images/markerdot-heart.png'

const IosHeartMarker = ({numMachines}) => {
    let dotFontMargin, dotWidth
    if (numMachines < 10) {
        dotFontMargin = 4
        dotWidth = 36
    } else if (numMachines < 20) {
        dotFontMargin = 4
        dotWidth = 40
    } else if (numMachines < 100) {
        dotFontMargin = 7
        dotWidth = 46
    } else {
        dotFontMargin = 8
        dotWidth = 54
    }
    return (
        <ImageBackground style={{width: dotWidth, height: dotWidth * .875}} source={markerDotHeart} >
            <Text style={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 18,
                marginTop: dotFontMargin}}>
                {numMachines}
            </Text>
        </ImageBackground>
    )
}

IosHeartMarker.propTypes = {
    numMachines: PropTypes.number,
}

export default IosHeartMarker
