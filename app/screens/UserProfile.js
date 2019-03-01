import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActivityIndicator, View, StyleSheet, ScrollView } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { HeaderBackButton } from 'react-navigation'
import { Button, ListItem } from 'react-native-elements'
import { ConfirmationModal, NotLoggedIn, PbmButton, WarningButton, Text } from '../components'
import { getData } from '../config/request'
import { logout } from '../actions'

const moment = require('moment')

class UserProfile extends Component {
    state = {
        modalVisible: false,
        fetchingUserInfo: this.props.user.loggedIn ? true : false,
        profile_info: {},
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} />,
            title: 'Profile',
            headerStyle: {
                backgroundColor:'#f5fbff',                
            },
            headerTintColor: '#4b5862'
        }
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible})
    }

    componentDidMount() {
        const id = this.props.user.id
        if (id) {
            getData(`/users/${id}/profile_info.json`)
                .then(data => {
                    this.setState({
                        fetchingUserInfo: false,
                        profile_info: data.profile_info,
                    })
                })
        }
    }

    render(){
        if (this.state.fetchingUserInfo)
            return <ActivityIndicator />

        const { user } = this.props
        const profileInfo = this.state.profile_info

        return (
            <View>
                <ConfirmationModal visible={this.state.modalVisible} >
                    <PbmButton
                        title={"Really Logout?"}
                        onPress={() => {
                            this.setModalVisible(false)
                            this.props.logout()
                            this.props.navigation.navigate('Login')
                        }}
                        accessibilityLabel="Logout"
                    />
                    <WarningButton
                        title={"Stay Logged In"}
                        onPress={() => this.setModalVisible(false)}
                        accessibilityLabel="Stay Loggin In"
                    />
                </ConfirmationModal>

                {user.loggedIn ?
                    <ScrollView style={{backgroundColor:'#f5fbff'}}>
                        <Text style={s.username}>{user.username}</Text>
                        <Text style={s.member}>{`Member since: ${moment(profileInfo.created_at).format('MMM-DD-YYYY')}`}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={s.stat}>Machines Added:</Text>
                            <Text style={s.statNum}>{` ${profileInfo.num_machines_added} `}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={s.stat}>Machines Removed:</Text>
                            <Text style={s.statNum}>{` ${profileInfo.num_machines_removed} `}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={s.stat}>Machines Comments:</Text>
                            <Text style={s.statNum}>{` ${profileInfo.num_lmx_comments_left} `}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={s.stat}>Locations Submitted:</Text>
                            <Text style={s.statNum}>{` ${profileInfo.num_locations_suggested} `}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={s.stat}>Locations Edited:</Text>
                            <Text style={s.statNum}>{` ${profileInfo.num_locations_edited} `}</Text>
                        </View>
                        <Button 
                            title={'Saved Locations'}
                            onPress={() => this.props.navigation.navigate('Saved')}
                            buttonStyle={s.savedLink}
                            titleStyle={{
                                color:"#000e18", 
                                fontSize:16
                            }}
                            iconLeft
                            icon={<FontAwesome name='heart-o' style={s.savedIcon} />}
                            containerStyle={s.margin15}
                        />
                        <Text style={s.bold}>Locations Edited:</Text>
                        <View style={{backgroundColor:'#ffffff',paddingTop:0,paddingBottom:0,marginBottom:8,marginTop:8}}>
                            {profileInfo.profile_list_of_edited_locations.slice(0, 50).map(location => {
                                return <ListItem
                                    key={location[0]}
                                    titleStyle={{marginLeft:15,marginRight:15,fontSize:16,marginBottom:-8,marginTop:-8}}
                                    title={location[1]}
                                    onPress={() => this.props.navigation.navigate('LocationDetails', { id: location[0], locationName: location[1] })}
                                /> 
                            })}
                        </View>
                        <Text style={s.bold}>High Scores:</Text>
                        <View style={{backgroundColor:'#ffffff',paddingTop:0,paddingBottom:15}}>
                            {profileInfo.profile_list_of_high_scores.map((score, idx) => {
                                return <ListItem
                                    key={`${score[0]}-${score[1]}-${score[2]}-${score[3]}-${idx}`}
                                    titleStyle={{marginLeft:15,marginRight:15,fontSize:16,marginBottom:-15}}
                                    title={`${score[2]} on ${score[1]} at ${score[0]} on ${score[3]}`}
                                /> 
                            })}
                        </View>
                        <WarningButton
                            title={"Logout"} 
                            onPress={() => this.setModalVisible(true)}
                            accessibilityLabel="Logout"
                        /> 
                    </ScrollView> :
                    <NotLoggedIn 
                        text={`Hi, you're not logged in, so you don't have a profile!`}
                        title={'User Profile'}
                        onPress={() => this.props.navigation.navigate('Login')}
                    />
                }                      
            </View>
        )
    }
}

const s = StyleSheet.create({
    bold: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        color: "#000e18",
        backgroundColor: "#D3ECFF"
    },
    savedIcon: {
        fontSize: 24
    },
    savedLink: {
        backgroundColor:'#f5fbff',
        borderWidth: 1,
        borderColor: '#97a5af',
        borderRadius: 5,
        elevation: 0
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
    username: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        padding: 10,
        color: "#f5fbff",
        backgroundColor: "#6a7d8a",
        textAlign: "center"
    },
    stat: {
        marginTop: 5,
        marginLeft: 30,
        fontSize: 16,
        color: "#4b5862",
        width: 200
    },
    statNum: {
        fontWeight: "bold",
        color: "#000e18",
        backgroundColor: "#D3ECFF",
        fontSize: 16,
        marginTop: 5,
        marginLeft: 10
    },
    member: {
        textAlign:"center",
        marginBottom:10,
        fontWeight:"bold",
        fontSize: 16,
        marginTop: 5
    },
})

UserProfile.propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ user }) => ({ user })
const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)

