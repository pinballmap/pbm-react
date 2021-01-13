import React from 'react'
import Svg, {Circle, G} from "react-native-svg"
import PropTypes from "prop-types"

const AndroidMarker = ({numMachines}) => {
    let radius
    if (numMachines === 1) {
        radius = 2
    } else if (numMachines === 2) {
        radius = 2.25
    } else if (numMachines === 3) {
        radius = 2.5
    } else if (numMachines === 4) {
        radius = 2.75
    } else if (numMachines < 10) {
        radius = 3
    } else if (numMachines < 20) {
        radius = 4
    } else {
        radius = 4.5
    }
    return (
        <Svg width={48} height={40} >
            <G
                transform="translate(-99.885513,-122.46734)">
                <Circle
                    fill='#f7545f'
                    fillOpacity={numMachines * 0.15 + 0.4}
                    stroke='#f5fbff'
                    strokeWidth={1}
                    cx="105.21638"
                    cy="148.88647"
                    r={radius}
                    transform="matrix(2.9741147,0,0,2.9741147,-197.18546,-304.44272)" />
            </G>
        </Svg>
    )
}

AndroidMarker.propTypes = {
    numMachines: PropTypes.number,
}

export default AndroidMarker
