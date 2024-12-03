import { Call, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../store";
import { generateRoomId } from "../lib/utils";

const DEFAULT_CALL_TYPE = "default";
const MAX_RETRIES = 5;

export const useSetCall = ({ meetingId }: { meetingId: string }) => {
  const chatId = useAppSelector(state => state.chat.currentChatInfo._id);
  const callId = useRef(generateRoomId(12));
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!client || retryCount >= MAX_RETRIES) {
      return;
    }

    const fetchCall = async () => {
      try {
        const callToSet = client.call(
          DEFAULT_CALL_TYPE,
          meetingId || chatId || callId.current,
        );
        await callToSet.getOrCreate();
        setCall(callToSet);
        setRetryCount(0); // Reset retry count on success
        // setQueryParams(); // Call this after setting the call
        if (!meetingId) {
          // SOCKET
        }
      } catch (error) {
        console.error("Error creating or getting call:", error);
        setRetryCount(prevCount => prevCount + 1);

        // Retry with exponential backoff
        const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff delay
        setTimeout(() => {
          fetchCall();
        }, retryDelay);
      }
    };

    fetchCall();

    // Cleanup function to handle potential cancellation
    return () => {
      // Optionally, clear timers or perform other cleanup
    };
  }, [chatId, client, meetingId, retryCount]); // Removed navigate and location.search from dependencies

  return call;
};
