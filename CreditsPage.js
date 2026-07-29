import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, BackHandler, useWindowDimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const CreditsPage = () => {
  const navigation = useNavigation();
  // Bounding the screen to the window height (NOT flex:1 — RN-web's app root
  // only sets min-height, so flex:1 here would grow to content instead of
  // being bounded) lets the ScrollView below scroll internally on web.
  const { height: windowHeight } = useWindowDimensions();

  const handleBack = () => {
    navigation.navigate('MainSelectionPage');
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainSelectionPage');
      return true;
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

  return (
    <View style={[styles.screen, { height: windowHeight }]}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>SECRET DOSSIER</Text>
        <View style={styles.stamp}>
          <Text style={styles.stampText}>CLASSIFIED</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>How to Play</Text>
        <Text style={styles.bodyText}>
          Pick a category, then answer one multiple-choice question at a time. Choose an option and tap
          Submit to lock in your answer, giving you one attempt per question. The Next Question button only
          unlocks once the current question has been graded, so there's no skipping ahead unanswered.
        </Text>

        <Text style={styles.sectionTitle}>Hints</Text>
        <Text style={styles.bodyText}>
          Every question has two progressive clues, from a light nudge to a specific fact. Tap "Need a
          hint?" to reveal one at a time before you answer. Once a question is answered, the button becomes
          "Learn More": you can still read the remaining clues, but they no longer count toward your hints
          total, since the question is already scored.
        </Text>

        <Text style={styles.sectionTitle}>Points</Text>
        <Text style={styles.bodyText}>
          A correct answer earns 100 points with no hints used, 50 points with one hint, or 25 points with
          two hints. A wrong answer always scores 0, regardless of hints used. The results screen shows how
          many points you gave up to hints over the course of the game.
        </Text>

        <Text style={styles.sectionTitle}>Super Secret Spy Mode</Text>
        <Text style={styles.bodyText}>
          Toggle Super Secret Spy on the main menu before picking a category to filter out "obvious"
          questions, ones where the correct answer's text is already given away inside the question itself
          (for example, a theme song that shares its film's title). Every question in this mode requires
          real Bond knowledge.
        </Text>

        <Text style={styles.sectionTitle}>Images &amp; Assets</Text>
        <Text style={styles.bodyText}>
          Bond gun-barrel artwork and the "Fresno" display font are used in this app. Trivia data is served
          via a custom API.
        </Text>
        <Text style={[styles.bodyText, styles.attributionIntro]}>
          The Secret Dossier and Super Secret Spy icons are from The Noun Project (CC BY 3.0):
        </Text>
        <Text style={styles.attributionText}>
          "Files and Folders" by inzacon{'\n'}thenounproject.com/icon/files-and-folders-7127139
        </Text>
        <Text style={styles.attributionText}>
          "Spy" by G-CAT{'\n'}thenounproject.com/icon/spy-6352673
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>◂ BACK</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
  },
  titleBar: {
    backgroundColor: 'black',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 18,
  },
  title: {
    textAlign: 'center',
    fontSize: 34,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Fresno-Regular',
    letterSpacing: 2,
  },
  stamp: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#C20400',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    transform: [{ rotate: '-6deg' }],
  },
  stampText: {
    color: '#C20400',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    color: '#C20400',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 6,
  },
  bodyText: {
    color: '#222',
    fontSize: 14,
    lineHeight: 21,
  },
  attributionIntro: {
    marginTop: 10,
  },
  attributionText: {
    color: '#555',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 28,
    width: '50%',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default CreditsPage;
