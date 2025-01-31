import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert } from 'react-native';
import { getAuth, signOut, updateProfile, sendEmailVerification, verifyBeforeUpdateEmail, updatePassword } from 'firebase/auth';
import { Button } from 'react-native-paper';
import md5 from 'md5';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const [name, setName] = useState<string>(user?.displayName || '');
  const [newEmail, setNewEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>(''); // Não necessário para atualizar a senha
  const [newPassword, setNewPassword] = useState<string>('');

  const generateGravatarUrl = (email: string | null): string => {
    if (!email) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon';
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const handleUpdateName = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado!');
      return;
    }
    try {
      await updateProfile(user, { displayName: name });
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user || !newEmail) {
      Alert.alert('Erro', 'Por favor, insira um novo e-mail válido.');
      return;
    }
    if (newEmail === user.email) {
      Alert.alert('Erro', 'O novo e-mail deve ser diferente do atual.');
      return;
    }
    try {
      await verifyBeforeUpdateEmail(user, newEmail);
      await sendEmailVerification(user);
      await signOut(auth);
      router.replace('/(auth)/mainPage/page');
      Alert.alert('Sucesso', 'Verificação de e-mail enviada. Verifique sua caixa de entrada.');
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atualizar o e-mail.');
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !newPassword) {
      Alert.alert('Erro', 'Por favor, preencha a nova senha.');
      return;
    }
    try {
      // Apenas se o usuário estiver autenticado, podemos chamar updatePassword diretamente
      await updatePassword(user, newPassword);
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atualizar a senha. Verifique sua conexão ou tente novamente.');
    }
  };

  const deslogar = async () => {
    await signOut(auth);
    router.replace('/(auth)/mainPage/page');
  }

  return (
    <View style={styles.screen}>
      <Image source={{ uri: generateGravatarUrl(user?.email || null) }} style={styles.profileImage} />
      
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" />
      <Button onPress={handleUpdateName} style={styles.btn} labelStyle={styles.btnText} contentStyle={styles.btnTamanho} mode="contained">
        Atualizar Nome
      </Button>

      <Text style={styles.label}>Novo E-mail:</Text>
      <TextInput style={styles.input} value={newEmail} onChangeText={setNewEmail} placeholder="Seu novo e-mail" keyboardType="email-address" />
      <Button onPress={handleUpdateEmail} style={styles.btn} labelStyle={styles.btnText} contentStyle={styles.btnTamanho} mode="contained">
        Atualizar Email
      </Button>

      <Text style={styles.label}>Nova Senha:</Text>
      <TextInput 
        style={styles.input} 
        value={newPassword} 
        onChangeText={setNewPassword} 
        placeholder="Sua nova senha" 
        secureTextEntry 
      />
      <Button onPress={handleUpdatePassword} style={styles.btn} labelStyle={styles.btnText} contentStyle={styles.btnTamanho} mode="contained">
        Atualizar Senha
      </Button>

      <Button onPress={deslogar} style={styles.btnDeslogar} labelStyle={styles.btnText} contentStyle={styles.btnTamanho} mode="contained">
        Deslogar
      </Button>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.ColorText,
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: colors.Preto0,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  btn: {
    borderRadius: 8,
    backgroundColor: colors.Ciano0,
    width: '100%',
  },
  btnTamanho: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  btnText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.ColorText,
    fontSize: 15,
  },
  btnDeslogar: {
    margin: 50,
    backgroundColor: colors.ColorBtnSair
  }
});

export default ProfileScreen;
