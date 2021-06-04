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
    HeaderBackButton,
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

    static navigationOptions = ({ navigation, theme }) => {
        return {
            headerLeft: () => <HeaderBackButton navigation={navigation} />,
            title: 'Recent Nearby Activity',
            headerRight: () => <FilterRecentActivity />,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fffbf5',
                borderBottomWidth: 0,
                elevation: 0,
                shadowColor: 'transparent'
            },
            headerTitleStyle: {
                textAlign: 'center',
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
        }
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
        //The listener will refetch recent activity data every time this screen is navigated to
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
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
                                                <View style={[s.list,s.flexi,pressed ? s.pressed : s.notPressed]}>
                                                    <View style={{width: '15%'}}>
                                                        {activity.submissionTypeIcon}
                                                    </View>
                                                    <View style={{width: '85%'}}>
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
        fontSize: 16
    },
    header: {
        backgroundColor: theme.blue1,
        paddingVertical: 10,
        marginBottom: 10
    },
    headerText: {
        textAlign: "center",
        color: theme.orange8
    },
    title: {
        fontSize: 16,
        fontStyle: "italic",
        color: theme.orange7
    },
    subtitleStyle: {
        paddingTop: 3,
        fontSize: 14,
        color: theme.orange7
    },
    filterView: {
        backgroundColor: theme.indigo1,
        marginTop: -10,
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
        fontWeight: 'bold',
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
        fontWeight: 'bold',
        marginTop: 20
    },
    xButton: {
        color: theme.red2,
        marginLeft: 8,
    },
    pressed: {
        borderColor: theme.blue1,
        borderWidth: 1,
        shadowColor: 'transparent',
        opacity: 0.8
    },
    notPressed: {
        borderColor: 'transparent',
        borderWidth: 0,
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

