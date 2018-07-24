import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, Text, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation';
import { LocationCard } from '../components';

class LocationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonIndex: 0,
      locations: this.props.locations.locations,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} title="Map" />,
      title: 'LocationList',
    };
  };

  updateIndex = (buttonIndex) => {
    this.setState({ buttonIndex })
    switch(buttonIndex) {
      case 0:
        return this.setState({
          locations: this.state.locations.sort((a, b) => a.distance > b.distance)
        })
      case 1:
        return this.setState({
          locations: this.state.locations.sort((a, b) => a.name > b.name)
        })
      case 2:
        return this.setState({
          locations: this.state.locations.sort((a, b) => a.updatedAt > b.updatedAt)
        })
    }
  }

  render() {
    const { location_types: { locationTypes }} = this.props
    return (
      <View style={{ flex: 1 }}>
        <Text>SORT BY:</Text>
        <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.buttonIndex}
            buttons={['Distance', 'Alphabetically', 'Last Updated']}
            containerStyle={{ height: 30 }}
        />
        <View style={{ flex: 1, position: 'absolute', left: 0, top: 75, bottom: 0, right: 0 }}>
          <FlatList
            data={this.state.locations}
            extraData={this.state}
            renderItem={({ item }) =>
              <LocationCard
                name={item.name}
                distance={item.distance}
                street={item.street}
                state={item.state}
                zip={item.zip}
                machines={item.machine_names} 
                type={item.location_type_id ? locationTypes.find(location => location.id === item.location_type_id).name : ""}
                navigation={this.props.navigation}
                id={item.id}
                context={'Location List'} />
            }
            keyExtractor={(item, index) => `list-item-${index}`}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ locations, location_types }) => ({ locations, location_types })
export default connect(mapStateToProps)(LocationList);
