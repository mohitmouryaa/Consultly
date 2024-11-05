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
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (new Date(date).getDate() === yesterday.getDate()) {
    return "Yesterday";
  }
  // ELSE RETURN DATE
  return new Date(date)?.toLocaleString("en-US", {
    year: "2-digit",
    month: "short",
    day: "numeric",
  });
}
