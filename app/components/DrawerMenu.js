import React, { Component } from 'react'
import { connect } from 'react-redux' 
import PropTypes from 'prop-types'
import { DrawerNavigatorItems } from 'react-navigation-drawer'
import { 
    Platform,
    Text, 
    TouchableOpacity, 
    View,
    StyleSheet
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { logout } from '../actions'
import ConfirmationModal from './ConfirmationModal'
import PbmButton from './PbmButton'
import WarningButton from './WarningButton'

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
                    <DrawerNavigatorItems 
                        {...this.props} 
                        onItemPress={(item) => navigation.navigate(item.route.key)}
                    />
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
        height: 55,
    },
    icon: {
        fontSize: 24,
        color: '#97a5af',
        position: 'absolute',
        paddingLeft: Platform.OS === 'ios' ? 20 : 15
    },
    text: {
        color: '#6a7d8a',
        fontWeight: 'bold',
        position: 'absolute',
        paddingLeft: 72,
        paddingRight: 120,
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
