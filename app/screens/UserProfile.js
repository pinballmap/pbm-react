import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
    StyleSheet, 
    View, 
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { 
    Button, 
    ListItem,
    ThemeConsumer,
} from 'react-native-elements'
import { 
    ActivityIndicator,
    ConfirmationModal, 
    HeaderBackButton,
    NotLoggedIn, 
    PbmButton, 
    Screen,
    Text,
    WarningButton
} from '../components'
import { getData } from '../config/request'
import { logout } from '../actions'

const moment = require('moment')

class UserProfile extends Component {
    state = {
        modalVisible: false,
        fetchingUserInfo: this.props.user.loggedIn ? true : false,
        profile_info: {},
    }

    static navigationOptions = ({ navigation, theme }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Profile',
            headerRight:<View style={{padding:6}}></View>,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#2a211c' : '#f5fbff',
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',           
        }
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible})
    }

    componentDidMount() {
        //The listener will refetch user profile data every time the profile screen is navigated to
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
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
        })
    }
      
    render(){
        if (this.state.fetchingUserInfo)
            return (
                <ActivityIndicator />
            )
        const { user } = this.props
        const profileInfo = this.state.profile_info
        const { 
            profile_list_of_edited_locations = [], 
            profile_list_of_high_scores = [], 
            created_at, 
            num_machines_added, 
            num_machines_removed, 
            num_lmx_comments_left, 
            num_locations_suggested, 
            num_locations_edited 
        } = profileInfo

        return (
            <ThemeConsumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <Screen>
                            {!user.loggedIn ? 
                                <NotLoggedIn 
                                    text={`Hi, you're not logged in, so you don't have a profile!`}
                                    title={'User Profile'}
                                    onPress={() => this.props.navigation.navigate('Login')}
                                /> :
                                <View>
                                    <ConfirmationModal visible={this.state.modalVisible} >
                                        <PbmButton
                                            title={"Yes! Log Me Out"}
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
                                            accessibilityLabel="Stay LoggedIn"
                                        />
                                    </ConfirmationModal>
                                    <Text style={s.username}>{user.username}</Text>
                                    <Text style={s.member}>{`Member since: ${moment(created_at).format('MMM-DD-YYYY')}`}</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={s.stat}>Machines Added:</Text>
                                        <Text style={s.statNum}>{` ${num_machines_added} `}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={s.stat}>Machines Removed:</Text>
                                        <Text style={s.statNum}>{` ${num_machines_removed} `}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={s.stat}>Machines Comments:</Text>
                                        <Text style={s.statNum}>{` ${num_lmx_comments_left} `}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={s.stat}>Locations Submitted:</Text>
                                        <Text style={s.statNum}>{` ${num_locations_suggested} `}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={s.stat}>Locations Edited:</Text>
                                        <Text style={s.statNum}>{` ${num_locations_edited} `}</Text>
                                    </View>
                                    <Button 
                                        title={'Saved Locations'}
                                        onPress={() => this.props.navigation.navigate('Saved')}
                                        buttonStyle={s.savedLink}
                                        titleStyle={s.titleStyle}
                                        iconLeft
                                        icon={<FontAwesome name='heart-o' style={s.savedIcon} />}
                                        containerStyle={s.margin15}
                                    />
                                    <Text style={s.bold}>Locations Edited (up to 50):</Text>
                                    <View style={{paddingVertical:8}}>
                                        {profile_list_of_edited_locations.slice(0, 50).map(location => {
                                            return <ListItem
                                                containerStyle={s.background}
                                                key={location[0]}
                                                titleStyle={s.listTitleStyle}
                                                title={location[1]}
                                                onPress={() => this.props.navigation.navigate('LocationDetails', { id: location[0], locationName: location[1] })}
                                            /> 
                                        })}
                                    </View>
                                    <Text style={s.bold}>High Scores:</Text>
                                    <View style={{paddingTop:0,paddingBottom:15}}>
                                        {profile_list_of_high_scores.map((score, idx) => {
                                            return <ListItem
                                                containerStyle={s.background}
                                                key={`${score[0]}-${score[1]}-${score[2]}-${score[3]}-${idx}`}
                                                titleStyle={s.listTitleStyle}
                                                title={`${score[2]} on ${score[1]} at ${score[0]} on ${score[3]}`}
                                            /> 
                                        })}
                                    </View>
                                    <WarningButton
                                        title={"Logout"} 
                                        onPress={() => this.setModalVisible(true)}
                                        accessibilityLabel="Logout"
                                    /> 
                                </View>
                            }                      
                        </Screen>
                    )
                }}
            </ThemeConsumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    background: {
        backgroundColor: theme.backgroundColor
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: theme.pbmText,
        backgroundColor: theme.buttonColor
    },
    savedIcon: {
        fontSize: 24,
        color: theme.pbmText,
        marginRight: 5
    },
    savedLink: {
        backgroundColor: theme._fff,
        borderWidth: 1,
        borderColor: theme._97a5af,
        borderRadius: 50,
        elevation: 0
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
    titleStyle: {
        color: theme.pbmText, 
        fontSize: 16
    },
    listTitleStyle: {
        marginLeft: 15,
        marginRight: 15,
        fontSize: 16,
        marginBottom: -8,
        marginTop: -8,
        color: theme.pbmText
    },
    username: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        padding: 10,
        color: theme.pbmText,
        backgroundColor: theme._6a7d8a,
        textAlign: "center"
    },
    stat: {
        marginTop: 5,
        marginLeft: 30,
        fontSize: 16,
        color: theme.buttonTextColor,
        width: 200
    },
    statNum: {
        fontWeight: "bold",
        color: theme.pbmText,
        backgroundColor: theme.buttonColor,
        fontSize: 16,
        marginTop: 5,
        marginLeft: 10
    },
    member: {
        textAlign: "center",
        marginBottom: 10,
        fontWeight: "bold",
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

