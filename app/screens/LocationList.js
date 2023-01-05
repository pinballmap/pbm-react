import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Dimensions,
    FlatList,
    StyleSheet,
    View,
} from 'react-native'
import { ButtonGroup } from '@rneui/base'
import { ThemeContext } from '../theme-context'
import {
    ConfirmationModal,
    LocationCard,
    PbmButton,
    Text
} from '../components'
import { getDistance, getDistanceWithUnit } from '../utils/utilityFunctions'
import { selectLocationListFilterBy } from '../actions/locations_actions'

let deviceWidth = Dimensions.get('window').width

const moment = require('moment')

export class LocationList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            locations: this.props.locations.mapLocations,
            showNoLocationTrackingModal: false,
        }
    }

    updateIndex = (buttonIndex) => {
        if (buttonIndex === 0 && !this.props.user.locationTrackingServicesEnabled) {
            this.setState({ showNoLocationTrackingModal: true })
        }
        this.props.selectLocationListFilterBy(buttonIndex)
    }

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
                    locations: locations.sort((a, b) => b.num_machines - a.num_machines)
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
        const { lat, lon, locationTrackingServicesEnabled, unitPreference } = this.props.user
        const { locations = [], showNoLocationTrackingModal } = this.state

        return (
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <>
                            <ConfirmationModal
                                visible={showNoLocationTrackingModal}>
                                <View>
                                    <Text style={s.confirmText}>Location tracking must be enabled to use this feature!</Text>
                                    <PbmButton
                                        title={"OK"}
                                        onPress={() => this.setState({ showNoLocationTrackingModal: false })}
                                        accessibilityLabel="Great!"
                                        containerStyle={s.buttonContainer}
                                    />
                                </View>
                            </ConfirmationModal>
                            <View style={{ flex: 1, backgroundColor: theme.base1, marginBottom: 20 }}>
                                <ButtonGroup
                                    onPress={this.updateIndex}
                                    selectedIndex={this.props.locations.selectedLocationListFilter}
                                    buttons={['Distance', 'A-Z', 'Updated', '# Machines']}
                                    containerStyle={s.buttonGroupContainer}
                                    textStyle={s.buttonGroupInactive}
                                    selectedButtonStyle={s.selButtonStyle}
                                    selectedTextStyle={s.selTextStyle}
                                    innerBorderStyle={s.innerBorderStyle}
                                />
                                <FlatList
                                    data={locations}
                                    extraData={this.state}
                                    renderItem={({ item }) =>
                                        <LocationCard
                                            locationType={item.location_type_id ? this.props.locations.locationTypes.find(location => location.id === item.location_type_id) : {}}
                                            name={item.name}
                                            distance={locationTrackingServicesEnabled ? getDistanceWithUnit(lat, lon, item.lat, item.lon, unitPreference) : undefined}
                                            street={item.street}
                                            city={item.city}
                                            state={item.state}
                                            zip={item.zip}
                                            machines={item.machine_names}
                                            navigation={this.props.navigation}
                                            id={item.id}
                                        />
                                    }
                                    keyExtractor={(item, index) => `list-item-${index}`}
                                />
                            </View>
                        </>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    buttonGroupContainer: {
        height: 40,
        borderWidth: 0,
        borderRadius: 25,
        backgroundColor: theme.base3,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'visible'
    },
    buttonGroupInactive: {
        color: theme.text2,
        fontSize: deviceWidth < 321 ? 12 : 14,
    },
    innerBorderStyle: {
        width: 0,
    },
    selButtonStyle: {
        borderWidth: 4,
        borderColor: theme.base4,
        backgroundColor: theme.white,
        borderRadius: 25
    },
    selTextStyle: {
        color: theme.text2,
        fontFamily: 'regularBoldFont',
    },
    confirmText: {
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10
    },
    buttonContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
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
