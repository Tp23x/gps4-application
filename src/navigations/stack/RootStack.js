import React from 'react';

import {createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {
  createMaterialTopTabNavigator,
  createBottomTabNavigator,
} from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/FontAwesome';
//import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
Icon.loadFont();

import {
  // Loading,
  SelectLang,
  Intro2,
  Settings,
  Goal,
  Home,
  SignIn,
  SignUp,
  Vdos,
  ForgetPassword,
  ConfirmPassword,
  ConfirmSignUp,
  Profile,
  ChangePassword,
} from '../../screens';
import Tests from '../../screens/app/Tests';
import VdosList from '../../screens/app/VdosList';
import VdoGroup from '../../screens/app/VdoGroup';
import NoInternetConnection from '../../screens/app/NoInternetConnection';
import ChangeLanguage from '../../screens/app/ChangeLanguage';

import Result from '../../screens/app/Result';

import {colors} from '../../shared';

import {stackOptions, tabOptions} from '../../utils';
import {titles} from '../../shared';

const IntroStack = createStackNavigator({
  SelectLang: {
    screen: SelectLang,
    navigationOptions: stackOptions('', false),
  },
  Intro2: {
    screen: Intro2,
    navigationOptions: stackOptions('', true),
  },
  SignIn: {
    screen: SignIn,
    navigationOptions: stackOptions(''),
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: stackOptions(''),
  },
  ConfirmSignUp: {
    screen: ConfirmSignUp,
    navigationOptions: stackOptions(''),
  },
  ForgetPassword: {
    screen: ForgetPassword,
    navigationOptions: stackOptions(''),
  },
});

const AppStack = createMaterialTopTabNavigator(
  {Home, Settings, Vdos},
  tabOptions,
);

const TestStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: stackOptions('', false),
    },
    Home2: {
      screen: Home,
      navigationOptions: stackOptions('', false),
    },
    Tests: {
      screen: Tests,
      navigationOptions: {
        title: 'ทำแบบทดสอบ',
        headerTintColor: 'white',
        headerBackTitle: 'Back',
        headerStyle: {
          backgroundColor: '#f15a24',
          borderBottomWidth: 0,
          //alignContent: 'center'
        },
        headerShown: !true,
      },
    },
  },
  {
    initialRouteName: 'Tests',
  },
);

const tabNav = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => <Icon name="home" size={22} color={tintColor} />,
      },
    },
    //History,
    Courses: {
      screen: VdosList,
      navigationOptions: {
        tabBarLabel: 'Courses',
        tabBarIcon: ({tintColor}) => <Icon name="play" size={17} color={tintColor} />,
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => <Icon name="user" size={20} color={tintColor} />,
      },
    },
  },
  {
    initialRouteName: 'Home',
  },
);


const RootStack = createSwitchNavigator(
  {
    // Loading,
    IntroStack: IntroStack,
    SignIn,
    ForgetPassword,
    Goal,
    tabNav,
    Vdos,
    Profile,
    ChangePassword,
    TestStack: TestStack,
    Result,
    SelectLang,
    NoInternetConnection,
    ChangeLanguage,
    VdoGroup,
    VdosList
  },
  {
    // initialRouteName: 'SelectLang',
    initialRouteName: 'SelectLang',
  },
);

export default RootStack;
