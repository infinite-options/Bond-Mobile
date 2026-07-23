import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainSelectionPage from './MainSelectionPage';
import MovieQuestionPage from './MovieQuestionPage';
import ResultsPage from './ResultsPage';
import CreditsPage from './CreditsPage';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="MainSelectionPage">
        <Stack.Screen name="MainSelectionPage" component={MainSelectionPage} />
      <Stack.Screen name="MovieQuestionPage" component={MovieQuestionPage} />
      <Stack.Screen name="ResultsPage" component={ResultsPage} />
      <Stack.Screen name="CreditsPage" component={CreditsPage} />

      </Stack.Navigator>
  );
};

export default AppNavigator;
