import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RobotIntro from '@/src/componentes/roboTutorial';  // Ou 'SecondRobotIntro', dependendo de qual você está utilizando.
import colors from '@/constants/colors';

const TutorialScreen = () => {
  const [isTutorialVisible, setIsTutorialVisible] = useState(false);

  // Função para começar o tutorial
  const startTutorial = () => {
    setIsTutorialVisible(true);
  };

  // Função para finalizar o tutorial e começar o uso do app
  const handleTutorialComplete = () => {
    setIsTutorialVisible(false);
    // Aqui você pode redirecionar para a próxima tela ou funcionalidade do app.
  };

  return (
    <View style={styles.container}>
      {!isTutorialVisible ? (
        <View style={styles.startButtonContainer}>
          <Text style={styles.title}>Bem-vindo ao FocusFlow!</Text>
          <TouchableOpacity style={styles.button} onPress={startTutorial}>
            <Text style={styles.buttonText}>Começar Tutorial</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <RobotIntro onStart={handleTutorialComplete} /> // Exibindo o robô
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  startButtonContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.ColorText
  },
  button: {
    backgroundColor: colors.Ciano0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TutorialScreen;
