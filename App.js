import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {createAppContainer} from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

import {RootStack as RootNav} from './src/navigations/stack';

import {Provider} from 'react-redux';
import taStore from './src/store/store';

const store = taStore();

if (!__DEV__) {
  console.log = () => {};
}

class taRoot extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

const AppContainer = createAppContainer(RootNav);
export default taRoot;
