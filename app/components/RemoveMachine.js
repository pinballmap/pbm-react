import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import RemoveMachineModal from './RemoveMachineModal'

const RemoveMachine = ({ user }) => {
    const [showModal, setShowModal] = useState(false)

    return(
        <View>
            {showModal && <RemoveMachineModal closeModal={() => setShowModal(false)}/>}
            {user.loggedIn && 
                    <FontAwesome 
                        name='trash' 
                        size={30}
                        color={'#e4606a'}
                        style={{ marginRight: 10 }}
                        onPress={() => setShowModal(true)}
                    />
            }
        </View>
    )
}

RemoveMachine.propTypes = {
    user: PropTypes.object,
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(RemoveMachine)
