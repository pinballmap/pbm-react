import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Modal, Text, View, StyleSheet } from 'react-native'
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
                    {this.props.machineName && <Text style={{textAlign:'center',marginTop:10,marginLeft:15,marginRight:15,fontSize: 18}}>{`Remove ${this.props.machineName} from ${location.name}?`}</Text>}
                    <Button 
                        title={'Yes, Remove It'}
                        onPress={() => this.removeLmx(curLmx.id)}
                        raised
                        buttonStyle={s.blueButton}
                        titleStyle={s.titleStyle}
                        style={{borderRadius: 50}}
                        containerStyle={[{borderRadius:50},s.margin15]}
                    />
                    <Button 
                        title={'Cancel'}
                        onPress={() => this.props.closeModal()}
                        raised
                        buttonStyle={s.redButton}
                        titleStyle={{fontSize:18,color:'#ffffff'}}
                        style={{borderRadius: 50}}
                        containerStyle={[{borderRadius:50},s.margin15]}
                    />
                </View>
            </Modal>    

        )
    }
}

const s = StyleSheet.create({
    blueButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    redButton: {
        backgroundColor:"#F53240",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    titleStyle: {
        color:"black",
        fontSize:18
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
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
    removeMachineFromLocation: (lmx) => dispatch(removeMachineFromLocation(lmx))
})
export default connect(mapStateToProps, mapDispatchToProps)(RemoveMachineModal)
