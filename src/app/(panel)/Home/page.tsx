import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { db } from '@/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';  // Ícones para usarmos
import colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RobotIntro from '@/src/componentes/roboIntro';


const TaskList = () => {
  const [tarefas, setTarefas] = useState<any[]>([]); // Tipo de tarefas
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser; // Obter o usuário atual
  const [showIntro, setShowIntro] = useState(false);

  // useEffect(() => {
  //   const resetIntro = async () => {
  //     await AsyncStorage.removeItem('hasSeenIntro'); // Apaga o dado salvo
  //     console.log("AsyncStorage resetado! O robô de introdução deve aparecer novamente.");
  //   };
  //   resetIntro();
  // }, []);
  

  useEffect(() => {
    const checkFirstTime = async () => {
      const hasSeenIntro = await AsyncStorage.getItem('hasSeenIntro');
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    };
    checkFirstTime();
  }, []);

  const handleIntroDismiss = async () => {
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
  };

  const checkEmailVerification = () => {
    if (user && !user.emailVerified) {
      Alert.alert(
        "Verifique seu e-mail",
        "Seu e-mail ainda não foi verificado. Por favor, verifique sua caixa de entrada para confirmar seu e-mail.",
        [
          { text: "Ok" }
        ]
      );
      verifyOff();
    }
  };

  const verifyOff = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/mainPage/page'); // Redireciona para a tela principal após deslogar
      console.log('Deslogado com sucesso');
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar sair.");
      console.error('Erro ao tentar deslogar:', error); // Loga o erro para depuração
    }
  };

  // Função para calcular o progresso de cada tarefa com base nas subtarefas
  const calcularProgresso = (subtarefas?: { concluido: boolean }[], concluida?: boolean) => {
    if (concluida) return 100; // Se a tarefa está concluída, progresso é 100%
    if (!subtarefas || subtarefas.length === 0) return 0; // Sem subtarefas, progresso é 0
    const concluidos = subtarefas.filter((subtarefa) => subtarefa.concluido).length;
    return Math.round((concluidos / subtarefas.length) * 100); // Calcula e arredonda para inteiro
};


  // Carregar tarefas do Firestore filtrando pelo idUser do usuário
  const carregarTarefas = () => {
    setLoading(true);
    if (user) {
      const tarefasCollection = collection(db, "Tarefas");
      const q = query(tarefasCollection, where("idUser", "==", user.uid));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tarefasData: any[] = [];
        querySnapshot.forEach((doc) => {
          tarefasData.push({ ...doc.data(), id: doc.id });
        });
        setTarefas(tarefasData);  // Atualiza a lista de tarefas
        setLoading(false);  // Pode definir o loading como false depois de receber os dados
      }, (error) => {
        console.error("Erro ao ouvir as tarefas: ", error);
        setLoading(false);
      });

      // Retorne a função de desinscrição quando o componente for desmontado
      return () => unsubscribe();
    }
  };

  // Carregar tarefas ao montar o componente
  useEffect(() => {
    checkEmailVerification();
    carregarTarefas();  // Inicia a escuta das tarefas em tempo real
    return () => {  // Cancela a escuta quando o componente for desmontado
      setLoading(false);  // Pode resetar o estado de loading aqui, caso necessário
    };
  }, []);

  return (
    <View style={styles.container}>

      <Modal visible={showIntro} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <RobotIntro onStart={handleIntroDismiss} />
        </View>
      </Modal>

      <Text style={styles.title}>Minhas Tarefas</Text>

      {loading ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <View style={styles.header}>
                <Text style={styles.taskTitle}>{item.titulo}</Text>
                <MaterialIcons 
                  name={item.prioridade === 'Alta' ? 'warning' : item.prioridade === 'Média' ? 'warning' : 'warning'}
                  size={24} 
                  color={item.prioridade === 'Alta' ? 'red' : item.prioridade === 'Média' ? colors.Amarelo01 : colors.AzulCinzentado}
                />
              </View>

              <Text style={styles.taskDescription}>{item.description}</Text>

              {/* Ícone para o status da tarefa */}
              <View style={styles.statusContainer}>
                <MaterialIcons
                  name={item.concluida ? 'check-circle' : 'cancel'}
                  size={30}
                  color={item.concluida ? colors.Verde0 : colors.LaranjaClaro}
                />
                <Text style={[styles.status, item.concluida ? styles.statusConcluida : styles.statusNaoConcluida]}>
                  {item.concluida ? "Concluída" : "Não Concluída"}
                </Text>
              </View>

              <Text style={styles.progresso}>
                Progresso: {calcularProgresso(item.subtarefas, item.concluida)}%
              </Text>


              <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace({ pathname: '../EditTask/[id]', params: { id: item.id } })}
              >
                <Text style={styles.buttonText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D29',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
  },
  loading: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },
  taskContainer: {
    backgroundColor: '#3C3C3C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  taskDescription: {
    color: '#FFF',
    fontSize: 16,
    marginVertical: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statusConcluida: {
    color: colors.Verde0,
  },
  statusNaoConcluida: {
    color: colors.LaranjaClaro,
  },
  progresso: {
    color: '#FFF',
    fontSize: 14,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#215A6D',
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});