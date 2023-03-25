import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function (type) {
  switch (type) {
    case "new_lmx":
      return (
        <MaterialCommunityIcons name="plus-box" size={28} color="#58a467" />
      );
    case "new_condition":
      return (
        <MaterialCommunityIcons name="comment-text" size={28} color="#6cbffe" />
      );
    case "remove_machine":
      return (
        <MaterialCommunityIcons name="minus-box" size={28} color="#f56f79" />
      );
    case "new_msx":
      return (
        <MaterialCommunityIcons name="numeric" size={28} color="#eeb152" />
      );
    case "confirm_location":
      return (
        <MaterialCommunityIcons
          name="clipboard-check"
          size={28}
          color="#d473df"
        />
      );
    default:
      return null;
  }
}
