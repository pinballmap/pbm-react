import React, { Component } from 'react'
import { connect } from 'react-redux' 
import PropTypes from 'prop-types'
import { DrawerItems } from 'react-navigation'
import { 
    Text, 
    TouchableOpacity, 
    View,
} from 'react-native'
import { logout } from '../actions'
import { 
    ConfirmationModal, 
    PbmButton, 
    WarningButton 
} from './'

class DrawerMenu extends Component {
    state = {
        modalVisible: false,
    }

    render(){
        const { 
            loggedIn,
            logout, 
            navigation,
        } = this.props

        return(
            <View>
                <ConfirmationModal visible={this.state.modalVisible} >
                    <PbmButton
                        title={"Really Logout?"}
                        onPress={() => {
                            this.setState({ modalVisible: false})
                            logout()
                            navigation.navigate('Login')
                        }}
                        accessibilityLabel="Logout"
                    />
                    <WarningButton
                        title={"Stay Logged In"}
                        onPress={() => this.setState({ modalVisible: false})}
                        accessibilityLabel="Stay Loggin In"
                    />
                </ConfirmationModal>
                <View style={{marginTop: 50}}>
                    <DrawerItems {...this.props} />
                    {loggedIn ? 
                        <TouchableOpacity onPress={() => this.setState({ modalVisible: true})}><Text>Logout</Text></TouchableOpacity> :
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text>Log In</Text></TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}

DrawerMenu.propTypes = {
    loggedIn: PropTypes.bool,
    logout: PropTypes.func,
    navigation: PropTypes.object,
}

const mapStateToProps = ({user}) => ({loggedIn: user.loggedIn})
const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
})
export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu)
