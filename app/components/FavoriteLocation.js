import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Pressable, StyleSheet } from "react-native";
import { addFavoriteLocation, removeFavoriteLocation } from "../actions";
import LottieView from "lottie-react-native";
import LoginRequiredModal from "./LoginRequiredModal";

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

const Location = ({ onPress, style, loggedIn }) => {
  const addAnimation = useRef(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const onAddPress = () => {
    if (loggedIn) {
      return addAnimation?.current.play();
    }
    setLoginModalVisible(true);
  };
  return (
    <>
      <LoginRequiredModal
        visible={loginModalVisible}
        closeModal={() => setLoginModalVisible(false)}
      />
      <Pressable style={style} onPress={onAddPress}>
        <LottieView
          ref={addAnimation}
          onAnimationFinish={onPress}
          style={s.icon}
          loop={false}
          source={require("../assets/Heart-Pop-Dark.json")}
        />
      </Pressable>
    </>
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
};

const s = StyleSheet.create({
  icon: {
    height: 60,
    width: 60,
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
