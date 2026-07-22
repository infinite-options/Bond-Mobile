import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Font from 'expo-font';

const MainSelectionPage = () => {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    // Bounding the screen to the window height (NOT flex:1 — RN-web's app root
    // only sets min-height, so flex:1 here would grow to content instead of
    // being bounded) lets the ScrollView below scroll internally on web.
    const { height: windowHeight } = useWindowDimensions();
    useFocusEffect(
        React.useCallback(() => {
            navigation.setOptions({ headerShown: false });
        }, [navigation])
    );

    useEffect(() => {
        async function loadFonts() {
          await Font.loadAsync({
            'Fresno-Regular': require('./assets/fonts/fresno.ttf'),
          });
          setFontsLoaded(true);
        }
        loadFonts();
      }, []);
  
     
    if (!fontsLoaded) {
    return null;
    }

    const handleMovieQuestions = () => {
       // console.log("Movie Button Pressed");
        navigation.navigate('MovieQuestionPage', { qtype: 'movie' });
    };

    const handleBondGirlQuestions = () => {
        //console.log("Bond Girl Button Pressed");
        navigation.navigate('MovieQuestionPage', { qtype: 'bond_girl' });
    };

    const handleVillainQuestions = () => {
       // console.log("Villain Button Pressed");
        navigation.navigate('MovieQuestionPage', { qtype: 'villains' });
    };

    const handlePlotQuestions = () => {
       // console.log("Plot Button Pressed");
        navigation.navigate('MovieQuestionPage', { qtype: 'plots' });
    };

    return (
        <View style={[styles.container, { height: windowHeight }]}>
            <Text style={styles.welcomeText}>WELCOME MR.BOND</Text>
            <Text style={styles.accessText}>You have Full Access</Text>
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
                <View style={styles.optionContainer}>
                    <TouchableOpacity onPress={handleMovieQuestions}>
                        <ImageBackground source={require('./assets/bond_image.jpeg')} style={styles.imageButton}>
                            <Text style={styles.labelText}>Movies</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <View style={styles.optionContainer}>
                    <TouchableOpacity onPress={handleBondGirlQuestions}>
                        <ImageBackground source={require('./assets/bond_image.jpeg')} style={styles.imageButton}>
                            <Text style={styles.labelText}>Bond Girls</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <View style={styles.optionContainer}>
                    <TouchableOpacity onPress={handleVillainQuestions}>
                        <ImageBackground source={require('./assets/bond_image.jpeg')} style={styles.imageButton}>
                            <Text style={styles.labelText}>Villains</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <View style={styles.optionContainer}>
                    <TouchableOpacity onPress={handlePlotQuestions}>
                        <ImageBackground source={require('./assets/bond_image.jpeg')} style={styles.imageButton}>
                            <Text style={styles.labelText}>Plots</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <Text style={styles.accessText}>Credits</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderWidth: 2,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    welcomeText: {
        textAlign: 'center',
        fontSize: 40,
        paddingTop: 50,
        backgroundColor: 'black',
        fontFamily: 'Fresno-Regular',
        fontWeight: 'bold',
        color: 'white',
    },
    accessText: {
        textAlign: 'center',
        fontSize: 20,
        padding: 10,
        backgroundColor: 'black',
        color: 'white',
    },
    optionContainer: {
        marginLeft: 25,
        marginRight: 25,
        marginTop: 25,
       
    },
    optionContainermovie: {
        marginVertical: 10,
        marginHorizontal: 20,
        marginTop: 30,
        aspectRatio: 16 / 9,
    },
    imageButton: {
        width: '100%',
        aspectRatio: 16 / 9, 
    },
    labelText: {
        color: '#C20400',
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'left',
        position: 'absolute',
        bottom: 50,
        left: 10,
        fontFamily: 'Fresno-Regular',
    },
});

export default MainSelectionPage;
