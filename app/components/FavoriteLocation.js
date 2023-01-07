import React, { useContext, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    Pressable,
    StyleSheet,
} from 'react-native'
import { ThemeContext } from '../theme-context'
import {
    addFavoriteLocation,
    removeFavoriteLocation,
} from '../actions'
import LottieView from 'lottie-react-native'

const FavoriteLocationHeart = ({
    user,
    locationId,
    navigation,
    addFavoriteLocation,
    removeFavoriteLocation,
    style,
    removeFavorite,
}) => {
    const removeAnimation = useRef(null)
    const addAnimation = useRef(null)
    const { theme } = useContext(ThemeContext)
    const { loggedIn, faveLocations = []} = user
    const isUserFave = faveLocations.some(fave => fave.location_id === locationId)

    const onAddPress = () => {
        if (!loggedIn) return navigation.navigate('Login')
        addAnimation?.current.play()
        setTimeout(() => addFavoriteLocation(locationId), 1000)
    }

    const onRemovePress = () => {
        removeAnimation?.current.play()
        setTimeout(() => removeFavorite(() => removeFavoriteLocation(locationId)), 1000)
    }

    if (loggedIn && isUserFave) {
        return  (
            <Pressable
                style={style}
                onPress={onRemovePress}
            >
                <LottieView
                    ref={removeAnimation}
                    style={s.icon}
                    loop={false}
                    source={theme.theme === 'dark' ? require('../assets/heart-break-dark.json') : require('../assets/heart-break-light.json')}
                />
            </Pressable>
        )
    }
    return (
        <Pressable
            style={style}
            onPress={onAddPress}
        >
            <LottieView
                ref={addAnimation}
                style={s.icon}
                loop={false}
                source={theme.theme === 'dark' ? require('../assets/heart-dark.json') : require('../assets/heart-light.json')}
            />
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
    notPressedStyle: PropTypes.object,
    removeFavorite: PropTypes.func,
}

const s = StyleSheet.create({
    icon: {
        height: 45,
        width: 45,
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
