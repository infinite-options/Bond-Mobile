import React, { useState} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
//import * as Font from 'expo-font';
//import * as SplashScreen from 'expo-splash-screen';



const MainSelectionPage = () => {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            navigation.setOptions({ headerShown: false });
        }, [navigation])
    );
/*
    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    'Fresno-Regular': require('./assets/fonts/fresno.ttf'),
                });
            } catch (e) {
                console.warn(e);
            } finally {
                setFontsLoaded(true);
            }
        }

        loadFonts();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null; 
    }
*/

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>WELCOME MR.BOND</Text>
            <Text style={styles.accessText}>You have Full Access</Text>

        </View>
    );
};

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
       // fontFamily: 'Fresno-Regular',
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
});

export default MainSelectionPage;
