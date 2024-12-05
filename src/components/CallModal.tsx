import React, { memo } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store";
import { setCallerDetails, setCallModal } from "../../store/slices/chatSlice";
import { useSocket } from "../providers/socketProvider";
import { CALL_PICKED, CALL_REJECTED, UPDATE_CALLER } from "../constants";
import httpClient from "../lib/httpClient";

export default memo(function CallModal() {
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const modalVisible = useAppSelector(state => state.chat.openCallModal);
  const caller = useAppSelector(state => state.chat.caller);
  const user = useAppSelector(state => state.user);

  const handleCallAccept = async () => {
    dispatch(setCallModal(false));
    const { callerId, chatId } = caller;
    if (!callerId || !chatId) return;
    socket?.emit(CALL_PICKED, { user: { _id: user._id }, callerId, chatId });
    let counsellorId = null;
    let userId = null;

    if (caller.user_type === "user") {
      userId = caller.sql_id;
      counsellorId = user.sql_id;
    } else if (user.user_type === "user") {
      counsellorId = caller.sql_id;
      userId = user.sql_id;
    }
    try {
      const response = await httpClient.post(
        `http://89.40.9.101:8080/api/startCall`,
        {
          roomId: caller.chatId,
          counsellorId,
          userId,
        },
      );
      dispatch(setCallerDetails({ ...caller, id: response.data.callData.id }));

      socket?.emit(UPDATE_CALLER, { caller, id: response.data.callData.id });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCallReject = () => {
    dispatch(setCallModal(false));
    dispatch(setCallerDetails({}));
    const { callerId, chatId } = caller;
    console.log("callerId", callerId);
    console.log("chatId", chatId);
    if (!callerId || !chatId) return;
    socket?.emit(CALL_REJECTED, { callerId, chatId });
  };

  if (!caller || Object.values(caller).length === 0) return null;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCallReject}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text className="text-2xl text-black">{caller.name}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={handleCallAccept}>
            <Text style={styles.textStyle}>Accept</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={handleCallReject}>
            <Text style={styles.textStyle}>Reject</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  centeredView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    zIndex: 1000,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
