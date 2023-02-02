import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native'
import { ThemeContext } from '../theme-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ActivityIndicator } from '.'
import { Text } from '.'
import { getData } from '../config/request'
const moment = require('moment')

let deviceWidth = Dimensions.get('window').width

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

    const getIcon = (type) =>  {
        switch (type) {
            case 'new_lmx':
                return <MaterialCommunityIcons name='plus-box' size={28} color='#58a467' />
            case 'new_condition':
                return <MaterialCommunityIcons name='comment-text' size={28} color='#6cbffe' />
            case 'remove_machine':
                return <MaterialCommunityIcons name='minus-box' size={28} color='#f56f79' />
            case 'new_msx':
                return <MaterialCommunityIcons name='numeric' size={28} color='#eeb152' />
            case 'confirm_location':
                return <MaterialCommunityIcons name='clipboard-check' size={28} color='#d473df' />
            default:
                return null
        }
    }

    return (
        <>
            <Modal
                visible={locationActivityModalOpen}
                onRequestClose={() => { }}
            >
                <ScrollView>
                    {locationActivityLoading ?
                        <ActivityIndicator /> :
                        recentActivity.length === 0 ?
                            <Text style={s.problem}>{`No map edits in the last 30 days within 30 miles of the map's current location`}</Text> :
                            recentActivity.map(activity => (
                                <Pressable
                                    key={activity.id}
                                    onPress={() => {}}
                                >
                                    {({ pressed }) => (
                                        <View style={[s.list, s.flexi, pressed ? s.pressed : s.notPressed]}>
                                            <View style={{ width: '15%' }}>
                                                {getIcon(activity.submission_type)}
                                            </View>
                                            <View style={{ width: '85%' }}>
                                                <Text style={s.pbmText}>
                                                    {activity.submission}
                                                </Text>
                                                <Text style={s.subtitleStyle}>
                                                    {`${moment(activity.updated_at).format('LL')}`}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </Pressable>
                            ))
                    }
                </ScrollView>
            </Modal>
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
    activityButton: {
        right: 60,
    },
    quickButton: {
        borderWidth: 1,
        borderColor: theme.pink2,
        position: 'absolute',
        padding: 10,
        zIndex: 10,
        borderRadius: 18,
        height: 36,
        width: 36,
        alignSelf: 'center',
        justifyContent: 'center',
        top: deviceWidth < 325 ? 80 : 120,
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
    header: {
        paddingVertical: 10,
    },
    headerText: {
        textAlign: "center",
        color: theme.text3
    },
    title: {
        fontSize: 16,
        fontFamily: 'regularItalicFont',
        color: theme.text2
    },
    subtitleStyle: {
        paddingTop: 3,
        fontSize: 14,
        color: theme.text3
    },
    filterView: {
        backgroundColor: theme.base3,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    filter: {
        fontSize: 14,
        textAlign: "center",
        color: theme.text,
        fontFamily: 'boldFont',
        paddingVertical: 8,
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
    xButton: {
        color: theme.red2,
        marginLeft: 8,
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