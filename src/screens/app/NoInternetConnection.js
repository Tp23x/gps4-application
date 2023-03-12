import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import NetInfo from '@react-native-community/netinfo';

class NoInternetConnection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
    };
    this.checkConnectivity = this.checkConnectivity.bind(this);
  }

  async checkConnectivity() {
    await NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);

      this.setState({isConnected: state.isConnected});
    });

    if (this.state.isConnected) {
      this.props.navigation.navigate('SelectLang');
      console.log('it will redirect you back to the select lang screen');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>No internet connection!</Text>
        <Text>This app require an internet connection.</Text>
        <Text>Please turn on your mobile data or connect to wifi hotspot.</Text>
        <View style={{marginTop: 50}}>
          <TouchableOpacity
            onPress={this.checkConnectivity}
            style={styles.reloadBtn}>
            <Text>Reload</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  reloadBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 0,
    backgroundColor: '#0083c1',
  },
});

export default NoInternetConnection;
