declare module "react-native-config" {
  export interface NativeConfig {
    SERVER_URL?: string;
    SQL_SERVER_URL?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
