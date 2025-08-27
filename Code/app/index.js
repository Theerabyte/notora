import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as Font from 'expo-font';

import ComfortaaBold from '../assets/fonts/Comfortaa-Bold.ttf';

export default function HomeScreen() {

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                Comfortaa: ComfortaaBold
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    return( 
        <Redirect href="/time" />
    )
}