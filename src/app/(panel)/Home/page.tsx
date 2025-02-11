import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Modal, NativeScrollEvent, NativeSyntheticEvent  } from 'react-native';
import { db } from '@/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RobotIntro from '@/src/componentes/roboIntro';
import { FAB, Portal, PaperProvider } from 'react-native-paper';


type State = {
  open: boolean;
};

const TaskList = () => {
  const [tarefas, setTarefas] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;
  const [showIntro, setShowIntro] = useState(false);
  const [state, setState] = React.useState<State>({ open: false });
  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const { open } = state;



  // Função de verificação do primeiro uso
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

  // Função para verificação de e-mail
  const checkEmailVerification = () => {
    if (user && !user.emailVerified) {
      Alert.alert(
        "Verifique seu e-mail",
        "Seu e-mail ainda não foi verificado. Por favor, verifique sua caixa de entrada para confirmar seu e-mail.",
        [{ text: "Ok" }]
      );
      verifyOff();
    }
  };

  const verifyOff = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/mainPage/page'); 
      console.log('Deslogado com sucesso');
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar sair.");
      console.error('Erro ao tentar deslogar:', error);
    }
  };

  // Função para calcular o progresso
  const calcularProgresso = (subtarefas?: { concluido: boolean }[], concluida?: boolean) => {
    if (concluida) return 100; 
    if (!subtarefas || subtarefas.length === 0) return 0; 
    const concluidos = subtarefas.filter((subtarefa) => subtarefa.concluido).length;
    return Math.round((concluidos / subtarefas.length) * 100); 
  };

  // Carregar tarefas do Firestore
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
        setTarefas(tarefasData);  
        setLoading(false); 
      }, (error) => {
        console.error("Erro ao ouvir as tarefas: ", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  };

  // Carregar tarefas ao montar o componente
  useEffect(() => {
    checkEmailVerification();
    carregarTarefas();  
    return () => {
      setLoading(false);  
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
                  name="warning"
                  size={24} 
                  color={item.prioridade === 'Alta' ? 'red' :
                    item.prioridade === 'Média' ? colors.Amarelo01 :
                    item.prioridade === 'Baixa' ? colors.AzulCinzentado : '#FFFFFF'}
                />
              </View>

              <Text style={styles.taskDescription}>{item.description}</Text>

              <View style={styles.statusContainer}>
                {/* Ícone com cor condicional baseado em 'conclusaoDaTarefa' */}
                <MaterialIcons
                  name={item.conclusaoDaTarefa ? 'check-circle' : 'cancel'}
                  size={30}
                  color={item.conclusaoDaTarefa ? colors.Verde0 : colors.LaranjaClaro}  // Verde para concluída, laranja para não concluída
                />
                
                {/* Texto com cor condicional */}
                <Text style={[styles.status, item.conclusaoDaTarefa ? styles.statusConcluida : styles.statusNaoConcluida]}>
                  {item.conclusaoDaTarefa ? "Concluída" : "Não Concluída"}
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

    <PaperProvider>
      <View>
        {/* Seu conteúdo de tarefas aqui */}

        {/* FAB Flutuante */}
        <Portal >
          <FAB.Group style={styles.fabStyle}
            open={open}
            backdropColor='transparent'
            visible
            icon={open ? 'minus' : 'plus'}
            actions={[
              { icon: 'plus', onPress: () => router.navigate('/(panel)/AddTasks/page') },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // Aqui você pode adicionar a lógica do que acontece ao clicar no FAB aberto
              }
            }}
          />
        </Portal>
      </View>
    </PaperProvider>

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
  fabStyle: {
    backgroundColor: '#transparent',  // Cor de fundo transparente ou branca
    justifyContent: 'center',  // Alinha o conteúdo no centro da tela
    padding: 10, // Espaçamento interno
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
    color: colors.Verde0,  // Verde quando a tarefa estiver concluída
  },

  statusNaoConcluida: {
    color: colors.LaranjaClaro,  // Laranja quando não estiver concluída
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
