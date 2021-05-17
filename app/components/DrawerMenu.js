import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DrawerNavigatorItems } from 'react-navigation-drawer'
import {
    Platform,
    Text,
    Pressable,
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
                    containerStyle={s.buttonContainer}
                />
                <PbmButton
                    title={"Stay Logged In"}
                    onPress={() => setModalVisible(false)}
                    accessibilityLabel="Stay Logged In"
                    containerStyle={s.buttonContainer}
                />
            </ConfirmationModal>
            <View style={{marginTop: 50}}>
                <DrawerNavigatorItems
                    {...props}
                    onItemPress={(item) => navigation.navigate(item.route.key)}
                />
                {loggedIn ?
                    <Pressable
                        onPress={() => setModalVisible(true)}
                        style={({ pressed }) => [{opacity: pressed ? 0.2 : 1.0},s.container]}
                    >
                        <Text style={s.text}>Logout</Text>
                        <MaterialCommunityIcons name='exit-run' style={s.icon} />
                    </Pressable>
                    :
                    <Pressable
                        onPress={() => navigation.navigate('Login')}
                        style={({ pressed }) => [{opacity: pressed ? 0.2 : 1.0},s.container]}
                    >
                        <Text style={s.text}>Login</Text>
                        <MaterialCommunityIcons name='login' style={s.icon} />
                    </Pressable>
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
        color: '#95867c',
        position: 'absolute',
        paddingLeft: Platform.OS === 'ios' ? 16 : 15
    },
    text: {
        color: theme.orange7,
        fontWeight: 'bold',
        position: 'absolute',
        paddingLeft: 72,
        paddingRight: 120,
        top: 4
    },
    buttonContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
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
