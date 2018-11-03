import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { ActivityIndicator, Modal, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import { addMachineToLocation, addMachineToLocationFailure } from '../actions/location_actions'

class SaveAddMachine extends Component {
    state = {
        showModal: false,
    }

    addMachine = () => {
        this.props.addMachineToLocation()
        this.setState({ showModal: true })
    }

    addDialogue = () => {
        this.setState({ showModal: false })
        this.props.backToLocationDetails()
    }

    errorDialogue = () => {
        this.setState({ showModal: false })
        this.props.addMachineToLocationFailure()
        this.props.backToLocationDetails()
    }

    render(){    
        const { addingMachineToLocation } = this.props.location
        const { loggedIn } = this.props.user
        const { errorText = null } = this.props.error

        return(
            <View>
                <Modal
                    visible={this.state.showModal}
                >
                    <View style={{marginTop: 100}}>
                        {addingMachineToLocation ? <ActivityIndicator /> : 
                            !errorText ? 
                                <View>
                                    <Text>Thanks for the update!!</Text>
                                    <Button 
                                        title={`You're welcome`}
                                        onPress={this.addDialogue}
                                    />
                                </View> :
                                <View>
                                    <Text>Something went wrong, please try again!!</Text>
                                    <Button 
                                        title={`OK`}
                                        onPress={this.errorDialogue}
                                    />
                                </View>
                        }
                    </View>
                </Modal>  
                {loggedIn && 
                    <FontAwesome 
                        name='plus' 
                        size={20}
                        color={'red'}
                        style={{ marginRight: 25 }}
                        onPress={!addingMachineToLocation ? this.addMachine : () => {}}
                    />
                }
            </View>
  

        )
    }
}

SaveAddMachine.propTypes = {
    addMachineToLocation: PropTypes.func,
    user: PropTypes.object,
    backToLocationDetails: PropTypes.func,
    location: PropTypes.object,
    error: PropTypes.object,
    addMachineToLocationFailure: PropTypes.func,
}

const mapStateToProps = ({ error, location, user }) => ({ error, location, user })
const mapDispatchToProps = (dispatch) => ({
    addMachineToLocation: (lmx) => dispatch(addMachineToLocation(lmx)),
    addMachineToLocationFailure: () => dispatch(addMachineToLocationFailure())
})
export default connect(mapStateToProps, mapDispatchToProps)(SaveAddMachine)
