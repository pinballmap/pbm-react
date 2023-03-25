import React from "react";

export const ThemeContext = React.createContext({
  toggleDefaultTheme: () => {},
  toggleDarkTheme: () => {},
  theme: {},
});
