import React, { Component } from 'react'
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

const moment = require('moment')

class RecentActivity extends Component {
    state = {
        fetchingRecentActivity: true,
        recentActivity: [],
    }

    getIcon(type) {
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

    getText(selectedActivity) {
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

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => <FilterRecentActivity />,
        })
        //The listener will refetch recent activity data every time this screen is navigated to
        this.focusListener = this.props.navigation.addListener('focus', () => {
            const { curLat, curLon } = this.props.query
            getData(`/user_submissions/list_within_range.json?lat=${curLat};lon=${curLon}`)
                .then(data => {
                    this.setState({
                        fetchingRecentActivity: false,
                        recentActivity: data.user_submissions,
                    })
                })
        })
    }


    render() {
        const { recentActivity, fetchingRecentActivity } = this.state
        const { selectedActivity } = this.props.query

        return (
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <Screen>
                            <View style={s.header}>
                                <Text style={[s.title, s.headerText]}>30 miles, 30 days</Text>
                            </View>
                            {selectedActivity ?
                                <View style={s.filterView}>
                                    <Text style={s.filter}>{this.getText(selectedActivity)}</Text>
                                    <MaterialCommunityIcons
                                        name='close-circle'
                                        size={24}
                                        onPress={() => this.props.clearActivityFilter()}
                                        style={s.xButton}
                                    />
                                </View> : null
                            }
                            {fetchingRecentActivity ?
                                <ActivityIndicator /> :
                                recentActivity.length === 0 ?
                                    <Text style={s.problem}>{`No map edits in the last 30 days within 30 miles of the map's current location`}</Text> :
                                    recentActivity.filter(activity => {
                                        const submissionTypeIcon = this.getIcon(activity.submission_type)
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
                                            onPress={() => this.props.navigation.navigate('LocationDetails', { id: activity.location_id })}
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
                }}
            </ThemeContext.Consumer>
        )
    }
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
    }
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

