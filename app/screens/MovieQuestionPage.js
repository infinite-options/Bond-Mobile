import React, { useState, useEffect} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,BackHandler } from 'react-native';


function MovieQuestionPage(qtype) {
    const [questions, setQuestions] = useState(0);
    const [ansCorrect, setAnsCorrect] = useState(0);
    const [ansWrong, setAnsWrong] = useState(0);
    const [questionsAsked, setQuestionsAsked] = useState([]);
    const [moviesList, setMoviesList] = useState([]);
    const [villainsList, setVillainsList] = useState([]);
    const [bondGirlsList, setBondGirlsList] = useState([]);
    const [plotList, setPlotList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [questionType] = useState(qtype);
    const [subQuestionType, setSubQuestionType] = useState('');
    const [hasAnsweredIncorrectly, setHasAnsweredIncorrectly] = useState(false);
    return (
        <ScrollView style={styles.container}>
        <Text style={styles.title}>MOVIE QUESTIONS</Text>
        <Text style={styles.subtitle}>So you think you know the answers</Text>
      
        
          <View style={styles.questionContainer}>
            <Text style={styles.question}>
            {/*  {renderQuestion()} */}
            </Text>
            <View style={styles.line} />
          </View>
          <View style={styles.ansContainer}>
            {options.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleRadioButtonPress(item)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',padding: 15, }}>
                  <View
                    style={[
                      styles.radioButton,
                      { borderColor: selectedOption === (questionType === 'movie' ? item.movie_title : questionType === 'bond_girl' ? item.bond_girl : questionType === 'villains' ? item.villain : item[subQuestionType]) ? 'blue' : 'black' },
                    ]}
                  >
                  {selectedOption === (questionType === 'movie' ? item.movie_title : questionType === 'bond_girl' ? item.bond_girl : questionType === 'villains' ? item.villain : item[subQuestionType]) && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.radioButtonText}>{renderAnswers(questionType, subQuestionType, item)}</Text>
            </View>
              </TouchableOpacity>
      
            ))}
        
            <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleOptionPress()}
            disabled={!selectedOption}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View> 
          <View style={styles.resultsContainer}>
              <Text style={styles.resultsText}>Here is how you did Mr.Bond</Text>
              <View style={styles.textRow}>
                <Text style={styles.resultsText}>Number of Questions asked:</Text>
                <Text style={styles.questionsText}>{questions}</Text>
              </View>
              <View style={styles.textRow}>
                <Text style={styles.resultsText}>Total Number of Correct Answers:</Text>
                <Text style={styles.questionsText}>{ansCorrect}</Text>
              </View>
              <View style={styles.textRow}>
              <Text style={styles.resultsText}>Total Number of Incorrect Answers:</Text>
              <Text style={styles.questionsText}>{ansWrong}</Text>
              </View>    
          </View>
      </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        margin: 0,
        backgroundColor: 'black',
        borderRadius: 5,
        //height: '25%',
      },
      ansContainer: {
        margin: 0,
        backgroundColor: 'white',
      },
    
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        backgroundColor: 'black',
        textAlign: 'center', 
        fontSize: 60,
        paddingTop: '20%',
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Fresno-Regular',
       },
    subtitle: {
      paddingTop: '15%',
      backgroundColor: 'black',
      textAlign: 'left',
      fontSize: 22,
      color: 'white', 
     
     },
      line: {
        borderBottomColor: '#000', 
        borderBottomWidth: 1,
      },
      questionContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10,
      },
      question: {
        fontSize: 16,
        textAlign: 'left',
        fontWeight: 'bold',
        paddingVertical: 15,
      },
      highlight: {
        fontWeight: 'bold',
      },
    
      radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'blue',
        fontSize: 18,
      },
      radioButtonText: {
        fontSize: 16,
        paddingLeft: 10,
      },
      submitButton: {
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: '50%',
      },
    
      submitButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
      },
      resultsContainer: {
        backgroundColor: '#681110',
        padding: 24,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        //borderWidth: 1,
        borderColor: 'black',
        width: '100%',
        height: '40%',
      },
      resultsText: {
        fontSize: 18,
        color: 'white', 
        marginBottom: 20, 
      },
      questionsText: {
        fontSize: 15,
        color: 'white',
        textAlign: 'right', 
      },
      textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    
})
export default MovieQuestionPage;