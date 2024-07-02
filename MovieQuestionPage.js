import React, { useState, useEffect} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,BackHandler } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const useMovieViewModel = (qtype) => {
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
  
  
  const navigation = useNavigation();
  
  useEffect(() => {
    fetchMovies();

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
 

/*  
  useEffect(() => {
    fetchMovies();
  }, []);
*/  

  const fetchMovies = async () => {
    try {
      let apiEndpoint = '';
      switch (questionType) {
        case 'movie':
          apiEndpoint = 'https://iznfqs92n3.execute-api.us-west-1.amazonaws.com/dev/api/v2/movies';
          break;
        case 'bond_girl':
          apiEndpoint = 'https://iznfqs92n3.execute-api.us-west-1.amazonaws.com/dev/api/v2/girls';
          break;
        case 'villains':
          apiEndpoint = 'https://iznfqs92n3.execute-api.us-west-1.amazonaws.com/dev/api/v2/villains';
          break;
        case 'plots':
          apiEndpoint = 'https://iznfqs92n3.execute-api.us-west-1.amazonaws.com/dev/api/v2/villains';
          break; 
        default:
          throw new Error('Invalid question type'); 
      }

      const response = await axios.get(apiEndpoint);
      const data = response.data;
      
      switch (questionType) {
        case 'movie':
          setMoviesList(data);
          break;
        case 'bond_girl':
          setBondGirlsList(data);
          break;
        case 'villains':
          setVillainsList(data);
          break;
        case 'plots':
          setPlotList(data);
          break; 
        default:
          throw new Error('Invalid question type');
      }

      getQuestion(data);

    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert('Error', 'Unable to fetch data. Please try again later.');
    }
  };

  const getQuestion = (data) => {
    setSubQuestionType("");
   
    let randomSubQuestionType ="";
    let dataKey="";
    switch (questionType) {
      case 'movie':
            const movieQuestionTypes = ['movie_year', 'director', 'title_song', 'bond_actor'];
            randomSubQuestionType = movieQuestionTypes[Math.floor(Math.random() * movieQuestionTypes.length)];
            if (randomSubQuestionType === "year")  {
              dataKey = "move_year";
            }
            else
            {
              dataKey = "movie_title";
            }
          break;
      case 'bond_girl':
          const bondGirlQuestionTypes = ['bond_girl1', 'bond_girl_actress1', 'bond_girl2', 'bond_girl_actress2'];    
          randomSubQuestionType= bondGirlQuestionTypes[Math.floor(Math.random() * bondGirlQuestionTypes.length)];
          if (["bond_girl2", "bond_girl_actress2"].includes(randomSubQuestionType)) {
            dataKey = "bond_actor";
          }
          else
          {
            dataKey = "movie_title";
          }
          break;
      case 'villains':
          const villainQuestionTypes = ['villain_name', 'villain_actor'];
          randomSubQuestionType = villainQuestionTypes[Math.floor(Math.random() * villainQuestionTypes.length)];
          
          if (randomSubQuestionType === "name") {
            dataKey = "villain";
          }
          else
          {
            dataKey = "movie_title";
          }
          break;
      case 'plots':
          const PlotQuestionsTypes = ['objective', 'outcome', 'fate'];
          randomSubQuestionType =  PlotQuestionsTypes[Math.floor(Math.random() *  PlotQuestionsTypes.length)];
          if (randomSubQuestionType === "objective") {
            dataKey = "objective";
          }
          else if (randomSubQuestionType === "outcome") 
          {
            dataKey = "outcome";
          }
          else {
            dataKey = "fate";
          }
          break;
      default:
        return '';
    }

    setSubQuestionType(randomSubQuestionType);
    if(questionsAsked.length === data.length) {
         //Alert.alert("Completed", "You have answered all questions.");

    } else {
    let nextQuestion;
    do {
      nextQuestion = Math.floor(Math.random() * data.length);
    } while (questionsAsked.includes(nextQuestion));

    const correctOption = data[nextQuestion];
    const allOptions = data.slice(); 
    const correctValue = correctOption[dataKey];

    for (let i = allOptions.length - 1; i >= 0; i--) {

      if (allOptions[i][dataKey] === correctOption[dataKey] ) {
        allOptions.splice(i, 1);
      }
    }
    
    const randomIncorrectOptions = [];
    while (randomIncorrectOptions.length < 3) {
      const randIndex = Math.floor(Math.random() * allOptions.length);
      const option = allOptions[randIndex];

      // Ensure option is unique
      if (!randomIncorrectOptions.includes(option)) {
        randomIncorrectOptions.push(option);
      }

      // Remove selected option to prevent reuse
      for (let i = allOptions.length - 1; i >= 0; i--) {
        if (allOptions[i][dataKey]  === option[dataKey]) {
          allOptions.splice(i, 1);
        }
      }
    }

    // Combine the correct option with the incorrect options and shuffle
    const options = [...randomIncorrectOptions, correctOption];
    options.sort(() => Math.random() - 0.5);

   
    setQuestionsAsked([...questionsAsked, nextQuestion]);
    setQuestions(questions + 1);
    setCurrentIndex(nextQuestion);
    setOptions(options);
    setSelectedOption(null);
    setHasAnsweredIncorrectly(false);

    }
  };

  const handleRadioButtonPress = (item) => {
    switch (questionType) {
      case 'movie':
        setSelectedOption(item.movie_title);
        break;
      case 'bond_girl':
        setSelectedOption(item.bond_girl);
        break;
      case 'villains':
        setSelectedOption(item.villain);
        break;
      case 'plots':
        setSelectedOption(item[subQuestionType]);
        break; 
      default:
        setSelectedOption(null);
        break;
    }
  };

  const handleOptionPress = () => {
    let selectedEntity = '';
    switch (questionType) {
      case 'movie':
        selectedEntity = moviesList[currentIndex].movie_title;
        break;
      case 'bond_girl':
        selectedEntity = bondGirlsList[currentIndex].bond_girl;
        break;
      case 'villains':
        selectedEntity = villainsList[currentIndex].villain;
        break;
      case 'plots':
        selectedEntity = plotList[currentIndex][subQuestionType];
        break;
      default:
        selectedEntity = '';
        break;
    }

    if (selectedOption === selectedEntity) {
      //console.log(hasAnsweredIncorrectly);
      let finalScore=ansCorrect;
      if (hasAnsweredIncorrectly === false) {
        finalScore=ansCorrect+1
        setAnsCorrect(ansCorrect + 1);
      }  
     // console.log(finalScore);
     // console.log("answer");
      
      if (questions >= 10) {
        Alert.alert('Correct', "You're Good!",
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('ResultsPage', {finalScore, ansWrong, questions });
              return;
            }
          }
        ]
        );
      
      }
      else
      {
        Alert.alert('Correct', "You're Good!");
      }
      if (questions <= 9) {
        switch (questionType) {
          case 'movie':
            getQuestion(moviesList);
            break;
          case 'bond_girl':
            getQuestion(bondGirlsList);
            break;
          case 'villains':
            getQuestion(villainsList);
            break;
          case 'plots':
            getQuestion(plotList);
            break; 
          default:
            throw new Error('Invalid question type');
        }
      }

    } else {
      Alert.alert('Whoops', 'Wrong Answer!');
      if (hasAnsweredIncorrectly === false) {
        setAnsWrong(ansWrong + 1);
        setHasAnsweredIncorrectly(true); 
      }
    }
  };


  return {
    questions,
    ansCorrect,
    ansWrong,
    moviesList,
    bondGirlsList,
    villainsList,
    plotList,
    currentIndex,
    handleOptionPress,
    handleRadioButtonPress,
    getQuestion,
    selectedOption,
    options,
    questionType,
    subQuestionType,
  };
};

const MovieQuestionPage = ({ route, navigation }) => {
  const { qtype } = route.params;

  const {
    questions,
    ansCorrect,
    ansWrong,
    moviesList,
    bondGirlsList,
    villainsList,
    plotList,
    currentIndex,
    handleOptionPress,
    getQuestion,
    handleRadioButtonPress,
    selectedOption,
    options,
    questionType,
    subQuestionType,
  } = useMovieViewModel(qtype);

  useEffect(() => {
    if (moviesList.length > 0 || bondGirlsList.length > 0 || villainsList.length > 0 || plotList.length > 0) {

      switch (questionType) {
        case 'movie':
          getQuestion(moviesList);
          break;
        case 'bond_girl':
          getQuestion(bondGirlsList);
          break;
        case 'villains':
          getQuestion(villainsList);
          break;
        case 'plots':
          getQuestion(plotList); 
          break;
        default:
          throw new Error('Invalid question type');
      }
    }
  }, [moviesList, bondGirlsList, villainsList, plotList]);

  if (moviesList.length === 0 && bondGirlsList.length === 0 && villainsList.length === 0 && plotList.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderQuestion = () => {
    switch (questionType) {
      case 'movie':
        switch (subQuestionType) {
          case 'movie_year':
            return `Q. In which film did James Bond appear in the year ${moviesList[currentIndex]?.movie_year}?`;
          case 'director':
            return `Q. Which Bond film was directed by ${moviesList[currentIndex]?.director}?`;
          case 'title_song':
            return `Q. In which James Bond film does the theme song ${moviesList[currentIndex]?.title_song} appear?`;
          case 'bond_actor':
            return `Q. In which film did ${moviesList[currentIndex]?.bond_actor} play James Bond?`;
          case 'year':
            return `Q. In which year did ${moviesList[currentIndex]?.movie_title} appear?`;
          default:
            return '';
        }
      
      case 'bond_girl':
        switch (subQuestionType) {
          case 'bond_girl1':
            return `Q. Which film featured the Bond girl ${bondGirlsList[currentIndex]?.bond_girl}?`;
          case 'bond_girl_actress1':
            return `Q. In which film did ${bondGirlsList[currentIndex]?.bond_girl_actress} play the Bond girl?`;
          case 'bond_girl2':
            return `Q. Who played Bond in the movie which featured ${bondGirlsList[currentIndex]?.bond_girl}?`;
          case 'bond_girl_actress2':
            return `Q. Who played Bond in the movie which featured ${bondGirlsList[currentIndex]?.bond_girl_actress}?`;
          default:
            return '';
        }
      
      case 'villains':
        switch (subQuestionType) {
          case 'villain_name':
            return `Q. Which film featured the villain ${villainsList[currentIndex]?.villain}?`;
          case 'villain_actor':
            return `Q. In which film did ${villainsList[currentIndex]?.villain_actor} play the villain?`;
          case 'name':
            return `Q. Which villain did ${villainsList[currentIndex]?.villain_actor} play?`;
          case 'bond':
            return `Q. In which film did Bond face the ${villainsList[currentIndex]?.villain}?`;
          default:
            return '';
        }

        case 'plots':
         
          switch (subQuestionType) {
            case 'objective':
              return `Q. What was ${plotList[currentIndex]?.villain} trying to achieve in the movie ${plotList[currentIndex]?.movie_title}?`;
            case 'outcome':
              return `Q. What happens to ${plotList[currentIndex]?.villain}'s plan in the movie ${plotList[currentIndex]?.movie_title}?`;
            case 'fate':
              return `Q. What is the fate of ${plotList[currentIndex]?.villain} in the movie ${plotList[currentIndex]?.movie_title}?`;
            default:
              return '';
          }
      
      default:
        return '';
    }
  };

  const renderAnswers = (questionType, subQuestionType, item ) => {

    switch (questionType) {
      case 'movie':
        switch (subQuestionType) {
          case 'movie_year':
            return item.movie_title; 
          case 'director':
            return item.movie_title; 
          case 'title_song':
            return item.movie_title; 
          case 'bond_actor':
            return item.movie_title; 
          case 'year':
            return item.movie_year;
          default:
            return '';
        }
      
      case 'bond_girl':
        switch (subQuestionType) {
          case 'bond_girl1':
            return item.movie_title; 
          case 'bond_girl_actress1':
            return item.movie_title; 
          case 'bond_girl2':
            return item.bond_actor; 
          case 'bond_girl_actress2':
            return item.bond_actor; 
          default:
            return '';
        }
      
      case 'villains':
        switch (subQuestionType) {
          case 'villain_name':
            return item.movie_title; 
          case 'villain_actor':
            return item.movie_title; 
          case 'name':
            return item.villain; 
          case 'bond':
            return item.movie_title;
          default:
            return '';
        }

        case 'plots':
          switch (subQuestionType) {
            case 'objective':
              return item.objective; 
            case 'outcome':
              return item.outcome; 
            case 'fate':
                return item.fate; 
            default:
              return '';
        }
      default:
        return '';
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>MOVIE QUESTIONS</Text>
      <Text style={styles.subtitle}>So you think you know the answers</Text>
    
      
        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            {renderQuestion()}
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
};

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

});

export default MovieQuestionPage;

