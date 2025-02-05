import * as Notifications from 'expo-notifications';

// Função para exibir a notificação
export async function showNotification() {

  await Notifications.setNotificationChannelAsync('Tarefas', {
    name: 'Tarefas Notifications',
    importance: Notifications.AndroidImportance.HIGH,
  });

  console.log('funciona')
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'FocusFlow',
      body: 'Você tem uma nova Tarefa para concluir',
    },  
    trigger: {
      seconds: 3,
      repeats: false,
      channelId: 'Tarefas'
    }, 
  });
}
