import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import {connect} from "react-redux"
import {
    getRegions,
    fetchLocationTypes,
    fetchMachines,
    fetchOperators,
    getLocationAndMachineCounts,
    fetchCurrentLocation,
} from '../actions'
import * as SplashScreen from 'expo-splash-screen'
import {
    ActivityIndicator
} from '../components'

const AppWrapper = ({
    children,
    getRegions,
    getLocationTypes,
    getMachines,
    getOperators,
    getLocationAndMachineCounts,
    getCurrentLocation
}) => {
    const [loading, setIsLoading] = useState(true)

    const loaded = async () => {
        await SplashScreen.hideAsync()
        setIsLoading(false)
    }

    useEffect(() => {
        async function isLoading() {
            await Promise.all([
                getRegions('/regions.json'),
                getLocationTypes('/location_types.json'),
                getMachines('/machines.json'),
                getOperators('/operators.json'),
                getLocationAndMachineCounts('/regions/location_and_machine_counts.json'),
                getCurrentLocation()
            ]).then(loaded)
                .catch(loaded)
        }

        isLoading()
    }, [])

    if (loading) return <ActivityIndicator />

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
