import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Modal, Text, TextInput, View } from 'react-native'
import { Button, ListItem } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { addMachineCondition, addMachineScore } from '../actions/location_actions'
import { formatNumWithCommas } from '../utils/utilityFunctions'

const moment = require('moment')

class MachineDetails extends Component {
    state = {
        showAddConditionModal: false,
        conditionText: '', 
        showAddScoreModal: false,
        score: '0',
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: <Text>{`${navigation.getParam('machineName')} @ ${navigation.getParam('locationName')}`}</Text>,
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
        console.log(lmx)
    }

    render() {
        const { curLmx } = this.props.location
        const topScores = curLmx.machine_score_xrefs.sort((a, b) => b.score - a.score).slice(0, 3)

        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showAddConditionModal}
                >
                    <View style={{marginTop: 100}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={conditionText => this.setState({ conditionText })}
                            value={this.state.conditionText}
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                            placeholder={'Enter machine condition... '}
                        />
                        <Button
                            title={'Add Condition'}
                            disabled={this.state.conditionText.length === 0}
                            onPress={() => this.addCondition(curLmx.id)}
                        />
                        <Button
                            title={'Cancel'}
                            onPress={this.cancelAddCondition}
                        />
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showAddScoreModal}
                >
                    <View style={{marginTop: 100}}>
                        <TextInput 
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                            keyboardType='numeric'
                            onChangeText={score => this.setState({ score })}
                            value={this.state.score}
                        />
                        <Button 
                            title={'Add Score'}
                            onPress={() => this.addScore(curLmx.id)}
                        />
                        <Button 
                            title={'Cancel'}
                            onPress={this.cancelAddScore}
                        />
                    </View>
                </Modal>
                <View>
                    <Text>{`Added to location: ${moment(curLmx.created_at).format('MMM-DD-YYYY')}`}</Text>
                    <Button
                        title={'ADD A NEW CONDITION'}
                        onPress={() => this.setState({ showAddConditionModal: true })}
                    />
                    {curLmx.condition ? 
                        <Text>{curLmx.condition}</Text> :
                        <Text>No machine condition added yet</Text>
                    }
                    {curLmx.condition_date && <Text>{`Updated on ${curLmx.condition_date} ${curLmx.user_id ? `by ${curLmx.user_id}` : ''}`}</Text>}
                    <Button 
                        title={'ADD YOUR SCORE'}
                        onPress={() => this.setState({ showAddScoreModal: true })}
                    />
                    {topScores.map(scoreObj => {
                        const {id, score, created_at, username} = scoreObj
        
                        return (
                            <ListItem
                                key={id}
                                title={formatNumWithCommas(score)}
                                subtitle={`Scored on: ${moment(created_at).format('MMM-DD-YYY')} by ${username}`}
                            />)
                    })}
                    {topScores.length === 0 && <Text>No Scores Yet!</Text>}
                    <Button 
                        title={'REMOVE MACHINE'}
                        onPress={() => {
                            this.removeLmx(curLmx.id)
                            this.props.navigation.goBack()
                        }}
                    />
                </View>
            </View>
        )
    }
}

MachineDetails.propTypes = {
    location: PropTypes.object,
    addMachineCondition: PropTypes.func,
    addMachineScore: PropTypes.func,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ location }) => ({ location })
const mapDispatchToProps = (dispatch) => ({
    addMachineCondition: (condition, lmx) => dispatch(addMachineCondition(condition, lmx)),
    addMachineScore: (score, lmx) => dispatch(addMachineScore(score, lmx)),
})
export default connect(mapStateToProps, mapDispatchToProps)(MachineDetails)
