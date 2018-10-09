import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, Modal, Text, View, StyleSheet } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { Button } from 'react-native-elements';
import { setLoggedIn } from '../actions/user_actions'

class UserProfile extends Component {
  state = {
    modalVisible: false,
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
      title: 'Profile',
    };
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }
  
  render(){
    return(
      <View>
        <Text>UserProfile Screen</Text>
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
                  AsyncStorage.removeItem('auth')
                  this.setModalVisible(false)
                  this.props.setLoggedIn(false)
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

        {this.props.user.loggedIn && 
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
          />
        }
      </View>
    );
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
});

const mapStateToProps = ({ user }) => ({ user })
const mapDispatchToProps = (dispatch) => ({
  setLoggedIn: status => dispatch(setLoggedIn(status)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

