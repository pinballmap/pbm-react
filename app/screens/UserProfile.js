import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActivityIndicator, Modal, Text, View, StyleSheet, ScrollView } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { HeaderBackButton } from 'react-navigation'
import { Button, ListItem } from 'react-native-elements'
import { getData } from '../config/request'
import { logout } from '../actions/user_actions'

const moment = require('moment')

class UserProfile extends Component {
    state = {
        modalVisible: false,
        fetchingUserInfo: this.props.user.loggedIn ? true : false,
        profile_info: {},
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} title="Map" />,
            title: 'Profile',
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
        console.log(this.state)

        return(
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={()=>{}}
                >
                    <View style={{marginTop: 100}}>
                        <View>
                            <Button
                                title={"Really Logout?"}
                                onPress={() => {
                                    this.setModalVisible(false)
                                    this.props.logout()
                                    this.props.navigation.navigate('Login')
                                }}
                                accessibilityLabel="Logout"
                                raised
                                buttonStyle={s.blueButton}
                                titleStyle={{fontSize:18,color:"black"}}
                                style={{borderRadius: 50}}
                                containerStyle={{borderRadius:50,marginTop:10,marginBottom:15,marginLeft:15,marginRight:15}}
                            />
                            <Button
                                title={"Nevermind. Stay Logged In"}
                                onPress={() => this.setModalVisible(false)}
                                accessibilityLabel="Stay Loggin In"
                                raised
                                buttonStyle={s.pinkButton}
                                titleStyle={{
                                    color:'#f53240', 
                                    fontSize:18
                                }}
                                style={{borderRadius: 50}}
                                containerStyle={{borderRadius:50,marginLeft:15,marginRight:15}}
                            />
                        </View>
                    </View>
                </Modal>

                {user.loggedIn ?
                    <ScrollView style={{backgroundColor:'#ffffff'}}>
                        <Text style={s.username}>{user.username}</Text>
                        <Text style={s.member}>{`Member since: ${moment(profileInfo.created_at).format('MMM-DD-YYYY')}`}</Text>
                        <Text style={s.stat}>{`Machines Added: ${profileInfo.num_machines_added}`}</Text>
                        <Text style={s.stat}>{`Machines Removed: ${profileInfo.num_machines_removed}`}</Text>
                        <Text style={s.stat}>{`Machines Comments: ${profileInfo.num_lmx_comments_left}`}</Text>
                        <Text style={s.stat}>{`Locations Submitted: ${profileInfo.num_locations_suggested}`}</Text>
                        <Text style={s.stat}>{`Locations Edited: ${profileInfo.num_locations_edited}`}</Text>
                        <Button 
                            title={'Saved Locations'}
                            onPress={() => this.props.navigation.navigate('Saved')}
                            buttonStyle={s.savedLink}
                            titleStyle={{
                                color:"black", 
                                fontSize:16
                            }}
                            iconLeft
                            icon={<FontAwesome name='heart-o' style={s.savedIcon} />}
                            containerStyle={s.margin15}
                        />
                        <Text style={s.bold}>Locations Edited:</Text>
                        <View style={{backgroundColor:'#ffffff',paddingTop:0,paddingBottom:15}}>
                            {profileInfo.profile_list_of_edited_locations.slice(0, 50).map(location => {
                                return <ListItem
                                    key={location[0]}
                                    titleStyle={{marginLeft:15,marginRight:15,fontSize:16,marginBottom:-15}}
                                    title={location[1]}
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
                        <Button
                            title={"Logout"} 
                            onPress={() => this.setModalVisible(true)}
                            accessibilityLabel="Logout"
                            raised
                            buttonStyle={s.pinkButton}
                            titleStyle={{fontSize:18,color:'#f53240'}}
                            style={{borderRadius: 50}}
                            containerStyle={{borderRadius:50,marginLeft:15,marginRight:15,marginTop:10,marginBottom:20}}
                        /> 
                    </ScrollView> :
                    <View>
                        <Text style={s.pageTitle}>User Profile</Text>
                        <Text style={s.hiya}>{`Hi, you're not logged in, so you don't have a profile!`}</Text>
                        <Button
                            title={"Login"} 
                            onPress={() => this.props.navigation.navigate("SignupLogin")}
                            accessibilityLabel="Login"
                            raised
                            buttonStyle={s.blueButton}
                            titleStyle={s.titleStyle}
                            style={{borderRadius: 50}}
                            containerStyle={{borderRadius:50,marginTop:15,marginLeft:15,marginRight:15}}
                        />
                    </View>
                }
                        
            </View>
        )
    }
}

const s = StyleSheet.create({
    pinkButton: {
        backgroundColor:"#fdd4d7",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    blueButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    pageTitle: {
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
        paddingBottom: 15,
        paddingTop: 10
    },
    hiya: {
        fontStyle: 'italic',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        color: '#444444',
        textAlign: 'center'
    },
    titleStyle: {
        color:"black",
        fontSize:18
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        color: "#260204",
        backgroundColor: "#D3ECFF"
    },
    savedIcon: {
        fontSize: 24
    },
    savedLink: {
        backgroundColor:'rgba(38,2,4,.1)',
        borderWidth: 1,
        borderColor: '#888888',
        borderRadius: 5,
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
        backgroundColor: "#260204",
        textAlign: "center"
    },
    stat: {
        marginTop: 5,
        marginLeft: 30,
        fontSize: 16
    },
    member: {
        textAlign:"center",
        marginBottom:10,
        fontWeight:"bold",
        fontSize: 16,
        marginTop: 5
    }
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

