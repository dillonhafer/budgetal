import { Alert } from "react-native";

export const error = (msg: string, delay?: number) => {
  global.alertWithType("error", "Error", msg, { delay });
};

export const notice = (msg: string, delay?: number) => {
  global.alertWithType("success", "Success", msg, { delay });
};

export const info = (msg: string, delay?: number) => {
  global.alertWithType("info", "Information", msg, { delay });
};

export const maintenance = (msg: string, delay?: number) => {
  global.alertWithType("custom", "Server Updates", msg, { delay });
};

export const confirm = ({
  okText,
  cancelText,
  title,
  content,
  onOk,
  onCancel,
}: {
  okText: string;
  cancelText?: string;
  content?: string;
  title: string;
  onOk(): void;
  onCancel?(): void;
}) => {
  Alert.alert(
    title || "Confirm",
    content || "Are you sure?",
    [
      {
        text: cancelText || "Cancel",
        style: "cancel",
        onPress: onCancel,
      },
      {
        text: okText || "OK",
        style: "destructive",
        onPress: onOk,
      },
    ],
    { cancelable: true }
  );
};
