import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';

const TaskList = () => {
  const [tarefas, setTarefas] = useState<any[]>([]); // Tipo de tarefas
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const user = auth.currentUser; // Obter o usuário atual


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
  }


  // Função para calcular o progresso de cada tarefa com base nos tópicos
  const calcularProgresso = (topicos: { concluido: boolean }[]) => {
    if (topicos.length === 0) return 0;
    const concluidos = topicos.filter((topico) => topico.concluido).length;
    return (concluidos / topicos.length) * 100;
  };

  // Carregar tarefas do Firestore filtrando pelo idUser do usuário
  const carregarTarefas = async () => {
    setLoading(true);
    if (user) {
      try {
        const tarefasCollection = collection(db, "Tarefas");
        const q = query(tarefasCollection, where("idUser", "==", user.uid)); // Filtra tarefas pelo idUser
        const querySnapshot = await getDocs(q);

        const tarefasData: any[] = [];
        querySnapshot.forEach((doc) => {
          tarefasData.push({ ...doc.data(), id: doc.id });
        });
        setTarefas(tarefasData);
      } catch (error) {
        console.error("Erro ao carregar tarefas: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Carregar tarefas ao montar o componente
  useEffect(() => {
    checkEmailVerification();
    carregarTarefas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>

      {loading ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <Text style={styles.taskTitle}>{item.titulo}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskPriority}>Prioridade: {item.prioridade}</Text>
              <Text style={[styles.status, item.concluida? styles.statusConcluida : styles.statusNaoConcluida]}>
                {item.concluida ? "Concluída" : "Não Concluída"}
              </Text>

              <Text style={styles.progresso}>
                Progresso: {calcularProgresso(item.topicos).toFixed(2)}%
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
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  taskDescription: {
    color: '#FFF',
    fontSize: 16,
    marginVertical: 5,
  },
  taskPriority: {
    color: '#FFF',
    fontSize: 14,
    marginVertical: 5,
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
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  statusConcluida: {
    color: 'green',
  },
  statusNaoConcluida: {
    color: 'red',
  },
});
