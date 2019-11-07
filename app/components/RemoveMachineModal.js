import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Text, StyleSheet } from 'react-native'
import { ThemeContext } from 'react-native-elements'
import { removeMachineFromLocation } from '../actions/location_actions'
import ConfirmationModal from './ConfirmationModal'
import PbmButton from './PbmButton'
import WarningButton from './WarningButton'

const RemoveMachineModal = ({ removeMachineFromLocation, closeModal, location: loc, machineName }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const removeLmx = (curLmx, location_id) => {
        removeMachineFromLocation(curLmx, location_id)
        closeModal()
    }

    const { curLmx, location } = loc
    
    return(
        <ConfirmationModal>
            {machineName && <Text style={s.confirmText}>{`Remove ${machineName} from ${location.name}?`}</Text>}
            <PbmButton 
                title={'Yes, Remove It'}
                onPress={() => removeLmx(curLmx, location.id)}
            />
            <WarningButton 
                title={'Cancel'}
                onPress={() => closeModal()}
            />
        </ConfirmationModal>    
    )
}

const getStyles = theme => StyleSheet.create({ 
    confirmText: {
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 18,
        color: theme.pbmText,
    }
})

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
    removeMachineFromLocation: (curLmx, location_id) => dispatch(removeMachineFromLocation(curLmx, location_id))
})
export default connect(mapStateToProps, mapDispatchToProps)(RemoveMachineModal)
