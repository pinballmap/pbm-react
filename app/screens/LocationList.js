import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    FlatList,
    StyleSheet,
    View,
} from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { ThemeContext } from '../theme-context'
import {
    HeaderBackButton,
    LocationCard,
    Text
} from '../components'
import { getDistance } from '../utils/utilityFunctions'
import { selectLocationListFilterBy } from '../actions/locations_actions'

let deviceWidth = Dimensions.get('window').width

const moment = require('moment')

export class LocationList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            locations: this.props.locations.mapLocations,
        }
    }

    static navigationOptions = ({ navigation, theme }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} title="Map" />,
            title: 'Location List',
            headerRight: <View style={{ padding: 6 }}></View>,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#faf9f9',
                borderBottomWidth: 0
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#766a62',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
                fontWeight: 'bold'
            },
            gesturesEnabled: true
        }
    }

    updateIndex = (buttonIndex) => this.props.selectLocationListFilterBy(buttonIndex)

    sortLocations(locations, idx) {
        switch (idx) {
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
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <View style={{backgroundColor: theme.neutral}}>
                            <Text style={s.sort}>SORT BY:</Text>
                            <ButtonGroup
                                onPress={this.updateIndex}
                                selectedIndex={this.props.locations.selectedLocationListFilter}
                                buttons={['Distance', 'A-Z', 'Updated', '# Machines']}
                                containerStyle={s.buttonGroupContainer}
                                textStyle={s.buttonGroupInactive}
                                selectedButtonStyle={s.selButtonStyle}
                                selectedTextStyle={s.selTextStyle}
                                innerBorderStyle={s.innerBorderStyle}
                                disabledStyle={{shadowColor: '#dcd3d6',shadowOffset: { width: 4, height: 2 },shadowOpacity: 0.9,shadowRadius: 5,elevation: 5,}}
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
                        </View>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    sort: {
        textAlign: 'center',
        marginTop: 5,
    },
    buttonGroupContainer: {
        height: 40,
        //borderColor: theme.blue2,
        borderWidth: 0,
        backgroundColor: theme.white,
        shadowColor: '#dcd3d6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'visible'
    },
    buttonGroupInactive: {
        color: '#736f73',
        fontSize: deviceWidth < 321 ? 12 : 14,
    },
    innerBorderStyle: {
        width: 0,
        //color: theme.blue2,
    },
    selButtonStyle: {
        backgroundColor: theme.white,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 5
    },
    selTextStyle: {
        color: theme.orange8,
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
