import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer'
import { Platform, StyleSheet, Text, Dimensions } from 'react-native'
import Constants from 'expo-constants'
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

import FilterMap from '../screens/FilterMap.js'
import LocationList from '../screens/LocationList.js'
import LocationDetails from '../screens/LocationDetails.js'
import Login from '../screens/Login.js'
import Map from '../screens/Map.js'
import RecentActivity from '../screens/RecentActivity.js'
import Saved from '../screens/Saved.js'
import Signup from '../screens/Signup.js'
import SignupLogin from '../screens/SignupLogin.js'
import UserProfile from '../screens/UserProfile.js'
import MachineDetails from '../screens/MachineDetails.js'
import Podcast from '../screens/Podcast.js'
import FAQ from '../screens/FAQ.js'
import About from '../screens/About.js'
import Contact from '../screens/Contact.js'
import SuggestLocation from '../screens/SuggestLocation'
import Events from '../screens/Events'
import Blog from '../screens/Blog'
import FindMachine from '../screens/FindMachine'
import EditLocationDetails from '../screens/EditLocationDetails'
import PasswordReset from '../screens/PasswordReset'
import ResendConfirmation from '../screens/ResendConfirmation'
import FindOperator from '../screens/FindOperator'
import FindLocationType from '../screens/FindLocationType'

import { DrawerMenu } from '../components'

let deviceWidth = Dimensions.get('window').width

const map = createStackNavigator({
    Map
})

const saved = createStackNavigator(
    { Saved }, 
    {
        navigationOptions: {
            tabBarVisible: false
        }
    }
)

const activity = createStackNavigator(
    { RecentActivity },
    {
        navigationOptions: {
            tabBarVisible: false
        }
    }
)

const profile = createStackNavigator(
    { UserProfile },
    {
        navigationOptions: {
            tabBarVisible: false
        }
    }
)

const Menu = createStackNavigator({
    Map
})

const TabNav = createBottomTabNavigator({
    Map: map,
    Saved: saved,
    Activity: activity,
    Profile: profile,
    Menu,
},
{
    defaultNavigationOptions: ({ navigation, theme }) => ({
        tabBarIcon: ({focused, tintColor}) => {  // eslint-disable-line 
            const { routeName } = navigation.state
            switch(routeName) {
            case 'Map':
                return <MaterialIcons name='search' size={(focused) ? 30 : 28} color={tintColor} />
            case 'Saved':
                return <MaterialCommunityIcons name='heart-outline' size={(focused) ? 28 : 26} color={tintColor} />
            case 'Activity':
                return <FontAwesome name='newspaper-o' size={(focused) ? 26 : 24} color={tintColor} />
            case 'Profile':
                return <MaterialIcons name='face' size={(focused) ? 28 : 26} color={tintColor} />
            case 'Menu':
                return <MaterialIcons name='more-horiz' size={(focused) ? 30 : 28} color={tintColor} />
            }
        },
        tabBarLabel: ({ focused }) => {
            const { routeName } = navigation.state
            let label
            switch(routeName) {
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
                light: '#1e9dff',
                dark: '#bdae9d',
            },
            inactiveTintColor: {
                light: '#6a7d8a',
                dark: '#bdae9d',
            },
            showIcon: true,
            adaptive: false,
            style: {
                backgroundColor: theme === 'dark' ? '#2a211c' : '#f5fbff',
                paddingBottom: (Platform.OS === 'ios' && Constants.statusBarHeight < 40) ? 3 : 0,
                paddingTop: (Platform.OS === 'ios' && Constants.statusBarHeight > 40) ? 2 : 0,
                height: Platform.isPad ? 55 : (Platform.OS === 'ios' && Constants.statusBarHeight > 40) ? 46 : Platform.OS === 'android' ? 54 : Platform.OS === 'ios' ? 50 : null,
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
        swipeEnabled: true,
    })
})

TabNav.navigationOptions = {
    header: null,
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
    About: { screen: About },
    Podcast: { screen: Podcast },
    FindMachine: { screen: FindMachine },
    EditLocationDetails: { screen: EditLocationDetails },
    PasswordReset: { screen: PasswordReset },
    ResendConfirmation: { screen: ResendConfirmation },
    FindOperator: { screen: FindOperator },
    FindLocationType: { screen: FindLocationType },
},
{
    navigationOptions: ({ theme }) => ({
        gesturesEnabled: true,
        drawerLabel: 'Map',
        drawerIcon: <MaterialIcons name='search' style={{fontSize: 24,color: '#6a7d8a'}} />,
        headerStyle: {
            backgroundColor: theme === 'dark' ? '#2a211c' : '#f5fbff',
            height: Platform.OS === 'ios' ? 44 : 56,
        },
        headerTitleStyle: {
            textAlign: 'center',
            flexGrow: 1,
            alignSelf:'center',
            width: Platform.OS === 'ios' ? deviceWidth - 100 : null
        },
        headerTintColor: theme === 'dark' ? '#bdae9d' : '#4b5862'
    })
})

export const drawerNavigator = createDrawerNavigator({
    Map: MapStack,
    SuggestLocation: { screen: SuggestLocation },
    Events: { screen: Events },
    Contact: { screen: Contact },
    About: { screen: About },
    FAQ: { screen: FAQ },
    Podcast: { screen: Podcast },
    Blog: { screen: Blog },
},
{
    contentComponent: DrawerMenu,
    drawerPosition: 'right',
    drawerWidth: 250,
    drawerBackgroundColor: {
        light: '#f5fbff',
        dark: '#2a211c',
    },
    contentOptions: {
        activeTintColor: {
            light: '#6a7d8a',
            dark: '#bdae9d'
        },
        inactiveTintColor: {
            light: '#6a7d8a',
            dark: '#bdae9d'
        },
        activeBackgroundColor: {
            light: '#f5fbff',
            dark: '#2a211c'
        },
        itemsContainerStyle: {
            paddingTop: Constants.statusBarHeight > 40 ? 20 : 0,
        }
    },
})

export const PbmStack = createAppContainer(drawerNavigator)

const s = theme => StyleSheet.create({ 
    activeTabText: {
        fontWeight: "bold",
        fontSize: 11,
        color: '#1e9dff'
    },
    inactiveTabText: {
        fontWeight: "normal",
        fontSize: 11,
        color: theme === 'dark' ? '#bdae9d' : '#4b5862'
    },
})
