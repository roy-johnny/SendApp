import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Index from './Index';
import Home from './Home';
import Login from './Login';
import Success from './Success';
import Scan from './Scan';
import Signup from './Signup';
import Get from './Get';
import Reset from './Reset';
import Me from './Me';

global.siteKey = 'YOUR_RECAPTCHA_PUBLIC_KEY';
global.baseUrl = 'YOUR_WEBSITE_LINK';
global.token = null;
global.email = null;

const Tab = createBottomTabNavigator();

function Start() {
  return (
    <Tab.Navigator animationEnabled={true}>
      <Tab.Screen
        name="Index"
        component={Index}
        options={{
          tabBarLabel: 'Index',
          tabBarIcon: ({color}) => (
            <Icon name="sync-alt" color={color} size={24} />
          ),
        }}
      />
      <Stack.Screen
        name="Shares"
        component={Home}
        options={{
          tabBarLabel: 'Shares',
          tabBarIcon: ({color}) => (
            <Icon name="cloud" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={Me}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({color}) => (
            <Icon name="person" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Main" component={Start} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="Scan" component={Scan} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Get" component={Get} />
        <Stack.Screen name="Reset" component={Reset} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
