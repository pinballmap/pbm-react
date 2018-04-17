import React from 'react';
import { FlatList, ActivityIndicator, Text, YellowBox, View  } from 'react-native';

export default class FetchExample extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);
  }

  componentDidMount(){
    return fetch('https://pinballmap.com/api/v1/regions.json')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.regions,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <Text>PINBALL MAP ON REACT NATIVE</Text>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.full_name}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
