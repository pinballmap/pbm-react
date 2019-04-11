import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
    ActivityIndicator, 
    Dimensions,
    Image, 
    ImageBackground, 
    ScrollView,
    StyleSheet, 
    Text, 
    View, 
} from 'react-native'
import { Button } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'
import { 
    loginLater,
    login, 
    fetchLocationTypes,
    fetchMachines,
    fetchOperators,
} from '../actions'
import { retrieveItem } from '../config/utils'
import { getData } from '../config/request'
import "../config/globals.js"

let deviceHeight = Dimensions.get('window').height

export class SignupLogin extends Component {
    constructor(props){
        super(props)

        this.state ={ 
            num_locations: 0, 
            num_lmxes: 0, 
            apiError: '',
        }
    }

    static navigationOptions = { 
        drawerLabel: 'Map',
        drawerIcon: () => <Feather name='map' style={[s.drawerIcon]} />,
        header: null 
    }

    componentDidMount(){
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

        this.props.getLocationTypes('/location_types.json')
        this.props.getMachines('/machines.json')
        this.props.getOperators('/operators.json')

        retrieveItem('auth').then((auth) => {
            if (auth) {
                if (auth.id) {
                    this.props.login(auth)
                }
                this.props.navigation.navigate('Map')
            }
        }).catch((error) => console.log('Promise is rejected with error: ' + error)) 

    }

    render(){
        if (this.state.fetchingShowTurnOnLocationServices || (this.state.num_lmxes === 0 && !this.state.apiError)) {
            return (
                <View style={{ flex: 1, padding: 20,backgroundColor:'#f5fbff' }}>
                    <ActivityIndicator />
                </View>
            )
        }
        
        return(
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
                                    <Text style={s.bold}> {this.state.num_locations} </Text> 
                                    <Text>locations and</Text>
                                    <Text style={s.bold}> {this.state.num_lmxes} </Text>
                                    <Text>machines.</Text>
                                    {"\n"}{"\n"}
                                    <Text>You can use it without being logged in. But to help keep it up to date you gotta log in!</Text>
                                    {"\n"}{"\n"}
                                    <Text style={{marginTop:15,fontSize:18,textAlign:"center"}}>
                                        You’ll be prompted to enable location services, so that we can display pinball machines near you!
                                    </Text>
                                </Text>
                            }
                        </View>
                    </View>
                    <View style={{padding:15}}>
                        <Button
                            onPress={() => this.props.navigation.navigate('Login')}
                            raised
                            buttonStyle={s.buttonBlue}
                            titleStyle={s.titleStyle}
                            title="Current User? Log In"
                            accessibilityLabel="Log In"
                            containerStyle={{borderRadius:50}}
                            style={{borderRadius: 50}}
                        />
                        <Button
                            onPress={() => this.props.navigation.navigate('Signup')}
                            raised
                            buttonStyle={s.buttonPink}
                            titleStyle={s.titleStyle}
                            title="New User? Sign Up"
                            accessibilityLabel="Sign Up"
                            containerStyle={{borderRadius:50,marginTop:15,marginBottom:25}}
                            style={{borderRadius: 50}}
                        />
                        <Button                            
                            onPress={() => {
                                this.props.loginLater()
                                this.props.navigation.navigate('Map')}} 
                            title="skip this for now"
                            accessibilityLabel="skip this for now"                         
                            titleStyle={{color:'#000e18',fontSize:14,textAlign:"center"}}
                            buttonStyle={{backgroundColor:'rgba(255,255,255,.2)',elevation: 0}}
                        />
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const s = StyleSheet.create({
    mask: {
        flex: 1,
        backgroundColor:'rgba(255,255,255,.8)',
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
        margin:20,
        borderRadius:10,
        borderWidth:4,
        borderColor:'rgba(0,0,0,.4)',
    },
    textBg: {
        padding:10,
        borderRadius:10,
        backgroundColor:'rgba(255,255,255,.6)',
    },
    logoWrapper: {
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15
    },
    logo: {
        width: '100%',
        resizeMode: 'contain',
    },
    buttonPink: {
        backgroundColor:"#fdd4d7",
        borderRadius: 50,
        elevation: 0
    },
    buttonBlue: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        elevation: 0
    },
    titleStyle: {
        color:"#4b5862",
        fontSize:18
    },
    justify: {
        flexDirection: 'column',
        justifyContent: 'center',
        height:deviceHeight
    },
    drawerIcon: {
        fontSize: 24,
        color: '#6a7d8a'
    },
})

SignupLogin.propTypes = {
    user: PropTypes.object,
    loginLater: PropTypes.func,
    navigation: PropTypes.object,
    login: PropTypes.func, 
    getLocationTypes: PropTypes.func,
    getMachines: PropTypes.func,
    getOperators: PropTypes.func,
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => ({
    getLocationTypes: (url) => dispatch(fetchLocationTypes(url)),
    getMachines: (url) =>  dispatch(fetchMachines(url)),
    getOperators: (url) => dispatch(fetchOperators(url)),
    loginLater: () => dispatch(loginLater()),
    login: (auth) => dispatch(login(auth)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupLogin)