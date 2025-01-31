import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface RobotIntroProps {
  onStart: () => void;
}

const SecondRobotIntro: React.FC<RobotIntroProps> = ({ onStart }) => {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    {
      message: "Olá! Eu sou o MiniFlow, pronto para te ajudar no FocusFlow!",
    },
    {
      message:
        "Aqui você pode organizar suas tarefas por prioridades. A alta prioridade é vermelha, a média é amarela e a baixa é azul.",
    },
    {
      message:
        "Além disso, no perfil você pode atualizar suas informações como nome, email e foto. Tudo de forma rápida e prática!",
    },
    {
      message:
        "Não se esqueça das subtarefas! Elas são ótimas para detalhar suas tarefas e manter tudo no lugar.",
    },
    {
      message: "Pronto para começar? Clique 'OK' para iniciar o aplicativo!",
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
      {/* Balão de Fala */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>{tutorialSteps[step].message}</Text>
        <TouchableOpacity style={styles.button} onPress={handleNextStep}>
          <Text style={styles.buttonText}>{step === tutorialSteps.length - 1 ? 'Começar' : 'OK'}</Text>
        </TouchableOpacity>
      </View>

      {/* Robô 2 */}
      <Image source={require('../Elements/MiniFlowRobot.png')} style={styles.robotImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
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
  robotImage: {
    width: 100,
    height: 100,
  },
});

export default SecondRobotIntro;
