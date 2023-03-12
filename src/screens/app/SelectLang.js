/* eslint-disable react/prop-types */
import React from 'react';
import {AsyncStorage, View, Image, StyleSheet, Dimensions} from 'react-native';

import {Container, Centered, Text, Button, colors, routes} from '../../shared';

import * as firebase from 'firebase';
import 'firebase/auth';
import {NavigationEvents, NavigationActions} from 'react-navigation';
import {Spacer} from '../../shared/styledComponents';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';

import Spinner from 'react-native-loading-spinner-overlay';

import NetInfo from '@react-native-community/netinfo';

class SelectLang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      foundUserLang: false,
      userLang: null,

      isConnected: false,
    };

    this.checkLanguage = this.checkLanguage.bind(this);
    this.getLanguage = this.getLanguage.bind(this);
    this.checkConnectivity = this.checkConnectivity.bind(this);

    this.checkConnectivity();
  }

  async componentDidMount() {
    let _selectedLang = null;
    await AsyncStorage.getItem('lang', (err, _lang) => {
      // this.props.setLang(_lang);
      if (err == null && _lang != null) {
        // handler
        this.props.setLang(_lang);
        _selectedLang = _lang;
      }
    });
    let _loggedInUid = null;
    await AsyncStorage.getItem('uid', (err, uid) => {
      // handler
      if (err != null) {
        // console.log('select lang -> uid error: ', err);
      } else {
        _loggedInUid = uid;
      }
    });

    let usergoals = null;
    await AsyncStorage.getItem('usergoals', (err, ugoals) => {
      // handler
      if (err != null) {
        // console.log('select lang -> ugoals error: ', err);
      } else {
        usergoals = ugoals;
      }
    });

    if (_selectedLang && _loggedInUid && usergoals) {
      this.setState({isLoading: false});
      this.props.navigation.navigate(routes.home);
    } else if (_selectedLang && _loggedInUid) {
      this.setState({isLoading: false});
      this.props.navigation.navigate(routes.goal);
    } else if (_selectedLang) {
      this.setState({isLoading: false});
      this.props.navigation.navigate(routes.intro2);
    } else {
      this.setState({isLoading: false});
    }
  }

  async checkConnectivity() {
    await NetInfo.fetch().then(state => {
      this.setState({isConnected: state.isConnected});
    });

    if (!this.state.isConnected) {
      this.props.navigation.navigate('NoInternetConnection');
    }
  }

  setLang(lang = 'en') {
    this.props.setLang(lang);
    this.props.navigation.navigate(routes.intro2);
  }

  getLanguage() {
    AsyncStorage.getItem('lang', (err, lang) => {
      if (!err) {
        // this.setState({userLang: lang});
        return lang;
      } else {
        // console.log('get lang not okay: ', err);
        return false;
      }
    });
  }

  async checkLanguage() {
    let userlang = await this.getLanguage();
    // let userlang = this.state.userLang;
    if (userlang) {
      if (userlang != null && userlang != false && userlang != undefined) {
        this.setState({foundUserLang: true});
      } else {
        // console.log('not found user lang : ', userlang);
      }
      return userlang;
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View>
          <Spinner
            visible={this.state.isLoading}
            textContent={trans('loading', this.props.store.lang)}
            textStyle={styles.spinnerTextStyle}
            color="#fff"
            size="large"
          />
        </View>
      );
    } else {
      return (
        <Container style={{padding: 0, backgroundColor: 'white'}}>
          <Centered
            style={{
              flex: 1,
              pading: 0,
              backgroundColor: 'white',
              marginBottom: 60,
            }}>
            <Image
              source={require('../../../assets/images/bg-selectLang.jpg')}
              style={{
                resizeMode: 'cover',
                minWidth: 420,
                maxWidth: '100%',
                maxHeight: Dimensions.get('window').height - 180,
                borderColor: 'red',
                borderWidth: 1,
              }}
            />
          </Centered>

          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              textAlign: 'left',
              paddingHorizontal: 0,
              paddingVertical: 30,
              paddingLeft: '10%',
            }}>
            <View style={{}}>
              <Text style={styles.selectLangHeader}>
                {trans('languageseletion', 'en')}
              </Text>
              <Text style={styles.selectLangHeaderTh}>
                {trans('languageseletion', 'th')}
              </Text>
            </View>
          </View>
          <Centered style={{backgroundColor: 'white'}}>
            <View style={styles.btnListContainer}>
              <Button
                onPress={() => this.setLang('en')}
                style={styles.selectLangBtn}>
                <Text color={colors.bright}>
                  {trans('langEn', this.props.store.lang)}
                </Text>
              </Button>
              <Button
                onPress={() => this.setLang('th')}
                style={{
                  ...styles.selectLangBtn,
                  backgroundColor: '#ff671d',
                }}>
                <Text style={{fontWeight: 'normal'}} color={colors.bright}>
                  {trans('langTh', this.props.store.lang)}
                </Text>
              </Button>
            </View>
          </Centered>

          <Spacer />
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  btnListContainer: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  selectLangBtn: {
    width: '50%',
    flexDirection: 'row',
    padding: 5,
    borderRadius: 0,
    backgroundColor: '#0083c1',
  },
  selectLangHeader: {
    justifyContent: 'center',
    fontSize: 30,
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#0083c1',
  },
  selectLangHeaderTh: {
    justifyContent: 'center',
    fontSize: 25,
    textAlign: 'left',
    fontWeight: 'normal',
    color: '#999999',
  },
  spinnerTextStyle: {},
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(SelectLang);
