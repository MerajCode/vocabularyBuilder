import * as Notifications from "expo-notifications";

export const initializeNotifications = async () => {
  
  console.log("initialized");
  await Notifications.requestPermissionsAsync();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: false,
    }),
  });
};
