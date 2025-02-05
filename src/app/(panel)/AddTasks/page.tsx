import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { auth, db } from '@/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { showNotification } from '@/src/componentes/chamarnotificar';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});



interface Subtarefa {
  nome: string;
  concluido: boolean;
}

const AddTask = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescription] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [loading, setLoading] = useState(false);
  const [subtarefas, setSubtarefas] = useState<Subtarefa[]>([]); // Tipagem de subtarefas
  const [novaSubtarefa, setNovaSubtarefa] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const user = auth.currentUser;

  const adicionarSubtarefa = () => {
    if (novaSubtarefa.trim()) {
      const novaTarefaSubtarefa: Subtarefa = { nome: novaSubtarefa, concluido: false };
      setSubtarefas([...subtarefas, novaTarefaSubtarefa]);
      setNovaSubtarefa('');
    }
  };

  const alternarConclusao = (index: number) => {
    const novaLista = [...subtarefas];
    novaLista[index].concluido = !novaLista[index].concluido;
    setSubtarefas(novaLista);
  };

  const calcularProgresso = () => {
    if (subtarefas.length === 0) return 0;
    const concluidos = subtarefas.filter((subtarefa) => subtarefa.concluido).length;
    return (concluidos / subtarefas.length) * 100;
  };

  const handleAddTask = async () => {
    if (!titulo.trim() || !descricao.trim() || subtarefas.length === 0) {
      console.error("Preencha todos os campos e adicione pelo menos uma subtarefa.");
      return;
    }
  
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }
  
    try {
      setLoading(true);
  
      // Adiciona a tarefa no Firestore
      await addDoc(collection(db, "Tarefas"), {
        titulo,
        description: descricao,
        prioridade,
        subtarefas,
        progresso: calcularProgresso(),
        conclusaoDaTarefa: false,
        idUser: user.uid, // Acessando o UID do usuário
      });
  
      // Limpa os campos após adicionar a tarefa
      setTitulo('');
      setDescription('');
      setNovaSubtarefa('');
      setSubtarefas([]);
      setMensagemSucesso("Tarefa adicionada com sucesso!");
      showNotification();
    } catch (error) {
      console.error("Erro ao adicionar tarefa: ");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Tarefa</Text>

      <TextInput
        style={styles.input}
        placeholder="Título da Tarefa"
        placeholderTextColor="#FFF"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição da Tarefa"
        placeholderTextColor="#FFF"
        multiline
        value={descricao}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Prioridade:</Text>
      <Picker
        selectedValue={prioridade}
        onValueChange={setPrioridade}
        style={styles.picker}
      >
        <Picker.Item label="Alta" value="Alta" />
        <Picker.Item label="Média" value="Média" />
        <Picker.Item label="Baixa" value="Baixa" />
      </Picker>

      <Text style={styles.label}>Subtarefas:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nova Subtarefa"
        placeholderTextColor="#FFF"
        value={novaSubtarefa}
        onChangeText={setNovaSubtarefa}
      />
      <Button
        mode="contained"
        onPress={adicionarSubtarefa}
        style={styles.addTopicButton}
      >
        Adicionar Subtarefa
      </Button>

      <FlatList
        data={subtarefas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => alternarConclusao(index)}>
            <Text style={item.concluido ? styles.topicoConcluido : styles.topico}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.label}>
        Progresso: {calcularProgresso().toFixed(2)}%
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          contentStyle={styles.btncontent}
          mode="contained"
          onPress={handleAddTask}
          style={styles.button}
          loading={loading}
        >
          OK
        </Button>
      </View>

      {mensagemSucesso ? (
        <Text style={styles.mensagemSucesso}>{mensagemSucesso}</Text>
      ) : null}
    </View>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D2D29',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    color: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 55,
    backgroundColor: '#3C3C3C',
    borderRadius: 5,
    color: '#FFF',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#215A6D',
    height: 50,
    borderRadius: 25,
  },
  btncontent: {
    height: 50,
  },
  addTopicButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
  },
  topico: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
    marginVertical: 5,
  },
  topicoConcluido: {
    color: '#90EE90',
    fontSize: 16,
    marginVertical: 5,
    textDecorationLine: 'line-through',
  },
  mensagemSucesso: {
    marginTop: 20,
    color: '#4CAF50',
    fontSize: 18,
  },
});
