import React from 'react'
import { DrawerActions, useTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Platform, StyleSheet, Text } from 'react-native'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
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
import FAQ from '../screens/FAQ'
import About from '../screens/About'
import Contact from '../screens/Contact'
import SuggestLocation from '../screens/SuggestLocation'
import Events from '../screens/Events'
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

const Stack = createStackNavigator()

const TabsOptionsStyle = {
    headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowColor: 'transparent'
    },
    headerTitleStyle: {
        textAlign: 'center',
        fontFamily: 'boldFont',
        fontSize: 18
    },
}

function MapNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MapNavStack" title="Map" component={Map} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

function SavedStackNavigator() {
    return (
        <Stack.Navigator screenOptions={TabsOptionsStyle}>
            <Stack.Screen
                name="SavedStack"
                component={Saved}
                options={{
                    headerTitleAlign: 'center',
                    title: 'Saved Locations',
                }}
            />
        </Stack.Navigator>
    )
}

function ActivityStackNavigator() {
    return (
        <Stack.Navigator screenOptions={TabsOptionsStyle}>
            <Stack.Screen
                name="RecentActivityStack"
                component={RecentActivity}
                options={{
                    headerTitleAlign: 'center',
                    title: 'Nearby Activity (30 Days)',
                }}
            />
        </Stack.Navigator>
    )
}

function ProfileStackNavigator() {
    return (
        <Stack.Navigator screenOptions={TabsOptionsStyle}>
            <Stack.Screen
                name="UserProfileStack"
                component={UserProfile}
                options={{
                    headerTitleAlign: 'center',
                    title: 'Your Profile',
                }}
            />
        </Stack.Navigator>
    )
}

function MenuStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Menu" component={DrawerMenu} />
        </Stack.Navigator>
    )
}

const Tab = createBottomTabNavigator()

function BottomTabNavigator() {
    const { colors } = useTheme()

    return (
        <Tab.Navigator
            screenOptions={{
                gestureEnabled: true
            }}
        >
            <Tab.Screen
                name="MapTab"
                title="Map"
                component={MapNavigator}
                options={{
                    headerShown: false,
                    tabBarLabel: ({ focused }) => (<Text style={[{ color: focused ? colors.activeTab : colors.inactiveTab, fontFamily: focused ? 'regularBoldFont' : 'regularFont' }, s.labelText]}>Map</Text>),
                    tabBarIcon: ({ focused }) => (
                        <MaterialIcons name='search' size={(focused) ? 30 : 28} color={focused ? colors.activeTab : colors.inactiveTab} />
                    ),
                }}
            />
            <Tab.Screen
                name="Saved"
                component={SavedStackNavigator}
                options={{
                    headerShown: false,
                    tabBarLabel: ({ focused }) => (<Text style={[{ color: focused ? colors.activeTab : colors.inactiveTab, fontFamily: focused ? 'regularBoldFont' : 'regularFont' }, s.labelText]}>Saved</Text>),
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name='heart-outline' size={(focused) ? 30 : 28} color={focused ? colors.activeTab : colors.inactiveTab} />
                    ),
                }}
            />
            <Tab.Screen
                name="RecentActivity"
                component={ActivityStackNavigator}
                options={{
                    headerShown: false,
                    tabBarLabel: ({ focused }) => (<Text style={[{ color: focused ? colors.activeTab : colors.inactiveTab, fontFamily: focused ? 'regularBoldFont' : 'regularFont' }, s.labelText]}>Activity</Text>),
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name='newspaper-variant-outline' size={(focused) ? 30 : 28} color={focused ? colors.activeTab : colors.inactiveTab} />
                    ),
                }}
            />
            <Tab.Screen
                name="UserProfile"
                component={ProfileStackNavigator}
                options={{
                    headerShown: false,
                    tabBarLabel: ({ focused }) => (<Text style={[{ color: focused ? colors.activeTab : colors.inactiveTab, fontFamily: focused ? 'regularBoldFont' : 'regularFont' }, s.labelText]}>You</Text>),
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name='account-circle-outline' size={(focused) ? 30 : 28} color={focused ? colors.activeTab : colors.inactiveTab} />
                    ),
                }}
            />
            <Tab.Screen
                name="Menu"
                component={MenuStackNavigator}
                listeners={({ navigation }) => ({
                    tabPress: e => {
                        navigation.dispatch(DrawerActions.toggleDrawer())

                        e.preventDefault()
                    }
                })}
                options={{
                    tabBarLabel: () => (<Text style={[{ color: colors.inactiveTab }, s.labelText]}>More</Text>),
                    tabBarIcon: () => (<MaterialIcons name='more-horiz' size={28} color={colors.inactiveTab} />),
                }}
            />
        </Tab.Navigator>
    )
}

function MapStack() {
    const { colors } = useTheme()
    return (
        <Stack.Navigator
            screenOptions={() => ({
                headerTintColor: colors.text,
                headerTitleAlign: 'center',
                gestureDirection: 'horizontal',
                gestureEnabled: true,
                headerStyle: {
                    borderBottomWidth: 0,
                    elevation: 0,
                    shadowColor: 'transparent'
                },
                headerTitleStyle: {
                    textAlign: 'center',
                    fontFamily: 'boldFont',
                    fontSize: 18,
                    color: colors.text
                },
                headerBackTitleStyle: {
                    fontFamily: 'boldFont'
                },
                headerBackTitleVisible: false
            })}
        >
            <Stack.Screen name="MapStack" component={BottomTabNavigator} options={{ title: "Map", headerShown: false }} />
            <Stack.Screen name="Contact" component={Contact} />
            <Stack.Screen name="SignupLogin" component={SignupLogin} options={{ headerShown: false }} />
            <Stack.Screen name="LocationList" component={LocationList} options={{ headerBackTitleVisible: true, title: 'Locations on the Map' }} />
            <Stack.Screen name="LocationDetails" component={LocationDetails} options={{ headerTransparent: true, title: null }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="FilterMap" component={FilterMap} options={{ headerBackTitleVisible: true, title: 'Apply Filters to the Map' }} />
            <Stack.Screen name="MachineDetails" component={MachineDetails} options={{ headerTransparent: true, title: null }} />
            <Stack.Screen name="SuggestLocation" component={SuggestLocation} options={{ title: 'Submit Location' }} />
            <Stack.Screen name="Events" component={Events} options={{ title: 'Nearby Events' }} />
            <Stack.Screen name="FAQ" component={FAQ} />
            <Stack.Screen name="Resources" component={Resources} options={{ title: 'Pinball Resources' }} />
            <Stack.Screen name="About" component={About} options={{ title: 'About Pinball Map' }} />
            <Stack.Screen name="FindMachine" component={FindMachine} />
            <Stack.Screen name="EditLocationDetails" component={EditLocationDetails} options={{ title: 'Edit Location Details' }} />
            <Stack.Screen name="PasswordReset" component={PasswordReset} options={{ title: 'Reset Your Password' }} />
            <Stack.Screen name="ResendConfirmation" component={ResendConfirmation} options={{ title: 'Resend Confirmation Email' }} />
            <Stack.Screen name="FindOperator" component={FindOperator} options={{ title: 'Select Operator' }} />
            <Stack.Screen name="FindLocationType" component={FindLocationType} options={{ title: 'Select Location Type' }} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="FindCountry" component={FindCountry} options={{ title: 'Select Country' }} />
        </Stack.Navigator>
    )
}

const Drawer = createDrawerNavigator()

function DrawerNavigator() {
    const { colors } = useTheme()
    return (
        <Drawer.Navigator initialRouteName="Map" backBehavior="history" drawerContent={(props) => <DrawerMenu {...props} />}
            screenOptions={() => ({
                drawerPosition: 'right',
                drawerType: 'front',
                drawerActiveBackgroundColor: colors.background,
                drawerLabelStyle: { fontFamily: 'boldFont' }
            })}
        >
            <Drawer.Screen
                name="Map"
                component={MapStack}
                options={{
                    headerShown: false,
                    gestureEnabled: true,
                    drawerIcon: () => (
                        <MaterialIcons
                            name='search'
                            size={24}
                            color={'#bec2e6'}
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator

const s = StyleSheet.create({
    labelText: {
        fontSize: 12,
        marginBottom: Platform.OS === 'android' ? 5 : 0,
        marginTop: Platform.OS === 'android' ? -5 : 0
    }
})
