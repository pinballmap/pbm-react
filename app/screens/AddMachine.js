import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux' 
import { Text, TextInput, View } from 'react-native'
import { SaveAddMachine } from '../components'

class AddMachine extends Component {
    state = {
        conditionText: '',
    }
    
    static navigationOptions = ({ navigation }) => {
        console.log(navigation)
        return {
            headerLeft: <Text tintColor="#260204" onPress={() => navigation.goBack(null)}>Cancel</Text>,
            title: <Text>New Machine</Text>,
            headerRight: <SaveAddMachine myFunc={() => navigation.state.params.myFunc} />
        }
    }

    myFunc = () => console.log('fired!')

    componentDidMount() {
        this.props.navigation.setParams({
            myFunc: () => this.myFunc()
        })
    }

    render() {
        return (
            <View>
                <Button
                    title={'Pick Machine'}
                    onPress={() => this.props.navigation.navigate('FindMachine')}
                />
                <Text>Condition:</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={conditionText => this.setState({ conditionText })}
                    value={this.state.conditionText}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    placeholder={'Enter machine condition... '}
                />
            </View>
        )
    }
}

AddMachine.propTypes = {
    navigation: PropTypes.object,
}

const mapStateToProps = ({ machines }) => ({ machines })
export default connect(mapStateToProps)(AddMachine)