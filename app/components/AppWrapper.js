import React, {useEffect} from "react"
import PropTypes from 'prop-types'
import * as SplashScreen from "expo-splash-screen"
import {connect} from "react-redux"
import {
    getRegions,
    fetchLocationTypes,
    fetchMachines,
    fetchOperators,
    getLocationAndMachineCounts,
    fetchCurrentLocation,
} from '../actions'

const AppWrapper = ({
    children,
    getRegions,
    getLocationTypes,
    getMachines,
    getOperators,
    getLocationAndMachineCounts,
    getCurrentLocation
}) => {
    useEffect(() => {
        async function isLoading() {
            await Promise.all([
                getRegions('/regions.json'),
                getLocationTypes('/location_types.json'),
                getMachines('/machines.json'),
                getOperators('/operators.json'),
                getLocationAndMachineCounts('/regions/location_and_machine_counts.json'),
                getCurrentLocation()
            ]).finally(() => SplashScreen.hideAsync())
        }

        isLoading()
    }, [])

    return (
        <>
            {children}
        </>
    )
}

AppWrapper.propTypes = {
    children: PropTypes.node,
    getRegions: PropTypes.func,
    getLocationTypes: PropTypes.func,
    getMachines: PropTypes.func, 
    getOperators: PropTypes.func,
    getLocationAndMachineCounts: PropTypes.func,
    getCurrentLocation: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
    getRegions: (url) => dispatch(getRegions(url)),
    getLocationTypes: (url) => dispatch(fetchLocationTypes(url)),
    getMachines: (url) => dispatch(fetchMachines(url)),
    getOperators: (url) => dispatch(fetchOperators(url)),
    getLocationAndMachineCounts: (url) => dispatch(getLocationAndMachineCounts(url)),
    getCurrentLocation: () => dispatch(fetchCurrentLocation(true))
})
export default connect(null, mapDispatchToProps)(AppWrapper)
