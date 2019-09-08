import React from 'react'
import { DrawerNavigator, TabNavigator, StackNavigator } from 'react-navigation'
import { Platform, StyleSheet, Text } from 'react-native'
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

const TabNav = TabNavigator({
    Map: { screen: Map },
    Saved: { screen: Saved },
    Activity: { screen: RecentActivity },
    Profile: { screen: UserProfile },
    Menu: { screen: Map },
},
{
    navigationOptions: ({ navigation }) => ({
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
                return label = focused ? <Text style={s.activeTabText}>Map</Text> : <Text style={s.inactiveTabText}>Map</Text>
            case 'Saved':
                return label = focused ? <Text style={s.activeTabText}>Saved</Text> : <Text style={s.inactiveTabText}>Saved</Text>
            case 'Activity':
                return label = focused ? <Text style={s.activeTabText}>Activity</Text> : <Text style={s.inactiveTabText}>Activity</Text>
            case 'Profile':
                return label = focused ? <Text style={s.activeTabText}>Profile</Text> : <Text style={s.inactiveTabText}>Profile</Text>
            case 'Menu':
                return label = focused ? <Text style={s.activeTabText}>More</Text> : <Text style={s.inactiveTabText}>More</Text>         
            }
            return label
        },
        tabBarOnPress: (e) => {
            if (navigation.state.key === "Menu")
                navigation.navigate('DrawerToggle')
            else {
                e.jumpToIndex(e.scene.index)
            }
        }
    }), 
    tabBarOptions: {
        activeTintColor: '#1e9dff',
        inactiveTintColor: '#6a7d8a',
        showIcon: true,
        adaptive: false,
        style: {
            backgroundColor:'#f5fbff',
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
    },
    tabBarPosition: 'bottom',
    swipeEnabled: true,
})

export const MapStack = StackNavigator({
    SignupLogin: { screen: SignupLogin, },
    Map: { screen: TabNav },
    LocationList: {
        screen: LocationList,
        navigationOptions: {
            title: 'Location List',
        },
    },
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
    navigationOptions: {
        gesturesEnabled: true
    }
})

export const PbmStack = DrawerNavigator({
    Map: { screen: MapStack },
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
    drawerBackgroundColor: '#f5fbff',
    contentOptions: {
        activeTintColor: '#6a7d8a',
        inactiveTintColor: '#6a7d8a',
        activeBackgroundColor: '#f5fbff',
        itemsContainerStyle: {
            paddingTop: Constants.statusBarHeight > 40 ? 20 : 0,
        }
    },
})

const s = StyleSheet.create({ 
    activeTabText: {
        fontWeight: "bold",
        fontSize: 11,
        color: '#1e9dff'
    },
    inactiveTabText: {
        fontWeight: "normal",
        fontSize: 11,
        color: '#4b5862'
    }
})
