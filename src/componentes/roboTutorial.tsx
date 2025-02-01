import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';


interface RobotIntroProps {
  onStart: () => void;
}

interface TutorialStep {
  message: string;
  timer: number;
  image?: any; // Tipo para uma imagem única
  images?: any[]; // Tipo para um array de imagens
  imageStyle: object;
}

const SecondRobotIntro: React.FC<RobotIntroProps> = ({ onStart }) => {
  const [step, setStep] = useState(0);
  const [robotPosition] = useState(new Animated.Value(0)); // Posição do robô para animação
  const [timer, setTimer] = useState<number>(3); // Tempo de espera inicial de 3 segundos
  const [timerActive, setTimerActive] = useState<boolean>(true); // Controle do estado do temporizador

  useEffect(() => {
    if (timerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000); // Decrementa o timer a cada 1 segundo

      return () => clearInterval(interval); // Limpa o intervalo quando o componente for desmontado
    } else if (timer === 0) {
      setTimerActive(false); // Desativa o temporizador quando ele chega a zero
    }
  }, [timer, timerActive]);

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

  const tutorialSteps: TutorialStep[] = [
    {
      message: "Olá! Eu sou o MiniFlow, e estou pronto para te ajudar no FocusFlow! Aqui você vai organizar melhor o seu dia a dia.",
      timer: 2, // Tempo de espera para esse passo
      image: require('../Elements/Logo.png'),
      imageStyle: { width: 150, height: 150 }, // Tamanho específico para a imagem deste passo
    },
    {
      message:
        "FocusFlow é um aplicativo para você gerenciar melhor suas tarefas, Aqui você pode organizar suas tarefas por prioridades, definir subtarefas, ver o progresso e outras funcionalidades. Aqui está a navegação do aplicativo onde você vai navegar entre as telas. Vamos começar com a tela Home.",
      timer: 2, // Tempo de espera para esse passo
      image: require('../Elements/TutorialIMG/TutorialHome/NavgationHome.jpeg'),
      imageStyle: { width: 350, height: 60 }, // Tamanho específico para a imagem deste passo
    },
    {
      message:
        "Na tela home, você vai encontrar suas tarefas, e poderá perceber alguns detalhes, como se ela está concluída ou não, a prioridade dela e outras informações como título.",
      timer: 2, // Tempo de espera para esse passo
      image: require('../Elements/TutorialIMG/TutorialHome/TarefaHome.jpeg'),
      imageStyle: { width: 270, height: 150 },
    },
    {
      message: "Existem 3 tipos de prioridades das tarefas, Alta, Média e Baixa. Dependendo da prioridade da tarefa, ela virá com cores diferentes. As baixas são azuis mais claras, as médias são amarelas e as altas são vermelhas.",
      timer: 2,
      images: [
            require('../Elements/TutorialIMG/TutorialHome/warningAzul.png'),  // Primeira imagem
            require('../Elements/TutorialIMG/TutorialHome/warningAmarelo.png'),  // Segunda imagem
            require('../Elements/TutorialIMG/TutorialHome/warningVermelho.png'),  // Terceira imagem
        ], // Corrigido: Agora suportamos múltiplas imagens
      imageStyle: { width: 70, height: 60 }, // Ajuste de estilo, se necessário
    },
    {
        message: "Agora vamos falar sobre as Subtarefas. No FocusFlow, você pode dividir uma tarefa principal em várias subtarefas menores. Isso ajuda a tornar o trabalho mais organizado e menos sobrecarregado. Ao criar uma tarefa, basta adicionar subtarefas relacionadas a ela para ter um controle melhor de cada parte do seu projeto. Quando uma subtarefa for concluída, a tarefa principal será atualizada automaticamente!",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialHome/SubTarefasHome.jpeg'),
        imageStyle: { width: 280, height: 100 },
      },

      {
        message: "Agora vamos falar sobre a tela de adicionar tarefas. Nela, você pode criar novas tarefas, atribuindo um título e outros detalhes importantes. Para começar, basta clicar no botão de 'Adicionar Tarefa' e começar a configurar sua nova tarefa. Vamos ver os detalhes em seguida!",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialADDTarefas/NavTarefasADD.jpeg'),
        imageStyle: { width: 350, height: 60 },
      },
      {
        message: "Agora que você abriu a tela de adicionar tarefas, o próximo passo é adicionar o título da tarefa. O título é essencial para identificar a tarefa. Ele fica localizado no topo da tela, logo abaixo do nome 'Adicionar tarefa'. Basta digitar o nome da sua tarefa, como por exemplo: 'Comprar mantimentos'.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialADDTarefas/TituloTarefa.jpeg'),
        imageStyle: { width: 300, height: 90 },
      },
      {
        message: "Agora vamos adicionar uma descrição para a tarefa. A descrição serve para detalhar o que precisa ser feito. Abaixo do campo do título, você verá um campo maior onde pode escrever a descrição da sua tarefa, como por exemplo: 'Comprar frutas e vegetais para a semana'. Isso ajuda a entender melhor o que precisa ser feito.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialADDTarefas/DescTarefa.jpeg'),
        imageStyle: { width: 300, height: 100 },
      },
      {
        message: "Em seguida, você pode definir a prioridade da sua tarefa. A prioridade ajuda a organizar suas tarefas de acordo com a urgência. Na tela de adicionar tarefas, você verá um campo onde pode selecionar a prioridade: 'Alta', 'Média' ou 'Baixa'. Por exemplo, para uma tarefa urgente, como 'Finalizar relatório', escolha 'Alta'.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialADDTarefas/PrioridadeTarefa.jpeg'),
        imageStyle: { width: 300, height: 50 },
      },
      {
        message: "Agora vamos falar sobre as subtarefas. Subtarefas ajudam a dividir uma tarefa maior em partes menores. Para adicionar uma subtarefa, basta clicar no campo de 'Subtarefas' abaixo da descrição e adicionar as tarefas pequenas. Por exemplo, para a tarefa 'Comprar mantimentos', uma subtarefa poderia ser 'Comprar arroz'.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialADDTarefas/SubTarefas.jpeg'),
        imageStyle: { width: 250, height: 80 },
      },
      {
        message: "Por fim, você pode acompanhar o progresso da tarefa e, quando a tarefa for concluída, marcar como 'Concluída'. Ao adicionar uma tarefa, você verá um botão no final da tela para salvar a tarefa. Basta clicar nele e sua tarefa estará pronta para ser gerenciada!",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialADDTarefas/ProgressoConcluido.jpeg'),
        imageStyle: { width: 300, height: 60 },
      },
      {
        message: "Ao clicar no botão de 'Ver Detalhes da Tarefa', você será levado para uma tela onde poderá ver informações completas sobre a tarefa selecionada. Este botão está localizado abaixo de cada tarefa na tela principal. Ele permite acessar detalhes como a descrição completa, as subtarefas, a prioridade e o progresso da tarefa.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialVerTarefas/BtnVerTarefas.png'),
        imageStyle: { width: 300, height: 50 },
      },
      {
        message: "Nos detalhes da tarefa, você pode visualizar as seguintes informações: a prioridade da tarefa, sua descrição e as subtarefas associadas. As subtarefas aparecerão com caixas de seleção ao lado delas, onde você pode marcar como concluídas à medida que forem sendo finalizadas. Além disso, a prioridade e a descrição estarão logo no topo para que você consiga entender facilmente os detalhes da tarefa.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialVerTarefas/detalhesTarefas.png'),
        imageStyle: { width: 250, height: 100 },
      },
      {
        message: "Lembre-se, uma tarefa só será marcada como concluída quando todas as subtarefas associadas a ela forem também concluídas. Você deve marcar cada subtarefa individualmente e, ao fazer isso, o status da tarefa principal será atualizado para 'Concluída'. Isso garante que você tenha completado todas as partes da tarefa antes de finalizá-la.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialVerTarefas/SubsTarefas.png'),
        imageStyle: { width: 300, height: 300 },
      },
      {
        message: "Na tela de detalhes da tarefa, você verá um botão em forma de lápis. Este botão permite que você edite a tarefa a qualquer momento. Ao clicar nele, você poderá alterar informações como título, descrição, prioridade e até mesmo adicionar ou remover subtarefas. Isso é útil caso você precise fazer ajustes nas tarefas à medida que vai progredindo.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialVerTarefas/Pencil.png'),
        imageStyle: { width: 50, height: 50 },
      },
      {
        message: "Na tela de perfil, você pode gerenciar suas informações facilmente! Sua foto e nome aparecem no topo da tela. Logo abaixo, você encontrará os campos para editar seu nome, e-mail e senha. No final da tela, há a opção de deslogar da conta. Tudo organizado para facilitar suas alterações!",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialProfile/NavProfile.png'),
        imageStyle: { width: 320, height: 50 },
      },
      {
        message: "Sua foto de perfil pode ser alterada automaticamente se seu e-mail estiver conectado ao Gravatar. Basta atualizar sua foto no Gravatar, e ela será sincronizada com o aplicativo sem precisar fazer nenhuma mudança manualmente.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialProfile/FotoPerfil.png'),
        imageStyle: { width: 300, height: 100 },
      },
      {
        message: "Na tela de perfil, você pode mudar seu nome sempre que quiser. Basta clicar no campo de nome, editar o novo nome desejado e salvar as alterações. Isso atualizará sua identificação no aplicativo.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialProfile/AlterarNome.png'),
        imageStyle: { width: 300, height: 100 },
      },
      {
        message: "Caso precise mudar seu e-mail, vá até a tela de perfil e edite o campo correspondente. Isso atualizará o e-mail associado à sua conta, garantindo que você receba notificações e possa recuperar a senha caso necessário.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialProfile/AlterarEmail.png'),
        imageStyle: { width: 290, height: 100 },
      },
      {
        message: "Se precisar alterar sua senha, você pode fazer isso na tela de perfil. Basta digitar sua senha atual, inserir a nova senha e confirmar a alteração. Isso ajudará a manter sua conta segura.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialProfile/AlterarSenha.png'),
        imageStyle: { width: 300, height: 100 },
      },
      {
        message: "Para sair da sua conta, basta clicar no botão de 'Deslogar' na tela de perfil. Isso encerrará sua sessão no aplicativo, e você precisará fazer login novamente para acessar seus dados.",
        timer: 3,
        image: require('../Elements/TutorialIMG/TutorialProfile/Deslogar.png'),
        imageStyle: { width: 300, height: 50 },
      },

  ];

  const handleNextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
      setTimer(tutorialSteps[step + 1].timer); // Reseta o timer para o valor definido no próximo passo
      setTimerActive(true); // Reativa o temporizador
    } else {
      onStart(); // Fim do tutorial, chama a função para começar
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagem do passo atual */}
      {tutorialSteps[step].images ? (
        <View style={styles.imageContainer}>
          {tutorialSteps[step].images.map((imageSrc, index) => (
            <Image key={index} source={imageSrc} style={tutorialSteps[step].imageStyle} />
          ))}
        </View>
      ) : (
        <Image source={tutorialSteps[step].image} style={tutorialSteps[step].imageStyle} />
      )}

      {/* Balão de Fala */}
        <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{tutorialSteps[step].message}</Text>
                {timerActive ? (
                    <Text style={styles.timerText}>{timer} segundos restantes...</Text> // Exibe o tempo restante
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                    <Text style={styles.buttonText}>{step === tutorialSteps.length - 1 ? 'Começar' : 'OK'}</Text>
                    </TouchableOpacity>
                )}
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
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 20,
    maxWidth: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    marginTop: 10,
  },
  speechText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
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
  imageContainer: {
    flexDirection: 'row', // Adiciona um layout horizontal para as imagens
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
});

export default SecondRobotIntro;
