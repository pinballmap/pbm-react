import React, { useContext, useState } from 'react'
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
import { ThemeContext } from '../theme-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { logout } from '../actions'
import ConfirmationModal from './ConfirmationModal'
import PbmButton from './PbmButton'
import WarningButton from './WarningButton'

const DrawerMenu = ({ loggedIn, logout, navigation, ...props }) => {
    const { theme } = useContext(ThemeContext)
    const s = getStyles(theme)

    const [modalVisible, setModalVisible] = useState(false)

    return(
        <View>
            <ConfirmationModal visible={modalVisible} >
                <WarningButton
                    title={"Log Me Out"}
                    onPress={() => {
                        setModalVisible(false)
                        logout()
                        navigation.navigate('Login')
                    }}
                    accessibilityLabel="Logout"
                />
                <PbmButton
                    title={"Actually, Stay Logged In"}
                    onPress={() => setModalVisible(false)}
                    accessibilityLabel="Stay Logged In"
                />
            </ConfirmationModal>
            <View style={{marginTop: 50}}>
                <DrawerNavigatorItems 
                    {...props} 
                    onItemPress={(item) => navigation.navigate(item.route.key)}
                />
                {loggedIn ? 
                    <TouchableOpacity style={s.container} onPress={() => setModalVisible(true)}>
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
const getStyles = theme => StyleSheet.create({
    container: {
        marginTop: 8,
        height: 55,
    },
    icon: {
        fontSize: 24,
        color: theme.drawerIcon,
        position: 'absolute',
        paddingLeft: Platform.OS === 'ios' ? 20 : 15
    },
    text: {
        color: theme.drawerText,
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
