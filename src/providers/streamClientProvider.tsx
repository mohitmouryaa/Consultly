import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLayoutEffect, useState } from "react";
import { useAppSelector } from "../../store";
import httpClient from "../lib/httpClient";

type ProviderProps = {
  children: React.ReactNode;
};

export default function StreamClientProvider({ children }: ProviderProps) {
  const [streamClient, setStreamClient] = useState<StreamVideoClient | null>();
  const _user = useAppSelector(({ user }) => user);

  async function streamTokenProvider() {
    try {
      const { data } = await httpClient.get(`/user/generateStreamToken`);
      return data.token;
    } catch (err) {
      console.error(err);
    }
  }

  useLayoutEffect(() => {
    const initializeStreamClient = async () => {
      const token = await streamTokenProvider();
      if (!_user._id || !token) return;
      const user = {
        id: _user._id!,
        name: _user.name!,
        image: _user.avatar?.url!,
      };

      const client = StreamVideoClient.getOrCreateInstance({
        apiKey: "72hm7n8h6km2",
        user,
        token,
      });
      setStreamClient(client);
    };
    if (streamClient) return;
    initializeStreamClient();

    return () => {
      if (streamClient) {
        streamClient
          ?.disconnectUser()
          ?.catch(error => console.error(`Couldn't disconnect user`, error));
        setStreamClient(undefined);
      }
    };
  }, [_user]);

  if (!streamClient) return null;
  return <StreamVideo client={streamClient}>{children}</StreamVideo>;
}
