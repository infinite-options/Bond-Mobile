import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native'; 
import { StyleSheet, Text, View, Image, SafeAreaView, Alert, Button, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {useDimensions, useDeviceOrientation} from '@react-native-community/hooks'
import WelcomeScreen from './app/screens/WelcomeScreen';
import MainSelectionPage from './app/screens/MainSelectionPage';
import MovieQuestionPage from './app/screens/MovieQuestionPage';
import ResultsPage from './app/screens/ResultsPage';
const Stack = createStackNavigator();

export default function App() {

  return(

    <NavigationContainer>
       <Stack.Navigator initialRouteName="MainSelectionPage">
        <Stack.Screen name="MainSelectionPage" component={MainSelectionPage} />
        <Stack.Screen name="MovieQuestionPage" component={MovieQuestionPage} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="ResultsPage" component={ResultsPage} />
      </Stack.Navigator>
    </NavigationContainer>
    
   

    /*
    <SafeAreaView style={styles.container}>
      <View
      style={{
        backgroundColor: "dodgerblue",
        width: 100,
        height: 200,
        flex: 1,
        flexDirection: "row-reverse",
        justifyContent: 'center',
        alighItems: "center",
        top: 20, 
      }}
      ></View>
      <Text>Hello World</Text>
      <Button
        color = "orange"
       title="Click Me"
        onPress={() => Alert.alert("My title", "message", [
          {text: "Yes", onPress: () => console.log("Yes")},
          {text: "No", onPress: () => console.log("No")},      
        ])}
        ></Button>
      <Image 
      source={{ 
        width: 200,
        height: 300,
        uri: "https://picsum.photos/seed/picsum/200/300" }} />
    </SafeAreaView>
    */
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  //  paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
