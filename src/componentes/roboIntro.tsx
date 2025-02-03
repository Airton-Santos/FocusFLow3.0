import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';



interface RobotIntroProps {
  onStart: () => void;
}

const RobotIntro: React.FC<RobotIntroProps> = ({ onStart }) => {
  return (
    <View style={styles.container}>
      {/* Balão de Fala */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>
          Bem-vindo ao Focus Flow!{"\n"}Gostaria de começar suas tarefas diárias?{"\n"}Vamos para tela do tutoria para você aprender como as coisas funciona por aqui.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>

      {/* Robô */}
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

export default RobotIntro;
