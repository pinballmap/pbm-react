import React from "react";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6/static";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";

const CustomIcon = ({ name, size, color, type, style }) => {
  switch (type) {
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
