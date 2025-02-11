import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const TaskDetails = () => {
  const { id } = useLocalSearchParams(); 
  const [tarefa, setTarefa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subtarefas, setSubtarefas] = useState<any[]>([]); 
  const [novaSubtarefa, setNovaSubtarefa] = useState(""); 
  const [modoEdicao, setModoEdicao] = useState(false);
  const [titulo, setTitulo] = useState(''); 
  const [descricao, setDescricao] = useState(''); 
  const [prioridade, setPrioridade] = useState(''); 
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
          setSubtarefas(dados.subtarefas || []); 
          setTitulo(dados.titulo);
          setDescricao(dados.description);
          setPrioridade(dados.prioridade);
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

  const toggleSubtarefa = async (index: number) => {
    const novasSubtarefas = [...subtarefas];
    novasSubtarefas[index].concluido = !novasSubtarefas[index].concluido;
    setSubtarefas(novasSubtarefas);
  
    // Verifique se todas as subtarefas estão concluídas
    const todasConcluidas = novasSubtarefas.every(sub => sub.concluido);
  
    // Se alguma subtarefa for desmarcada, a tarefa volta a não ser concluída
    if (!todasConcluidas) {
      try {
        await updateDoc(doc(db, "Tarefas", id as string), {
          conclusaoDaTarefa: false,  // A tarefa volta a não concluída
        });
      } catch (error) {
        console.error("Erro ao atualizar a tarefa:", error);
      }
    } else {
      // Caso todas as subtarefas estejam concluídas, a tarefa é marcada como concluída
      try {
        await updateDoc(doc(db, "Tarefas", id as string), {
          conclusaoDaTarefa: true,  // Atualiza o campo de conclusão da tarefa
        });
      } catch (error) {
        console.error("Erro ao atualizar a tarefa:", error);
      }
    }
  
    try {
      await updateDoc(doc(db, "Tarefas", id as string), {
        subtarefas: novasSubtarefas,  // Atualiza as subtarefas
      });
    } catch (error) {
      console.error("Erro ao atualizar subtarefa:", error);
    }
  };
  
  const adicionarSubtarefa = async () => {
    if (!novaSubtarefa) return;
  
    const novasSubtarefas = [...subtarefas, { nome: novaSubtarefa, concluido: false }];
    setSubtarefas(novasSubtarefas);
    setNovaSubtarefa("");
  
    // A tarefa volta a não ser concluída quando uma nova subtarefa é adicionada
    try {
      await updateDoc(doc(db, "Tarefas", id as string), {
        conclusaoDaTarefa: false,  // Marca a tarefa como não concluída
      });
    } catch (error) {
      console.error("Erro ao atualizar a tarefa:", error);
    }
  
    try {
      await updateDoc(doc(db, "Tarefas", id as string), {
        subtarefas: novasSubtarefas,  // Atualiza as subtarefas
      });
    } catch (error) {
      console.error("Erro ao adicionar subtarefa:", error);
    }
  };
  

  const salvarAlteracoes = async () => {
    if (!id) return;
  
    try {
      await updateDoc(doc(db, "Tarefas", id as string), {
        titulo: titulo,
        description: descricao,
        prioridade: prioridade, 
        subtarefas: subtarefas,
      });
      setModoEdicao(false);
      alert("Alterações salvas!");
  
      router.push('/(panel)/GeneralScreen/page');
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };


  // Função para deletar a tarefa
  const deletarTarefa = async () => {
    Alert.alert(
      "Deletar Tarefa",
      "Você realmente deseja deletar esta tarefa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: async () => {
            if (id) {
              try {
                await deleteDoc(doc(db, "Tarefas", id as string));
                alert("Tarefa deletada com sucesso!");
                router.replace('/(panel)/GeneralScreen/page'); // Redireciona após deletar
              } catch (error) {
                console.error("Erro ao deletar tarefa:", error);
              }
            }
          },
        },
      ]
    );
  };

  const deletarSubtarefa = async (index: number) => {
    Alert.alert(
      "Deletar Subtarefa",
      "Você realmente deseja deletar esta subtarefa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: async () => {
            const novasSubtarefas = [...subtarefas];
            novasSubtarefas.splice(index, 1); // Remove a subtarefa pela posição
            setSubtarefas(novasSubtarefas);
  
            try {
              await updateDoc(doc(db, "Tarefas", id as string), {
                subtarefas: novasSubtarefas, // Atualiza a lista de subtarefas no Firebase
              });
              alert("Subtarefa deletada com sucesso!");
            } catch (error) {
              console.error("Erro ao deletar subtarefa:", error);
            }
          },
        },
      ]
    );
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
      <View style={styles.header}>
        <Text style={styles.title}>Detalhes da Tarefa</Text>
        <TouchableOpacity onPress={() => setModoEdicao(true)}>
          <MaterialIcons name="edit" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      {modoEdicao ? (
        <View>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Alterar título"
          />
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Alterar descrição"
          />
          <Text style={styles.inputLabel}>Prioridade:</Text>
          <Picker
            selectedValue={prioridade}
            onValueChange={(itemValue) => setPrioridade(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Baixa" value="baixa" />
            <Picker.Item label="Média" value="media" />
            <Picker.Item label="Alta" value="alta" />
          </Picker>
        </View>
      ) : (
        <>
          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Título</Text>
            <Text style={styles.taskTitle}>{titulo}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.taskDescription}>{descricao}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.priorityContainer}>
              <Text style={styles.TextPriority}>Prioridade:</Text>
              <MaterialIcons
                name={prioridade === 'Alta' ? 'warning' : prioridade === 'Média' ? 'warning' : 'warning'}
                size={24}
                color={prioridade === 'Alta' ? 'red' : prioridade === 'Média' ? colors.Amarelo01: colors.AzulCinzentado}
              />
            </View>
          </View>
        </>
      )}

      <Text style={styles.subtitle}>Subtarefas:</Text>
      <FlatList
          data={subtarefas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.subtarefaContainer}>
              <TouchableOpacity
                style={styles.subtarefaRow}
                onPress={() => toggleSubtarefa(index)}
              >
                <MaterialIcons
                  name={item.concluido ? 'check-circle' : 'radio-button-unchecked'}
                  size={24}
                  color={item.concluido ? 'green' : 'red'}
                />
                <Text style={[styles.subtarefaTexto, item.concluido && styles.subtarefaConcluida]}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
              {modoEdicao && (
                <TouchableOpacity onPress={() => deletarSubtarefa(index)}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>
          )}
      />

      <View style={styles.addSubtarefaContainer}>
        {modoEdicao && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Adicionar nova subtarefa"
              placeholderTextColor={colors.ColorText}
              value={novaSubtarefa}
              onChangeText={setNovaSubtarefa}
            />
            <TouchableOpacity onPress={adicionarSubtarefa} style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {modoEdicao && (
        <TouchableOpacity onPress={salvarAlteracoes} style={styles.button}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      )}

      {/* Botão de deletar tarefa */}
      <TouchableOpacity onPress={deletarTarefa} style={[styles.button, styles.buttonDeletar]}>
        <Text style={styles.buttonText}>Deletar Tarefa</Text>
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
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.ColorText
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.ColorText
  },
  input: {
    height: 40,
    borderColor: colors.AzulCinzentado,
    borderWidth: 1,
    marginVertical: 10,
    paddingLeft: 8,
    borderRadius: 5,
    color: colors.ColorText
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 15,
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 18,
    color: '#FFF',
    marginVertical: 10,
  },
  taskPriority: {
    fontSize: 18,
    color: '#FFF',
    marginVertical: 10,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Isso separa os itens
    alignItems: 'center',  // Alinha o texto e o ícone verticalmente
    width: '100%',  // Faz com que ocupe toda a largura disponível
    height: 70
  },
  TextPriority: {
     color: colors.ColorText,
     fontSize: 20,
     marginBottom: 10
  },
  subtarefaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  subtarefaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtarefaTexto: {
    fontSize: 16,
    color: colors.ColorText,
    marginLeft: 10,
  },
  subtarefaConcluida: {
    textDecorationLine: 'line-through',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginVertical: 10,
  },
  addSubtarefaContainer: {
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.ColorText,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: colors.Preto0,
  },
  button: {
    backgroundColor: colors.Ciano1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },

  buttonDeletar: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
  },
  buttonVoltar: {
    backgroundColor: colors.LaranjaClaro,
  },
  buttonTextVoltar: {
    fontSize: 16,
    color: '#FFF',
  },
  picker: {
    height: 70,
    color: colors.ColorText,
  },
  inputLabel: {
    color: colors.ColorText,
    fontSize: 16,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFF',
  },
});
