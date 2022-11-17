import React from 'react'
import PropTypes from 'prop-types'
import { Marker } from 'react-native-maps'
import IosHeartMarker from './IosHeartMarker'
import IosMarker from './IosMarker'

const MarkerDot = React.memo(({ numMachines }) => <IosMarker numMachines={numMachines} />)
const MarkerHeart = React.memo(({ numMachines }) => <IosHeartMarker numMachines={numMachines} />)

MarkerDot.propTypes = {
    numMachines: PropTypes.number,
}

MarkerHeart.propTypes = {
    numMachines: PropTypes.number,
}

const CustomMapMarker = React.memo(({ marker, updateCurrentMarker }) => {
    const { num_machines, lat, lon, id, icon } = marker
    return (
        <Marker
            key={id}
            coordinate={{
                latitude: Number(lat),
                longitude: Number(lon)
            }}
            pointerEvents="auto"
            onPress={updateCurrentMarker}
            tracksViewChanges={false}
        >
            {icon === 'dot' ? <MarkerDot numMachines={num_machines} /> : <MarkerHeart numMachines={num_machines} />}
        </Marker>
    )
})

CustomMapMarker.propTypes = {
    marker: PropTypes.object,
    updateCurrentMarker: PropTypes.func,
}

export default CustomMapMarker
