import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, Alert, Button, Platform } from 'react-native';
import {useDimensions, useDeviceOrientation} from '@react-native-community/hooks'
import WelcomeScreen from './app/screens/WelcomeScreen';
export default function App() {
 // const {landscape} = useDeviceOrientation();


  return(
    <WelcomeScreen />
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
