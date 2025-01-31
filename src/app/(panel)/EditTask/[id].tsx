import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Para o ícone do círculo com X

const TaskDetails = () => {
  const { id } = useLocalSearchParams(); // Obtém o ID da URL
  const [tarefa, setTarefa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subtarefas, setSubtarefas] = useState<any[]>([]); // Alterado de 'topicos' para 'subtarefas'
  const router = useRouter();

  const voltar = () => {
    router.replace('/(panel)/GeneralScreen/page');
  };

  const carregarDetalhes = async () => {
    if (id) {
      try {
        const docRef = doc(db, "Tarefas", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dados = docSnap.data();
          setTarefa(dados);
          setSubtarefas(dados.subtarefas || []); // Carrega as subtarefas
        } else {
          console.log("Tarefa não encontrada!");
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  const toggleSubtarefa = (index: number) => {
    setSubtarefas((prevSubtarefas) => {
      const novasSubtarefas = [...prevSubtarefas];
      novasSubtarefas[index].concluida = !novasSubtarefas[index].concluida;
      return novasSubtarefas;
    });
  };

  const salvarProgresso = async () => {
    if (!id) return;

    try {
      const todasConcluidas = subtarefas.every((subtarefa) => subtarefa.concluida);
      await updateDoc(doc(db, "Tarefas", id as string), {
        subtarefas: subtarefas,
        concluida: todasConcluidas, // Se todas as subtarefas forem concluídas, a tarefa será marcada como concluída.
      });

      setTarefa((prevTarefa: any) => ({
        ...prevTarefa,
        subtarefas: subtarefas,
        concluida: todasConcluidas,
      }));

      alert(todasConcluidas ? "Tarefa concluída!" : "Progresso salvo!");
    } catch (error) {
      console.error("Erro ao salvar progresso: ", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.ColorText} />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Tarefa</Text>
      <Text style={styles.taskTitle}>{tarefa.titulo}</Text>
      <Text style={styles.taskDescription}>{tarefa.description}</Text>

      {/* Exibe a prioridade da tarefa com ícones */}
      <View style={styles.priorityContainer}>
        <Text style={styles.taskPriority}>Prioridade:</Text>
        <MaterialIcons
          name={tarefa.prioridade === 'Alta' ? 'warning' : tarefa.prioridade === 'Média' ? 'warning' : 'warning'}
          size={24}
          color={tarefa.prioridade === 'Alta' ? 'red' : tarefa.prioridade === 'Média' ? colors.Amarelo01 : colors.AzulCinzentado}
        />
      </View>

      {/* Exibe o status da tarefa */}
      <Text style={[styles.status, tarefa.concluida ? styles.statusConcluida : styles.statusNaoConcluida]}>
        {tarefa.concluida ? "Tarefa Concluída" : "Tarefa Não Concluída"}
      </Text>

      <Text style={styles.subtitle}>Subtarefas:</Text>
      <FlatList
        data={subtarefas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.subtarefaContainer} onPress={() => toggleSubtarefa(index)}>
            <View style={styles.subtarefaRow}>
              {/* Ícone de círculo com "X" para subtarefas não concluídas */}
              <MaterialCommunityIcons
                name={item.concluida ? 'check-circle' : 'circle-slice-8'}
                size={24}
                color={item.concluida ? 'green' : 'red'}
              />
              <Text style={[styles.subtarefaTexto, item.concluida && styles.subtarefaConcluida]}>
                {item.nome}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={salvarProgresso}>
        <Text style={styles.buttonText}>Salvar Progresso</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonVoltar]} onPress={voltar}>
        <Text style={styles.buttonTextVoltar}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Ciano0,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF',
  },
  taskTitle: {
    fontSize: 20,
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
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    color: colors.LaranjaClaro,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFF',
  },
  subtarefaContainer: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginVertical: 5,
  },
  subtarefaTexto: {
    fontSize: 16,
    color: '#000',
  },
  subtarefaConcluida: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.Ciano0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.ColorText,
    fontSize: 18,
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.AzulCinzentado,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonTextVoltar: {
    color: colors.ColorText,
    fontSize: 16,
  },
  buttonText: {
    color: colors.Preto0,
    fontSize: 16,
  },
  buttonVoltar: {
    backgroundColor: 'red',
  },
  subtarefaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
