import React from 'react'
import { ImageBackground } from "react-native"
import Text from './PbmText'
import PropTypes from "prop-types"
import markerDotHeart from '../assets/images/markerdot-heart.png'

const IosHeartMarker = ({numMachines}) => {
    let dotFontMargin, dotWidth, dotHeight
    if (numMachines < 10) {
        dotFontMargin = 4
        dotWidth = 36
        dotHeight = dotWidth * .875
    } else if (numMachines < 20) {
        dotFontMargin = 4
        dotWidth = 40
        dotHeight = dotWidth * .875
    } else if (numMachines < 100) {
        dotFontMargin = 7
        dotWidth = 46
        dotHeight = dotWidth * .875
    } else {
        dotFontMargin = 8
        dotWidth = 54
        dotHeight = dotWidth * .875
    }
    return (
        <ImageBackground style={{width: dotWidth, height: dotHeight}}source={markerDotHeart} >
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
