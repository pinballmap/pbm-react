import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { 
    Modal,
    StyleSheet, 
    View, 
} from 'react-native'
import { ThemeContext } from 'react-native-elements'

const ConfirmationModal = ({children, visible}) => {
    const { theme } = useContext(ThemeContext)

    return(
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={()=>{}}
            visible={visible}
        >
            <View style={s(theme).modalBg}>
                <View style= {s(theme).modal}>
                    {children}
                </View>
            </View>
        </Modal>    

    )
}

ConfirmationModal.propTypes = {
    visible: PropTypes.bool,
    children: PropTypes.node,
}

const s = (theme) => StyleSheet.create({
    modalBg: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal: {
        backgroundColor: theme.modalBg,
        borderRadius: 15,
        width: '80%',
        paddingVertical: 15,
    }
})

export default ConfirmationModal
