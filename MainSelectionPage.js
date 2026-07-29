import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Font from 'expo-font';

const MainSelectionPage = () => {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [hardMode, setHardMode] = useState(false);
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
        navigation.navigate('MovieQuestionPage', { qtype: 'movie', hardMode });
    };

    const handleBondGirlQuestions = () => {
        navigation.navigate('MovieQuestionPage', { qtype: 'bond_girl', hardMode });
    };

    const handleVillainQuestions = () => {
        navigation.navigate('MovieQuestionPage', { qtype: 'villains', hardMode });
    };

    const handlePlotQuestions = () => {
        navigation.navigate('MovieQuestionPage', { qtype: 'plots', hardMode });
    };

    const handleCredits = () => {
        navigation.navigate('CreditsPage');
    };

    return (
        <View style={[styles.container, { height: windowHeight }]}>
            <Text style={styles.welcomeText}>WELCOME MR.BOND</Text>
            <Text style={styles.accessText}>You have Full Access</Text>
            <View style={styles.spyToggleWrap}>
                <TouchableOpacity
                    style={[styles.spyToggle, hardMode && styles.spyToggleActive]}
                    onPress={() => setHardMode((v) => !v)}
                >
                    <View style={styles.spyToggleContent}>
                        <Image
                            source={require('./assets/icon-spy.png')}
                            style={[styles.spyToggleIcon, { tintColor: hardMode ? '#FFD700' : '#999' }]}
                        />
                        <Text style={[styles.spyToggleText, hardMode && styles.spyToggleTextActive]}>
                            {hardMode ? '✓ ' : ''}SUPER SECRET SPY
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
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
                <TouchableOpacity onPress={handleCredits} style={styles.dossierButton}>
                    <Image source={require('./assets/icon-dossier.png')} style={[styles.dossierIcon, { tintColor: 'white' }]} />
                    <Text style={styles.dossierButtonText}>Secret Dossier</Text>
                </TouchableOpacity>
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
    dossierButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'black',
    },
    dossierIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    dossierButtonText: {
        fontSize: 20,
        color: 'white',
    },
    spyToggleWrap: {
        backgroundColor: 'black',
        paddingHorizontal: 25,
        paddingBottom: 16,
        alignItems: 'center',
    },
    spyToggle: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 26,
        alignItems: 'center',
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#444',
    },
    spyToggleActive: {
        backgroundColor: '#7A0300',
        borderWidth: 1.5,
        borderColor: '#FFD700',
    },
    spyToggleContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spyToggleIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
    },
    spyToggleText: {
        color: '#999',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    spyToggleTextActive: {
        color: '#FFD700',
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
