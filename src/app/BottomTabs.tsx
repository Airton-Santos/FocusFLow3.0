import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomeScreen from '@/src/app/(panel)/Home/page';
import AddTaskScreen from '@/src/app/(panel)/AddTasks/page';
import ProfileScreen from '@/src/app/(panel)/profile/page';
import { StyleSheet } from 'react-native';
import colors from '@/constants/colors';

type Route = {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon: string;
};

export default function BottomTabs() {
  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'addTask', title: 'Add', focusedIcon: 'plus-box', unfocusedIcon: 'plus-box-outline' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account-box', unfocusedIcon: 'account-box-outline' },
  ]);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'home':
        return <HomeScreen />;
      case 'addTask':
        return <AddTaskScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={true} // Ativa animações de transição
      barStyle={styles.barStyle} // Aplica os estilos personalizados
      activeColor={colors.Preto0} // Cor do ícone/texto quando ativo
      inactiveColor={colors.ColorText} // Cor do ícone/texto quando inativo
    />
  );
}

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: colors.Ciano0,
    height: 80, // Altura maior para facilitar o toque
    borderTopLeftRadius: 20, // Arredondamento das bordas superiores
    borderTopRightRadius: 20,
    paddingBottom: 10, // Ajusta espaço interno
    elevation: 20, // Adiciona sombra no Android
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -3 },
  },
});
