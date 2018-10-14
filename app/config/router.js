import React from 'react'
import { DrawerNavigator, TabNavigator, StackNavigator } from 'react-navigation'
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
import AddMachine from '../screens/AddMachine.js'
import Podcast from '../screens/Podcast.js'
import FAQ from '../screens/FAQ.js'
import Donate from '../screens/Donate.js'
import About from '../screens/About.js'
import Contact from '../screens/Contact.js'
import SuggestLocation from '../screens/SuggestLocation'
import Events from '../screens/Events'
import Store from '../screens/Store'
import Blog from '../screens/Blog'

const TabNav = TabNavigator({
    Drawer: { screen: Map },
    Map: { screen: Map },
    Saved: { screen: Saved },
    Activity: { screen: RecentActivity },
    Profile: { screen: UserProfile },
},
{
    navigationOptions: ({ navigation }) => ({
        tabBarIcon: () => {
            const { routeName } = navigation.state
            switch(routeName) {
            case 'Drawer':
                return <FontAwesome name='bars' size={25} />
            case 'Map':
                return <MaterialIcons name='search' size={25} />
            case 'Saved':
                return <MaterialCommunityIcons name='star-outline' size={25} />
            case 'Activity':
                return <FontAwesome name='newspaper-o' size={25} />
            case 'Profile':
                return <MaterialIcons name='face' size={25} />
            }
        },
        tabBarOnPress: (e) => {
            if (navigation.state.key === "Drawer")
                navigation.navigate('DrawerToggle')
            else {
                e.jumpToIndex(e.scene.index)
            }
        }
    }), 
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    tabBarOptions: {
        activeTintColor: '#f2f2f2',
        activeBackgroundColor: '#2EC4B6',
        inactiveTintColor: '#666',
    },
})

  
export const MapStack = StackNavigator({
    Map: { screen: TabNav },
    SignupLogin: { screen: SignupLogin, },
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
    AddMachine: { screen: AddMachine, },
    SuggestLocation: { screen: SuggestLocation },
    Events: { screen: Events },
    Contact: { screen: Contact },
    Store: { screen: Store },
    FAQ: { screen: FAQ },
    Blog: { screen: Blog },
    About: { screen: About },
    Donate: { screen: Donate },
    Podcast: { screen: Podcast },
})

export const PbmStack = DrawerNavigator({
    Map: { screen: MapStack },
    SuggestLocation: { screen: SuggestLocation },
    Events: { screen: Events },
    Contact: { screen: Contact },
    Store: { screen: Store },
    FAQ: { screen: FAQ },
    Blog: { screen: Blog },
    About: { screen: About },
    Donate: { screen: Donate },
    Podcast: { screen: Podcast },
},
{
    drawerPosition: 'left',
    drawerWidth: 200,
})