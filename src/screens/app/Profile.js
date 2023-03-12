/* eslint-disable react/prop-types */
import React from 'react';
import {
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  View,
} from 'react-native';

import {Container, Centered, Text, Button, colors} from '../../shared';

import {FlexCentered, TextInput} from '../../shared/styledComponents';
import {routes} from '../../shared/routes';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';
import Spinner from 'react-native-loading-spinner-overlay';

import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uuid: null,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/ta168-8d469.appspot.com/o/userphotos%2Fdefault.jpg?alt=media&token=306bdb23-64a1-449c-a8d2-e198302893a4',
      username: '',
      fullname: '',
      email: '',
      phone: '',
      errorMsg: '',

      spinner: false,
    };

    this.getUserProfile = this.getUserProfile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateProfileImage = this.updateProfileImage.bind(this);
    this.uploadToStorage = this.uploadToStorage.bind(this);
  }

  componentDidMount() {
    this.getUserProfile();
  }

  async getUserProfile() {
    let uuid = null;
    await AsyncStorage.getItem('uid', (err, uid) => {
      if (err != null) {
        // console.log('profile -> uid error: ', err);
      } else {
        uuid = uid;
        this.setState({uuid});
      }
    });

    if (uuid) {
      // this.getPhoto();
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

  getPhoto(){
    let currentUser = auth().currentUser;
    this.setState({
      photoURL: currentUser.photoURL,
    });
  }

  setPhotoUrl(photoUrl) {
    this.setState({
      photoURL: photoUrl,
    });
    let _data = {
      picture: photoUrl
    };
    firestore()
        .collection('users')
        .doc(this.state.uuid)
        .update(_data)
        .then(user => {
          this.setState({
            spinner: false,
          });
        })
        .catch(error => {
          this.setState({
            spinner: false,
          });
          // console.log('firebase user save error: ', error);
        });
  }

  async uploadToStorage(imageUrl) {
    const reference = storage().ref(
      'userphotos/'.concat(this.state.uuid, '.jpg'),
    );
    await reference
      .putFile(imageUrl)
      .then(f => {
        reference
          .getDownloadURL()
          .then(ref => {
            this.setPhotoUrl(ref);
          })
          .catch(error => {
            // console.log('the ref error: ', error);
          });
      })
      .catch(e => {
        // console.log('upload error:  ', e);
      });
  }

  async updateProfileImage() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      this.uploadToStorage(image.path);
    });
  }

  async handleSubmit() {
    //save to firebase
    this.setState({
      spinner: true,
    });
    let uuid = null;
    await AsyncStorage.getItem('uid', (err, uid) => {
      if (err != null) {
        // console.log('profile -> uid error: ', err);
      } else {
        uuid = uid;
      }
    });

    let _data = {
      fullname: this.state.fullname,
      phone: this.state.phone,
      email: this.state.email,
      username: this.state.username,
      uuid: uuid,
    };
    if (uuid) {
      firestore()
        .collection('users')
        .doc(uuid)
        .update(_data)
        .then(user => {
          this.setState({
            spinner: false,
          });
          this.props.navigation.navigate(routes.settings);
        })
        .catch(error => {
          this.setState({
            spinner: false,
          });
        });
    }
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
            <View
              style={{
                backgroundColor: '#f15a24',
                width: 40,
                height: 40,
                borderRadius: 20,
                marginTop: 30,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
              }}>
              <TouchableOpacity onPress={this.updateProfileImage}>
                <Image
                  source={require('../../../assets/images/pencil.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
            </View>
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
              {trans('account_setting', this.props.store.lang)}
            </Text>

            <TextInput
              style={styles.profilemenu_disabled}
              placeholder="Username"
              value={this.state.username}
              editable={false}
            />
          </View>
          <View style={styles.menubox}>
            <TextInput
              style={styles.profilemenu}
              placeholder="Fullname"
              value={this.state.fullname}
              onChangeText={fullname => this.setState({fullname})}
            />
          </View>
          <View style={styles.menubox}>
            <TextInput
              style={styles.profilemenu_disabled}
              placeholder="Email"
              value={this.state.email}
              editable={false}
            />
          </View>
          <View style={styles.menubox}>
            <TextInput
              style={styles.profilemenu}
              placeholder="Phone"
              value={this.state.phone}
              onChangeText={phone => this.setState({phone})}
            />
          </View>

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
                onPress={this.handleSubmit}
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
)(Profile);
