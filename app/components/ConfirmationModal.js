import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { 
    Modal,
    StyleSheet, 
    View, 
} from 'react-native'

class ConfirmationModal extends Component {
    render(){
        return(
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={()=>{}}
                visible={this.props.visible}
            >
                <View style={s.modalBg}>
                    <View style= {s.modal}>
                        {this.props.children}
                    </View>
                </View>
            </Modal>    

        )
    }
}

ConfirmationModal.propTypes = {
    visible: PropTypes.bool,
    children: PropTypes.node,
}

const s = StyleSheet.create({
    modalBg: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        width: '80%',
        paddingTop: 15,
        paddingBottom: 15
    }
})

export default ConfirmationModal
