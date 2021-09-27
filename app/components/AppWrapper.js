import React, {useEffect} from "react"
import PropTypes from 'prop-types'
import * as SplashScreen from "expo-splash-screen"
import {connect} from "react-redux"

const AppWrapper = ({ appLoading, children}) => {
    useEffect(() => {
        async function isLoading() {
            if (!appLoading) {
                await SplashScreen.hideAsync()
            }
        }

        isLoading()
    }, [appLoading])

    return (
        <>
            {children}
        </>
    )
}

AppWrapper.propTypes = {
    appLoading: PropTypes.bool,
    children: PropTypes.node,
}

const mapStateToProps = ({ app }) => ({ appLoading: app.appLoading })
export default connect(mapStateToProps)(AppWrapper)
