import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RobotIntro from '@/src/componentes/roboTutorial';  // Ou 'SecondRobotIntro', dependendo de qual você está utilizando.
import colors from '@/constants/colors';


// Tipagem das props que o componente TutorialScreen recebe
interface TutorialScreenProps {
  onTutorialStart: () => void;
  onTutorialEnd: () => void;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({ onTutorialStart, onTutorialEnd }) => {
  const [isTutorialVisible, setIsTutorialVisible] = useState(false);


  
  // Iniciar o tutorial
  const startTutorial = () => {
    setIsTutorialVisible(true);
    onTutorialStart();  // Chama a função passada pela prop
  };

  // Finalizar o tutorial
  const handleTutorialComplete = () => {
    setIsTutorialVisible(false);
    onTutorialEnd();  // Chama a função passada pela prop
  };

  // Pular o tutorial
  const skipTutorial = () => {
    setIsTutorialVisible(false);
    onTutorialEnd();  // Finaliza o tutorial e chama a função passada pela prop

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
        <>
          {/* Exibindo o robô e o botão de pular tutorial */}
          <RobotIntro onStart={handleTutorialComplete} />
          
          {/* Botão de Pular Tutorial - visível apenas se o tutorial estiver ativo */}
          <TouchableOpacity style={styles.skipButton} onPress={skipTutorial}>
            <Text style={styles.skipButtonText}>Pular Tutorial</Text>
          </TouchableOpacity>
        </>
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
  skipButton: {
    backgroundColor: colors.Ciano0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20
  },
  skipButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TutorialScreen;
