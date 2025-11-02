import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from '../../screens/WelcomeScreen/WelcomeScreen';
import PermissionsScreen from '../../screens/PermissionsScreen/PermissionsScreen';
import DashboardScreen from '../../screens/DashboardScreen/DashboardScreen';
import {Storage} from '../../utils/storage';
import LoadingScreen from '../../screens/LoadingScreen/LoadingScreen';

const Stack = createNativeStackNavigator();

const OnBoardingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={'WELCOME_SCREEN'}
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'PERMISSIONS_SCREEN'}
        component={PermissionsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={'LOADING_SCREEN'}
        component={LoadingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'DASHBOARD_SCREEN'}
        component={DashboardScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const PublicRoutes = () => {
  const onboarded = Storage.isOnboardingCompleted();
  return onboarded ? <MainStack /> : <OnBoardingStack />;
};

export default PublicRoutes;

const styles = StyleSheet.create({});
