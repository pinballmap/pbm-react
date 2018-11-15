import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActivityIndicator, Modal, Text, View, StyleSheet, ScrollView } from 'react-native'
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
              <Text style={s.pageTitle}>User Profile</Text>
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
                                  this.props.navigation.navigate('SignupLogin')
                              }}
                              accessibilityLabel="Logout"
                              raised
                              buttonStyle={s.logoutButton}
                              titleStyle={{
                                  color:"white", 
                                  fontSize:18
                              }}
                              style={{borderRadius: 50}}
                              containerStyle={{borderRadius:50,marginTop:10,marginBottom:15,marginLeft:15,marginRight:15}}
                          />
                          <Button
                              title={"Nevermind. Stay Logged In"}
                              onPress={() => this.setModalVisible(false)}
                              accessibilityLabel="Stay Loggin In"
                              raised
                              buttonStyle={s.cancelButton}
                              titleStyle={{
                                  color:"black", 
                                  fontSize:18
                              }}
                              style={{borderRadius: 50}}
                              containerStyle={{borderRadius:50,marginLeft:15,marginRight:15}}
                          />
                      </View>
                  </View>
              </Modal>

              {user.loggedIn ?
                  <ScrollView>
                      <Text>{user.username}</Text>
                      <Text>{`Member since: ${moment(profileInfo.created_at).format('MMM-DD-YYYY')}`}</Text>
                      <Text>{`Machines Added: ${profileInfo.num_machines_added}`}</Text>
                      <Text>{`Machines Removed: ${profileInfo.num_machines_removed}`}</Text>
                      <Text>{`Machines Comments: ${profileInfo.num_lmx_comments_left}`}</Text>
                      <Text>{`Locations submitted: ${profileInfo.num_locations_suggested}`}</Text>
                      <Text>{`Locations edited: ${profileInfo.num_locations_edited}`}</Text>
                      <Button 
                          title={'Saved Locations'}
                          onPress={() => this.props.navigation.navigate('Saved')}
                      />
                      <Text>Locations Edited:</Text>
                      <View style={{backgroundColor:'#ffffff',paddingTop:5,paddingBottom:5}}>
                          {profileInfo.profile_list_of_edited_locations.slice(0, 50).map(location => {
                              return <ListItem
                                  key={location[0]}
                                  titleStyle={{marginLeft:15,marginRight:15}}
                                  title={location[1]}
                              /> 
                          })}
                      </View>
                      <Text>High Scores:</Text>
                      <View style={{backgroundColor:'#ffffff',paddingTop:5,paddingBottom:5}}>
                          {profileInfo.profile_list_of_high_scores.map((score, idx) => {
                              return <ListItem
                                  key={`${score[0]}-${score[1]}-${score[2]}-${score[3]}-${idx}`}
                                  titleStyle={{marginLeft:15,marginRight:15}}
                                  title={`${score[2]} on ${score[1]} at ${score[0]} on ${score[3]}`}
                              /> 
                          })}
                      </View>
                      <Button
                          title={"Logout"} 
                          onPress={() => this.setModalVisible(true)}
                          accessibilityLabel="Logout"
                          raised
                          buttonStyle={s.logoutButton}
                          titleStyle={{
                              color:"white", 
                              fontSize:18
                          }}
                          style={{borderRadius: 50}}
                          containerStyle={{borderRadius:50,marginLeft:15,marginRight:15}}
                      /> 
                  </ScrollView> :
                  <View>
                      <Text style={s.hiya}>{`Hi, you're not logged in, so you don't have a profile!`}</Text>
                      <Button
                          title={"Login"} 
                          onPress={() => this.props.navigation.navigate("SignupLogin")}
                          accessibilityLabel="Login"
                          raised
                          buttonStyle={s.cancelButton}
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
    logoutButton: {
        backgroundColor:"#F53240",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    cancelButton: {
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

