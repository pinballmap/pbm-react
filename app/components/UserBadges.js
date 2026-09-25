import React, { useContext } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { ThemeContext } from "../theme-context";
import flagImages, { getFlagWidth } from "../utils/flagImages";

const BASE_ICON_SIZE = 18;
const MAX_FONT_SCALE = 1.6;
const SCALE_OFFSET = 2;

export const useBadgeIconSize = () => {
  const { fontScale } = useWindowDimensions();
  const clampedScale = Math.min(fontScale, MAX_FONT_SCALE);
  return clampedScale > 1
    ? BASE_ICON_SIZE * clampedScale - SCALE_OFFSET * clampedScale
    : BASE_ICON_SIZE;
};

const contributorIcons = {
  "Super Mapper": require("../assets/images/SuperMapper.png"),
  "Legendary Mapper": require("../assets/images/LegendaryMapper.png"),
  "Grand Champ Mapper": require("../assets/images/GrandChampMapper.png"),
};

// Username plus admin/contributor/flag badges. Pass isOperator to show the
// operator wrench inline; callers that show operator info on its own line
// (e.g. MachineComment) leave it off.
const UserBadges = ({
  username,
  userId,
  userDeleted,
  adminTitle,
  contributorRank,
  flag,
  isOperator = false,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const navigation = useNavigation();
  const iconSize = useBadgeIconSize();
  const isUserLinkable = !!userId && !userDeleted;
  const displayUsername = username || (userDeleted ? "DELETED USER" : null);
  const contributorIcon = contributorIcons[contributorRank];

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {!!displayUsername && (
        <Text
          style={
            isUserLinkable
              ? [s.username, s.semiBold]
              : [s.usernamePlain, s.semiBold]
          }
          onPress={() =>
            isUserLinkable &&
            navigation.navigate("UserProfilePublic", {
              userId,
              username,
            })
          }
        >
          {displayUsername}
        </Text>
      )}
      {!!adminTitle && (
        <MaterialCommunityIcons
          name="shield-account"
          size={iconSize}
          color={theme.shield}
          style={[s.rankIcon, { marginRight: 3 }]}
        />
      )}
      {!!contributorIcon && (
        <Image
          contentFit="fill"
          source={contributorIcon}
          style={[s.rankIcon, { width: iconSize, height: iconSize }]}
        />
      )}
      {isOperator && (
        <MaterialCommunityIcons
          name="wrench"
          size={iconSize}
          color={theme.wrench}
          style={[s.rankIcon, { width: iconSize, height: iconSize }]}
        />
      )}
      {!!flag && flagImages[flag] && (
        <Image
          source={flagImages[flag]}
          style={[
            s.flagIcon,
            { height: iconSize, width: getFlagWidth(flag, 15) },
          ]}
        />
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    semiBold: {
      fontFamily: "Nunito",
      fontWeight: "600",
    },
    username: {
      color: theme.pink1,
      fontSize: 14,
      textDecorationLine: "underline",
    },
    usernamePlain: {
      color: theme.text2,
      fontSize: 14,
    },
    rankIcon: {
      marginLeft: 3,
    },
    flagIcon: {
      marginLeft: 7,
      borderRadius: 3,
    },
  });

export default UserBadges;
