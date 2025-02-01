import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomeScreen from '@/src/app/(panel)/Home/page';
import AddTaskScreen from '@/src/app/(panel)/AddTasks/page';
import ProfileScreen from '@/src/app/(panel)/profile/page';
import TutorialScreen from '@/src/app/(panel)/Info/page';
import { StyleSheet } from 'react-native';
import colors from '@/constants/colors';

type Route = {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon: string;
};

export default function BottomTabs() {
  const [index, setIndex] = useState<number>(0);
  const [isTutorialActive, setIsTutorialActive] = useState<boolean>(false);

  const [routes] = useState<Route[]>([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'addTask', title: 'Add', focusedIcon: 'plus-box', unfocusedIcon: 'plus-box-outline' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account-box', unfocusedIcon: 'account-box-outline' },
    { key: 'tutorial', title: 'Tutorial', focusedIcon: 'help-circle', unfocusedIcon: 'help-circle-outline' },
  ]);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'home':
        return <HomeScreen />;
      case 'addTask':
        return <AddTaskScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'tutorial':
        return <TutorialScreen onTutorialStart={() => setIsTutorialActive(true)} onTutorialEnd={() => setIsTutorialActive(false)} />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={(newIndex: number) => {
        if (!isTutorialActive) {
          setIndex(newIndex);
        }
      }}
      renderScene={renderScene}
      shifting={true}
      barStyle={styles.barStyle}
      activeColor={colors.Preto0}
      inactiveColor={colors.ColorText}
    />
  );
}

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: colors.Ciano0,
    height: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 10,
    elevation: 20,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -3 },
  },
});
