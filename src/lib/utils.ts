import { RAZORPAY_KEY_ID } from "@env";
import RazorpayCheckout from "react-native-razorpay";

export function convertDate(date: Date) {
  if (!date) {
    return null;
  }
  return new Date(date)?.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "numeric",
    month: "short",
  });
}

export function convertChatDate(date: Date) {
  if (!date) {
    return null;
  }
  // CHECK IF DATE IS TODAY
  const today = new Date();
  if (new Date(date).getDate() === today.getDate()) {
    return new Date(date)?.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  // CHECK IF DATE IS YESTERDAY
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (new Date(date).getDate() === yesterday.getDate()) {
    return `Yesterday - ${new Date(date)?.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  }
  // ELSE RETURN DATE
  return new Date(date)?.toLocaleString("en-US", {
    year: "2-digit",
    month: "short",
    day: "numeric",
  });
}
// Function to get current time in HH:MM format
export const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // returns "HH:MM"
};

export function generateRoomId(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

interface PaymentProps {
  amount: number;
  orderId: string;
  currency?: string;
  email: string;
  name: string;
  description?: string;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  theme?: {
    color: string;
  };
}

export const initiatePayment = async ({
  amount,
  orderId,
  currency = "USD",
  email,
  name,
  description = "Consultly Plan Purchase",
  prefill,
  theme,
}: PaymentProps) => {
  const options = {
    description,
    currency,
    key: RAZORPAY_KEY_ID,
    amount: amount,
    name: "Consultly",
    order_id: orderId,
    prefill: {
      email,
      name,
      contact: prefill?.contact || "",
    },
    theme: theme || { color: "#534ECC" },
  };

  try {
    const data = await RazorpayCheckout.open(options);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
