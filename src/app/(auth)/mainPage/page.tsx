import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router'; // Importando useRouter
import colors from '@/constants/colors';
import { auth } from '@/firebaseConfig';

export default function Profile() {
  const router = useRouter(); // Inicializando o roteador
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      router.replace('/(panel)/GeneralScreen/page');
      }
  }, []);

  const handleCadastro = () => {
    router.navigate('/(auth)/signup/page'); // Navega para a tela de cadastro
  };

  const handleEntrar = () => {
    router.navigate('/(auth)/login/page'); // Navega para a tela de login
  };

  const handleRecuperarSenha = () => {
    router.navigate('/(auth)/recuperarSenha/page'); // Navega para a tela de recuperar senha
  };

  return (
    <Animated.View style={[styles.main]}>
      {/* Conteúdo da tela */}
      <Text style={styles.title}>
        Bem-vindo ao Focus Flow
      </Text>
      <Text style={styles.text}>
        Organize seu tempo e conquiste seus objetivos!
      </Text>

      {/* Botões com navegação programática */}
      <Button
        mode="contained"
        style={styles.btn}
        labelStyle={styles.btnText}
        contentStyle={styles.btnTamanho}
        onPress={handleCadastro}
      >
        Cadastrar
      </Button>

      <Button
        mode="contained"
        style={styles.btn}
        labelStyle={styles.btnText}
        contentStyle={styles.btnTamanho}
        onPress={handleEntrar}
      >
        Entrar
      </Button>

      <Button
        mode="contained"
        style={styles.btn}
        labelStyle={styles.btnText}
        contentStyle={styles.btnTamanho}
        onPress={handleRecuperarSenha}
      >
        Recuperar Senha
      </Button>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.Preto0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.ColorText,
    marginBottom: 20,
    textAlign: 'center',
  },

  text: {
    fontSize: 16,
    color: colors.ColorText,
    textAlign: 'center',
    marginBottom: 20,
  },

  btn: {
    borderRadius: 8,
    backgroundColor: colors.Ciano0,
    margin: 10,
    width: '70%',
  },

  btnTamanho: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },

  btnText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.ColorText,
    fontSize: 15,
  },
});
