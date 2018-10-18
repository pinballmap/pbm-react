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
import About from '../screens/About.js'
import Contact from '../screens/Contact.js'
import SuggestLocation from '../screens/SuggestLocation'
import Events from '../screens/Events'
import Blog from '../screens/Blog'

const TabNav = TabNavigator({
    Map: { screen: Map },
    Saved: { screen: Saved },
    Activity: { screen: RecentActivity },
    Profile: { screen: UserProfile },
    Menu: { screen: Map },
},
{
    navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({focused, tintColor}) => {
            const { routeName } = navigation.state
            switch(routeName) {
            case 'Map':
                return <MaterialIcons name='search' size={25} color={tintColor} />
            case 'Saved':
                return <MaterialCommunityIcons name='star-outline' size={25} color={tintColor} />
            case 'Activity':
                return <FontAwesome name='newspaper-o' size={25} color={tintColor} />
            case 'Profile':
                return <MaterialIcons name='face' size={25} color={tintColor} />
            case 'Menu':
                return <FontAwesome name='bars' size={25} color={tintColor} />
            }
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
        activeTintColor: '#000000',
        activeBackgroundColor: '#D3ECFF',
        inactiveTintColor: '#555555',
    },
    tabBarPosition: 'bottom',
    swipeEnabled: true,
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
    FAQ: { screen: FAQ },
    Blog: { screen: Blog },
    About: { screen: About },
    Podcast: { screen: Podcast },
})

export const PbmStack = DrawerNavigator({
    Map: { screen: MapStack },
    SuggestLocation: { screen: SuggestLocation },
    Events: { screen: Events },
    Contact: { screen: Contact },
    About: { screen: About },
    Podcast: { screen: Podcast },
    FAQ: { screen: FAQ },
    Blog: { screen: Blog },
},
{
    drawerPosition: 'right',
    drawerWidth: 200,
})