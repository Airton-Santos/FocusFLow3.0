import * as Notifications from "expo-notifications";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
    }),
  });


export async function sendInstantNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Tutorial",
      body: "Você pulou o tutorial",
    },
    trigger: null, // Executa imediatamente
  });
}
