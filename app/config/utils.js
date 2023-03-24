import AsyncStorage from "@react-native-async-storage/async-storage";

export async function retrieveItem(key) {
  try {
    const retrievedItem = await AsyncStorage.getItem(key);
    const item = JSON.parse(retrievedItem);
    return item;
  } catch (error) {
    console.log(error.message);
  }
  return;
}
