import * as React from "react";
import {
    Button,
    Dialog,
    PaperProvider,
    Portal,
    Text,
} from "react-native-paper";

interface Props {
  title: string;
  body: string;
}

const DialogBox = ({ title, body }: Props) => {
  const [visible, setVisible] = React.useState(true);

  const hideDialog = () => setVisible(false);

  return (
    <PaperProvider>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{body}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

export default DialogBox;
