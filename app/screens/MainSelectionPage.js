import React from 'react';
import { ImageBackground, StyleSheet, View, Image, Text,ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect, useState } from '@react-navigation/native';


function MainSelectionPage(props) {

    const navigation = useNavigation();
 
    
    useFocusEffect(
        React.useCallback(() => {
            navigation.setOptions({ headerShown: false });
        }, [navigation])
    );
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

     const handleCredits = () => {
        // console.log("Credit Button Pressed");
         navigation.navigate('CreditsPage', { qtype: 'credits' });
     };
 
    return (
    
        <View style={styles.container}>

            <Text style={styles.welcomeText}>WELCOME MR.BOND</Text>
            <Text style={styles.accessText}>You have Full Access</Text>

            <ScrollView>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity onPress={handleMovieQuestions}>
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Movies</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity onPress={handleBondGirlQuestions}>
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Bond Girls</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity onPress={handleVillainQuestions}>
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Villains</Text>
                            </ImageBackground>
                            </TouchableOpacity>
                    </View>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity onPress={handlePlotQuestions}>    
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Plots</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    
               
                    <View style={styles.optionContainer}>
                        <TouchableOpacity onPress={handleCredits}>
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Credits</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
            
        </View>
    
    );
}


const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 2,
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
    },
})
export default MainSelectionPage;