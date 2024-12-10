declare interface ButtonProps extends TouchableHighlightProps {
  title: string;
  className?: string;
  textClassName?: string;
  loading?: boolean;
  onPress: () => void;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  rightIcon?: any;
  leftIcon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  leftIconStyle?: string;
  rightIconStyle?: string;
  className?: string;
  placeholder?: string;
  rightIconPress?: () => void;
  textContentType?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  readOnly?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

declare interface ChatItem {
  _id: string;
  name?: string;
  latestMessage: {
    content: string;
    sender: string;
    createdAt: Date;
    status: "delivered" | "seen" | "sent";
  };
  avatar?: string;
  members: string[];
  messageCount: number;
}

declare interface MessageBoxProps {
  item: ChatItem;
}

declare interface CallBoxProps {
  item: {
    id: number;
    name: string;
    callType: string;
    callSide: string;
    time: string;
    counselor?: {
      _id: number;
      name: string;
      image: string;
    };
    user?: {
      _id: number;
      name: string;
      image: string;
    };
    durationMinutes: number;
    callStartTime: Date;
    callEndTime: Date;
  };
}

declare interface TabIconProps {
  color: string;
  name: string;
  focused: boolean;
}

declare interface TransactionBoxProps {
  item: {
    // id: number;
    title: string;
    amount: string;
    date: string;
    paymentType: string;
    time: string;
  };
}

declare interface ScreenHeaderProps {
  title: string;
  children?: React.ReactNode;
  navigation?: DrawerNavigationProp;
}

declare interface ListItemProps {
  item: {
    name: string;
    icon: any;
  };
}

interface SocketProviderProps {
  children: React.ReactNode;
}

interface SocketContextProps {
  socket: Socket | null;
}

interface UseCurrentChatMemberByIdProps {
  members: string[];
  _id: string;
  name: string;
}

interface SocketContextProps {
  socket: Socket | null;
  onlineUsers: Set<string>;
}

interface StartCallPayload {
  roomId: string;
  counsellorId: string;
  userId: string;
}
