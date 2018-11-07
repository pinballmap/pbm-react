import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { ActivityIndicator, Linking, Modal, Text, TextInput, View, StyleSheet, ScrollView } from 'react-native'
import { Button, ListItem } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { addMachineCondition, addMachineScore, removeMachineFromLocation } from '../actions/location_actions'
import { formatNumWithCommas } from '../utils/utilityFunctions'
import { RemoveMachine, RemoveMachineModal }  from '../components'

const moment = require('moment')

class MachineDetails extends Component {
    state = {
        showAddConditionModal: false,
        conditionText: '', 
        showAddScoreModal: false,
        score: '0',
        showRemoveMachineModal: false,
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: <Text>{`${navigation.getParam('machineName')} @ ${navigation.getParam('locationName')}`}</Text>,
            headerRight: <RemoveMachine />
        }
    }

    cancelAddCondition = () => this.setState({ showAddConditionModal: false, conditionText: '' })

    cancelAddScore = () => this.setState({ showAddScoreModal: false, score: '0' })
    
    addCondition = (lmx) => {
        this.props.addMachineCondition(this.state.conditionText, lmx)
        this.setState({ showAddConditionModal: false })
    }

    addScore = (lmx) => {
        this.props.addMachineScore(this.state.score, lmx)
        this.setState({ showAddScoreModal: false })
    }

    removeLmx = (lmx) => {
        this.props.removeMachineFromLocation(lmx)
        this.setState({ showRemoveMachineModal: false })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.curLmx && !this.props.location.curLmx)
            this.props.navigation.goBack()
    }

    render() {
        const { curLmx } = this.props.location   

        if (!curLmx) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )   
        }

        const { loggedIn } = this.props.user
        const { ipdb_link } = this.props.machineDetails
        const topScores = curLmx.machine_score_xrefs.sort((a, b) => b.score - a.score).slice(0, 3)
        const pintipsUrl = curLmx.machine_group_id ? 
            `http://pintips.net/pinmap/group/${curLmx.machine_group_id}` :
            `http://pintips.net/pinmap/machine/${curLmx.machine_id}`

        const mostRecentComment = curLmx.machine_conditions[0] ? curLmx.machine_conditions[0] : undefined

        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showAddConditionModal}
                >
                    <ScrollView style={{paddingTop: 100}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={conditionText => this.setState({ conditionText })}
                            value={this.state.conditionText}
                            style={[{padding:5,height: 200},s.textInput]}
                            placeholder={'Enter machine condition...'}
                        />
                        <Button
                            title={'Add Condition'}
                            disabled={this.state.conditionText.length === 0}
                            onPress={() => this.addCondition(curLmx.id)}
                            raised
                            buttonStyle={s.blueButton}
                            titleStyle={s.titleStyle}
                            style={{borderRadius: 50}}
                            containerStyle={[{borderRadius:50},s.margin15]}
                        />
                        <Button
                            title={'Cancel'}
                            onPress={this.cancelAddCondition}
                            raised
                            buttonStyle={s.redButton}
                            titleStyle={{fontSize:18,color:'#ffffff'}}
                            style={{borderRadius: 50}}
                            containerStyle={[{borderRadius:50},s.margin15]}
                        />
                    </ScrollView>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showAddScoreModal}
                >
                    <View style={{paddingTop: 100}}>
                        <TextInput 
                            style={[{height: 40,textAlign:'center'},s.textInput]}
                            keyboardType='numeric'
                            onChangeText={score => this.setState({ score })}
                            value={this.state.score}
                            returnKeyType="done"
                            placeholder={'0...'}
                        />
                        <Button 
                            title={'Add Score'}
                            onPress={() => this.addScore(curLmx.id)}
                            raised
                            buttonStyle={s.blueButton}
                            titleStyle={s.titleStyle}
                            style={{borderRadius: 50}}
                            containerStyle={[{borderRadius:50},s.margin15]}
                        />
                        <Button 
                            title={'Cancel'}
                            onPress={this.cancelAddScore}
                            raised
                            buttonStyle={s.redButton}
                            titleStyle={{fontSize:18,color:'#ffffff'}}
                            style={{borderRadius: 50}}
                            containerStyle={[{borderRadius:50},s.margin15]}
                        />
                    </View>
                </Modal>
                {this.state.showRemoveMachineModal && <RemoveMachineModal closeModal={() => this.setState({showRemoveMachineModal: false})} />}
                <ScrollView>
                    <Text style={{textAlign:'center',marginTop:10}}>{`Added to location: ${moment(curLmx.created_at).format('MMM-DD-YYYY')}`}</Text>
                    
                    <Button
                        title={loggedIn ? 'ADD A NEW CONDITION' : 'Login to add a machine condition'}
                        onPress={loggedIn ? 
                            () => this.setState({ showAddConditionModal: true }) :
                            () => this.props.navigation.navigate('SignupLogin')}
                        raised
                        buttonStyle={s.blueButton}
                        titleStyle={s.titleStyle}
                        style={{borderRadius: 50}}
                        containerStyle={[{borderRadius:50},s.margin15]}
                    />
                    <View style={{backgroundColor:'#ffffff',paddingTop:5,paddingBottom:5}}>
                        {mostRecentComment ? 
                            <Text style={[{marginLeft:20,marginRight:20},s.conditionText]}>{`"${mostRecentComment.comment}"`}</Text> :
                            <Text style={s.noneYet}>No machine condition added yet</Text>
                        }
                        {mostRecentComment && <Text style={{marginTop:5,marginLeft:25,marginRight:20}}>{`Updated on ${moment(mostRecentComment.created_at).format('MMM-DD-YYYY')} ${mostRecentComment.username ? `by ${mostRecentComment.username}` : ''}`}</Text>}
                    </View>
                    <Button 
                        title={loggedIn ? 'ADD YOUR SCORE' : 'Login to add your high score'}
                        onPress={loggedIn ? 
                            () => this.setState({ showAddScoreModal: true }) :
                            () => this.props.navigation.navigate('SignupLogin')
                        }
                        raised
                        buttonStyle={s.blueButton}
                        titleStyle={s.titleStyle}
                        style={{borderRadius: 50}}
                        containerStyle={[{borderRadius:50},s.margin15]}
                    />
                    {topScores.map(scoreObj => {
                        const {id, score, created_at, username} = scoreObj
        
                        return (
                            <ListItem
                                containerStyle={{paddingLeft:20}}
                                key={id}
                                title={formatNumWithCommas(score)}
                                subtitle={`Scored on ${moment(created_at).format('MMM-DD-YYYY')} by ${username}`}
                                titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                subtitleStyle={{ paddingTop:3 }}
                            />)
                    })}
                    {topScores.length === 0 && <Text style={[{paddingTop:5,paddingBottom:5,backgroundColor:'#ffffff'},s.noneYet]}>No scores yet!</Text>}
                    <Button
                        title={'View playing tips on pintips.net'}
                        onPress={() => Linking.openURL(pintipsUrl)}
                        buttonStyle={s.externalLink}
                        titleStyle={{
                            color:"black", 
                            fontSize:18
                        }}
                        containerStyle={s.margin15}
                    />
                    <Button
                        title={'View on IPDB'}
                        onPress={() => Linking.openURL(ipdb_link)}
                        buttonStyle={s.externalLink}
                        titleStyle={{
                            color:"black", 
                            fontSize:18
                        }}
                        containerStyle={s.margin15}
                    />
                    <Button 
                        title={loggedIn ? 'REMOVE MACHINE' : 'Login to remove machine'}
                        onPress={loggedIn ? 
                            () => this.setState({ showRemoveMachineModal: true }) :
                            () => this.props.navigation.navigate('SignupLogin')
                        }
                        raised
                        buttonStyle={s.redButton}
                        titleStyle={{fontSize:18,color:'#ffffff'}}
                        style={{borderRadius: 50}}
                        containerStyle={[{borderRadius:50},s.margin15]}
                    />
                </ScrollView>
            </View>
        )
    }
}

const s = StyleSheet.create({
    externalLink: {
        backgroundColor:'rgba(38,2,4,.1)',
        borderWidth: 1,
        borderColor: '#888888',
        borderRadius: 5
    },
    blueButton: {
        backgroundColor:"#D3ECFF",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    redButton: {
        backgroundColor:"#F53240",
        borderRadius: 50,
        width: '100%',
        elevation: 0
    },
    titleStyle: {
        color:"black",
        fontSize:18
    },
    margin15: {
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        marginBottom:15
    },
    italic: {
        fontStyle:'italic'
    },
    conditionText: {
        color: '#555555',
        fontStyle: 'italic',
        fontSize: 16
    },
    noneYet: {
        textAlign:'center',
        paddingLeft:15,
        paddingRight:15,
        fontStyle:'italic',
        color:'#555555'
    },
    textInput: {
        backgroundColor: '#ffffff', 
        borderColor: '#888888', 
        borderWidth: 1,
        marginLeft:15,
        marginRight:15
    }
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
