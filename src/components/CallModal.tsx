import { memo, useEffect } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { type Socket } from "socket.io-client";
import { CALL_CANCELLED } from "../constants";

interface ModalProps {
  name: string;
  avatar: string;
  members: string[];
  socket: Socket | null;
  setShowModal: (show: boolean) => void;
}
export default memo(function CallModal({
  name,
  avatar,
  members,
  socket,
  setShowModal,
}: ModalProps) {
  const handleCallCancel = () => {
    socket?.emit(CALL_CANCELLED, { members });
    setShowModal(false);
  };

  useEffect(() => {
    return () => {
      socket?.off(CALL_CANCELLED);
    };
  });
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={handleCallCancel}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text className="text-2xl text-black">Calling {name} ...</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={handleCallCancel}>
            <Text style={styles.textStyle}>Cancel</Text>
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
