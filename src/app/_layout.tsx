import { Stack } from 'expo-router'

export default function MainLayout() {
  return (
    <Stack>
      {/*Telas de Quando Usuario Não está conectado*/}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen 
          name='(auth)/signup/page'
          options={{ headerShown: false }}
      />
      <Stack.Screen 
          name='(auth)/mainPage/page'
          options={{ headerShown: false }}
      />
      <Stack.Screen 
          name='(auth)/login/page'
          options={{ headerShown: false }}
      />
      <Stack.Screen 
          name='(auth)/recuperarSenha/page'
          options={{ headerShown: false }}
      />

      {/*Telas de Quando Usuario está conectado*/}
      <Stack.Screen 
          name='(panel)/GeneralScreen/page'
          options={{ headerShown: false }}
      />
      <Stack.Screen 
          name='(panel)/EditTask/[id]'
          options={{ headerShown: false }}
      />
    </Stack>
  )
}