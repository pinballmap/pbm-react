import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native'
import { ThemeContext } from '../theme-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ActivityIndicator, Text, ConfirmationModal } from '.'
import { getData } from '../config/request'
import {formatNumWithCommas} from '../utils/utilityFunctions'
import {getIcon} from "../screens/RecentActivity"
const moment = require('moment')

const LocationActivity = ({
    locationId,
}) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)
    const [locationActivityModalOpen, setLocationActivityModalOpen] = useState(false)
    const [locationActivityLoading, setLocationActivityLoading] = useState(true)
    const [recentActivity, setRecentActivity] = useState([])

    useEffect(() => {
        if (locationActivityModalOpen) {
            setLocationActivityLoading(true)
            getData(`/user_submissions/location.json?id=${locationId}`)
                .then(data => {
                    setLocationActivityLoading(false)
                    setRecentActivity(data.user_submissions)
                })
        }
    }, [locationActivityModalOpen])

    const getText = (activity) => {
        const {submission_type, submission, high_score, machine_name, user_name, comment} = activity
        const userNameStr = user_name ? ` - ${user_name}` : ''
        switch (submission_type) {
            case 'new_lmx': {
                return `${machine_name} added${userNameStr}`
            }
            case 'new_condition': {
                if (!comment) return submission
                return `${comment} - ${machine_name}${userNameStr}`
            }
            case 'remove_machine': {
                return `${machine_name} removed${userNameStr}`
            }
            case 'new_msx': {
                if (!high_score) return submission
                return `${formatNumWithCommas(high_score)} on ${machine_name}${userNameStr}`
            }
            case 'confirm_location': {
                return `${user_name} confirmed the line-up`
            }
            default:
                return null
        }
    }

    return (
        <>
            <ConfirmationModal
                visible={locationActivityModalOpen}
                onRequestClose={() => { }}
                wide
            >
                <>
                    <View style={s.header}>
                        <Text style={s.title}>Location Activity</Text>
                        <MaterialCommunityIcons
                            name='close-circle'
                            size={45}
                            onPress={() => setLocationActivityModalOpen(false)}
                            style={s.xButton}
                        />
                    </View>
                    <ScrollView style={{height: "80%"}}>
                        {locationActivityLoading ?
                            <ActivityIndicator /> :
                            recentActivity.length === 0 ?
                                <Text style={s.problem}>No location activity found</Text> :
                                recentActivity.map(activity => (
                                    <View key={activity.id} style={[s.list, s.flexi]}>
                                        <View style={{ width: '15%' }}>
                                            {getIcon(activity.submission_type)}
                                        </View>
                                        <View style={{ width: '85%' }}>
                                            <Text style={s.pbmText}>
                                                {getText(activity)}
                                            </Text>
                                            <Text style={s.subtitleStyle}>
                                                {`${moment(activity.updated_at).format('LL')}`}
                                            </Text>
                                        </View>
                                    </View>
                                )
                                )
                        }
                    </ScrollView>
                </>
            </ConfirmationModal>
            <Pressable
                style={({ pressed }) => [s.activity, s.quickButton, pressed ? s.quickButtonPressed : s.quickButtonNotPressed]}
                onPress={() =>  setLocationActivityModalOpen(true)}
            >
                <MaterialCommunityIcons
                    name='newspaper-variant-outline'
                    color={theme.text2}
                    size={24}
                    style={{ height: 24, width: 24, justifyContent: 'center', alignSelf: 'center' }}
                />
            </Pressable>
        </>
    )}

LocationActivity.propTypes = {
    loggedIn: PropTypes.bool,
    isUserFave: PropTypes.bool,
    locationId: PropTypes.number,
    addFavoriteLocation: PropTypes.func,
    removeFavoriteLocation: PropTypes.func,
    style: PropTypes.object,
    removeFavorite: PropTypes.func,
}

const getStyles = theme =>StyleSheet.create({
    header: {
        backgroundColor: theme.base4,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: -25,
        height: 40,
        justifyContent: 'center'
    },
    title: {
        color: theme.text,
        textAlign: "center",
        fontSize: 18,
        fontFamily: 'extraBoldFont',
    },
    xButton: {
        position: 'absolute',
        right: -20,
        top: -20,
        color: theme.red2,
    },
    activityButton: {
        right: 60,
    },
    quickButton: {
        borderWidth: 1,
        borderColor: theme.pink2,
        padding: 10,
        marginHorizontal: 4,
        zIndex: 10,
        borderRadius: 18,
        height: 36,
        width: 36,
        alignSelf: 'center',
        justifyContent: 'center',
        shadowColor: theme.darkShadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        backgroundColor: theme.white
    },
    pbmText: {
        color: theme.text,
        fontSize: 16
    },
    subtitleStyle: {
        paddingTop: 3,
        fontSize: 14,
        color: theme.text3
    },
    flexi: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'space-around',
    },
    list: {
        padding: 10,
        borderRadius: 15,
        marginVertical: 8,
        marginHorizontal: 20,
        borderWidth: 0,
        backgroundColor: theme.white,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
    },
    problem: {
        textAlign: "center",
        color: theme.text,
        fontFamily: 'boldFont',
        marginTop: 20
    },
    pressed: {
        borderColor: theme.pink2,
        borderWidth: 2,
        shadowColor: 'transparent',
        opacity: 0.8,
    },
    notPressed: {
        borderColor: 'transparent',
        borderWidth: 2,
        shadowColor: theme.shadow,
        opacity: 1.0
    }
})

export default LocationActivity