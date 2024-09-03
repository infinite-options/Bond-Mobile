import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';

function ResultsPage(props) {

    const route = useRoute();
    const { finalScore, ansWrong, questions } = route.params;
    const navigation = useNavigation();

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
        <Text style={styles.title}>RESULTS</Text>
        <Text style={styles.titleSpace}></Text>
        <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Here is how you did Mr.Bond</Text>
          <View style={styles.textRow}>
            <Text style={styles.resultsText}>Number of Questions asked:</Text>
            <Text style={styles.questionsText}>{questions}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.resultsText}>Total Number of Correct Answers:</Text>
            <Text style={styles.questionsText}>{finalScore}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.resultsText}>Total Number of Incorrect Answers:</Text>
            <Text style={styles.questionsText}>{ansWrong}</Text>
          </View>
  
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
                <Text style={styles.buttonText}>MainPage</Text>
            </TouchableOpacity> 
        </View>
      </View>  
  

    );
}

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
    
       titleSpace: {
        backgroundColor: 'white',
        paddingBottom: '2%',
       },
      resultsContainer: {
        backgroundColor: '#681110',
        padding: 24,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        width: '100%',
        height: '90%',
      },
      resultsTitle: {
        fontSize: 18,
        color: 'white', 
        marginTop: 5, 
        marginBottom: 20, 
        fontWeight: 'bold',
      },
      resultsText: {
        fontSize: 18,
        color: 'white', 
        marginTop: 20, 
        fontWeight: 'bold',
      },
      questionsText: {
        fontSize: 15,
        color: 'white',
        marginTop: 20, 
        textAlign: 'right', 
        fontWeight: 'bold',
        
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
    
})
export default ResultsPage;