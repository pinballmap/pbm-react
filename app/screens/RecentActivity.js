import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { ListItem } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
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

    componentDidMount() {
        const { locationTrackingServicesEnabled, lat, lon } = this.props.user
        //The listener will refetch recent activity data every time this screen is navigated to
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            if (locationTrackingServicesEnabled) {
                getData(`/user_submissions/list_within_range.json?lat=${lat};lon=${lon}`)
                    .then(data => {
                        console.log(data)
                        this.setState({
                            fetchingRecentActivity: false,
                            recentActivity: data.user_submissions,
                        })
                    })
            }
        })
    }
      

    render(){
        const { recentActivity } = this.state
        const { locationTrackingServicesEnabled } = this.props.user

        return(
            <View>
                {!locationTrackingServicesEnabled ? 
                    <Text>Enable location tracking to view recent nearby activity</Text> :
                    recentActivity.length === 0 ?
                        <Text>No recent activity</Text> :
                        recentActivity.map(activity => {
                            return (
                                <View key={activity.id}>
                                    <View
                                        style={{
                                            borderBottomColor: '#D3ECFF',
                                            borderBottomWidth: 1,
                                        }}
                                    />
                                    <ListItem
                                        title={activity.submission}
                                        subtitle={`Updated At: ${moment(activity.updated_at).format('LL')}`}
                                    />
                                </View>
                            )})
                }
            </View>
        )
    }
}

RecentActivity.propTypes = {
    user: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps, null)(RecentActivity)

