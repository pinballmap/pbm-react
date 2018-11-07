import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Modal, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import { addMachineToLocation } from '../actions/location_actions'

class SaveAddMachine extends Component {
    state = {
        showModal: false,
    }

    addMachine = () => {
        //this.props.addMachineToLocation()
        this.setState({ showModal: false })
    }

    render(){    
        const { loggedIn } = this.props.user

        return(
            <View>
                <Modal
                    visible={this.state.showModal}
                >
                    <View style={{marginTop: 100}}>
                        <Text>Add Machine?</Text>
                        <Button 
                            title={'YES'}
                            onPress={() => this.addMachine()}
                        />
                        <Button 
                            title={'Cancel'}
                            onPress={() => this.setState({ showModal: false })}
                        />
                    </View>
                </Modal>  
                {loggedIn && 
                    <FontAwesome 
                        name='plus' 
                        size={20}
                        color={'red'}
                        style={{ marginRight: 25 }}
                        onPress={() => {
                            this.setState({showModal: true})
                            this.props.myFunc()()
                        }}
                    />
                }
            </View>
  

        )
    }
}

SaveAddMachine.propTypes = {
    addMachineToLocation: PropTypes.func,
    user: PropTypes.object,
}

const mapStateToProps = ({ user }) => ({ user })
const mapDispatchToProps = (dispatch) => ({
    addMachineToLocation: (lmx) => dispatch(addMachineToLocation(lmx))
})
export default connect(mapStateToProps, mapDispatchToProps)(SaveAddMachine)
