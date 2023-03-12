/* eslint-disable react/prop-types */
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  Alert,
} from 'react-native';

import {
  FlexCentered,
  Centered,
  Text,
  Spacer,
  Button,
} from '../../shared/styledComponents';
import {colors, routes} from '../../shared';
import {ScrollView} from 'react-native-gesture-handler';

import * as firebase from 'firebase';
import 'firebase/firestore';
import '../../../firebaseConfig';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';
import Spinner from 'react-native-loading-spinner-overlay';

import CustomTouch from '../../components/CustomTouch';

class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      spinner: false,
    };
    this.selectGoalHandler = this.selectGoalHandler.bind(this);
    this.checkGoalInLocalStorage = this.checkGoalInLocalStorage.bind(this);
    this.goToHome = this.goToHome.bind(this);
    this.getPresetGoal = this.getPresetGoal.bind(this);
  }

  componentDidMount() {
    this.checkGoalInLocalStorage();
    // this.loadGoal();
  }

  getPresetGoal() {
    const presetData = [
      {},
      {
        key: 'RGdK3dKUZWR7kIuU7nGx',
        name: trans('RGdK3dKUZWR7kIuU7nGx', this.props.store.lang, 'goal'),
      },
      {
        key: '5gaO6csKENpwNXzeY2gs',
        name: trans('5gaO6csKENpwNXzeY2gs', this.props.store.lang, 'goal'),
      },
      {
        key: '1V2Pp1YtQxgddlamI3mk',
        name: trans('1V2Pp1YtQxgddlamI3mk', this.props.store.lang, 'goal'),
      },
      {
        key: 't5BQFTlfOa8iJwbJsOX1',
        name: trans('t5BQFTlfOa8iJwbJsOX1', this.props.store.lang, 'goal'),
      },
      {
        key: 'Qx4mrVcycn1sZLTeEw0r',
        name: trans('Qx4mrVcycn1sZLTeEw0r', this.props.store.lang, 'goal'),
      },
      {
        key: 'pm7UUU6GSXY7XooqEsxB',
        name: trans('pm7UUU6GSXY7XooqEsxB', this.props.store.lang, 'goal'),
      },
      {
        key: 'QLsQNM89iiJNOYdbUdpS',
        name: trans('QLsQNM89iiJNOYdbUdpS', this.props.store.lang, 'goal'),
      },
      {
        key: 'pOFpFBmomsNF50G8w0oc',
        name: trans('pOFpFBmomsNF50G8w0oc', this.props.store.lang, 'goal'),
      },
    ];

    return presetData;
  }

  selectGoalHandler(value) {
    let selected = this.state.selected;

    if (selected.indexOf(value) >= 0) {
      let _selected = selected.filter(s => {
        return s != value;
      });
      this.setState({
        selected: _selected,
      });
    } else {
      if (selected.length <= 1) {
        selected.push(value);
        this.setState({
          selected: selected,
        });
      } else {
        //this.props.navigation.navigate(routes.home);
      }
    }
  }

  goToHome() {
    let selected = this.state.selected;
    let sum = 0;
    this.setState({
      spinner: true
    });
    AsyncStorage.removeItem('reselectgoal');
    selected.forEach(a => {
      sum++;
    });
    if (sum == 2) {
      let _preset = this.getPresetGoal();
      let selectedGoalObj = [];
      selected.forEach((sel, idx) => {
        selectedGoalObj.push(_preset[sel]);
      });
      this.setState({
        spinner: false
      });
      this.props.addUserGoal(selectedGoalObj);
      this.props.navigation.navigate(routes.home);
    } else {
      this.setState({
        spinner: false
      });
      Alert.alert(trans('please_select_2_goal', this.props.store.lang));
    }
  }

  async checkGoalInLocalStorage(){
    let usergoals = null;
    let reSelect = null;
    await AsyncStorage.getItem("usergoals", (err, ugoals) => {
      // handler
      if( err != null ){
        // console.log( 'goal screen -> ugoals error: ', err);
      }else{
        usergoals = ugoals;
      }
    });

    await AsyncStorage.getItem("reselectgoal", (err, reselect) => {
      // handler
      if( err != null ){
        // console.log( 'goal screen -> reselect error: ', err);
      }else{
        reSelect = reselect;
      }
    });
    if( ( reSelect == 0 || reSelect == null ) && usergoals ){
      this.props.navigation.navigate(routes.home);
    }
  }

  async loadGoal() {

    let uid = null;
    await AsyncStorage.getItem('uid', (err, _uid) => {
      if (err != null) {
        // console.log('goal -> uid error: ', err);
      } else {
        uid = _uid;
      }
    });
    let _user = this.props.store.user;
    if (_user != null) _user = JSON.parse(_user);

    if (uid && uid != null) {
      firebase
        .firestore()
        .collection('usergoals')
        .where('uid', '==', uid)
        .limit(1)
        .get()
        .then(snapShot => {
          snapShot.docs.forEach(doc => {
            console.log('snapshot: ', doc);
            this.setState({spinner: false});
            this.toDashboard();
          });
        })
        .catch(error => {
          // console.log('load goal error: ', error);
        });
    }
  }

  toDashboard() {
    this.props.navigation.navigate(routes.home);
  }

  render() {
    let selected = this.state.selected;

    var additionalStyles = [];
    for (let i = 0; i <= 8; i++) {
      if (selected.indexOf(i) >= 0) {
        additionalStyles[i] = {backgroundColor: '#cccccc'};
      } else {
        additionalStyles[i] = {};
      }
    }
    return (
      <ScrollView>
        <View style={styles.containerTop}>
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
            }}>
            <Text />
          </View>
          <Image
            source={require('../../../assets/images/Goal-LOGO.png')}
            style={styles.goalLogo}
          />
          <View
            style={{
              flex: 1,
              paddingRight: 20,
              justifyContent: 'center',
              //alignItems: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                textAlign: 'right',
              }}
              onPress={this.goToHome}>
              {trans('next', this.props.store.lang)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 30,
          }}>
          <Text style={styles.goalHeader}>{trans('choose_your_goal', this.props.store.lang)}</Text>
          <Text style={styles.goalDescription}>
            {trans('choose2of8goal', this.props.store.lang)}
          </Text>
        </View>

        <View style={styles.containerMain}>
          <ImageBackground
            source={require('../../../assets/images/Goal-BG.png')}
            style={{height: '100%', resizeMode: 'contain'}}>
            <Spacer />
            <View style={styles.goalrow}>
              <View style={styles.goalElement}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectGoalHandler(1);
                  }}
                  style={{...styles.imageContainer, ...additionalStyles[1]}}>
                  <View>
                    <Image
                      source={require('../../../assets/images/goal-1.png')}
                      style={styles.goalElementImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.goalName}>
                  {trans('RGdK3dKUZWR7kIuU7nGx', this.props.store.lang, 'goal')}
                </Text>
              </View>
              <View style={styles.goalElement}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectGoalHandler(2);
                  }}
                  style={{...styles.imageContainer, ...additionalStyles[2]}}>
                  <View>
                    <Image
                      source={require('../../../assets/images/goal-2.png')}
                      style={styles.goalElementImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.goalName}>
                  {trans('5gaO6csKENpwNXzeY2gs', this.props.store.lang, 'goal')}
                </Text>
              </View>
              <View style={styles.goalElement}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectGoalHandler(3);
                  }}
                  style={{...styles.imageContainer, ...additionalStyles[3]}}>
                  <View>
                    <Image
                      source={require('../../../assets/images/goal-3.png')}
                      style={styles.goalElementImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.goalName}>
                  {trans('1V2Pp1YtQxgddlamI3mk', this.props.store.lang, 'goal')}
                </Text>
              </View>
            </View>
            <View style={styles.goalrow}>
              <View style={styles.goalElement}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectGoalHandler(4);
                  }}
                  style={{...styles.imageContainer, ...additionalStyles[4]}}>
                  <View>
                    <Image
                      source={require('../../../assets/images/goal-4.png')}
                      style={styles.goalElementImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.goalName}>
                  {trans('t5BQFTlfOa8iJwbJsOX1', this.props.store.lang, 'goal')}
                </Text>
              </View>
              <View style={styles.goalElement}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectGoalHandler(5);
                  }}
                  style={{...styles.imageContainer, ...additionalStyles[5]}}>
                  <View>
                    <Image
                      source={require('../../../assets/images/goal-5.png')}
                      style={styles.goalElementImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.goalName}>
                  {trans('Qx4mrVcycn1sZLTeEw0r', this.props.store.lang, 'goal')}
                </Text>
              </View>
              <View style={styles.goalElement}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectGoalHandler(6);
                  }}
                  style={{...styles.imageContainer, ...additionalStyles[6]}}>
                  <View>
                    <Image
                      source={require('../../../assets/images/goal-6.png')}
                      style={styles.goalElementImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.goalName}>
                  {trans('pm7UUU6GSXY7XooqEsxB', this.props.store.lang, 'goal')}
                </Text>
              </View>
            </View>
            <View style={styles.goalrow}>
              <View style={styles.goalElement}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectGoalHandler(7);
                  }}
                  style={{...styles.imageContainer, ...additionalStyles[7]}}>
                  <View>
                    <Image
                      source={require('../../../assets/images/goal-7.png')}
                      style={styles.goalElementImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.goalName}>
                  {trans('QLsQNM89iiJNOYdbUdpS', this.props.store.lang, 'goal')}
                </Text>
              </View>
              <View style={styles.goalElement}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectGoalHandler(8);
                  }}
                  style={{...styles.imageContainer, ...additionalStyles[8]}}>
                  <View>
                    <Image
                      source={require('../../../assets/images/goal-8.png')}
                      style={styles.goalElementImage}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.goalName}>
                  {trans('pOFpFBmomsNF50G8w0oc', this.props.store.lang, 'goal')}
                </Text>
              </View>
              <View style={styles.goalElementNone} />
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //height: 230,
    //paddingBottom: 30
    height: 120,
  },
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - 100,
  },
  goalBlank: {
    height: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalrow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  goalElement: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
  },
  goalElementNone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
  },
  goalLogo: {
    flex: 1,
    width: '30%',
    marginTop: 30,
    resizeMode: 'contain',
  },
  goalHeader: {
    fontSize: 30,
  },
  goalDescription: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  goalElementImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    //backgroundColor: "white",
    //borderRadius: 100,
    borderColor: 'white',
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 100,
    backgroundColor: 'white',
    width: 110,
    height: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'normal',
    paddingTop: 20,
  },
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Goal);
