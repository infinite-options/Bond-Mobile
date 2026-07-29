import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, BackHandler, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const API_BASE = 'https://iznfqs92n3.execute-api.us-west-1.amazonaws.com/dev/api/v2';
const MAX_QUESTIONS = 10;

// Points awarded for a correct answer, indexed by how many hints were revealed.
// 0 hints -> full points, 1 hint -> half, 2+ hints -> a quarter. Wrong answers always score 0.
const POINTS_BY_HINTS = [100, 50, 25];
const pointsForHints = (hintsShown) => POINTS_BY_HINTS[Math.min(hintsShown, POINTS_BY_HINTS.length - 1)];

// Decade of a film from its year, e.g. "1962" -> "1960s".
const decade = (item) => `${String(item.movie_year).slice(0, 3)}0s`;

// Seconds -> "M:SS", e.g. 84 -> "1:24".
const formatTime = (totalSeconds) => `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;

// Each subtype builds one kind of question:
// - questionField: the item field the question text is built from
// - answerField: the item field displayed as the answer options (grading compares this)
// - hints: progressive context clues [broad, ...specific]; NO level may contain the answer
const QUIZ_CONFIG = {
  movie: {
    title: 'MOVIE QUESTIONS',
    endpoint: `${API_BASE}/movies`,
    subtypes: [
      { questionField: 'movie_year', answerField: 'movie_title', questionText: (item) => `Q. In which film did James Bond appear in the year ${item.movie_year}?`, hints: (item) => [`${item.bond_actor} era · ${decade(item)}`, `The Bond girl was ${item.bond_girl}`] },
      { questionField: 'director', answerField: 'movie_title', questionText: (item) => `Q. Which Bond film was directed by ${item.director}?`, hints: (item) => [`Starred ${item.bond_actor} · ${decade(item)}`, `The Bond girl was ${item.bond_girl}`] },
      { questionField: 'title_song', answerField: 'movie_title', questionText: (item) => `Q. In which James Bond film does the theme song ${item.title_song} appear?`, hints: (item) => [`${item.bond_actor} era · ${decade(item)}`, `The Bond girl was ${item.bond_girl}`] },
      { questionField: 'bond_actor', answerField: 'movie_title', questionText: (item) => `Q. In which film did ${item.bond_actor} play James Bond?`, hints: (item) => [`Directed by ${item.director} · ${decade(item)}`, `The Bond girl was ${item.bond_girl}`] },
    ],
  },
  bond_girl: {
    title: 'BOND GIRL QUESTIONS',
    endpoint: `${API_BASE}/girls`,
    subtypes: [
      { questionField: 'bond_girl', answerField: 'movie_title', questionText: (item) => `Q. Which film featured the Bond girl ${item.bond_girl}?`, hints: (item) => [`${item.bond_actor} era · ${decade(item)}`, `Played by ${item.bond_girl_actress}`] },
      { questionField: 'bond_girl_actress', answerField: 'movie_title', questionText: (item) => `Q. In which film did ${item.bond_girl_actress} play the Bond girl?`, hints: (item) => [`${item.bond_actor} era · ${decade(item)}`, `The Bond girl was ${item.bond_girl}`] },
      { questionField: 'bond_girl', answerField: 'bond_actor', questionText: (item) => `Q. Who played Bond in the movie which featured ${item.bond_girl}?`, hints: (item) => [`A ${decade(item)} film`, `Directed by ${item.director}`] },
      { questionField: 'bond_girl_actress', answerField: 'bond_actor', questionText: (item) => `Q. Who played Bond in the movie which featured ${item.bond_girl_actress}?`, hints: (item) => [`A ${decade(item)} film`, `Directed by ${item.director}`] },
    ],
  },
  villains: {
    title: 'VILLAIN QUESTIONS',
    endpoint: `${API_BASE}/villains`,
    subtypes: [
      { questionField: 'villain', answerField: 'movie_title', questionText: (item) => `Q. Which film featured the villain ${item.villain}?`, hints: (item) => [`${item.bond_actor} era · ${decade(item)}`, `Played by ${item.villain_actor}`] },
      { questionField: 'villain_actor', answerField: 'movie_title', questionText: (item) => `Q. In which film did ${item.villain_actor} play the villain?`, hints: (item) => [`${item.bond_actor} era · ${decade(item)}`, `The villain was ${item.villain}`] },
    ],
  },
  plots: {
    title: 'PLOT QUESTIONS',
    endpoint: `${API_BASE}/villains`,
    subtypes: [
      { questionField: 'objective', answerField: 'objective', questionText: (item) => `Q. What was ${item.villain} trying to achieve in the movie ${item.movie_title}?`, hints: (item) => [`${item.bond_actor} · ${decade(item)}`, `The villain's fate: ${item.fate}`] },
      { questionField: 'outcome', answerField: 'outcome', questionText: (item) => `Q. What happens to ${item.villain}'s plan in the movie ${item.movie_title}?`, hints: (item) => [`${item.bond_actor} · ${decade(item)}`, `The villain's fate: ${item.fate}`] },
      { questionField: 'fate', answerField: 'fate', questionText: (item) => `Q. What is the fate of ${item.villain} in the movie ${item.movie_title}?`, hints: (item) => [`${item.bond_actor} · ${decade(item)}`, `The villain's objective: ${item.objective}`] },
    ],
  },
};

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Builds the next question, or null when no eligible item remains.
// Incorrect options must differ from the correct item in BOTH fields:
// same answerField would show duplicate option text, and same questionField
// would be a second factually-valid answer (e.g. another Sean Connery film).
// askedTexts avoids re-asking an identically worded question (e.g. two films
// share a year, or one director made several films) with a different answer.
// hardMode additionally skips "obvious" questions whose answer text is
// already contained in the question itself (e.g. many Bond theme songs
// share the film's title, like "Goldfinger").
const buildQuestion = (config, data, askedIndices, askedTexts = [], hardMode = false) => {
  for (const subtype of shuffle(config.subtypes)) {
    const eligible = shuffle(
      data
        .map((item, index) => ({ item, index }))
        .filter(({ item, index }) =>
          !askedIndices.includes(index) && item[subtype.questionField] && item[subtype.answerField]
        )
    );
    for (const { item, index } of eligible) {
      const questionText = subtype.questionText(item);
      if (askedTexts.includes(questionText)) continue;
      const correctAnswer = item[subtype.answerField];
      if (hardMode && questionText.toLowerCase().includes(String(correctAnswer).toLowerCase())) continue;
      // Every answer value that is factually valid for this question, across all
      // items sharing the question-field value (e.g. both films featuring an actor)
      const validAnswers = new Set(
        data
          .filter((other) => other[subtype.questionField] === item[subtype.questionField])
          .map((other) => other[subtype.answerField])
      );
      const incorrectPool = data.filter(
        (other) => other[subtype.answerField] && !validAnswers.has(other[subtype.answerField])
      );
      const incorrect = [...new Set(incorrectPool.map((other) => other[subtype.answerField]))];
      if (incorrect.length === 0) continue;
      const options = shuffle([correctAnswer, ...shuffle(incorrect).slice(0, 3)]);
      // Keep only non-empty clues that never reveal the answer (guards data quirks
      // like villain "Auric Goldfinger" vs. the film "Goldfinger").
      const hints = subtype
        .hints(item)
        .filter((h) => h && String(h).trim() !== '' && !String(h).includes(correctAnswer));
      return { index, questionText, options, correctAnswer, hints };
    }
  }
  return null;
};

const useQuizViewModel = (qtype, hardMode) => {
  const config = QUIZ_CONFIG[qtype];
  const [list, setList] = useState([]);
  const [question, setQuestion] = useState(null);
  const [askedIndices, setAskedIndices] = useState([]);
  const [askedTexts, setAskedTexts] = useState([]);
  const [ansCorrect, setAnsCorrect] = useState(0);
  const [ansWrong, setAnsWrong] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [pointsLostToHints, setPointsLostToHints] = useState(0);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerState, setAnswerState] = useState('unanswered');
  const [hintsShown, setHintsShown] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchQuestions();

    const backAction = () => {
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

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

  // Live quiz timer: starts once the first question loads, ticks every second,
  // and stops automatically when this screen unmounts (navigating to Results).
  useEffect(() => {
    if (!startTime) return;
    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const fetchQuestions = async () => {
    try {
      if (!config) throw new Error('Invalid question type');
      const response = await axios.get(config.endpoint);
      const data = response.data;
      const first = buildQuestion(config, data, [], [], hardMode);
      if (!first) throw new Error('No questions available');
      setList(data);
      setQuestion(first);
      setAskedIndices([first.index]);
      setAskedTexts([first.questionText]);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoadError(true);
    }
  };

  const handleRadioButtonPress = (option) => {
    if (answerState !== 'unanswered') return;
    setSelectedOption(option);
  };

  const revealHint = () => {
    setHintsShown((n) => Math.min(n + 1, question ? question.hints.length : 0));
    setTotalHintsUsed((n) => n + 1);
  };

  // Post-answer version of revealHint: the question is already graded, so this
  // is pure trivia context now — it must NOT count toward totalHintsUsed.
  const learnMore = () => {
    setHintsShown((n) => Math.min(n + 1, question ? question.hints.length : 0));
  };

  const handleSubmit = () => {
    if (!selectedOption || answerState !== 'unanswered') return;
    if (selectedOption === question.correctAnswer) {
      setAnswerState('correct');
      setAnsCorrect(ansCorrect + 1);
      const earned = pointsForHints(hintsShown);
      setTotalScore(totalScore + earned);
      setPointsLostToHints(pointsLostToHints + (100 - earned));
    } else {
      setAnswerState('wrong');
      setAnsWrong(ansWrong + 1);
    }
  };

  const handleNext = () => {
    const answered = askedIndices.length;
    const next = answered >= MAX_QUESTIONS ? null : buildQuestion(config, list, askedIndices, askedTexts, hardMode);
    if (!next) {
      navigation.navigate('ResultsPage', { ansCorrect, ansWrong, questions: answered, totalScore, elapsedSeconds, pointsLostToHints });
      return;
    }
    setQuestion(next);
    setAskedIndices([...askedIndices, next.index]);
    setAskedTexts([...askedTexts, next.questionText]);
    setSelectedOption(null);
    setAnswerState('unanswered');
    setHintsShown(0);
  };

  return {
    title: config ? config.title : '',
    question,
    questionNumber: askedIndices.length,
    isLastQuestion: askedIndices.length >= MAX_QUESTIONS || askedIndices.length >= list.length,
    ansCorrect,
    ansWrong,
    totalScore,
    totalHintsUsed,
    elapsedSeconds,
    selectedOption,
    answerState,
    hintsShown,
    loadError,
    handleRadioButtonPress,
    handleSubmit,
    handleNext,
    revealHint,
    learnMore,
  };
};

const MovieQuestionPage = ({ route }) => {
  const { qtype, hardMode = false } = route.params;
  const {
    title,
    question,
    questionNumber,
    isLastQuestion,
    ansCorrect,
    ansWrong,
    totalScore,
    totalHintsUsed,
    elapsedSeconds,
    selectedOption,
    answerState,
    hintsShown,
    loadError,
    handleRadioButtonPress,
    handleSubmit,
    handleNext,
    revealHint,
    learnMore,
  } = useQuizViewModel(qtype, hardMode);

  // Bounding the screen to the window height lets the ScrollView scroll internally
  // (RN-web's app root only sets min-height), so the footer button stays pinned.
  const { height: windowHeight } = useWindowDimensions();

  if (loadError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Unable to fetch data. Please try again later.</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const answered = answerState !== 'unanswered';

  const optionTextStyle = (option) => {
    if (!answered) return null;
    if (option === question.correctAnswer) return styles.optionTextCorrect;
    if (option === selectedOption) return styles.optionTextWrong;
    return null;
  };

  return (
    <View style={[styles.screen, { height: windowHeight }]}>
      {/* Fixed header: stats row, then the Next Question button below it. Next
          ONLY advances — it never grades the current answer — but it's locked
          until Submit has graded this question, so the user can't skip ahead
          unanswered. Both rows stay outside the ScrollView so they're always
          reachable without scrolling. */}
      <Text style={styles.title}>{title}</Text>
      {hardMode && (
        <View style={styles.hardModeBadge}>
          <Image source={require('./assets/icon-spy.png')} style={[styles.hardModeBadgeIcon, { tintColor: '#FFD700' }]} />
          <Text style={styles.hardModeBadgeText}>SUPER SECRET SPY MODE</Text>
        </View>
      )}
      <View style={styles.statsBar}>
        <Text style={styles.scoreItem}>Q {questionNumber}/{MAX_QUESTIONS}</Text>
        <Text style={[styles.scoreItem, styles.scorePoints]}>★{totalScore}</Text>
        <Text style={[styles.scoreItem, styles.scoreCorrect]}>✓{ansCorrect}</Text>
        <Text style={[styles.scoreItem, styles.scoreWrong]}>✗{ansWrong}</Text>
        <Text style={[styles.scoreItem, styles.scoreHints]}>💡{totalHintsUsed}</Text>
        <Text style={styles.scoreItem}>⏱{formatTime(elapsedSeconds)}</Text>
      </View>
      <TouchableOpacity
        style={[styles.nextButton, !answered && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={!answered}
        accessibilityLabel={isLastQuestion ? 'See results' : 'Next question'}
      >
        <Text style={styles.nextButtonText}>{isLastQuestion ? 'See Results →' : 'Next Question →'}</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.mainContainer}>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{question.questionText}</Text>
          {question.hints.slice(0, hintsShown).map((clue, i) => (
            <Text key={i} style={styles.hintText}>💡 {clue}</Text>
          ))}
          {hintsShown < question.hints.length && (
            answered ? (
              <TouchableOpacity onPress={learnMore}>
                <Text style={styles.hintButtonText}>📖 Learn More</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={revealHint}>
                <Text style={styles.hintButtonText}>💡 {hintsShown === 0 ? 'Need a hint?' : 'Need another hint?'}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
        <View style={styles.line} />
        {question.options.map((option) => (
          <TouchableOpacity key={option} onPress={() => handleRadioButtonPress(option)} disabled={answered}>
            <View style={styles.optionRow}>
              <View style={[styles.radioButton, { borderColor: selectedOption === option ? 'blue' : 'black' }]}>
                {selectedOption === option && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={[styles.radioButtonText, optionTextStyle(option)]}>{option}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {!answered && selectedOption && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
        {answered && (
          <View style={[styles.banner, answerState === 'correct' ? styles.bannerCorrect : styles.bannerWrong]}>
            <Text style={styles.bannerTitle}>
              {answerState === 'correct' ? "✓ Correct — You're good, Mr. Bond!" : '✗ Wrong answer!'}
            </Text>
            {answerState === 'wrong' && (
              <Text style={styles.bannerText}>Correct answer: {question.correctAnswer}</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#681110',
    textAlign: 'center',
    padding: 20,
  },
  title: {
    backgroundColor: 'black',
    textAlign: 'center',
    fontSize: 40,
    paddingTop: 40,
    paddingBottom: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Fresno-Regular',
  },
  hardModeBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingBottom: 8,
  },
  hardModeBadgeIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  hardModeBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scoreItem: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },
  scorePoints: {
    color: '#B8860B',
  },
  scoreCorrect: {
    color: '#1B7C1B',
  },
  scoreWrong: {
    color: '#C20400',
  },
  scoreHints: {
    color: '#8A6D00',
  },
  nextButton: {
    backgroundColor: 'black',
    paddingVertical: 11,
    marginHorizontal: 16,
    marginVertical: 9,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.3,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  line: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  questionContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 6,
  },
  mainContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 6,
  },
  question: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 12,
  },
  hintButtonText: {
    color: '#681110',
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 4,
  },
  hintText: {
    color: '#555',
    fontSize: 14,
    fontStyle: 'italic',
    paddingTop: 4,
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
  },
  radioButtonText: {
    fontSize: 16,
    paddingLeft: 10,
    flexShrink: 1,
  },
  optionTextCorrect: {
    color: '#1B7C1B',
    fontWeight: 'bold',
  },
  optionTextWrong: {
    color: '#C20400',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  banner: {
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    borderWidth: 2,
  },
  bannerCorrect: {
    backgroundColor: '#1B7C1B',
    borderColor: '#125712',
  },
  bannerWrong: {
    backgroundColor: '#C20400',
    borderColor: '#681110',
  },
  bannerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
});

export default MovieQuestionPage;
