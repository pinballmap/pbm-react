import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { ActivityIndicator, Linking, Modal, TextInput, View, StyleSheet, ScrollView, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { Button, ListItem } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { addMachineCondition, addMachineScore, removeMachineFromLocation } from '../actions/location_actions'
import { formatNumWithCommas } from '../utils/utilityFunctions'
import { PbmButton, RemoveMachine, RemoveMachineModal, WarningButton, Text }  from '../components'
import { EvilIcons } from '@expo/vector-icons'

const moment = require('moment')

var DismissKeyboard = require('dismissKeyboard')

let deviceWidth = Dimensions.get('window').width

class MachineDetails extends Component {
    state = {
        showAddConditionModal: false,
        conditionText: '', 
        showAddScoreModal: false,
        score: '',
        showRemoveMachineModal: false,
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} />,
            title: <Text>{`${navigation.getParam('machineName')} @ ${navigation.getParam('locationName')}`}</Text>,
            headerTitleStyle: {width:deviceWidth - 90},
            headerRight: <RemoveMachine />,
            headerStyle: {
                backgroundColor:'#f5fbff',               
            },
            headerTintColor: '#4b5862'
        }
    }

    cancelAddCondition = () => this.setState({ showAddConditionModal: false, conditionText: '' })

    cancelAddScore = () => this.setState({ showAddScoreModal: false, score: '' })
    
    addCondition = (lmx) => {
        this.props.addMachineCondition(this.state.conditionText, lmx)
        this.setState({ 
            showAddConditionModal: false, 
            conditionText: '',
        })
    }

    addScore = (lmx) => {
        this.props.addMachineScore(this.state.score, lmx)
        this.setState({ showAddScoreModal: false })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.curLmx && !this.props.location.curLmx)
            this.props.navigation.goBack()
    }

    render() {
        const { curLmx, location } = this.props.location   
        
        if (!curLmx) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )   
        }

        const { id: userId, loggedIn } = this.props.user
        const { ipdb_link } = this.props.machineDetails
        const { opdb_id } = this.props.machineDetails
        const pintipsUrl = opdb_id ? 
            `http://pintips.net/opdb/${opdb_id}` :
            ``

        const mostRecentComments = curLmx.machine_conditions.length > 0 ? curLmx.machine_conditions.slice(0, 5) : undefined
        const scores = curLmx.machine_score_xrefs.sort((a,b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0)).slice(0, 10) 
        const { score: userHighScore } = curLmx.machine_score_xrefs.filter(score => score.user_id === userId).reduce((prev, current) => (prev.score > current.score) ? prev : current, -1)
        const { name: machineName } = this.props.machineDetails

        return (
            <View style={{flex:1,backgroundColor:'#f5fbff'}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showAddConditionModal}
                    onRequestClose={()=>{}}
                >
                    <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
                        <ScrollView style={{paddingTop: 50, backgroundColor:'#f5fbff'}}>
                            <Text style={{textAlign:'center',marginBottom:10,marginLeft:15,marginRight:15,fontSize: 18}}>{`Comment on ${machineName} at ${location.name}!`}</Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={4}
                                underlineColorAndroid='transparent'
                                onChangeText={conditionText => this.setState({ conditionText })}
                                value={this.state.conditionText}
                                style={[{padding:5,height: 100},s.textInput]}
                                placeholder={'Enter machine condition...'}
                                textAlignVertical='top'
                            />
                            <PbmButton
                                title={'Add Condition'}
                                disabled={this.state.conditionText.length === 0}
                                onPress={() => this.addCondition(curLmx.id)}
                            />
                            <WarningButton
                                title={'Cancel'}
                                onPress={this.cancelAddCondition}
                            />
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showAddScoreModal}
                    onRequestClose={()=>{}}
                >
                    <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
                        <ScrollView style={{paddingTop: 50,backgroundColor:'#f5fbff'}}>
                            <Text style={{textAlign:'center',marginBottom:10,marginLeft:15,marginRight:15,fontSize: 18}}>{`Add your high score to ${machineName} at ${location.name}!`}</Text>
                            <TextInput 
                                style={[{height: 40,textAlign:'center'},s.textInput]}
                                keyboardType='numeric'
                                underlineColorAndroid='transparent'
                                onChangeText={score => this.setState({ score })}
                                value={this.state.score}
                                returnKeyType="done"
                                placeholder={'123...'}
                            />
                            <PbmButton 
                                title={'Add Score'}
                                disabled={this.state.score.length === 0}
                                onPress={() => this.addScore(curLmx.id)}
                            />
                            <WarningButton 
                                title={'Cancel'}
                                onPress={this.cancelAddScore}
                            />
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </Modal>
                {this.state.showRemoveMachineModal && <RemoveMachineModal closeModal={() => this.setState({showRemoveMachineModal: false})} />}
                <ScrollView>
                    <Text style={{textAlign:'center',marginTop:10}}>{`Added to location: ${moment(curLmx.created_at).format('MMM-DD-YYYY')}`}</Text>  
                    <PbmButton
                        title={loggedIn ? 'ADD A NEW CONDITION' : 'Login to add a machine condition'}
                        onPress={loggedIn ? 
                            () => this.setState({ showAddConditionModal: true }) :
                            () => this.props.navigation.navigate('Login')}
                    />
                    <Text style={s.sectionTitle}>Machine Comments</Text>
                    <View>
                        {mostRecentComments ? 
                            mostRecentComments.map(commentObj => {
                                const { comment, created_at, username } = commentObj
                                return <ListItem
                                    key={commentObj.id}
                                    titleStyle={[{marginLeft:15,marginRight:15},s.conditionText]}
                                    title={`"${comment}"`}
                                    subtitle={`Comment made ${moment(created_at).format('MMM-DD-YYYY')} ${username ? `by ${username}` : ''}`}
                                    subtitleStyle={{marginTop:5,marginLeft:15,marginRight:15,fontSize:14}}
                                /> 
                            }) :
                            <Text style={s.noneYet}>No machine condition added yet</Text>
                        }
                    </View>
                    <PbmButton 
                        title={loggedIn ? 'ADD YOUR SCORE' : 'Login to add your high score'}
                        onPress={loggedIn ? 
                            () => this.setState({ showAddScoreModal: true }) :
                            () => this.props.navigation.navigate('Login')
                        }
                    />
                    {userHighScore ? 
                        <View>
                            <Text style={s.userScoreTitle}>{`Your personal best on this machine is`}</Text>
                            <Text style={s.userHighScore}>{formatNumWithCommas(userHighScore)}</Text>
                        </View>                       
                        : null
                    }
                    <Text style={s.sectionTitle}>Top Scores</Text>
                    {scores.length > 0 ? 
                        <View style={{paddingBottom:5}}>                                  
                            {scores.map(scoreObj => {
                                const {id, score, created_at, username} = scoreObj
        
                                return (
                                    <ListItem
                                        containerStyle={{paddingLeft:30, paddingTop:5}}
                                        key={id}
                                        title={formatNumWithCommas(score)}
                                        subtitle={`Scored on ${moment(created_at).format('MMM-DD-YYYY')} by ${username}`}
                                        titleStyle={{ fontSize: 15, fontWeight: 'bold' }}
                                        subtitleStyle={{ paddingTop:3,fontSize:14,color:'#6a7d8a' }}
                                    />)
                            })}
                        </View> : 
                        <Text style={s.noneYet}>No scores yet!</Text>
                    }
                    {pintipsUrl ?
                        <Button
                            title={'View playing tips on PinTips'}
                            onPress={() => Linking.openURL(pintipsUrl)}
                            buttonStyle={s.externalLink}
                            titleStyle={{
                                color:"#000e18", 
                                fontSize:16
                            }}
                            iconRight
                            icon={<EvilIcons name='external-link' style={s.externalIcon} />}
                            containerStyle={s.margin15}
                        /> :
                        null
                    }
                    <Button
                        title={'View on IPDB'}
                        onPress={() => Linking.openURL(ipdb_link)}
                        buttonStyle={s.externalLink}
                        titleStyle={{
                            color:"#000e18", 
                            fontSize:16
                        }}
                        iconRight
                        icon={<EvilIcons name='external-link' style={s.externalIcon} />}
                        containerStyle={s.margin15}
                    />
                    <WarningButton 
                        title={loggedIn ? 'REMOVE MACHINE' : 'Login to remove machine'}
                        onPress={loggedIn ? 
                            () => this.setState({ showRemoveMachineModal: true }) :
                            () => this.props.navigation.navigate('Login')
                        } 
                    />
                </ScrollView>
            </View>
        )
    }
}

const s = StyleSheet.create({
    externalLink: {
        backgroundColor:'#ffffff',
        borderWidth: 1,
        borderColor: '#97a5af',
        borderRadius: 5,
        elevation: 0
    },
    externalIcon: {
        fontSize: 24
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
    conditionText: {
        color: '#6a7d8a',
        fontStyle: 'italic',
        fontSize: 14,
    },
    noneYet: {
        textAlign:'center',
        paddingLeft:15,
        paddingRight:15,
        fontStyle:'italic',
        color:'#97a5af',
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#ffffff',
    },
    textInput: {
        backgroundColor: '#ffffff', 
        borderColor: '#97a5af',
        borderWidth: 2,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    userScoreTitle: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        color: '#6a7d8a'
    },
    userHighScore: {
        textAlign:'center',
        fontSize: 24,
        paddingBottom: 15,
        color: '#4b5862'
    },
})

MachineDetails.propTypes = {
    location: PropTypes.object,
    addMachineCondition: PropTypes.func,
    addMachineScore: PropTypes.func,
    navigation: PropTypes.object,
    user: PropTypes.object,
    machineDetails: PropTypes.object,
    removeMachineFromLocation: PropTypes.func,
}

const mapStateToProps = ({ location, user, machines }) => {
    const machineDetails = location.curLmx ? machines.machines.find(m => m.id === location.curLmx.machine_id) : {}
    return ({ location, user, machineDetails })
}
const mapDispatchToProps = (dispatch) => ({
    addMachineCondition: (condition, lmx) => dispatch(addMachineCondition(condition, lmx)),
    addMachineScore: (score, lmx) => dispatch(addMachineScore(score, lmx)),
    removeMachineFromLocation: (lmx) => dispatch(removeMachineFromLocation(lmx))
})
export default connect(mapStateToProps, mapDispatchToProps)(MachineDetails)
