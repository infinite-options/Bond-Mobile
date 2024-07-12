import React from 'react';
import { ImageBackground, StyleSheet, View, Image, Text } from 'react-native';

function MovieQuestionPage(props) {
    return (
        <ImageBackground 
        style={styles.background}
        >
            <View style={styles.logoContainer}>
                <Text>QuestionPage!</Text>
            </View>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"

    },

    logo: {
        width: 100,
        height: 100,
        position: 'absolute',
        top: 50
    },
    logoContainer: {
        position: "absolute",
        top: 70,
        alignItems: "center",
    },
    
})
export default MovieQuestionPage;