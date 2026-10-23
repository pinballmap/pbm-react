import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { retrieveItem } from "./utils";

const AUTH_KEY = "auth";
const TOKEN_KEY = "authToken";

// The auth token is kept in the Keychain/Keystore; the rest of the auth record
// stays in AsyncStorage. The iOS Keychain survives an uninstall but AsyncStorage
// does not, so a stored token is only used while its AsyncStorage record exists.
export const saveAuth = async (auth) => {
  const { authentication_token, ...rest } = auth;
  try {
    if (authentication_token) {
      await SecureStore.setItemAsync(TOKEN_KEY, authentication_token);
    } else if (!auth.id) {
      // Only a logged-out record (logout / login later) clears the token, so
      // a login dispatched without one can't wipe a valid token
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(rest));
  } catch (error) {
    console.log(error.message);
  }
};

const readToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    // e.g. Android restored a backup whose Keystore key no longer exists
    console.log(error.message);
    return null;
  }
};

export const loadAuth = async () => {
  const auth = await retrieveItem(AUTH_KEY);
  if (!auth?.id) return auth;

  // Records saved before SecureStore still hold the token; move it over
  if (auth.authentication_token) {
    await saveAuth(auth);
    return auth;
  }

  const authentication_token = await readToken();
  if (!authentication_token) return { loggedIn: false };

  return { ...auth, authentication_token };
};
