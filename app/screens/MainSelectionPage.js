import React from 'react';
import { ImageBackground, StyleSheet, View, Image, Text,ScrollView } from 'react-native';

function MainSelectionPage(props) {
    return (
    
        <View style={styles.container}>

            <Text style={styles.welcomeText}>WELCOME MR.BOND</Text>
            <Text style={styles.accessText}>You have Full Access</Text>

            <ScrollView>
                    <View style={styles.optionContainer}>
                        
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Movies</Text>
                            </ImageBackground>
                        
                    </View>
                    <View style={styles.optionContainer}>
                        
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Bond Girls</Text>
                            </ImageBackground>
                        
                    </View>
                    <View style={styles.optionContainer}>
                        
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Villains</Text>
                            </ImageBackground>
                        
                    </View>
                    <View style={styles.optionContainer}>
                        
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Plots</Text>
                            </ImageBackground>
                        
                    </View>
                    
               
                    <View style={styles.optionContainer}>
                        
                            <ImageBackground source={require('../assets/bond_image.jpeg')} style={styles.imageButton}>
                                <Text style={styles.labelText}>Credits</Text>
                            </ImageBackground>
                        
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