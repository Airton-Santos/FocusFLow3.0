import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

interface RobotIntroProps {
  onStart: () => void;
}

const SecondRobotIntro: React.FC<RobotIntroProps> = ({ onStart }) => {
  const [step, setStep] = useState(0);
  const [robotPosition] = useState(new Animated.Value(0)); // Posição do robô para animação

  useEffect(() => {
    // Animação contínua e suave para o robô
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotPosition, {
          toValue: 20, // Aumenta a posição do robô
          duration: 1500, // Duração da animação para mover para cima
          useNativeDriver: true,
        }),
        Animated.timing(robotPosition, {
          toValue: 0, // Retorna para a posição original
          duration: 1500, // Duração da animação para voltar
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [robotPosition]);

  const tutorialSteps = [
    {
      message: "Olá! Eu sou o MiniFlow, pronto para te ajudar no FocusFlow!",
      image: require('../Elements/Logo.png'), // Imagem para o primeiro passo
    },
    {
      message:
        "Aqui você pode organizar suas tarefas por prioridades. A alta prioridade é vermelha, a média é amarela e a baixa é azul.",
      image: require('../Elements/Logo.png'), // Imagem para o segundo passo
    },
    {
      message:
        "Além disso, no perfil você pode atualizar suas informações como nome, email e foto. Tudo de forma rápida e prática!",
      image: require('../Elements/Logo.png'), // Imagem para o terceiro passo
    },
    {
      message:
        "Não se esqueça das subtarefas! Elas são ótimas para detalhar suas tarefas e manter tudo no lugar.",
      image: require('../Elements/Logo.png'), // Imagem para o quarto passo
    },
    {
      message: "Pronto para começar? Clique 'OK' para iniciar o aplicativo!",
      image: require('../Elements/Logo.png'), // Imagem para o quinto passo
    },
  ];

  const handleNextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onStart(); // Fim do tutorial, chama a função para começar
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagem do passo atual, acima da bolha de fala */}
      <Image source={tutorialSteps[step].image} style={styles.demoImage} />

      {/* Balão de Fala */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>{tutorialSteps[step].message}</Text>
        <TouchableOpacity style={styles.button} onPress={handleNextStep}>
          <Text style={styles.buttonText}>{step === tutorialSteps.length - 1 ? 'Começar' : 'OK'}</Text>
        </TouchableOpacity>
      </View>

      {/* Robô com animação suave */}
      <Animated.View
        style={[
          styles.robotContainer,
          {
            transform: [{ translateY: robotPosition }], // Animação para cima e para baixo
          },
        ]}
      >
        <Image source={require('../Elements/MiniFlowRobot.png')} style={styles.robotImage} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  speechBubble: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 20,
    maxWidth: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  speechText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  robotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotImage: {
    width: 100,
    height: 100,
  },
  demoImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default SecondRobotIntro;
