import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActivityIndicator, Text, View, ScrollView, StyleSheet } from 'react-native'
import { ListItem } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getData } from '../config/request'
import { FilterRecentActivity } from '../components'
import { clearActivityFilter } from '../actions'
const moment = require('moment')

class RecentActivity extends Component {
    state = {
        fetchingRecentActivity: this.props.user.locationTrackingServicesEnabled ? true : false,
        recentActivity: [],
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} />,
            title: 'Activity',
            headerStyle: {
                backgroundColor:'#f5fbff',          
            },
            headerTintColor: '#4b5862',
            headerRight: <FilterRecentActivity />
        }
    }

    getIcon(type) {
        switch(type) {
        case 'new_lmx':
            return <MaterialCommunityIcons name='plus-box' size={28} color='#4e7b57' />
        case 'new_condition':
            return <MaterialCommunityIcons name='comment-text' size={28} color='#458284' />
        case 'remove_machine':
            return <MaterialCommunityIcons name='minus-box' size={28} color='#854444' />
        case 'new_msx':
            return <MaterialCommunityIcons name='numeric' size={28} color='#986c31' />
        case 'confirm_location':
            return <MaterialCommunityIcons name='clipboard-check' size={28} color='#7a4f71' />
        default:
            return null
        }
    }

    getText(selectedActivity) {
        const activity = 'Viewing recently'
        switch(selectedActivity) {
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
        const { locationTrackingServicesEnabled, lat, lon } = this.props.user
        //The listener will refetch recent activity data every time this screen is navigated to
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            if (locationTrackingServicesEnabled) {
                getData(`/user_submissions/list_within_range.json?lat=${lat};lon=${lon}`)
                    .then(data => {
                        this.setState({
                            fetchingRecentActivity: false,
                            recentActivity: data.user_submissions.reverse(),
                        })
                    })
            }
        })
    }
      

    render(){
        const { recentActivity, fetchingRecentActivity } = this.state
        const { locationTrackingServicesEnabled } = this.props.user
        const { selectedActivity } = this.props.query

        return(
            <ScrollView style={{backgroundColor:'#f5fbff'}}>
                <View>
                    {selectedActivity ? 
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text>{this.getText(selectedActivity)}</Text>
                            <MaterialCommunityIcons name='close-circle' size={28} onPress={() => this.props.clearActivityFilter()}/>
                        </View> : 
                        <Text style={s.title}>Recent Nearby Activity</Text> 
                    }
                    <Text style={s.paren}>(5 miles, 30 days)</Text>
                </View>
                {fetchingRecentActivity ? 
                    <ActivityIndicator /> :
                    !locationTrackingServicesEnabled ? 
                        <Text style={s.problem}>Enable location services to view recent nearby activity</Text> :
                        recentActivity.length === 0 ?
                            <Text style={s.problem}>No recent activity</Text> :
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
                                <View key={activity.id}>
                                    <ListItem
                                        title={activity.submission}
                                        titleStyle={{color:'#000e18'}}
                                        subtitleStyle={{paddingTop:3,fontSize:14,color:'#6a7d8a'}}
                                        subtitle={`${moment(activity.updated_at).format('LL')}`}
                                        containerStyle={s.list}
                                        leftAvatar={activity.submissionTypeIcon}
                                    />
                                </View>
                            ))
                }
            </ScrollView>
        )
    }
}

const s = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 10,
        color: "#f5fbff",
        backgroundColor: "#6a7d8a",
        textAlign: "center"
    },
    paren: {
        fontSize: 12,
        paddingBottom: 10,
        color: "#f5fbff",
        backgroundColor: "#6a7d8a",
        textAlign: "center",
        fontStyle: "italic"
    },
    list: {
        borderRadius: 5,
        borderWidth: 3,
        borderColor: '#D3ECFF',
        padding: 8,
        margin: 5
    },
    problem: {
        textAlign: "center",
        color: '#000e18',
        fontWeight: 'bold',
        marginTop: 20
    }
})

RecentActivity.propTypes = {
    query: PropTypes.object,
    user: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ query, user }) => ({ query, user })
const mapDispatchToProps = (dispatch) => ({
    clearActivityFilter: () => dispatch(clearActivityFilter())
})
export default connect(mapStateToProps, mapDispatchToProps)(RecentActivity)

