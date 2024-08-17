import React from "react";
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import LoginScreen from "./frontend/screens/loginScreen";
import SignUpScreen1 from "./frontend/screens/signUpScreen1";
import HomeScreen1 from "./frontend/screens/homeScreen1";

const RootStack = createNativeStackNavigator();
const SignUpStack = createNativeStackNavigator();

function SignUpStackScreen(){
  return (
    <SignUpStack.Navigator>
      <SignUpStack.Screen name="SignUp1" component={SignUpScreen1} options={{headerShown: true}} />
    </SignUpStack.Navigator>
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