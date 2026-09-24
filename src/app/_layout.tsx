import {Stack} from 'expo-router';

export default function RootLayout(){

    return( <Stack screenOptions={{headerStyle: {backgroundColor: '#000000',
    },
    headerTintColor: '#ffd700', headerTitleStyle: { fontWeight:'bold'}, headerTitleAlign: 'center',}}>

<Stack.Screen name="index" options={{title: "Dj-Floorball"}}></Stack.Screen>
<Stack.Screen name="soundboard" options={{title: "Soundboard"}}/>

    </Stack>);
    
}