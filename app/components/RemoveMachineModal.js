import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Modal, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { removeMachineFromLocation } from '../actions/location_actions'



class RemoveMachineModal extends Component {
    removeLmx = (lmx) => {
        this.props.removeMachineFromLocation(lmx)
        this.props.closeModal()
    }

    render(){
        const { curLmx, location } = this.props.location
    
        return(
            <Modal>
                <View style={{marginTop: 100}}>
                    {this.props.machineName && <Text>{`Remove ${this.props.machineName} from ${location.name}?`}</Text>}
                    <Button 
                        title={'YES'}
                        onPress={() => this.removeLmx(curLmx.id)}
                    />
                    <Button 
                        title={'Cancel'}
                        onPress={() => this.props.closeModal()}
                    />
                </View>
            </Modal>    

        )
    }
}

RemoveMachineModal.propTypes = {
    removeMachineFromLocation: PropTypes.func,
    closeModal: PropTypes.func, 
    location: PropTypes.object,
    machineName: PropTypes.string, 
}

const mapStateToProps = ({ location, machines }) => {
    const machineName = location.curLmx ? machines.machines.find(m => m.id === location.curLmx.machine_id).name : ''
    return ({ location, machineName })
}
const mapDispatchToProps = (dispatch) => ({
    removeMachineFromLocation: (lmx) => dispatch(removeMachineFromLocation(lmx))
})
export default connect(mapStateToProps, mapDispatchToProps)(RemoveMachineModal)
