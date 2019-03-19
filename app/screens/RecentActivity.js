import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActivityIndicator, Text, View, ScrollView, StyleSheet } from 'react-native'
import { ListItem } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { MaterialIcons } from '@expo/vector-icons'
import { getData } from '../config/request'
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
            headerTintColor: '#4b5862'
        }
    }

    getIcon(type) {
        switch(type) {
        case 'new_lmx':
        case 'contact_us':
        case 'new_condition':
        case 'remove_machine':
        case 'suggest_location':
        case 'new_msx':
        case 'confirm_location':
        case 'delete_location':
            return <MaterialIcons name='search' size={28} />

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

        return(
            <ScrollView style={{backgroundColor:'#f5fbff'}}>
                <View>
                    <Text style={s.title}>Recent Nearby Activity</Text>
                    <Text style={s.paren}>(5 miles, 30 days)</Text>
                </View>
                {fetchingRecentActivity ? 
                    <ActivityIndicator /> :
                    !locationTrackingServicesEnabled ? 
                        <Text style={s.problem}>Enable location services to view recent nearby activity</Text> :
                        recentActivity.length === 0 ?
                            <Text style={s.problem}>No recent activity</Text> :
                            recentActivity.map(activity => {
                                const submissionTypeIcon = this.getIcon(activity.submission_type)
                                return (                               
                                    <View key={activity.id}>
                                        <ListItem
                                            title={activity.submission}
                                            titleStyle={{color:'#000e18'}}
                                            subtitleStyle={{paddingTop:3,fontSize:14,color:'#6a7d8a'}}
                                            subtitle={`${moment(activity.updated_at).format('LL')}`}
                                            containerStyle={s.list}
                                            leftAvatar={submissionTypeIcon}
                                        />
                                    </View>
                                )})
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
    user: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps, null)(RecentActivity)

