import { useEffect, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import httpClient from "../lib/httpClient";
import Config from "react-native-config";
import { useAppSelector } from "../../store";

export const StreamClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null,
  );
  const _user = useAppSelector(({ user }) => user);
  const apiKey = Config.STREAM_API_KEY!;

  const streamTokenProvider = async () => {
    const { data } = await httpClient.get("/user/generateStreamToken");
    setToken(data.token);
    return data.token;
  };

  useEffect(() => {
    const initializeVideoClient = async () => {
      if (!_user?._id || !_user?.name || !_user?.avatar?.url) return;

      if (!videoClient) {
        try {
          const clientToken = token || (await streamTokenProvider());

          const client = new StreamVideoClient({
            apiKey,
            user: {
              id: _user._id,
              name: _user.name,
              image: _user.avatar.url,
            },
            token: clientToken,
          });

          setVideoClient(client);
        } catch (error) {
          console.error("Error initializing video client", error);
        }
      }
    };

    initializeVideoClient();

    return () => {
      if (videoClient) {
        videoClient
          .disconnectUser()
          .catch(error => console.error("Couldn't disconnect user", error));
        setVideoClient(null);
      }
    };
  }, [_user, token, videoClient]);

  if (!videoClient) return null;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
