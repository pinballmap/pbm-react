import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Text, View, StyleSheet } from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import { Button } from 'react-native-elements'
import { logout } from '../actions/user_actions'

class UserProfile extends Component {
  state = {
      modalVisible: false,
  }

  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft: <HeaderBackButton tintColor="#888888" onPress={() => navigation.goBack(null)} title="Map" />,
          title: 'Profile',
      }
  };

  setModalVisible(visible) {
      this.setState({modalVisible: visible})
  }
  
  render(){
      return(
          <View>
              <Text style={s.pageTitle}>User Profile</Text>
              <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.modalVisible}
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
                              rounded
                              buttonStyle={s.logoutButton}
                              titleStyle={{
                                  color:"white", 
                                  fontSize:18
                              }}
                              style={{padding:10}}
                          />
                          <Button
                              title={"Nevermind. Stay Logged In"}
                              onPress={() => this.setModalVisible(false)}
                              accessibilityLabel="Logout"
                              raised
                              rounded
                              buttonStyle={s.cancelButton}
                              titleStyle={{
                                  color:"black", 
                                  fontSize:18
                              }}
                              style={{padding:10}}
                          />
                      </View>
                  </View>
              </Modal>

              {this.props.user.loggedIn ?
                  <Button
                      title={"Logout"} 
                      onPress={() => this.setModalVisible(true)}
                      accessibilityLabel="Logout"
                      raised
                      rounded
                      buttonStyle={s.logoutButton}
                      titleStyle={{
                          color:"white", 
                          fontSize:18
                      }}
                      style={{padding:10}}
                  /> :
                  <View>
                      <Text style={s.hiya}>{`Hi, you're not logged in, so you don't have a profile!`}</Text>
                      <Button
                          title={"Login"} 
                          onPress={() => this.props.navigation.navigate("SignupLogin")}
                          accessibilityLabel="Login"
                          raised
                          rounded
                          buttonStyle={s.cancelButton}
                          titleStyle={s.titleStyle}
                          style={{padding:10}}
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
        width: '100%'
    },
    cancelButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%'
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
        color: '#444444'
    },
    titleStyle: {
        color:"black",
        fontSize:18
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

