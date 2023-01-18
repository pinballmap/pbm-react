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

const FaveLocation = ({onPress, theme, style}) => {
    const removeAnimation = useRef(null)
    const onRemovePress = () => {
        removeAnimation?.current.play()
    }
    return (
        <Pressable
            style={style}
            onPress={onRemovePress}
        >
            <LottieView
                ref={removeAnimation}
                onAnimationFinish={onPress}
                style={s.icon}
                loop={false}
                source={theme.theme === 'dark' ? require('../assets/Heart-Break-Dark.json') : require('../assets/Heart-Break-Light.json')}
            />
        </Pressable>
    )
}

const Location = ({onPress, theme, style}) => {
    const addAnimation = useRef(null)
    const onAddPress = () => {
        addAnimation?.current.play()
    }
    return (
        <Pressable
            style={style}
            onPress={onAddPress}
        >
            <LottieView
                ref={addAnimation}
                onAnimationFinish={onPress}
                style={s.icon}
                loop={false}
                source={theme.theme === 'dark' ? require('../assets/Heart-Pop-Dark.json') : require('../assets/Heart-Pop-Light.json')}
            />
        </Pressable>   
    )}

const FavoriteLocationHeart = ({
    loggedIn,
    isUserFave,
    locationId,
    addFavoriteLocation,
    removeFavoriteLocation,
    style,
    removeFavorite,
}) => {
    const { theme } = useContext(ThemeContext)

    if (loggedIn && isUserFave) {
        return <FaveLocation onPress={() => removeFavorite(() => removeFavoriteLocation(locationId))} theme={theme} style={style} />
    }
    return (
        <Location onPress={() => addFavoriteLocation(locationId)} theme={theme} style={style} />
    )
}

FavoriteLocationHeart.propTypes = {
    loggedIn: PropTypes.bool,
    isUserFave: PropTypes.bool,
    locationId: PropTypes.number,
    addFavoriteLocation: PropTypes.func,
    removeFavoriteLocation: PropTypes.func,
    style: PropTypes.object,
    pressedStyle: PropTypes.object,
    notPressedStyle: PropTypes.object,
    removeFavorite: PropTypes.func,
}

const s = StyleSheet.create({
    icon: {
        height: 55,
        width: 55,
        justifyContent: 'center',
        alignSelf: 'center',
    },
})

const mapStateToProps = ({ user }, {locationId}) => ({
    loggedIn: user?.loggedIn,
    isUserFave: user?.faveLocations.some(fave => fave.location_id === locationId)
})
const mapDispatchToProps = (dispatch) => ({
    removeFavoriteLocation: (id) => dispatch(removeFavoriteLocation(id)),
    addFavoriteLocation: (id) => dispatch(addFavoriteLocation(id)),
})
export default connect(mapStateToProps, mapDispatchToProps)(FavoriteLocationHeart)
