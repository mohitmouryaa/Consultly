import { MMKVLoader } from "react-native-mmkv-storage";

const mmkv = new MMKVLoader().initialize();

export const storeToken = async (token: string) => {
  try {
    await mmkv.setStringAsync("consultlyKey", token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

export const getToken = async () => {
  try {
    const token = await mmkv.getStringAsync("consultlyKey");
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
  }
};

export const deleteToken = async () => {
  try {
    mmkv.removeItem("consultlyKey");
  } catch (error) {
    console.error("Error deleting token:", error);
  }
};

export const checkFirstLaunch = async () => {
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
