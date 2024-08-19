import React from "react";
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import LoginScreen from "./frontend/screens/loginScreen";

import HomeScreen1 from "./frontend/screens/homeScreen1";

import { SignUpProvider } from "./frontend/contexts/signUpContext";
import SignUpScreen1 from "./frontend/screens/signUpScreen1";
import SignUpScreen2 from "./frontend/screens/signUpScreen2";
import SignUpScreen3 from "./frontend/screens/signUpScreen3";
import SignUpScreen4 from "./frontend/screens/signUpScreen4";

const RootStack = createNativeStackNavigator();
const SignUpStack = createNativeStackNavigator();

function SignUpStackScreen(){
  return (
    <SignUpProvider>
      <SignUpStack.Navigator>
        <SignUpStack.Screen name="SignUp1" component={SignUpScreen1} options={{headerShown: false}} />
        <SignUpStack.Screen name="SignUp2" component={SignUpScreen2} options={{headerShown: false}} />
        <SignUpStack.Screen name="SignUp3" component={SignUpScreen3} options={{headerShown: false}} />
        <SignUpStack.Screen name="SignUp4" component={SignUpScreen4} options={{headerShown: false}} />
      </SignUpStack.Navigator>
    </SignUpProvider>
    
  )
}

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <RootStack.Screen name="SignUp" component={SignUpStackScreen} options={{headerShown: false}}/>
        <RootStack.Screen name="Home" component={HomeScreen1}/>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;