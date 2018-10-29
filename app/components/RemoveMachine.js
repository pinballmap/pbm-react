import React, { Component } from 'react'
import { View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import RemoveMachineModal from './RemoveMachineModal'

class RemoveMachine extends Component {
    state = { showModal: false }

    render(){
        return(
            <View>
                {this.state.showModal && <RemoveMachineModal closeModal={() => this.setState({showModal: false})}/>}
                <FontAwesome 
                    name='trash' 
                    size={20}
                    color={'red'}
                    style={{ marginRight: 25 }}
                    onPress={() => this.setState({showModal: true})}
                />
            </View>
        )
    }
}

export default RemoveMachine
