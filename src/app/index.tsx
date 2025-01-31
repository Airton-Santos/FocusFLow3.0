import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';

export default function app() {
    const router = useRouter();
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Animação para o fade in do logo e nome do app
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start();
    
        // Redireciona para a tela principal após 5 segundos
        const timer = setTimeout(() => {
          router.replace('/(auth)/mainPage/page');
        }, 5000);
    
        return () => clearTimeout(timer);
      }, [fadeAnim, router]);
    

 return (
   <View style={styles.container}>
        {/* Logo e nome com animação */}
        <Animated.Image
        source={require('../Elements/Logo.png')}
        style={[styles.logo, { opacity: fadeAnim }]}/>

    <Animated.Text style={[styles.NameApp, { opacity: fadeAnim }]}>
        Focus Flow
      </Animated.Text>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.Preto0
    },
    logo: {
        width: 180, // Aumenta o tamanho do logo para dar mais destaque
        height: 180,
        zIndex: 1,
        marginBottom: 30, // Distância entre o logo e o nome
      },
      NameApp: {
        fontSize: 30, // Aumenta o tamanho da fonte
        fontWeight: 'bold', // Traz mais destaque ao nome
        color: colors.Ciano1,
        zIndex: 1,
        letterSpacing: 2, // Distância entre as letras para um visual mais moderno
      }

})