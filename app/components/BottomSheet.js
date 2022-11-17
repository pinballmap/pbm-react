import React from 'react'
import PropTypes from 'prop-types'
import BottomSheet from '@gorhom/bottom-sheet'
import LocationCard from './LocationCard'

const LocationBottomSheet = React.memo(({sheetRef, index, navigation, location}) => {
    const {city, id, name, state, zip, machine_names, street} = location ?? {}
    return (
        <BottomSheet
            ref={sheetRef}
            index={index}
            snapPoints={["40%", "30%"]}
            enablePanDownToClose={true}
            onChange={() => {
                navigation.navigate('LocationDetails', { id })
                sheetRef.current.close()
            }}
        >
            <LocationCard
                city={city} id={id} name={name} state={state} zip={zip} locationType={{}} machines={machine_names} street={street} navigation={navigation}/>
        </BottomSheet>
    )
})


LocationBottomSheet.propTypes = {
    sheetRef: PropTypes.object,
    index: PropTypes.number,
    navigation: PropTypes.object,
    location: PropTypes.object,
}

export default LocationBottomSheet
