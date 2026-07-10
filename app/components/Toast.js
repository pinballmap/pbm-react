import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import Text from "./PbmText";

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(timeoutRef.current);
    setToastMessage(message);
    timeoutRef.current = setTimeout(() => setToastMessage(null), 2000);
  }, []);

  return { toastMessage, showToast };
};

const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <View style={s.wrapper}>
      <View style={s.container}>
        <Text style={s.text}>{message}</Text>
      </View>
    </View>
  );
};

Toast.propTypes = {
  message: PropTypes.string,
};

const s = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 100,
  },
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  text: {
    color: "white",
    fontSize: 13,
    fontFamily: "Nunito-SemiBold",
  },
});

export default Toast;
