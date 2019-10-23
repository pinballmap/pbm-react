import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
    FlatList, 
    StyleSheet,
    View, 
} from 'react-native'
import { ButtonGroup, ThemeConsumer } from 'react-native-elements'
import { 
    HeaderBackButton,
    LocationCard,
    Screen,
    Text 
} from '../components'
import { getDistance } from '../utils/utilityFunctions'
import { selectLocationListFilterBy } from '../actions/locations_actions'

const moment = require('moment')

export class LocationList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            locations: this.props.locations.mapLocations,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} title="Map" />,
            title: 'Location List',
            headerRight:<View style={{padding:6}}></View>,
        }
    }

    updateIndex = (buttonIndex) => this.props.selectLocationListFilterBy(buttonIndex)
    
    sortLocations(locations, idx) {
        switch(idx) {
        case 0:
            return this.setState({
                locations: locations.sort((a, b) => getDistance(this.props.user.lat, this.props.user.lon, a.lat, a.lon) - getDistance(this.props.user.lat, this.props.user.lon, b.lat, b.lon))
            })
        case 1:
            return this.setState({
                locations: locations.sort((a, b) => {
                    const locA = a.name.toUpperCase()  
                    const locB = b.name.toUpperCase()
                    return locA < locB ? -1 : locA === locB ? 0 : 1
                })
            })
        case 2:
            return this.setState({
                locations: locations.sort((a, b) => moment(b.updated_at, 'YYYY-MM-DDTh:mm:ss').unix() - moment(a.updated_at, 'YYYY-MM-DDTh:mm:ss').unix())
            })
        case 3: 
            return this.setState({
                locations: locations.sort((a, b) => b.machine_names.length - a.machine_names.length)
            })
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (this.state.locations !== props.locations.mapLocations) {
            this.sortLocations(props.locations.mapLocations, this.props.locations.selectedLocationListFilter)
        }
  
        if (this.props.locations.selectedLocationListFilter !== props.locations.selectedLocationListFilter) {
            this.sortLocations(this.state.locations, props.locations.selectedLocationListFilter)
        }
    }
  
    componentDidMount() {
        this.sortLocations(this.state.locations, this.props.locations.selectedLocationListFilter)
    }

    render() {
        const { lat, lon, locationTrackingServicesEnabled } = this.props.user
        const { locations = [] } = this.state

        return (
            <ThemeConsumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <Screen>
                            <Text style={s.sort}>SORT BY:</Text>
                            <ButtonGroup
                                onPress={this.updateIndex}
                                selectedIndex={this.props.locations.selectedLocationListFilter}
                                buttons={['Distance', 'A-Z', 'Updated', '# Machines']}
                                containerStyle={{ height: 40, borderColor:'#e0ebf2', borderWidth: 2 }}
                                selectedButtonStyle={s.buttonStyle}
                                selectedTextStyle={s.textStyle}
                            />
                            <FlatList
                                data={locations}
                                extraData={this.state}
                                renderItem={({ item }) =>
                                    <LocationCard
                                        name={item.name}
                                        distance={locationTrackingServicesEnabled ? getDistance(lat, lon, item.lat, item.lon) : undefined}
                                        street={item.street}
                                        city={item.city}
                                        state={item.state}
                                        zip={item.zip}
                                        machines={item.machine_names} 
                                        type={item.location_type_id ? this.props.locations.locationTypes.find(location => location.id === item.location_type_id).name : ""}
                                        navigation={this.props.navigation}
                                        id={item.id}
                                    />
                                }
                                keyExtractor={(item, index) => `list-item-${index}`}
                            />
                        </Screen>
                    )
                }}
            </ThemeConsumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
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
})

LocationList.propTypes = {
    locations: PropTypes.object, 
    user: PropTypes.object, 
    navigation: PropTypes.object,
    selectLocationListFilterBy: PropTypes.func,
}

const mapStateToProps = ({ locations, user }) => ({ locations, user })
const mapDispatchToProps = dispatch => ({
    selectLocationListFilterBy: idx => dispatch(selectLocationListFilterBy(idx))
})
export default connect(mapStateToProps, mapDispatchToProps)(LocationList)
