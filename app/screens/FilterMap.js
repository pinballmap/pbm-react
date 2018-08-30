import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Picker, Text, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { setSelectedMachine } from '../actions/query_actions';

class FilterMap extends Component {
  constructor(props){
    super(props);

    this.state ={ 
      isLoading: true,
      selectedMachine: this.props.query.machineId
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
      title: 'Filter',
      //headerRight: <Button title="Save" onPress={() => params.saveFilters()} />
    };
  };

  componentWillUnmount() {
    this.props.setSelectedMachine(this.state.selectedMachine)
  }

  render(){
    
    const machines = [{name: 'All', id: null}].concat(this.props.machines.machines.sort((a, b) => {
      machineA = a.name.toUpperCase()  
      machineB = b.name.toUpperCase()
      return machineA < machineB ? -1 : machineA === machineB ? 0 : 1
    }))
  
    return(
      <View style={{flex: 1}}>
        <Text>Machine</Text>
        <Picker
          selectedValue={this.state.selectedMachine}
          onValueChange={(itemValue, itemIdx) => this.setState({ selectedMachine: itemValue })}>
          {machines.map(m => (
            <Picker.Item label={m.name} value={m.id} key={m.id} />
          ))}
        </Picker>
      </View>
    );
  }
}

const mapStateToProps = ({ machines, query }) => ({ machines, query })
const mapDispatchToProps = (dispatch) => ({
  setSelectedMachine: machine => dispatch(setSelectedMachine(machine)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FilterMap);

