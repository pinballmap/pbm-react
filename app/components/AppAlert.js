import React, { useContext, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    AsyncStorage,
    StyleSheet,
    View
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import ConfirmationModal from './ConfirmationModal'
import { ThemeContext } from '../theme-context'
import { retrieveItem } from '../config/utils'
import Text from './PbmText'

const AppAlert = ({ motd }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const [visible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!motd) return

        retrieveItem('appAlert').then(appAlert => {
            if (appAlert !== motd) {
                setIsVisible(true)
                AsyncStorage.setItem('appAlert', JSON.stringify(motd))
            }
        })
    }, [motd])

    return (
        <ConfirmationModal
            visible={visible}>
            <View style={s.appAlertHeader}>
                <Text style={s.appAlertTitle}>Message of the Day!</Text>
                <MaterialCommunityIcons
                    name='close-circle'
                    size={45}
                    onPress={() => setIsVisible(false)}
                    style={s.xButton}
                />
            </View>
            <View style={s.appAlert}>
                <Text style={{fontSize: 16}}>{motd}</Text>
            </View>
        </ConfirmationModal>
    )
}

AppAlert.propTypes = {
    motd: PropTypes.string,
}

const getStyles = (theme) => StyleSheet.create({
    appAlertTitle: {
        color: theme.text3,
        textAlign: "center",
        fontSize: 18,
        fontFamily: 'boldFont',
    },
    appAlertHeader: {
        backgroundColor: theme.blue1,
        marginTop: -25,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 40,
        paddingVertical: 10,
    },
    appAlert: {
        padding: 10,
        paddingBottom: 0,
    },
    xButton: {
        position: 'absolute',
        right: -15,
        top: -15,
        color: theme.red2,
    },
})

const mapStateToProps = ({ regions }) => {
    const motd = regions.regions.length ? regions.regions.filter(region => region.id === 1)[0].motd : ''
    return {
        motd
    }
}
export default connect(mapStateToProps)(AppAlert)
