import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { RemoveMachineModal } from './'

class RemoveMachine extends Component {
    state = { showModal: false }

    render(){
        return(
            <View>
                {this.state.showModal && <RemoveMachineModal closeModal={() => this.setState({showModal: false})}/>}
                {this.props.user.loggedIn && 
                    <FontAwesome 
                        name='trash' 
                        size={30}
                        color={'red'}
                        style={{ marginRight: 20 }}
                        onPress={() => this.setState({showModal: true})}
                    />
                }
            </View>
        )
    }
}

RemoveMachine.propTypes = {
    user: PropTypes.object,
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(RemoveMachine)