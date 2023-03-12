/* eslint-disable react/prop-types */
import React from 'react';
import {
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import {
  Container,
  Button,
  Text,
  TextInput,
  Centered,
} from '../../shared/styledComponents';
import {routes} from '../../shared/routes';
import trans from '../../shared/lang';
import * as firebase from 'firebase';
import 'firebase/auth';

import {connect} from 'react-redux';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';

import firestore from '@react-native-firebase/firestore';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,

      photoURL: 'https://firebasestorage.googleapis.com/v0/b/ta168-8d469.appspot.com/o/userphotos%2Fdefault.jpg?alt=media&token=306bdb23-64a1-449c-a8d2-e198302893a4',
      userProfile: {
        username: '',
        fullname: '',
        email: '',
        phone: '',
        uid: ''
      }
    };
    this.signOut = this.signOut.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.removeItem = this.removeItem.bind(this);

    this.reSelectGoal = this.reSelectGoal.bind(this);
  }

  componentDidMount(){
    this.getUserProfile();
  }

  async getUserProfile() {
    let uuid = null;
    await AsyncStorage.getItem('uid', (err, uid) => {
      if (err != null) {
        // console.log('settings -> uid error: ', err);
      } else {
        uuid = uid;
      }
    });

    if (uuid) {
      firestore()
        .collection('users')
        .doc(uuid)
        .get()
        .then(user => {
          let _user = user.data();
          if( typeof _user.picture == 'string' && _user.picture.length > 0 ){
            this.setState({
              photoURL: _user.picture
            });
          }
          this.setState({userProfile: {
            username: _user.username,
            fullname: _user.fullname,
            phone: _user.phone,
            email: _user.email,
            uid: _user.uid
          } });
        })
        .catch(error => {
          // console.log('firebase user error: ', error);
        });
    }
  }

  async signOut() {
    let uid = null;
    await AsyncStorage.getItem('uid', (err, _uid) => {
      if (err != null) {
        // console.log('settings -> uid error: ', err);
      } else {
        uid = _uid;
      }
    });
    
    this.setState({
      spinner: true,
    });
    let removed = await this.removeItem();
    if (removed) {
      setTimeout(() => {
        this.props.navigation.navigate(routes.selectlang);
      }, 1500);
    }
  }

  async removeItem() {
    try {
      await AsyncStorage.multiRemove(['uid', 'users']);
      console.log( 'removed success');
      return true;
    } catch (error) {
      console.log('error catch :', error);
      return false;
    }
  }

  reSelectGoal(){
    AsyncStorage.setItem('reselectgoal', '1');
    this.setState({spinner: true});
    setTimeout(() => {
      this.props.navigation.navigate(routes.goal);
    },1200);
  }

  render() {

    console.log( this.state.userProfile );
    return (
      <ScrollView
        style={{
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
              source={{uri:this.state.photoURL}}
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
            { this.state.userProfile.fullname }
          </Text>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'normal'}}>
            { this.state.userProfile.email }
          </Text>
        </View>

        <View style={styles.menubox}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate(routes.profile);
            }}>
            <View style={styles.menuName}>
              <View style={styles.profilemenu}>
                <Text>{trans('account_setting', this.props.store.lang)}</Text>
              </View>
              <View style={styles.arrowmenu}>
                <Text style={{color: '#cccccc'}}></Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.menubox}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate(routes.changePassword);
            }}>
            <View style={styles.menuName}>
              <View style={styles.profilemenu}>
                <Text>{trans('change_password', this.props.store.lang)}</Text>
              </View>
              <View style={styles.arrowmenu}>
                <Text style={{color: '#cccccc'}}></Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.menubox}>
          <TouchableOpacity
            onPress={this.reSelectGoal}>
            <View style={styles.menuName}>
              <View style={styles.profilemenu}>
                <Text>{trans('select_goal', this.props.store.lang)}</Text>
              </View>
              <View style={styles.arrowmenu}>
                <Text style={{color: '#cccccc'}}></Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.menubox}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('ChangeLanguage');
            }}>
            <View style={styles.menuName}>
              <View style={styles.profilemenu}>
          <Text>{trans('change_language', this.props.store.lang)}</Text>
              </View>
              <View style={styles.arrowmenu}>
                <Text style={{color: '#cccccc'}}></Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.menubox}>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.menuName}>
              <View style={styles.profilemenu}>
          <Text>{trans('help_center', this.props.store.lang)}</Text>
              </View>
              <View style={styles.arrowmenu}>
                <Text style={{color: '#cccccc'}}>></Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.menubox}>
          <TouchableOpacity onPress={this.signOut}>
            <Text
              style={{
                flex: 1,
                color: '#f15a24',
                textAlign: 'left',
                marginVertical: 25,
              }}>
              {trans('logout', this.props.store.lang)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  spinnerTextStyle: {},
  menubox: {
    flexDirection: 'row',
    flex: 1,
    //justifyContent: "center",
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
    marginHorizontal: 20,
  },
  menuName: {
    flex: 1,
    flexDirection: 'row',
    width: 370,
  },
  profilemenu: {
    flex: 1,
    color: '#4d4d4d',
    textAlign: 'left',
    marginVertical: 25,
    //borderWidth: 1,
  },
  arrowmenu: {
    flex: 1,
    alignItems: 'flex-end',
    color: '#4d4d4d',
    textAlign: 'right',
    marginVertical: 25,
    //borderWidth: 1,
  },
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Settings);
// export default Settings;
