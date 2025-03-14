import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; // Importando configuração do Firebase
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Entrar = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loginIcon, setLoginIcon] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estados de foco para os campos de entrada
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSenhaFocused, setIsSenhaFocused] = useState(false);

  const router = useRouter();

  // Função para realizar o login
  const handlerLogin = async () => {
    setErro('');
    setLoginIcon(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      if (!user.emailVerified) {
        // Se o e-mail não estiver verificado, envia um novo e-mail de verificação
        await sendEmailVerification(user);
        setErro('Foi enviado um novo e-mail de verificação. Verifique sua caixa de entrada antes de tentar o login novamente.');
        setLoginIcon(false);
        return;
      }

      console.log('Logado com sucesso', user.uid);

      // Após o login bem-sucedido, redireciona para a página home
      router.replace('/(panel)/GeneralScreen/page');
    } catch (error) {
      setErro('Ocorreu um erro ao tentar fazer o login. Tente novamente.');
      setLoginIcon(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Elemento Superior */}
      <View style={styles.headerContainer}>
        <Image
          style={styles.ElementWaterTop}
          source={require('@/src/Elements/ElementWater.png')}
        />
      </View>

      {/* Conteúdo Central */}
      <View style={styles.content}>
        <Image
          style={styles.logo}
          source={require('@/src/Elements/Logo.png')}
        />
        <Text style={styles.text}>Entrar</Text>

        <TextInput
          style={[styles.input, isEmailFocused && { borderColor: '#308282' }]}
          outlineColor="transparent"
          mode="outlined"
          cursorColor="#fff"
          placeholder="E-mail"
          textColor="#fff"
          placeholderTextColor="#A3B4B4"
          underlineColor="transparent"
          activeOutlineColor="transparent"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
        />

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

        {/* Exibindo o erro se houver */}
        {erro !== '' && <Text style={styles.errorText}>{erro}</Text>}

        {/* Botão de Login */}
        <Button
          mode="outlined"
          style={styles.btnEntrar}
          labelStyle={styles.btnText}
          onPress={handlerLogin}
          loading={loginIcon}
          contentStyle={styles.btnTamanho}
        >
          Entrar
        </Button>
      </View>

      {/* Elemento Inferior */}
      <View style={styles.footerContainer}>
        <Image
          style={styles.ElementWaterBottom}
          source={require('@/src/Elements/ElementWater.png')}
        />
      </View>
    </View>
  );
};

export default Entrar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D29',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ElementWaterTop: {
    width: 210,
    height: 210,
    transform: [{ rotate: '-180deg' }],
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  text: {
    margin: 10,
    fontSize: 30,
    fontFamily: 'Silkscreen-Bold',
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: 'transparent',
    margin: 10,
    width: 325,
    fontFamily: 'Silkscreen-Regular',
    borderColor: '#92C7A3',
    borderWidth: 1,
    color: '#FFFFFF',
    paddingHorizontal: 10,
  },
  btnEntrar: {
    margin: 10,
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
    fontFamily: 'Silkscreen-Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  ElementWaterBottom: {
    width: 210,
    height: 215,
    transform: [{ rotate: '0deg' }],
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },

  senhaContainer: {
    position: 'relative',
  },
});
