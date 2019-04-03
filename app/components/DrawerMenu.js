import React, { Component } from 'react'
import { connect } from 'react-redux' 
import PropTypes from 'prop-types'
import { DrawerItems } from 'react-navigation'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Left, Right } from 'react-native-elements'
import { 
    Text, 
    TouchableOpacity, 
    View,
    StyleSheet
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
                        title={"Yes! Log Me Out"}
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
                        accessibilityLabel="Stay Logged In"
                    />
                </ConfirmationModal>
                <View style={{marginTop: 50}}>
                    <DrawerItems {...this.props} />
                    {loggedIn ? 
                        <TouchableOpacity style={s.container} onPress={() => this.setState({ modalVisible: true})}>
                            <MaterialCommunityIcons name='logout' style={s.icon} />
                            <Text style={s.text}>Logout</Text>
                        </TouchableOpacity>                    
                        : <TouchableOpacity style={s.container} onPress={() => navigation.navigate('Login')}>
                            <MaterialCommunityIcons name='login' style={s.icon} />
                            <Text style={s.text}>Log In</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}
const s = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    icon: {
        fontSize: 24,
        color: '#97a5af',
        position: 'absolute',
        paddingLeft: 20
    },
    text: {
        color: '#6a7d8a',
        fontWeight: 'bold',
        position: 'absolute',
        paddingLeft: 72,
        paddingRight: 130,
        top: 4
    },
})
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
