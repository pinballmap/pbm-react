import React, { useContext, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import { ThemeContext } from '../theme-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getData } from '../config/request'
import {
    ActivityIndicator,
    FilterRecentActivity,
    Screen,
    Text,
} from '../components'
import { clearActivityFilter } from '../actions'
import { useFocusEffect } from '@react-navigation/native'
import {ButtonGroup} from '@rneui/base'

const moment = require('moment')

const RecentActivity = ({query, clearActivityFilter, navigation}) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)
    const [fetchingRecentActivity, setFetchingRecentActivity] = useState(true)
    const [recentActivity, setRecentActivity] = useState([])
    const [maxDistance, setMaxDistance] = useState(30)
    const [btnIdx, setBtnIdx] = useState(0)
    const {selectedActivity, curLat, curLon} = query

    useEffect(() => {
        navigation.setOptions({headerRight: () => <FilterRecentActivity />})
    }, [])

    useFocusEffect(
        useCallback(() => {
            setFetchingRecentActivity(true)
            getData(`/user_submissions/list_within_range.json?lat=${curLat};lon=${curLon};max_distance=${maxDistance}`)
                .then(data => {
                    setFetchingRecentActivity(false)
                    setRecentActivity(data.user_submissions)
                })
        }, [curLat, curLon, maxDistance])
    )

    const updateIdx = (selectedIdx) => {
        const distanceMap = [30, 75, 150]
        setBtnIdx(selectedIdx)
        setMaxDistance(distanceMap[selectedIdx])
    }

    const getIcon= (type) => {
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

    const getText = (selectedActivity) => {
        const activity = 'Filtering by recently'
        switch (selectedActivity) {
            case 'new_lmx':
                return `${activity} added machines`
            case 'new_condition':
                return `${activity} added conditions`
            case 'remove_machine':
                return `${activity} removed machines`
            case 'new_msx':
                return `${activity} added scores`
            case 'confirm_location':
                return `${activity} confirmed locations`
        }
    }

    return (
        <Screen>
            <View style={s.header}>
                <Text style={[s.title, s.headerText]}>Past 30 days</Text>
                <View style={s.header}>
                    <ButtonGroup
                        onPress={updateIdx}
                        selectedIndex={btnIdx}
                        buttons={['30 mi', '75 mi', '150 mi']}
                        containerStyle={s.buttonGroupContainer}
                        textStyle={s.buttonGroupInactive}
                        selectedButtonStyle={s.selButtonStyle}
                        selectedTextStyle={s.selTextStyle}
                        innerBorderStyle={s.innerBorderStyle}
                    />
                </View>
            </View>
            {selectedActivity ?
                <View style={s.filterView}>
                    <Text style={s.filter}>{getText(selectedActivity)}</Text>
                    <MaterialCommunityIcons
                        name='close-circle'
                        size={24}
                        onPress={() => clearActivityFilter()}
                        style={s.xButton}
                    />
                </View> : null
            }
            {fetchingRecentActivity ?
                <ActivityIndicator /> :
                recentActivity.length === 0 ?
                    <Text style={s.problem}>{`No map edits in the last 30 days within ${maxDistance} miles of the map's current location`}</Text> :
                    recentActivity.filter(activity => {
                        const submissionTypeIcon = getIcon(activity.submission_type)
                        const showType = selectedActivity ?
                            selectedActivity === activity.submission_type ? true : false
                            : true

                        if (submissionTypeIcon && showType) {
                            activity.submissionTypeIcon = submissionTypeIcon
                            return activity
                        }
                    }).map(activity => (
                        <Pressable
                            key={activity.id}
                            onPress={() => navigation.navigate('LocationDetails', { id: activity.location_id })}
                        >
                            {({ pressed }) => (
                                <View style={[s.list, s.flexi, pressed ? s.pressed : s.notPressed]}>
                                    <View style={{ width: '15%' }}>
                                        {activity.submissionTypeIcon}
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
        </Screen>
    )
}

const getStyles = theme => StyleSheet.create({
    pbmText: {
        color: theme.text,
        fontSize: 16,
        fontFamily: 'regularFont'
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
        fontSize: 16,
        color: theme.text3,
        fontFamily: 'regularBoldFont'
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
    },
    buttonGroupContainer: {
        height: 40,
        borderWidth: 0,
        borderRadius: 25,
        backgroundColor: theme.base3,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'visible'
    },
    buttonGroupInactive: {
        color: theme.text2,
        fontSize: 14,
        fontFamily: "mediumFont"
    },
    innerBorderStyle: {
        width: 0,
    },
    selButtonStyle: {
        borderWidth: 4,
        borderColor: theme.base4,
        backgroundColor: theme.white,
        borderRadius: 25
    },
    selTextStyle: {
        color: theme.text2,
        fontFamily: 'boldFont',
    },
})

RecentActivity.propTypes = {
    query: PropTypes.object,
    user: PropTypes.object,
    navigation: PropTypes.object,
    clearActivityFilter: PropTypes.func,
}

const mapStateToProps = ({ query }) => ({ query })
const mapDispatchToProps = (dispatch) => ({
    clearActivityFilter: () => dispatch(clearActivityFilter())
})
export default connect(mapStateToProps, mapDispatchToProps)(RecentActivity)

