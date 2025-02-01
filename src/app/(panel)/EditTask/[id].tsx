import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';  // Importa MaterialIcons
// MaterialCommunityIcons foi removido, pois estamos usando MaterialIcons para o ícone de warning

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
    
    try {
      await updateDoc(doc(db, "Tarefas", id as string), {
        subtarefas: novasSubtarefas,
      });
    } catch (error) {
      console.error("Erro ao atualizar subtarefa:", error);
    }
  };

  const salvarProgresso = async () => {
    if (!id) return;
  
    try {
      const todasConcluidas = subtarefas.every((subtarefa) => subtarefa.concluido === true);
      
      await updateDoc(doc(db, "Tarefas", id as string), {
        subtarefas: subtarefas,
        concluido: todasConcluidas, 
      });
  
      setTarefa((prevTarefa: any) => ({
        ...prevTarefa,
        subtarefas: [...subtarefas], 
        concluido: todasConcluidas,
      }));
  
      alert(todasConcluidas ? "Tarefa concluída!" : "Progresso salvo!");
    } catch (error) {
      console.error("Erro ao salvar progresso: ", error);
    }
  };

  const adicionarSubtarefa = async () => {
    if (!novaSubtarefa) return; 

    const novasSubtarefas = [...subtarefas, { nome: novaSubtarefa, concluido: false }];
    setSubtarefas(novasSubtarefas);
    setNovaSubtarefa(""); 

    try {
      await updateDoc(doc(db, "Tarefas", id as string), {
        subtarefas: novasSubtarefas
      });
    } catch (error) {
      console.error("Erro ao adicionar subtarefa:", error);
    }
  };

  const removerSubtarefa = async (index: number) => {
    if (!modoEdicao) return; 
    
    const novasSubtarefas = subtarefas.filter((_, i) => i !== index); 
    setSubtarefas(novasSubtarefas);

    try {
      await updateDoc(doc(db, "Tarefas", id as string), {
        subtarefas: novasSubtarefas
      });
    } catch (error) {
      console.error("Erro ao remover subtarefa:", error);
    }
  };

  const salvarAlteracoes = async () => {
    if (!id) return;

    try {
      await updateDoc(doc(db, "Tarefas", id as string), {
        titulo: titulo,
        description: descricao,
        prioridade: prioridade,
        subtarefas: subtarefas
      });
      setModoEdicao(false); 
      alert("Alterações salvas!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
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
          <TextInput
            style={styles.input}
            value={prioridade}
            onChangeText={setPrioridade}
            placeholder="Alterar prioridade"
          />
        </View>
      ) : (
        <>
          <Text style={styles.taskTitle}>{titulo}</Text>
          <Text style={styles.taskDescription}>{descricao}</Text>
          <Text style={styles.taskPriority}>
            Prioridade: 
            <MaterialIcons
              name={
                prioridade === 'alta' ? 'warning' :  // Ícone de alerta para alta prioridade
                prioridade === 'media' ? 'warning' :  // Ícone de alerta para média prioridade
                'warning'  // Ícone de alerta para baixa prioridade
              }
              size={24}
              color={
                prioridade === 'alta' ? 'red' :
                prioridade === 'media' ? 'yellow' :
                'green'
              }
            />
          </Text>
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
          </View>
        )}
      />

      <View style={styles.addSubtarefaContainer}>
        {modoEdicao && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Adicionar nova subtarefa"
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
    backgroundColor: colors.Ciano1,
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
    color: '#FFF',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFF',
  },
  input: {
    height: 40,
    borderColor: colors.AzulCinzentado,
    borderWidth: 1,
    marginVertical: 10,
    paddingLeft: 8,
    borderRadius: 5,
    color: '#FFF',
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  taskDescription: {
    fontSize: 18,
    color: '#FFF',
    marginVertical: 10,
  },
  taskPriority: {
    fontSize: 18,
    color: '#FFF',
  },
  subtarefaContainer: {
    marginBottom: 10,
  },
  subtarefaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtarefaTexto: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFF',
  },
  subtarefaConcluida: {
    textDecorationLine: 'line-through',
    color: 'green',
  },
  addSubtarefaContainer: {
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: colors.AzulCinzentado,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.Ciano1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonVoltar: {
    backgroundColor: 'red',
  },
  buttonTextVoltar: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
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

