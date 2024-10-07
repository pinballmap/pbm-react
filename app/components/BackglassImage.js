import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

const BackglassImage = ({ width, height, source }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const s = getStyles();

  return (
    <View style={{ alignItems: "center" }}>
      <View style={[s.imageContainer, { width: width + 8 }]}>
        <Image
          style={[
            {
              width,
              height,
              resizeMode: "cover",
              borderRadius: 10,
            },
            isLoading && { display: "none" },
          ]}
          source={{ uri: source }}
          onLoadStart={() => !isLoaded && setIsLoading(true)}
          onLoadEnd={() => {
            setIsLoaded(true);
            setIsLoading(false);
          }}
        />
        {isLoading && <ActivityIndicator />}
      </View>
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    imageContainer: {
      marginBottom: 20,
      marginHorizontal: 20,
      borderWidth: 4,
      borderColor: "#e7b9f1",
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default BackglassImage;
