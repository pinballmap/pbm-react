import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import Text from "./PbmText";

const ICON_SIZE = 22;
const BUTTON_PADDING = 14;
// MDI chevrons only occupy x≈8–15.4 of their 24-unit grid, leaving ~1/3 of the
// icon box as blank space on each side. Subtract that from the padding on the
// icon side so the visible chevron and the text have equal padding.
const ICON_SIDE_PADDING = BUTTON_PADDING - Math.round((ICON_SIZE * 8) / 24);

const Pagination = ({ page, pages, hasNext, onPageChange }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  if (!pages || pages <= 1) return null;

  const hasPrev = page > 1;

  return (
    <View style={s.paginationContainer}>
      <Pressable
        onPress={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        style={[s.pageButton, s.prevButton, !hasPrev && s.pageButtonInactive]}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={ICON_SIZE}
          color={hasPrev ? theme.text2 : theme.text3}
        />
        <Text style={[s.pageButtonText, !hasPrev && s.pageButtonTextInactive]}>
          Prev
        </Text>
      </Pressable>
      <Text style={s.pageIndicator}>
        {page} / {pages}
      </Text>
      <Pressable
        onPress={() => onPageChange(page + 1)}
        disabled={!hasNext}
        style={[s.pageButton, s.nextButton, !hasNext && s.pageButtonInactive]}
      >
        <Text style={[s.pageButtonText, !hasNext && s.pageButtonTextInactive]}>
          Next
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={ICON_SIZE}
          color={hasNext ? theme.text2 : theme.text3}
        />
      </Pressable>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    paginationContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      gap: 12,
    },
    pageButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: BUTTON_PADDING,
      borderRadius: 20,
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.pink2,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    prevButton: {
      paddingLeft: ICON_SIDE_PADDING,
    },
    nextButton: {
      paddingRight: ICON_SIDE_PADDING,
    },
    pageButtonInactive: {
      borderColor: theme.theme == "dark" ? theme.base3 : theme.base2,
      shadowOpacity: 0,
      elevation: 0,
    },
    pageButtonText: {
      color: theme.text2,
      fontSize: 14,
      fontFamily: "Nunito",
      fontWeight: "600",
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    pageButtonTextInactive: {
      color: theme.text3,
    },
    pageIndicator: {
      color: theme.text3,
      fontSize: 14,
      minWidth: 40,
      textAlign: "center",
      fontFamily: "Nunito",
      fontWeight: "400",
      includeFontPadding: false,
      textAlignVertical: "center",
    },
  });

Pagination.propTypes = {
  page: PropTypes.number,
  pages: PropTypes.number,
  hasNext: PropTypes.bool,
  onPageChange: PropTypes.func,
};

export default Pagination;
