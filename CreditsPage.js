import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const CreditsPage = ({ route }) => {
  const navigation = useNavigation();
  const { ansCorrect, ansWrong, questions } = route.params;

  const handleRestart = () => {
    navigation.navigate('MainSelectionPage'); 
  };

  useEffect(() => {

    const backAction = () => {
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerTitle: '',
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation])
  );
 

  return (

    <View style={styles.container}>
      <Text style={styles.title}>CREDITS</Text>
      <View style={styles.resultsContainer}>
        <View style={styles.textRow}>
          <Text style={styles.resultsText}>Thanks to Adobe Fonts for providing the Fresno Black font Free of Charge!</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRestart}>
              <Text style={styles.buttonText}>MainPage</Text>
          </TouchableOpacity> 
      </View>
    </View>  


  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  title: {
    backgroundColor: 'black',
    textAlign: 'center', 
    fontSize: 60,
    paddingTop: '10%',
    paddingBottom: '20%',
    color: 'white',
    fontWeight: 'bold',
    height: '10%',
    fontFamily: 'Fresno-Regular',
   },

  resultsContainer: {
    backgroundColor: '#681110',
    padding: 24,

    borderWidth: 1,
    borderColor: 'black',
    width: '100%',
    height: '90%',
  },

  resultsText: {
    fontSize: 18,
    color: 'white', 
    marginTop: 20, 
  },
  button: {

    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 10,
    width: '50%',
    borderColor: 'black',
    borderWidth: 3,
    
  },

  buttonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center', 
    fontWeight: 'bold',
  },

  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});

export default CreditsPage;
