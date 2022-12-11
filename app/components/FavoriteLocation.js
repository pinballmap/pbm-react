import React, { useContext } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    Pressable,
    StyleSheet,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ThemeContext } from '../theme-context'
import {
    addFavoriteLocation,
    removeFavoriteLocation,
} from '../actions'

const FavoriteLocationHeart = ({
    user,
    locationId,
    navigation,
    addFavoriteLocation,
    removeFavoriteLocation,
    style,
    pressedStyle,
    notPressedStyle
}) => {
    const { theme } = useContext(ThemeContext)
    const { loggedIn, faveLocations = []} = user
    const isUserFave = faveLocations.some(fave => fave.location_id === locationId)

    const onPress = () => {
        if (!loggedIn) return navigation.navigate('Login')
        return isUserFave ? removeFavoriteLocation(locationId) : addFavoriteLocation(locationId)
    }

    return (
        <Pressable
            style={({ pressed }) => [pressed ? pressedStyle: notPressedStyle, style]}
            onPress={onPress}
        >
            {loggedIn && isUserFave ?
                <MaterialCommunityIcons
                    name={'heart'}
                    color={theme.pink1}
                    size={26}
                    style={s.icon}
                /> :
                <MaterialCommunityIcons
                    name={'heart-outline'}
                    color={theme.pink1}
                    size={26}
                    style={s.icon}
                />
            }
        </Pressable>
    )
}

FavoriteLocationHeart.propTypes = {
    user: PropTypes.object,
    locationId: PropTypes.number,
    addFavoriteLocation: PropTypes.func,
    removeFavoriteLocation: PropTypes.func,
    navigation: PropTypes.object,
    style: PropTypes.object,
    pressedStyle: PropTypes.object, 
    notPressedStyle: PropTypes.object
}

const s = StyleSheet.create({
    icon: {
        height: 26,
        width: 26,
        justifyContent: 'center',
        alignSelf: 'center',
    },
})

const mapStateToProps = ({ user }) => ({user})
const mapDispatchToProps = (dispatch) => ({
    removeFavoriteLocation: (id) => dispatch(removeFavoriteLocation(id)),
    addFavoriteLocation: (id) => dispatch(addFavoriteLocation(id)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FavoriteLocationHeart)
