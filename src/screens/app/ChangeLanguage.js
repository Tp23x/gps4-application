/* eslint-disable react/prop-types */
import React from 'react';
import {AsyncStorage, ScrollView, Image, StyleSheet, View} from 'react-native';

import {Centered, Text, Button, colors} from '../../shared';

import {TextInput} from '../../shared/styledComponents';
import {routes} from '../../shared/routes';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';
import Spinner from 'react-native-loading-spinner-overlay';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Icon from 'react-native-vector-icons/FontAwesome';

class ChangeLanguage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uuid: null,
      passwordCurrent: '',
      password: '',
      passwordConf: '',
      errorMsg: '',

      spinner: false,
    };

    this.getUserProfile = this.getUserProfile.bind(this);
    this.setLang = this.setLang.bind(this);
  }

  componentDidMount() {
    this.getUserProfile();
  }

  async getUserProfile() {
    let uuid = null;
    await AsyncStorage.getItem('uid', (err, uid) => {
      if (err != null) {
        //some error
      } else {
        uuid = uid;
        this.setState({uuid});
      }
    });

    if (uuid) {
      firestore()
        .collection('users')
        .doc(uuid)
        .get()
        .then(user => {
          let _user = user.data();
          if (typeof _user.picture == 'string' && _user.picture.length > 0) {
            this.setState({
              photoURL: _user.picture,
            });
          }
          this.setState({
            username: _user.username,
            fullname: _user.fullname,
            email: _user.email,
            phone: _user.phone,
          });
        })
        .catch(error => {
          // console.log('firebase user error: ', error);
        });
    }
  }

  setLang(lang = 'en') {
    this.props.setLang(lang);
    this.props.navigation.navigate(routes.settings);
  }

  render() {
    return (
      <ScrollView
        Style={{
          flex: 1,
          width: '100%',
        }}>
        <Spinner
          visible={this.state.spinner}
          textContent={trans('loading', this.props.store.lang)}
          textStyle={styles.spinnerTextStyle}
          color="#fff"
          size="large"
        />
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#0083c1',
            height: 400,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <Image
              source={{uri: this.state.photoURL}}
              style={{
                width: 150,
                height: 150,
                borderRadius: 100,
                borderWidth: 5,
                borderColor: 'white',
                marginTop: 30,
              }}
            />
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: 26,
              fontWeight: 'bold',
              marginTop: 20,
            }}>
            {this.state.fullname}
          </Text>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'normal'}}>
            {this.state.email}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <View style={styles.menubox}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginTop: 25,
                textAlign: 'center',
              }}>
              {trans('change_language', this.props.store.lang)}
            </Text>

            <Centered style={{flex: 1, marginTop: 25}}>
              <View style={styles.btnListContainer}>
                <Button
                  onPress={() => this.setLang('en')}
                  style={styles.selectLangBtn}>
                  <Text color={colors.bright}>
                    {trans('langEn', this.props.store.lang)} &nbsp;&nbsp;
                    {
                      ( this.props.store.lang == 'en' )?
                      <Icon name="check" size={17} color="white"/>: null
                    }
                  </Text>
                </Button>
                <Button
                  onPress={() => this.setLang('th')}
                  style={{
                    ...styles.selectLangBtn,
                    backgroundColor: '#ff671d',
                  }}>
                  <Text style={{fontWeight: 'normal'}} color={colors.bright}>
                    {trans('langTh', this.props.store.lang)} &nbsp;&nbsp;
                    {
                      ( this.props.store.lang == 'th' )?
                      <Icon name="check" size={17} color="white" />: null
                    }
                  </Text>
                </Button>
              </View>
            </Centered>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menubox: {
    flex: 1,
    borderBottomColor: '#cccccc',
    // borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
    marginHorizontal: 20,
  },
  profilemenu: {
    flex: 1,
    color: '#4d4d4d',
    textAlign: 'left',
    marginVertical: 25,
    width: 370,
    borderWidth: 0,
  },
  profilemenu_disabled: {
    flex: 1,
    color: '#4d4d4d',
    textAlign: 'left',
    marginVertical: 25,
    width: 370,
    borderWidth: 0,
    backgroundColor: '#eeeeee',
  },
  btnListContainer: {
    flex: 1,
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
  spinnerTextStyle: {},
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(ChangeLanguage);
