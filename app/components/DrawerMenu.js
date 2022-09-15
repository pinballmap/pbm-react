import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList
} from '@react-navigation/drawer'
import { useTheme } from '@react-navigation/native'
import {
    Dimensions,
    Platform,
    Text,
    Pressable,
    StyleSheet
} from 'react-native'
import { ThemeContext } from '../theme-context'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { logout } from '../actions'
import ConfirmationModal from './ConfirmationModal'
import PbmButton from './PbmButton'
import WarningButton from './WarningButton'

let deviceWidth = Dimensions.get('window').width

const DrawerMenu = ({ loggedIn, logout, ...props }) => {
    const { theme } = useContext(ThemeContext)
    const { colors } = useTheme()

    const s = getStyles(theme)

    const [modalVisible, setModalVisible] = useState(false)

    return (
        <DrawerContentScrollView {...props}>
            <ConfirmationModal visible={modalVisible} >
                <WarningButton
                    title={"Log Me Out"}
                    onPress={() => {
                        setModalVisible(false)
                        logout()
                        props.navigation.navigate('Login')
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
            <DrawerItemList {...props} />
            <DrawerItem
                label="Submit Location"
                labelStyle={{ color: colors.primary }}
                icon={() => <MaterialIcons name='add-location' size={24} color={'#bec2e6'} />}
                onPress={() => props.navigation.navigate('Map', { screen: 'SuggestLocation' })}
            />
            <DrawerItem
                label="Contact"
                labelStyle={{ color: colors.primary }}
                icon={() => <MaterialCommunityIcons name='email-outline' size={24} color={'#bec2e6'} />}
                onPress={() => props.navigation.navigate('Map', { screen: 'Contact' })}
            />
            <DrawerItem
                label="About"
                labelStyle={{ color: colors.primary }}
                icon={() => <MaterialIcons name='info-outline' size={24} color={'#bec2e6'} />}
                onPress={() => props.navigation.navigate('Map', { screen: 'About' })}
            />
            <DrawerItem
                label="Events"
                labelStyle={{ color: colors.primary }}
                icon={() => <MaterialIcons name='event-note' size={24} color={'#bec2e6'} />}
                onPress={() => props.navigation.navigate('Map', { screen: 'Events' })}
            />
            <DrawerItem
                label="FAQ"
                labelStyle={{ color: colors.primary }}
                icon={() => <MaterialIcons name='question-answer' size={24} color={'#bec2e6'} />}
                onPress={() => props.navigation.navigate('Map', { screen: 'FAQ' })}
            />
            <DrawerItem
                label="Blog"
                labelStyle={{ color: colors.primary }}
                icon={() => <MaterialCommunityIcons name='book-open-variant' size={24} color={'#bec2e6'} />}
                onPress={() => props.navigation.navigate('Map', { screen: 'Blog' })}
            />
            <DrawerItem
                label="Settings"
                labelStyle={{ color: colors.primary }}
                icon={() => <MaterialIcons name='settings' size={24} color={'#bec2e6'} />}
                onPress={() => props.navigation.navigate('Map', { screen: 'Settings' })}
            />
            {loggedIn ?
                <Pressable
                    onPress={() => setModalVisible(true)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1.0 }, s.container]}
                >
                    <Text style={s.text}>Logout</Text>
                    <MaterialCommunityIcons name='exit-run' style={s.icon} />
                </Pressable>
                :
                <Pressable
                    onPress={() => props.navigation.navigate('Login')}
                    style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1.0 }, s.container]}
                >
                    <Text style={s.text}>Login</Text>
                    <MaterialCommunityIcons name='login' style={s.icon} />
                </Pressable>
            }
        </DrawerContentScrollView>
    )
}
const getStyles = theme => StyleSheet.create({
    container: {
        marginTop: deviceWidth < 325 ? 5 : 8,
        height: 55,
    },
    icon: {
        fontSize: 24,
        color: theme.colors.activeTab,
        position: 'absolute',
        opacity: 0.9,
        paddingLeft: Platform.OS === 'ios' ? 17 : 15
    },
    text: {
        color: theme.colors.activeTab,
        fontFamily: 'boldFont',
        fontSize: 14,
        position: 'absolute',
        paddingLeft: 75,
        paddingRight: 120,
        top: 3,
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

const mapStateToProps = ({ user }) => ({ loggedIn: user.loggedIn })
const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
})
export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu)
