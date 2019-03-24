import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatList, View, StyleSheet } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation'
import { LocationCard, NotLoggedIn, Text } from '../components'
import { getDistance } from '../utils/utilityFunctions'
import { selectFavoriteLocationFilterBy } from '../actions/user_actions'
import { FontAwesome } from '@expo/vector-icons'

const moment = require('moment')

export class LocationList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            locations: this.props.user.faveLocations,
        }
    }
  
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor="#4b5862" onPress={() => navigation.goBack(null)} />,          
            title: 'Saved',
            headerStyle: {
                backgroundColor:'#f5fbff',                
            },
            headerTintColor: '#4b5862'
        }
    }
  
  updateIndex = (buttonIndex) => this.props.selectFavoriteLocationFilterBy(buttonIndex)

  sortLocations(locations, idx) {
      switch(idx) {
      case 0:
          return this.setState({
              locations: locations.sort((a, b) => getDistance(this.props.user.lat, this.props.user.lon, a.location.lat, a.location.lon) - getDistance(this.props.user.lat, this.props.user.lon, b.location.lat, b.location.lon))
          })
      case 1:
          return this.setState({
              locations: locations.sort((a, b) => {
                  const locA = a.location.name.toUpperCase()  
                  const locB = b.location.name.toUpperCase()
                  return locA < locB ? -1 : locA === locB ? 0 : 1
              })
          })
      case 2:
          return this.setState({
              locations: locations.sort((a, b) => moment(b.updated_at, 'YYYY-MM-DDTh:mm:ss').unix() - moment(a.updated_at, 'YYYY-MM-DDTh:mm:ss').unix())
          })
      }
  }

  UNSAFE_componentWillReceiveProps(props) {
      if (this.props.user.faveLocations !== props.user.faveLocations) {
          this.sortLocations(props.user.faveLocations, this.props.user.selectedFavoriteLocationFilter)
      }

      if (this.props.user.selectedFavoriteLocationFilter !== props.user.selectedFavoriteLocationFilter) {
          this.sortLocations(props.user.faveLocations, props.user.selectedFavoriteLocationFilter)
      }
  }

  componentDidMount() {
      this.sortLocations(this.state.locations, this.props.user.selectedFavoriteLocationFilter)
  }

  render() { 
      const { loggedIn } = this.props.user     
      return (
          <View style={{ flex: 1,backgroundColor:'#f5fbff' }}>
              {!loggedIn ? 
                  <NotLoggedIn 
                      text={`Please login to start saving your favorite locations.`}
                      title={'Saved Locations'}
                      onPress={() => this.props.navigation.navigate('Login')}
                  /> :
                  <View style={{ flex: 1 }}>
                      {this.state.locations.length > 0 ? 
                          <View style={{ flex: 1}}>
                              <Text style={s.sort}>SORT BY:</Text>
                              <ButtonGroup
                                  onPress={this.updateIndex}
                                  selectedIndex={this.props.user.selectedFavoriteLocationFilter}
                                  buttons={['Distance', 'Alphabetically', 'Last Added']}
                                  containerStyle={{ height: 40, borderColor:'#97a5af', borderWidth: 2 }}
                                  selectedButtonStyle={s.buttonStyle}
                                  selectedTextStyle={s.textStyle}
                              />
                              <View style={{ flex: 1, position: 'absolute', left: 0, top: 70, bottom: 0, right: 0 }}>
                                  <FlatList
                                      data={this.state.locations}
                                      extraData={this.state}
                                      renderItem={({ item }) => 
                                          <LocationCard
                                              name={item.location.name}
                                              distance={getDistance(this.props.user.lat, this.props.user.lon, item.location.lat, item.location.lon)}
                                              street={item.location.street}
                                              state={item.location.state}
                                              zip={item.location.zip}
                                              machines={item.location.machines} 
                                              type={item.location.location_type_id ? this.props.locations.locationTypes.find(location => location.id === item.location.location_type_id).name : ""}
                                              navigation={this.props.navigation}
                                              id={item.location.id}
                                          />
                                      }
                                      keyExtractor={(item, index) => `list-item-${index}`}
                                  />
                              </View>
                          </View> : 
                          <View style={{margin:15}}>
                              <Text style={{fontSize:18,textAlign:'center',color:'#4b5862'}}>{`You have no saved locations.`}</Text>
                              <FontAwesome name="heart-o" style={s.savedIcon} />
                              <Text style={{fontSize:18,textAlign:'center'}}>{`To save your favorite locations, lookup a location then click the heart icon.`}</Text>
                          </View> 
                      }
                  </View>
              }
          </View>
      )
  }
}

const s = StyleSheet.create({
    sort: {
        textAlign: 'center',
        marginTop: 5,
    },
    buttonStyle: {
        backgroundColor: '#D3ECFF',
    },
    textStyle: {
        color: '#000e18',
        fontWeight: 'bold',
    },
    savedIcon: {
        fontSize: 50,
        marginTop: 15,
        marginBottom: 15,
        textAlign: 'center',
        color: '#F53240'
    },
})

LocationList.propTypes = {
    locations: PropTypes.object, 
    user: PropTypes.object, 
    navigation: PropTypes.object,
    selectFavoriteLocationFilterBy: PropTypes.func,
}

const mapStateToProps = ({ locations, user }) => ({ locations, user })
const mapDispatchToProps = (dispatch) => ({
    selectFavoriteLocationFilterBy: idx => dispatch(selectFavoriteLocationFilterBy(idx)),
})
export default connect(mapStateToProps, mapDispatchToProps)(LocationList)
