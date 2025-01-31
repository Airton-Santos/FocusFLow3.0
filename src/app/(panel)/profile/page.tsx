import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import { getAuth, signOut, updateProfile, sendEmailVerification, verifyBeforeUpdateEmail } from 'firebase/auth';
import md5 from 'md5';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const [name, setName] = useState<string>(user?.displayName || '');
  const [newEmail, setNewEmail] = useState<string>('');

  // Função para gerar URL do Gravatar com o email
  const generateGravatarUrl = (email: string | null): string => {
    if (!email) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon';
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  // Função para atualizar o nome do usuário
  const handleUpdateName = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado!');
      return;
    }

    try {
      await updateProfile(user, {
        displayName: name,
      });
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  // Função para atualizar o email
  const handleUpdateEmail = async () => {
    if (!user || !newEmail) {
      Alert.alert('Erro', 'Por favor, insira um novo e-mail válido.');
      return;
    }

    // Verifica se o e-mail foi alterado
    if (newEmail === user.email) {
      Alert.alert('Erro', 'O novo e-mail deve ser diferente do atual.');
      return;
    }

    try {
      // Enviar a verificação de e-mail para o novo e-mail
      await verifyBeforeUpdateEmail(user, newEmail); // Corrigido aqui!
      await sendEmailVerification(user);

      // Desloga o usuário após enviar a verificação de e-mail
      await signOut(auth);
      router.replace('/(auth)/mainPage/page');
      console.log('Deslogado com sucesso');
      Alert.alert('Sucesso', 'Verificação de e-mail enviada. Verifique sua caixa de entrada.');
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atualizar o e-mail.');
    }
  };

  return (
    <View style={styles.screen}>
      {/* Exibindo a foto do perfil do usuário */}
      <Image
        source={{ uri: generateGravatarUrl(user?.email || null) }}
        style={styles.profileImage}
      />

      {/* Exibindo o nome e permitindo edição */}
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Seu nome"
      />
      <Button title="Atualizar Nome" onPress={handleUpdateName} />

      {/* Exibindo o email e permitindo edição */}
      <Text style={styles.label}>Novo E-mail:</Text>
      <TextInput
        style={styles.input}
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="Seu novo e-mail"
        keyboardType="email-address"
      />
      <Button title="Atualizar Email" onPress={handleUpdateEmail} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.ColorText,
    marginTop: 15,
  },
  input: {
    height: 40,
    borderColor: colors.Preto0,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});

export default ProfileScreen;
