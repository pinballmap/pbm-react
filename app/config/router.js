import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer'
import { Platform, StyleSheet, Text } from 'react-native'
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import FilterMap from '../screens/FilterMap'
import LocationList from '../screens/LocationList'
import LocationDetails from '../screens/LocationDetails'
import Login from '../screens/Login'
import Map from '../screens/Map'
import RecentActivity from '../screens/RecentActivity'
import Saved from '../screens/Saved'
import Signup from '../screens/Signup'
import SignupLogin from '../screens/SignupLogin'
import UserProfile from '../screens/UserProfile'
import MachineDetails from '../screens/MachineDetails'
import Podcast from '../screens/Podcast'
import FAQ from '../screens/FAQ'
import About from '../screens/About'
import Contact from '../screens/Contact'
import SuggestLocation from '../screens/SuggestLocation'
import Events from '../screens/Events'
import Blog from '../screens/Blog'
import FindMachine from '../screens/FindMachine'
import EditLocationDetails from '../screens/EditLocationDetails'
import PasswordReset from '../screens/PasswordReset'
import ResendConfirmation from '../screens/ResendConfirmation'
import FindOperator from '../screens/FindOperator'
import FindLocationType from '../screens/FindLocationType'
import Settings from '../screens/Settings'
import Resources from '../screens/Resources'
import FindCountry from '../screens/FindCountry'

import { DrawerMenu } from '../components'

const map = createStackNavigator({
    Map
})

const saved = createStackNavigator({
    Saved
})

const activity = createStackNavigator({
    RecentActivity
})

const profile = createStackNavigator({
    UserProfile
})

const Menu = createStackNavigator({
    Map
})

const TabNav = createBottomTabNavigator(
    {
        Map: map,
        Saved: saved,
        Activity: activity,
        Profile: profile,
        Menu,
    },
    {
        defaultNavigationOptions: ({ navigation, theme }) => ({
            tabBarIcon: ({ focused, tintColor }) => {  // eslint-disable-line
                const { routeName } = navigation.state
                switch (routeName) {
                    case 'Map':
                        return <MaterialIcons name='search' size={(focused) ? 30 : 28} color={tintColor} />
                    case 'Saved':
                        return <MaterialCommunityIcons name='heart-outline' size={(focused) ? 28 : 26} color={tintColor} />
                    case 'Activity':
                        return <FontAwesome name='newspaper-o' size={(focused) ? 26 : 24} color={tintColor} />
                    case 'Profile':
                        return <MaterialCommunityIcons name='emoticon-cool-outline' size={(focused) ? 30 : 28} color={tintColor} />
                    case 'Menu':
                        return <MaterialIcons name='more-horiz' size={(focused) ? 30 : 28} color={tintColor} />
                }
            },
            tabBarLabel: ({ focused }) => {
                const { routeName } = navigation.state
                let label
                switch (routeName) {
                    case 'Map':
                        return label = focused ? <Text style={s(theme).activeTabText}>Map</Text> : <Text style={s(theme).inactiveTabText}>Map</Text>
                    case 'Saved':
                        return label = focused ? <Text style={s(theme).activeTabText}>Saved</Text> : <Text style={s(theme).inactiveTabText}>Saved</Text>
                    case 'Activity':
                        return label = focused ? <Text style={s(theme).activeTabText}>Activity</Text> : <Text style={s(theme).inactiveTabText}>Activity</Text>
                    case 'Profile':
                        return label = focused ? <Text style={s(theme).activeTabText}>Profile</Text> : <Text style={s(theme).inactiveTabText}>Profile</Text>
                    case 'Menu':
                        return label = focused ? <Text style={s(theme).activeTabText}>More</Text> : <Text style={s(theme).inactiveTabText}>More</Text>
                }
                return label
            },
            tabBarOnPress: (e) => {
                if (e.navigation.state.key === "Menu") {
                    navigation.dispatch(DrawerActions.toggleDrawer())
                }
                else {
                    navigation.navigate(e.navigation.state.key)
                }
            },
            tabBarOptions: {
                activeTintColor: {
                    light: '#7cc5ff',
                    dark: '#addbff',
                },
                inactiveTintColor: {
                    light: '#95867c',
                    dark: '#ebebeb',
                },
                showIcon: true,
                adaptive: false,
                style: {
                    backgroundColor: theme === 'dark' ? '#1d1c1d' : '#fff7eb',
                    height: Platform.isPad ? 55 : Platform.OS === 'ios' ? 46 : 54,
                    marginBottom: Platform.OS === 'ios' ? 0 : 5,
                    borderTopWidth: 0,
                    shadowColor: 'transparent',
                    elevation: 0,
                    shadowOffset: { height: 0, width: 0 },
                },
                iconStyle: {
                    height: 30,
                    width: 30,
                    marginTop: Platform.OS === 'android' ? -5 : 0
                },
                indicatorStyle: {
                    backgroundColor: 'transparent'
                },
                tabStyle: {
                    alignItems: 'center',
                },
            },
            tabBarPosition: 'bottom',
        })
    }
)

TabNav.navigationOptions = {
    headerShown: false,
    headerVisible: false,
    gestureEnabled: false,
    headerTransparent: true,
}

export const MapStack = createStackNavigator({
    SignupLogin: { screen: SignupLogin, },
    Map: { screen: TabNav },
    LocationList: { screen: LocationList },
    LocationDetails: { screen: LocationDetails, },
    Signup: { screen: Signup, },
    Login: { screen: Login, },
    FilterMap: { screen: FilterMap, },
    MachineDetails: { screen: MachineDetails },
    SuggestLocation: { screen: SuggestLocation },
    Events: { screen: Events },
    Contact: { screen: Contact },
    FAQ: { screen: FAQ },
    Blog: { screen: Blog },
    Resources: { screen: Resources },
    About: { screen: About },
    Podcast: { screen: Podcast },
    FindMachine: { screen: FindMachine },
    EditLocationDetails: { screen: EditLocationDetails },
    PasswordReset: { screen: PasswordReset },
    ResendConfirmation: { screen: ResendConfirmation },
    FindOperator: { screen: FindOperator },
    FindLocationType: { screen: FindLocationType },
    Settings: { screen: Settings },
    FindCountry: { screen: FindCountry },
}, {
    navigationOptions: ({ theme }) => ({
        gesturesEnabled: true,
        drawerLabel: 'Map',
        drawerIcon: <MaterialIcons name='search' style={{ fontSize: 24, color: '#95867c' }} />,
        headerStyle: {
            backgroundColor: theme === 'dark' ? '#1d1c1d' : 'red',
        },
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow: 1,
            alignSelf: 'center',
        },
        headerTintColor: theme === 'dark' ? '#ebebeb' : '#7cc5ff'
    })
}
)

export const drawerNavigator = createDrawerNavigator({
    Map: MapStack,
    SuggestLocation: { screen: SuggestLocation },
    Events: { screen: Events },
    Contact: { screen: Contact },
    About: { screen: About },
    FAQ: { screen: FAQ },
    Podcast: { screen: Podcast },
    Blog: { screen: Blog },
    Resources: { screen: Resources },
    Settings: { screen: Settings },
}, {
    contentComponent: DrawerMenu,
    drawerPosition: 'right',
    drawerWidth: 250,
    drawerBackgroundColor: {
        light: '#fff7eb',
        dark: '#1d1c1d',
    },
    contentOptions: {
        activeTintColor: {
            light: '#95867c',
            dark: '#e6cfbe'
        },
        inactiveTintColor: {
            light: '#95867c',
            dark: '#e6cfbe'
        },
        activeBackgroundColor: {
            light: '#fff7eb',
            dark: '#1d1c1d'
        },
    },
})

export const PbmStack = createAppContainer(drawerNavigator)

const s = theme => StyleSheet.create({
    activeTabText: {
        fontWeight: "bold",
        fontSize: 11,
        color: theme === 'dark' ? '#addbff' : '#7cc5ff',
        marginBottom: Platform.OS === 'android' ? 5 : 0,
        marginTop: Platform.OS === 'android' ? -5 : 0
    },
    inactiveTabText: {
        fontWeight: "normal",
        fontSize: 11,
        color: theme === 'dark' ? '#ebebeb' : '#95867c',
        marginBottom: Platform.OS === 'android' ? 5 : 0,
        marginTop: Platform.OS === 'android' ? -5 : 0
    },
})
