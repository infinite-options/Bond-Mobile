import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';

const MainSelectionPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hello, World!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 60,
    paddingTop: 100,
    backgroundColor: 'black',
    fontFamily: 'Fresno-Regular',
    fontWeight: 'bold',
    color: 'white',
},
});

export default MainSelectionPage;
