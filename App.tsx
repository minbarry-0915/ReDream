import React from "react";
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import {store} from "./frontend/redux/store.ts";

import LoginScreen from "./frontend/screens/loginScreen";

import { SignUpProvider } from "./frontend/contexts/signUpContext";
import SignUpScreen1 from "./frontend/screens/signUpScreen1";
import SignUpScreen2 from "./frontend/screens/signUpScreen2";
import SignUpScreen3 from "./frontend/screens/signUpScreen3";
import SignUpScreen4 from "./frontend/screens/signUpScreen4";
import SignUpScreen5 from "./frontend/screens/signUpScreen5";
import BottomTabNavigator from "./frontend/components/bottomTabNavigator.tsx";
import { CreateBookProvider } from "./frontend/contexts/createBookContext.tsx";
import CreateBookScreen1 from "./frontend/screens/createBookScreen1.tsx";
import CreateBookScreen2 from "./frontend/screens/createBookScreen2.tsx";
import CreateBookScreen3 from "./frontend/screens/createBookScreen3.tsx";
import CreateBookScreen4 from "./frontend/screens/createBookScreen4.tsx";
import CreateSuccessScreen from "./frontend/screens/createSuccessScreen.tsx";
import CreateFailScreen from "./frontend/screens/createFailScreen.tsx";



const RootStack = createNativeStackNavigator();
const SignUpStack = createNativeStackNavigator();
const CreateBookStack = createNativeStackNavigator();

function SignUpStackScreen(){
  return (
    <SignUpProvider>
      <SignUpStack.Navigator>
        <SignUpStack.Screen name="SignUp1" component={SignUpScreen1} options={{headerShown: false}} />
        <SignUpStack.Screen name="SignUp2" component={SignUpScreen2} options={{headerShown: false}} />
        <SignUpStack.Screen name="SignUp3" component={SignUpScreen3} options={{headerShown: false}} />
        <SignUpStack.Screen name="SignUp4" component={SignUpScreen4} options={{headerShown: false}} />
        <SignUpStack.Screen name="SignUp5" component={SignUpScreen5} options={{headerShown: false}} />
      </SignUpStack.Navigator>
    </SignUpProvider>
  )
}

function CreateBookStackScreen(){
  return (
    <CreateBookProvider>
      <CreateBookStack.Navigator>
        <CreateBookStack.Screen name="CreateBook1" component={CreateBookScreen1} options={{headerShown: false}}/>
        <CreateBookStack.Screen name="CreateBook2" component={CreateBookScreen2} options={{headerShown: false}}/>
        <CreateBookStack.Screen name="CreateBook3" component={CreateBookScreen3} options={{headerShown: false}}/>
        <CreateBookStack.Screen name="CreateBook4" component={CreateBookScreen4} options={{headerShown: false}}/>
        <CreateBookStack.Screen name="CreateSuccess" component={CreateSuccessScreen} options={{headerShown: false}}/>
        <CreateBookStack.Screen name="CreateFail" component={CreateFailScreen} options={{headerShown: false}}/>
      </CreateBookStack.Navigator>
    </CreateBookProvider>
  )
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <RootStack.Screen name="SignUp" component={SignUpStackScreen} options={{ headerShown: false }} />
          <RootStack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false , animation: 'fade'}} />
          <RootStack.Screen name="CreateBook" component={CreateBookStackScreen} options={{headerShown: false}}/>
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;