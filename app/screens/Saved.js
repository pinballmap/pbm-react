import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    FlatList,
    StyleSheet,
    View,
} from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import { ThemeContext } from '../theme-context'
import {
    HeaderBackButton,
    LocationCard,
    NotLoggedIn,
    Text
} from '../components'
import { getDistance } from '../utils/utilityFunctions'
import { selectFavoriteLocationFilterBy } from '../actions/user_actions'

const moment = require('moment')

export class Saved extends Component {
    state = {
        locations: this.props.user.faveLocations,
    }

    static navigationOptions = ({ navigation, theme }) => {
        return {
            headerLeft: <HeaderBackButton navigation={navigation} />,
            title: 'Saved',
            headerRight: <View style={{ padding: 6 }}></View>,
            headerStyle: {
                backgroundColor: theme === 'dark' ? '#1d1c1d' : '#f5fbff',
            },
            headerTintColor: theme === 'dark' ? '#fdd4d7' : '#4b5862',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1
            }
        }
    }

    updateIndex = (buttonIndex) => this.props.selectFavoriteLocationFilterBy(buttonIndex)

    sortLocations(locations, idx) {
        switch (idx) {
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
            <ThemeContext.Consumer>
                {({ theme }) => {
                    const s = getStyles(theme)
                    return (
                        <View style={s.background}>
                            {!loggedIn ?
                                <NotLoggedIn
                                    text={`Please log in to start saving your favorite locations.`}
                                    title={'Saved Locations'}
                                    onPress={() => this.props.navigation.navigate('Login')}
                                /> :
                                <View style={{ flex: 1 }}>
                                    {this.state.locations.length > 0 ?
                                        <View style={{ flex: 1 }}>
                                            <Text style={s.sort}>SORT BY:</Text>
                                            <ButtonGroup
                                                onPress={this.updateIndex}
                                                selectedIndex={this.props.user.selectedFavoriteLocationFilter}
                                                buttons={['Distance', 'Alphabetically', 'Last Added']}
                                                containerStyle={s.buttonGroupContainer}
                                                textStyle={s.textStyle}
                                                selectedButtonStyle={s.selButtonStyle}
                                                selectedTextStyle={s.selTextStyle}
                                                innerBorderStyle={s.innerBorderStyle}
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
                                                            city={item.location.city}
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
                                        <View style={{ margin: 15 }}>
                                            <Text style={s.noSaved}>{`You have no saved locations.`}</Text>
                                            <FontAwesome name="heart-o" style={s.savedIcon} />
                                            <Text style={{ fontSize: 18, textAlign: 'center' }}>{`To save your favorite locations, lookup a location then click the heart icon.`}</Text>
                                        </View>
                                    }
                                </View>
                            }
                        </View>
                    )
                }}
            </ThemeContext.Consumer>
        )
    }
}

const getStyles = theme => StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    },
    sort: {
        textAlign: 'center',
        marginTop: 5,
    },
    buttonStyle: {
        backgroundColor: theme.buttonColor,
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
    textStyle: {
        color: theme.buttonTextColor,
        fontWeight: 'bold',
    },
    selButtonStyle: {
        backgroundColor: theme.locationName,
    },
    selTextStyle: {
        color: theme.pbmText,
        fontWeight: 'bold',
    },
    savedIcon: {
        fontSize: 50,
        marginTop: 15,
        marginBottom: 15,
        textAlign: 'center',
        color: '#F53240'
    },
    noSaved: {
        fontSize: 18,
        textAlign: 'center',
        color: theme.d_9a836a
    }
})

Saved.propTypes = {
    locations: PropTypes.object,
    user: PropTypes.object,
    navigation: PropTypes.object,
    selectFavoriteLocationFilterBy: PropTypes.func,
}

const mapStateToProps = ({ locations, user }) => ({ locations, user })
const mapDispatchToProps = (dispatch) => ({
    selectFavoriteLocationFilterBy: idx => dispatch(selectFavoriteLocationFilterBy(idx)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Saved)
