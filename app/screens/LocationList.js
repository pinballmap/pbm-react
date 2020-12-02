import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
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
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5fbff',
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1
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
                        <>
                            <Text style={s.sort}>SORT BY:</Text>
                            <ButtonGroup
                                onPress={this.updateIndex}
                                selectedIndex={this.props.locations.selectedLocationListFilter}
                                buttons={['Distance', 'A-Z', 'Updated', '# Machines']}
                                containerStyle={s.buttonGroupContainer}
                                textStyle={s.textStyle}
                                selectedButtonStyle={s.selButtonStyle}
                                selectedTextStyle={s.selTextStyle}
                                innerBorderStyle={s.innerBorderStyle}
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
                        </>
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
    textStyle: {
        color: theme.pbmText
    },
    selButtonStyle: {
        backgroundColor: theme.selButton,
    },
    selTextStyle: {
        color: theme.pbmText,
        fontWeight: 'bold',
    },
    buttonGroupContainer: {
        height: 40,
        borderColor: theme.borderColor,
        borderWidth: 2,
        backgroundColor: theme._e0ebf2,
    },
    innerBorderStyle: {
        width: 1,
        color: theme.placeholder
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
