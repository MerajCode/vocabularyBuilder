import React from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

interface props {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  header: {
    title: string;
    icon?: React.ReactNode;
  };
  onPress?: () => void;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modalVisible: boolean;
}

const ModalComponent = ({ children, trigger, header, onPress,setModalVisible,modalVisible }: props) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const modalBackgroundColor = isDarkMode ? "#1E1E1E" : "#FFFFFF";
  const textColor = isDarkMode ? "#E0E0E0" : "#333";

  const VisibleHandle = () => {
    setModalVisible(true);
    onPress?.();
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Pressable onPress={VisibleHandle}>{trigger}</Pressable>

      <Modal
        style={{
          zIndex: 1000,
        }}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: modalBackgroundColor },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Select Items
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </Pressable>
            </View>
            {children}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  modalHeader: {
    paddingTop:20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 30,
    fontWeight: "300",
    color: "#888",
  },
});

export default ModalComponent;
  