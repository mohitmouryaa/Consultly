import * as Keychain from "react-native-keychain";
import { MMKVLoader } from "react-native-mmkv-storage";

const mmkv = new MMKVLoader().initialize();

export const storeToken = async (token: string) => {
  try {
    await Keychain.setGenericPassword("consultlyKey", token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

export const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error("Error retrieving token:", error);
  }
};

export const deleteToken = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error("Error deleting token:", error);
  }
};

export const isFirstLaunch = async () => {
  try {
    const hasLaunched = await mmkv.getStringAsync("consultly-hasLaunched");
    if (hasLaunched === null) {
      await mmkv.setStringAsync("consultly-hasLaunched", "true");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking first launch:", error);
    return false;
  }
};
