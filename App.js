import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import MainSelectionPage from './MainSelectionPage'; 


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MainSelectionPage">
      <Stack.Screen name="MainSelectionPage" component={MainSelectionPage} />
   {/*   <Stack.Screen name="MovieQuestionPage" component={MovieQuestionPage} />
      <Stack.Screen name="ResultsPage" component={ResultsPage} />
  <Stack.Screen name="CreditsPage" component={CreditsPage} /> */}
    </Stack.Navigator>
  );
};


export default function App() {

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
