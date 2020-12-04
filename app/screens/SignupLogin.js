import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    Image,
    ImageBackground,
    Linking,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { Button } from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import {
    ActivityIndicator
} from '../components'
import {
    loginLater,
    login,
    fetchLocationTypes,
    fetchMachines,
    fetchOperators,
    getFavoriteLocations,
    getRegions,
    getRegion,
    getLocationsByRegion,
    updateCurrCoordinates,
} from '../actions'
import { retrieveItem } from '../config/utils'
import { formatNumWithCommas } from '../utils/utilityFunctions'
import { getData } from '../config/request'
import "../config/globals.js"

let deviceHeight = Dimensions.get('window').height

export class SignupLogin extends Component {
    state ={
        num_locations: 0,
        num_lmxes: 0,
        apiError: '',
    }
    static navigationOptions = () => {
        return {
            header: null
        }
    }

    navigateToScreen = async (url, startUpApp = false) => {
        const { navigate } = this.props.navigation
        if (url.indexOf('location_id=') > 0) {
            const idSegment = url.split('location_id=')[1]
            const id = idSegment.split('&')[0]
            navigate('LocationDetails', { id })
        } else if (url.indexOf('address=') > 0) {
            const decoded = decodeURIComponent(url)
            const address = decoded.split('address=')[1]
            const { location } = await getData(`/locations/closest_by_address.json?address=${address}`)
            if (location) {
                this.props.updateCurrCoordinates(location.lat, location.lon)
            }
            startUpApp && location ? navigate('Map', { setMapLocation: true }) : navigate('Map')
        } else if (url.indexOf('region=') > 0) {
            const regionSegment = url.split('region=')[1]
            const regionName = regionSegment.split('&')[0]
            const region = await this.props.getRegion(regionName)

            const citySegment = url.indexOf('by_city_id=') > 0 ? url.split('by_city_id=')[1] : ''
            const cityName = citySegment.split('&')[0]
            let locations = []
            if (cityName) {
                const byCity = await getData(`/region/${regionName}/locations.json?by_city_id=${cityName}`)
                locations = byCity.locations || []
                if (locations.length > 0) {
                    const {lat, lon} = locations[0]
                    this.props.updateCurrCoordinates(lat, lon)
                }
            }
            // If something goes wrong trying to get the specific city (highly plausible as it requires exact case matching), still get locations for the region
            if (region && locations.length === 0) {
                this.props.getLocationsByRegion(region)
            }
            startUpApp && region ? navigate('Map', { setMapLocation: true }) : navigate('Map')
        } else if (url.indexOf('profile') > 0) {
            navigate('UserProfile')
        } else if (url.indexOf('store') > 0) {
            navigate('About')
        } else if (url.indexOf('faq') > 0) {
            navigate('FAQ')
        } else if (url.indexOf('about') > 0) {
            navigate('Contact')
        } else if (url.indexOf('events') > 0) {
            navigate('Events')
        } else if (url.indexOf('suggest') > 0) {
            navigate('SuggestLocation')
        } else if (url.indexOf('saved') > 0) {
            navigate('Saved')
        } else if (url.indexOf('login') > 0) {
            navigate('Login')
        } else if (url.indexOf('join') > 0) {
            navigate('Signup')
        } else if (url.indexOf('confirmation') > 0) {
            navigate('ResendConfirmation')
        } else if (url.indexOf('password') > 0) {
            navigate('PasswordReset')
        } else if (url.indexOf('privacy') > 0) {
            navigate('About')
        } else {
            navigate('Map')
        }
    }

    async componentDidMount(){
        this.props.getLocationTypes('/location_types.json')
        this.props.getMachines('/machines.json')
        this.props.getOperators('/operators.json')
        await this.props.getRegions('/regions.json')

        Linking.addEventListener('url', ({url}) => this.navigateToScreen(url))

        getData('/regions/location_and_machine_counts.json')
            .then(data => {
                if (data && data.num_lmxes && data.num_locations) {
                    this.setState({
                        num_lmxes: data.num_lmxes,
                        num_locations: data.num_locations,
                    })
                } else {
                    this.setState({
                        apiError: data
                    })
                }
            })
            .catch(apiError => this.setState({ apiError }))

        retrieveItem('auth').then(async auth => {
            const initialUrl = await Linking.getInitialURL()

            if (auth) {
                if (auth.id) {
                    this.props.login(auth)
                    this.props.getFavoriteLocations(auth.id)
                }
                this.navigateToScreen(initialUrl, true)
            }
            else if (initialUrl.includes('?')) this.navigateToScreen(initialUrl)
        }).catch((error) => console.log('Promise is rejected with error: ' + error))
    }

    render(){
        if (this.state.fetchingShowTurnOnLocationServices || (this.state.num_lmxes === 0 && !this.state.apiError)) {
            return (
                <ActivityIndicator />
            )
        }

        return(
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <ImageBackground source={require('../assets/images/app_logo.jpg')} style={s.backgroundImage}>
                            <View style={[s.mask,s.justify]}>
                                <View style={s.logoWrapper}>
                                    <Image source={require('../assets/images/pinballmapcom_nocom.png')} style={s.logo}/>
                                </View>
                                <View style={s.outerBorder}>
                                    <View style={s.textBg}>
                                        {this.state.apiError ?
                                            <Text>Oops. Something went wrong!</Text> :
                                            <Text style={{fontSize:18,textAlign:"center"}}>
                                                <Text>Pinball Map is a user-updated map listing</Text>
                                                <Text style={s.bold}> {formatNumWithCommas(this.state.num_locations)} </Text>
                                                <Text>locations and</Text>
                                                <Text style={s.bold}> {formatNumWithCommas(this.state.num_lmxes)} </Text>
                                                <Text>machines.</Text>
                                                {"\n"}{"\n"}
                                                <Text>Please log in to help keep it up to date!</Text>
                                                {"\n"}{"\n"}
                                                <Text style={{marginTop:15,fontSize:18,textAlign:"center"}}>
                                        When prompted, enable locations services to see pinball machines near you!
                                                </Text>
                                            </Text>
                                        }
                                    </View>
                                </View>
                                <View style={{paddingVertical:10,paddingHorizontal:15,marginLeft: 15,marginRight: 15}}>
                                    <Button
                                        onPress={() => this.props.navigation.navigate('Login')}
                                        raised
                                        buttonStyle={s.buttonBlue}
                                        titleStyle={s.titleStyle}
                                        title="Current User? Log In"
                                        accessibilityLabel="Log In"
                                        containerStyle={{overflow:'hidden'}}
                                    />
                                    <Button
                                        onPress={() => this.props.navigation.navigate('Signup')}
                                        raised
                                        buttonStyle={s.buttonPink}
                                        titleStyle={s.titleStyle}
                                        title="New User? Sign Up"
                                        accessibilityLabel="Sign Up"
                                        containerStyle={{marginTop:15,marginBottom:20,overflow:'hidden'}}
                                    />
                                    <Button
                                        onPress={() => {
                                            this.props.loginLater()
                                            this.props.navigation.navigate('Map')}}
                                        title="skip this for now"
                                        accessibilityLabel="skip this for now"
                                        titleStyle={s.skipTitle}
                                        buttonStyle={{backgroundColor:'rgba(255,255,255,.2)',elevation: 0}}
                                    />
                                </View>
                            </View>
                        </ImageBackground>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    mask: {
        flex: 1,
        backgroundColor: theme.mask,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    bold: {
        fontWeight:"bold",
    },
    outerBorder: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 20,
        marginLeft: 20,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: 'rgba(0,0,0,.4)',
    },
    textBg: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,.6)',
    },
    logoWrapper: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    logo: {
        width: '100%',
        resizeMode: 'contain',
    },
    buttonPink: {
        backgroundColor: "#fdd4d7",
        borderRadius: 5,
        elevation: 0
    },
    buttonBlue: {
        backgroundColor: "#D3ECFF",
        borderRadius: 5,
        elevation: 0
    },
    titleStyle: {
        color: "#4b5862",
        fontSize: 16,
        fontWeight: '500'
    },
    justify: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: deviceHeight
    },
    skipTitle: {
        color: theme.pbmText,
        fontSize: 14,
        textAlign: "center"
    }
})

SignupLogin.propTypes = {
    user: PropTypes.object,
    loginLater: PropTypes.func,
    navigation: PropTypes.object,
    login: PropTypes.func,
    getLocationTypes: PropTypes.func,
    getMachines: PropTypes.func,
    getOperators: PropTypes.func,
    getRegion: PropTypes.func,
    getRegions: PropTypes.func,
    getFavoriteLocations: PropTypes.func,
    getLocationsByRegion: PropTypes.func,
    updateCurrCoordinates: PropTypes.func,
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => ({
    getLocationTypes: (url) => dispatch(fetchLocationTypes(url)),
    getMachines: (url) =>  dispatch(fetchMachines(url)),
    getOperators: (url) => dispatch(fetchOperators(url)),
    loginLater: () => dispatch(loginLater()),
    login: (auth) => dispatch(login(auth)),
    getFavoriteLocations: (id) => dispatch(getFavoriteLocations(id)),
    getRegions: (url) => dispatch(getRegions(url)),
    getRegion: (regionName) => dispatch(getRegion(regionName)),
    getLocationsByRegion: (region) => dispatch(getLocationsByRegion(region)),
    updateCurrCoordinates: (lat, lng) => dispatch(updateCurrCoordinates(lat, lng)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupLogin)
