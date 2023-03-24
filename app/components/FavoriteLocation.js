import React, { useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Pressable, StyleSheet } from "react-native";
import { addFavoriteLocation, removeFavoriteLocation } from "../actions";
import LottieView from "lottie-react-native";

const FaveLocation = ({ onPress, style }) => {
  const removeAnimation = useRef(null);
  const onRemovePress = () => {
    removeAnimation?.current.play();
  };
  return (
    <Pressable style={style} onPress={onRemovePress}>
      <LottieView
        ref={removeAnimation}
        onAnimationFinish={onPress}
        style={s.icon}
        loop={false}
        source={require("../assets/Heart-Break-Dark.json")}
      />
    </Pressable>
  );
};

const Location = ({ onPress, style, navigation, loggedIn }) => {
  const addAnimation = useRef(null);
  const onAddPress = () => {
    if (loggedIn) {
      return addAnimation?.current.play();
    }
    navigation.navigate("Login");
  };
  return (
    <Pressable style={style} onPress={onAddPress}>
      <LottieView
        ref={addAnimation}
        onAnimationFinish={onPress}
        style={s.icon}
        loop={false}
        source={require("../assets/Heart-Pop-Dark.json")}
      />
    </Pressable>
  );
};

const FavoriteLocationHeart = ({
  loggedIn,
  isUserFave,
  locationId,
  addFavoriteLocation,
  removeFavoriteLocation,
  style,
  removeFavorite,
  navigation,
}) => {
  if (loggedIn && isUserFave) {
    return (
      <FaveLocation
        onPress={() => removeFavorite(() => removeFavoriteLocation(locationId))}
        style={style}
      />
    );
  }

  return (
    <Location
      onPress={() => addFavoriteLocation(locationId)}
      style={style}
      loggedIn={loggedIn}
      navigation={navigation}
    />
  );
};

FavoriteLocationHeart.propTypes = {
  loggedIn: PropTypes.bool,
  isUserFave: PropTypes.bool,
  locationId: PropTypes.number,
  addFavoriteLocation: PropTypes.func,
  removeFavoriteLocation: PropTypes.func,
  style: PropTypes.object,
  removeFavorite: PropTypes.func,
  navigation: PropTypes.object,
};

const s = StyleSheet.create({
  icon: {
    height: 55,
    width: 55,
    justifyContent: "center",
    alignSelf: "center",
  },
});

const mapStateToProps = ({ user }, { locationId }) => {
  const { loggedIn, faveLocations = [] } = user ?? {};
  return {
    loggedIn,
    isUserFave: faveLocations.some((fave) => fave.location_id === locationId),
  };
};
const mapDispatchToProps = (dispatch) => ({
  removeFavoriteLocation: (id) => dispatch(removeFavoriteLocation(id)),
  addFavoriteLocation: (id) => dispatch(addFavoriteLocation(id)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoriteLocationHeart);
