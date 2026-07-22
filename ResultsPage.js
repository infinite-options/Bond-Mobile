import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Animated, Easing, useWindowDimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const CONFETTI_COLORS = ['#C20400', '#FFD700', '#FFFFFF', '#681110', '#EEEEEE'];
const CONFETTI_COUNT = 40;

// Seconds -> "M:SS", e.g. 84 -> "1:24".
const formatTime = (totalSeconds) => `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;

// A single falling, spinning, fading confetti rectangle. Pure Animated API —
// no extra dependency — driven entirely on the native/composited thread.
const ConfettiPiece = ({ seed, width, height }) => {
  const translateY = useRef(new Animated.Value(-40)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const piece = useMemo(() => {
    const rand = mulberry32(seed);
    return {
      left: rand() * width,
      size: 6 + rand() * 6,
      color: CONFETTI_COLORS[Math.floor(rand() * CONFETTI_COLORS.length)],
      duration: 2200 + rand() * 1600,
      delay: rand() * 500,
      drift: (rand() - 0.5) * 100,
      spins: 2 + rand() * 3,
    };
  }, [seed, width]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height + 40,
        duration: piece.duration,
        delay: piece.delay,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: piece.drift,
        duration: piece.duration,
        delay: piece.delay,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: piece.spins,
        duration: piece.duration,
        delay: piece.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        delay: piece.delay + piece.duration - 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotateInterpolated = rotate.interpolate({
    inputRange: [0, piece.spins],
    outputRange: ['0deg', `${piece.spins * 360}deg`],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: piece.left,
        width: piece.size,
        height: piece.size * 0.4,
        backgroundColor: piece.color,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate: rotateInterpolated }],
      }}
    />
  );
};

// Small deterministic PRNG so each piece's randomness is stable across re-renders.
const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const Confetti = ({ count = CONFETTI_COUNT }) => {
  const { width, height } = useWindowDimensions();
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {pieces.map((seed) => (
        <ConfettiPiece key={seed} seed={seed} width={width} height={height} />
      ))}
    </View>
  );
};

const ResultsPage = ({ route }) => {
  const navigation = useNavigation();
  const { ansCorrect = 0, ansWrong = 0, questions = 0, totalScore = 0, elapsedSeconds = 0 } = route.params || {};
  const maxScore = questions * 100;
  const accuracy = questions > 0 ? Math.round((ansCorrect / questions) * 100) : 0;

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.85)).current;

  const handleRestart = () => {
    navigation.navigate('MainSelectionPage');
  };

  useEffect(() => {
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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Confetti />
      <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.missionTitle}>MISSION COMPLETE</Text>

        <Text style={styles.scoreValue}>{totalScore}</Text>
        <Text style={styles.scoreLabel}>points · {maxScore} possible</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{ansCorrect}</Text>
            <Text style={styles.statLabel}>CORRECT</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{ansWrong}</Text>
            <Text style={styles.statLabel}>WRONG</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>ACCURACY</Text>
          </View>
        </View>

        <Text style={styles.timeText}>⏱ Completed in {formatTime(elapsedSeconds)}</Text>

        <TouchableOpacity style={styles.button} onPress={handleRestart}>
          <Text style={styles.buttonText}>▸ PLAY AGAIN ◂</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#161616',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  trophy: {
    fontSize: 48,
    marginBottom: 8,
  },
  missionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'Fresno-Regular',
    marginBottom: 20,
  },
  scoreValue: {
    color: '#FFD700',
    fontSize: 56,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: '#AAAAAA',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  timeText: {
    color: '#AAAAAA',
    fontSize: 13,
    marginBottom: 20,
  },
  statBlock: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888888',
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#333333',
  },
  button: {
    backgroundColor: '#C20400',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default ResultsPage;
