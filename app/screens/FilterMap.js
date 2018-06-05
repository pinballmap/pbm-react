import "../config/globals.js"
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';

class FilterMap extends Component {
  constructor(props){
    super(props);

    this.state ={ isLoading: true }
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
      title: 'Filter',
      headerRight: <Button title="Save" onPress={() => params.saveFilters()} />
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ saveFilters: this._saveFilters });
  }

  _saveFilters = () => {
    console.log('user updated')
  }

  render(){
    return(
      <View style={{flex: 1}}>
        <View>
            <View>
              <Text>Machine</Text>
            </View>
            <View>
              <Text>Machine Dropdown</Text>
            </View>
            <View>
              <Text>Machine Inputbox</Text>
            </View>
        </View>
        <View>
            <View>
              <Text>Location Type</Text>
            </View>
            <View>
              <Text>Location Type Dropdown</Text>
            </View>
            <View>
              <Text>Location Type Inputbox</Text>
            </View>
        </View>
        <View>
            <View>
              <Text># Of Machines</Text>
            </View>
            <View>
              <Text># Of Machines Radio</Text>
            </View>
        </View>
        <View>
            <View>
              <Text>Operator</Text>
            </View>
            <View>
              <Text>Operator Dropdown</Text>
            </View>
            <View>
              <Text>Operator Inputbox</Text>
            </View>
        </View>
      </View>
    );
  }
}

export default FilterMap;
