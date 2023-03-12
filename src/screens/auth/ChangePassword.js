/* eslint-disable react/prop-types */
import React from 'react';
import {
  AsyncStorage,
  ScrollView,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import {Centered, Text, Button, colors} from '../../shared';

import {TextInput} from '../../shared/styledComponents';
import {routes} from '../../shared/routes';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';
import Spinner from 'react-native-loading-spinner-overlay';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class ChangePassword extends React.Component {
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
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.resetPasswordState = this.resetPasswordState.bind(this);
  }

  componentDidMount() {
    this.getUserProfile();
  }

  async getUserProfile() {
    let uuid = null;
    await AsyncStorage.getItem('uid', (err, uid) => {
      if (err != null) {
        // console.log('changepassword -> uid error: ', err);
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

  async handleChangePassword() {
    this.setState({
      spinner: true,
    });

    if(
      this.state.passwordCurrent == ''
    ){
      this.setState({
        errorMsg: trans('password_no_input', this.props.store.lang),
        spinner: false
      });
      return false;
    }

    if(this.state.password.length < 6
    ){
      this.setState({
        errorMsg: trans('password_min_6', this.props.store.lang),
        spinner: false
      });
      return false;
    }

    let uuid = this.state.uuid;
    let checkCurrentPassword = null;
    let currentUser = null;
    await auth()
      .signInWithEmailAndPassword(this.state.email, this.state.passwordCurrent)
      .then(u => {
        checkCurrentPassword = true;
        currentUser = u;
      })
      .catch(error => {
        this.setState({
          errorMsg: trans('password_current_wrong', this.props.store.lang)
        });
        this.resetPasswordState();
      });
    
      if( checkCurrentPassword ){
        let _password = this.state.password;
          _password.trim();
        let _passwordConf = this.state.passwordConf;
          _passwordConf.trim();
        if( _password.length < 6  ){
          this.setState({
            errorMsg: trans('password_min_6', this.props.store.lang)
          });
          this.resetPasswordState();
        }else if( _password != _passwordConf ){
          this.setState({
            errorMsg: trans('password_mismatch', this.props.store.lang)
          });
          this.resetPasswordState();
        }else {
          auth().currentUser.updatePassword(_password)
            .then(() => {
              this.setState({
                errorMsg: '',
              });
              this.resetPasswordState();
              this.props.navigation.navigate(routes.settings);
            })
            .catch(error => {
              this.setState({
                errorMsg: trans('cannot_change_password', this.props.store.lang)
              });
              this.resetPasswordState();
            });
        }
      }
  }

  resetPasswordState(){
    this.setState({
      password: '',
      passwordConf: '',
      passwordCurrent: '',

      spinner: false
    });
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
              {trans('change_password', this.props.store.lang)}
            </Text>

            <TextInput
              style={styles.profilemenu}
              placeholder={trans('current_password', this.props.store.lang)}
              value={this.state.passwordCurrent}
              onChangeText={passwordCurrent => this.setState({passwordCurrent})}
              password
            />
          </View>
          <View style={styles.menubox}>
            <TextInput
              style={styles.profilemenu}
              placeholder={trans('newPassword', this.props.store.lang)}
              value={this.state.password}
              onChangeText={password => this.setState({password})}
              password
            />
          </View>
          <View style={styles.menubox}>
            <TextInput
              style={styles.profilemenu}
              placeholder={trans('confirm_new_password', this.props.store.lang)}
              value={this.state.passwordConf}
              onChangeText={passwordConf => this.setState({passwordConf})}
              password
            />
          </View>
          {this.state.errorMsg != ''  && (
            <View style={{
              flex: 1, justifyContent: 'center', alignItems: 'center'
            }}>
              <Text style={{color:'red'}}>{this.state.errorMsg}</Text>
            </View>
          )}

          <Centered style={{flex: 1, marginTop: 25}}>
            <View style={styles.btnListContainer}>
              <Button
                onPress={() => {
                  this.props.navigation.navigate(routes.settings);
                }}
                style={styles.selectLangBtn}>
                <Text style={{color: 'white', fontWeight: 'normal'}}>{trans('back', this.props.store.lang)}</Text>
              </Button>
              <Button
                onPress={this.handleChangePassword}
                style={{
                  ...styles.selectLangBtn,
                  backgroundColor: '#ff671d',
                }}>
                <Text style={{color: 'white'}}>{trans('submit', this.props.store.lang)}</Text>
              </Button>
            </View>
          </Centered>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menubox: {
    flex: 1,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
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
)(ChangePassword);
