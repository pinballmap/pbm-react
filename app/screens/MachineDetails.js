import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { Modal, Text, TextInput, View } from 'react-native'
import { Button } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { addMachineCondition } from '../actions/location_actions'

const moment = require('moment')

class MachineDetails extends Component {
    state = {
        showAddConditionModal: false,
        conditionText: '', 
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#260204" onPress={() => navigation.goBack(null)} />,
            title: <Text>{`${navigation.getParam('machineName')} @ ${navigation.getParam('locationName')}`}</Text>,
        }
    }

    cancelAddCondition = () => this.setState({ showAddConditionModal: false, conditionText: '' })
    
    addCondition = (lmx) => {
        this.props.addMachineCondition(this.state.conditionText, lmx)
        this.setState({ showAddConditionModal: false })
    }

    render() {
        const { curLmx } = this.props.location

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
                </View>
            </View>
        )
    }
}

MachineDetails.propTypes = {
    location: PropTypes.object,
    addMachineCondition: PropTypes.func,
}

const mapStateToProps = ({ location }) => ({ location })
const mapDispatchToProps = (dispatch) => ({
    addMachineCondition: (condition, lmx) => dispatch(addMachineCondition(condition, lmx))
})
export default connect(mapStateToProps, mapDispatchToProps)(MachineDetails)
