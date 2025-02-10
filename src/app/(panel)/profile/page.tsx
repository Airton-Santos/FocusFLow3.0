import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { getAuth, signOut, updateProfile, sendEmailVerification, verifyBeforeUpdateEmail, updatePassword, deleteUser } from 'firebase/auth';
import { Button } from 'react-native-paper';
import md5 from 'md5';
import colors from '@/constants/colors';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { getFirestore, doc, deleteDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const ProfileScreen = () => {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [name, setName] = useState<string>(user?.displayName || '');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const generateGravatarUrl = (email: string | null): string => {
    if (!email) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon';
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const validarSenha = (senha: string) => {  
    const requisitos = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{6,}$/;
    return requisitos.test(senha);
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
    if (!validarSenha(newPassword)) {
      Alert.alert("A senha deve ter no mínimo 6 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.");
      return;
    }

    try { 
      await updatePassword(user, newPassword);
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atualizar a senha. Verifique sua conexão ou tente novamente.');
    }
  };

  const deslogar = async () => {
    await signOut(auth);
    router.replace('/(auth)/mainPage/page');
  };

  const excluirConta = async () => {
    if (!user) return;
  
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // Realizando a consulta para pegar todas as tarefas do usuário
              const tarefasRef = collection(db, "Tarefas");
              const q = query(tarefasRef, where("idUser", "==", user.uid));
  
              // Buscando as tarefas
              const querySnapshot = await getDocs(q);
  
              // Excluindo todas as tarefas encontradas
              querySnapshot.forEach(async (docSnapshot) => {
                const tarefaDoc = docSnapshot; // DocumentSnapshot do Firestore
                await deleteDoc(doc(db, "Tarefas", tarefaDoc.id)); // Exclui a tarefa
              });
  
              // Após excluir as tarefas, exclua o usuário
              await deleteUser(user); // Exclui conta no Firebase
              await signOut(auth); // Faz logout do usuário
              router.replace('/(auth)/mainPage/page'); // Redireciona para a página inicial
  
              Alert.alert("Sucesso", "Conta e tarefas excluídas com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir conta:", error);
              Alert.alert("Erro", "Não foi possível excluir sua conta.");
            }
          },
        },
      ]
    );
  };

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
        secureTextEntry={!mostrarSenha}
        right={<TextInput.Icon 
          icon={mostrarSenha ? "eye-off" : "eye"} 
          onPress={() => setMostrarSenha(!mostrarSenha)}
        />}
      />
      <Button onPress={handleUpdatePassword} style={styles.btn} labelStyle={styles.btnText} contentStyle={styles.btnTamanho} mode="contained">
        Atualizar Senha
      </Button>
      <Button onPress={deslogar} style={styles.btnDeslogar} labelStyle={styles.btnText} contentStyle={styles.btnTamanho} mode="contained">
        Deslogar
      </Button>
      <Button onPress={excluirConta} style={styles.btnExcluir} labelStyle={styles.btnText} contentStyle={styles.btnTamanho} mode="contained">
        Excluir Conta
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
    margin: 30,
    backgroundColor: colors.ColorBtnSair
  },
  btnExcluir: {
    margin: 10,
    backgroundColor: colors.LaranjaClaro
  }
});

export default ProfileScreen;
