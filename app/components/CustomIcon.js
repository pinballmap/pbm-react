import React from "react";
import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const CustomIcon = ({ name, size, color, type, style }) => {
  switch (type) {
    case "font-awesome":
      return (
        <FontAwesome name={name} size={size} color={color} style={style} />
      );
    case "font-awesome-6":
      return (
        <FontAwesome6 name={name} size={size} color={color} style={style} />
      );
    case "material":
    case "material-icons":
      return (
        <MaterialIcons name={name} size={size} color={color} style={style} />
      );
    case "material-community":
      return (
        <MaterialCommunityIcons
          name={name}
          size={size}
          color={color}
          style={style}
        />
      );
    case "ionicon":
      return <Ionicons name={name} size={size} color={color} style={style} />;
    default:
      return null; // Or a default icon
  }
};

export default CustomIcon;
