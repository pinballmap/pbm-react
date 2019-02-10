import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Text } from 'react-native'
import { removeMachineFromLocation } from '../actions/location_actions'
import { ConfirmationModal, PbmButton, WarningButton } from './'

class RemoveMachineModal extends Component {
    removeLmx = (lmx) => {
        this.props.removeMachineFromLocation(lmx)
        this.props.closeModal()
    }

    render(){
        const { curLmx, location } = this.props.location
    
        return(
            <ConfirmationModal>
                {this.props.machineName && <Text style={{textAlign:'center',marginTop:10,marginLeft:15,marginRight:15,fontSize: 18}}>{`Remove ${this.props.machineName} from ${location.name}?`}</Text>}
                <PbmButton 
                    title={'Yes, Remove It'}
                    onPress={() => this.removeLmx(curLmx.id)}
                />
                <WarningButton 
                    title={'Cancel'}
                    onPress={() => this.props.closeModal()}
                />
            </ConfirmationModal>    
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
