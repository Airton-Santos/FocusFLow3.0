import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { auth } from '@/firebaseConfig';  // Certifique-se de que o caminho está correto
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { FirebaseError } from 'firebase/app'; // Importando o tipo FirebaseError

const Profile = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [loginIcon, setLoginIcon] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estados de foco individuais
  const [isNomeFocused, setIsNomeFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSenhaFocused, setIsSenhaFocused] = useState(false);

  const router = useRouter();

  const validarSenha = (senha: string) => {  // Garantir que o parâmetro seja do tipo string
    const requisitos = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{6,}$/;
    return requisitos.test(senha);
  };

  const handlerEntrar = async () => {
    setErro('');
    setLoginIcon(true);

    if (!validarSenha(senha)) {
      setErro('A senha deve ter no mínimo 6 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.');
      setLoginIcon(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      await updateProfile(userCredential.user, { displayName: nome });
      const user = userCredential.user;

      console.log('Usuário cadastrado com sucesso:', user.uid, user.displayName);
      await sendEmailVerification(user);

      // Redireciona para a tela de login após o cadastro
      router.replace('/(auth)/mainPage/page');

      setLoginIcon(false);
    } catch (error) {
      // Verificando se o erro é do tipo FirebaseError para acessar o código corretamente
      if ((error as FirebaseError).code === 'auth/email-already-in-use') {
        setErro('Este e-mail já está cadastrado. Tente usar outro e-mail.');
      } else if ((error as FirebaseError).code === 'auth/invalid-email') {
        setErro('O e-mail fornecido é inválido. Por favor, insira um e-mail válido.');
      } else if ((error as FirebaseError).code === 'auth/weak-password') {
        setErro('A senha fornecida é muito fraca. Escolha uma senha mais forte.');
      } else {
        setErro('Erro ao cadastrar o usuário. Tente novamente.');
      }
      setLoginIcon(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image style={styles.ElementWaterTop} source={require('@/src/Elements/ElementWater.png')} />
      </View>

      <View style={styles.content}>
        <Image style={styles.logo} source={require('@/src/Elements/Logo.png')} />
        <Text style={styles.text}>Cadastre-se</Text>

        {/* Nome */}
        <TextInput
          style={[styles.input, isNomeFocused && { borderColor: '#308282' }]}
          outlineColor="transparent"
          mode="outlined"
          cursorColor="#fff"
          textColor="#fff"
          placeholder="Nome"
          placeholderTextColor="#A3B4B4"
          underlineColor="transparent"
          activeOutlineColor="transparent"
          value={nome}
          onChangeText={setNome}
          onFocus={() => setIsNomeFocused(true)}
          onBlur={() => setIsNomeFocused(false)}
        />

        {/* Email */}
        <TextInput
          style={[styles.input, isEmailFocused && { borderColor: '#308282' }]}
          outlineColor="transparent"
          mode="outlined"
          cursorColor="#fff"
          textColor="#fff"
          placeholder="E-mail"
          placeholderTextColor="#A3B4B4"
          underlineColor="transparent"
          activeOutlineColor="transparent"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
        />

        {/* Senha */}
        <View style={styles.senhaContainer}>
          <TextInput
            style={[styles.input, isSenhaFocused && { borderColor: '#308282' }]}
            outlineColor="transparent"
            mode="outlined"
            cursorColor="#fff"
            textColor="#fff"
            placeholder="Senha"
            placeholderTextColor="#A3B4B4"
            secureTextEntry={!mostrarSenha}
            underlineColor="transparent"
            activeOutlineColor="transparent"
            value={senha}
            onChangeText={setSenha}
            onFocus={() => setIsSenhaFocused(true)}
            onBlur={() => setIsSenhaFocused(false)}
            right={<TextInput.Icon 
              icon={mostrarSenha ? "eye-off" : "eye"} 
              onPress={() => setMostrarSenha(!mostrarSenha)}
            />}
          />
        </View>

        {/* Exibe o erro */}
        {erro !== '' && <Text style={styles.errorText}>{erro}</Text>}

        <Button
          mode="outlined"
          contentStyle={styles.btnTamanho}
          style={styles.btnCadastrarSe}
          labelStyle={styles.btnText}
          onPress={handlerEntrar}
          loading={loginIcon}
        >
          Cadastrar
        </Button>
      </View>

      <View style={styles.footerContainer}>
        <Image style={styles.ElementWaterBottom} source={require('@/src/Elements/ElementWater.png')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D29',
  },
  headerContainer: {
    justifyContent: 'flex-end',
  },
  ElementWaterTop: {
    width: 210,
    height: 210,
    transform: [{ rotate: '90deg' }],
    opacity: 0.5,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  text: {
    margin: 5,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: 'transparent',
    color: '#FFFFF',
    margin: 5,
    width: 325,
    fontFamily: 'Roboto-Regular',
    borderColor: '#92C7A3',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  senhaContainer: {
    position: 'relative',
  },
  btnCadastrarSe: {
    margin: 5,
    width: 150,
    height: 50,
    backgroundColor: '#215A6D',
    justifyContent: 'center',
  },
  btnTamanho: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  btnText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ElementWaterBottom: {
    width: 210,
    height: 210,
    transform: [{ rotate: '-90deg' }],
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    margin: 20,
  },
});

export default Profile;
