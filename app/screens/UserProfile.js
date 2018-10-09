import React, { Component } from 'react';
import { AsyncStorage, Modal, Text, View, StyleSheet } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { Button } from 'react-native-elements';

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
                title={"Logout?"}
                onPress={() => {
                  AsyncStorage.removeItem('auth')
                  this.setModalVisible(!this.state.modalVisible)
                }}
              />
              <Button
                title={"Cancel"}
                onPress={() => this.setModalVisible(!this.state.modalVisible)}
              />
            </View>
          </View>
        </Modal>

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
});

export default UserProfile;
