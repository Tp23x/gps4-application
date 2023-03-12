/* eslint-disable react/prop-types */
import React from 'react';
import {
  ScrollView,
  ImageBackground,
  View,
  StyleSheet,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import {
  FlexCentered,
  Centered,
  Text,
  Spacer,
} from "../../shared/styledComponents";
import { routes } from "../../shared/routes";
// import {Slider} from 'react-native';
import Slider from '@react-native-community/slider';

import Spinner from 'react-native-loading-spinner-overlay';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';
import {TouchableOpacity} from 'react-native-gesture-handler';

import * as firebase from "firebase";
import {firebaseConfig} from "../../../firebaseConfig";
import firestore from '@react-native-firebase/firestore';

class Tests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test_c: 50, //control
      test_p: 50, //past
      test_n: 50, //now
      test_f: 50, //future
      test_s: 50, //self
      test_g: 50, //goal or focus
      result: 0,
      disabled_test_p: !true,
      disabled_test_f: !true,
      spinner: false,

      goalKey: null,
      goalName: null,
      isLeftButton: 0
    };

    this.saveTest = this.saveTest.bind(this);
    this.storeTest = this.storeTest.bind(this);
    this.calculateSuccess = this.calculateSuccess.bind(this);
  }

  componentDidMount() {
    this.calculateSuccess();

    let {goalKey, goalName, isLeftButton } = this.props.navigation.state.params;
    this.setState({
      goalKey,
      goalName,
      isLeftButton
    });

    
  }

  async saveTest(flag, value) {
    let _flag = flag;
    switch (_flag) {
      case 'c':
        let test_c = value;
        // this.setState({test_c});
        this.calculateSuccess();
        break;
      case 'p':
        var test_n = this.state.test_n;
        let test_p = value;
        this.setState({
          test_p,
          // test_p: 100 - test_n - test_p,
          disabled_test_f: false,
        });
        break;
      case 'n':
        var test_n = value;
        this.setState({
          test_n,
          // test_p: 100 - test_n,
          disabled_test_p: false,
        });
        this.calculateSuccess();
        break;
      case 'f':
        break;
      case 's':
        let test_s = value;
        this.setState({test_s});
        this.calculateSuccess();
        break;
      case 'g':
        let test_g = value;
        this.setState({test_g});
        this.calculateSuccess();
        break;
    }
  }

  async storeTest() {
    let uid = null;
    await AsyncStorage.getItem('uid', (err, _uid) => {
      if( err != null ){
        // console.log( 'tests -> uid error: ', err);
      }else{
        uid = _uid;
      }
    });

    let now = new Date();
    let docId = uid.concat('-', this.state.goalKey, '-', now.getTime());

    let _test_p = (this.state.test_p/100*(100-this.state.test_n)).toFixed(2);
    let _test_f = ((this.state.test_f)/100*(100-this.state.test_n)).toFixed(2);
    
    let rawData = {
      test_c: this.state.test_c,
      test_n: this.state.test_n,
      test_p: _test_p,
      test_f: _test_f,
      test_s: this.state.test_s,
      test_g: this.state.test_g,
      result: this.state.result
    };

    let _data = {
          day: ''.concat(now.getDate(), '-', now.getMonth()+1, '-', now.getFullYear()),
          time: now.getTime(),
          goal: this.state.goalKey,
          result: this.state.result,
          rawData: JSON.stringify(rawData),
          test_c: this.state.test_c,
          test_p: _test_p,
          test_n: this.state.test_n,
          test_f: _test_f,
          test_s: this.state.test_s,
          test_g: this.state.test_g,
          uid: uid
        };

    firestore()
      .collection('usertests')
      .doc(docId)
      .set(_data)
      .then(response => {
        // this.props.navigation.navigate(routes.app);
        this.goToResultScreen();
      })
      .catch(function(error) {
        // console.log('store test error: ', error);
      });


  }

  goToResultScreen(){
    this.props.navigation.navigate(routes.result, {
      result: this.state.result
    });
  }

  async calculateSuccess() {
    this.setState({
      spinner: true,
    });

    let t1 = this.state.test_c;
    let t2 = this.state.test_n;
    let t3 = this.state.test_s;
    let t4 = this.state.test_g;

    let result = 0;

    result = (((((t1 * t2) / 100) * t3) / 100) * t4) / 100;
    this.setState({result});
    setTimeout(() => {
      this.setState({
        spinner: false,
      });
    }, 1000);
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={trans('loading', this.props.store.lang)}
          textStyle={styles.spinnerTextStyle}
          color="#fff"
        />
        <View style={[this.state.isLeftButton == 1 ? styles.headerLeft :  styles.header]}>
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: 'normal',
              color: 'white',
              marginLeft: 50,
            }}>
            {trans('test_intro', this.props.store.lang)}
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: 30,
              fontWeight: 'normal',
              textAlign: 'right',
              alignItems: 'center',
              color: 'white',
              marginRight: 50,
            }}>
            {trans('test_life', this.props.store.lang)}{'\n'}
            <Text
              style={{
                flex:1,
                fontSize: 40,
                fontWeight: 'bold',
                lineHeight: 30,
                color: 'white'
              }}>
              {trans('test_be_right', this.props.store.lang)}
            </Text>
          </Text>
        </View>

        <Spacer />
        <View style={styles.test_outer_container}>
            <Text style={styles.headline}>{trans('test_control','en')}</Text>

          <View style={styles.test_c_container}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.left_text}>{100 - this.state.test_c}</Text>
            <Text style={styles.subheadline}>{trans('test_control', 'th')}</Text>
              <Text style={[this.state.isLeftButton ? styles.right_text_left: styles.right_text]}>{this.state.test_c}</Text>
            </View>

            <Slider
              style={{width: 350}}
              thumbImage={this.state.isLeftButton ? require('../../../assets/images/thumbImage2.png') :require('../../../assets/images/thumbImage.png')}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={this.state.isLeftButton ? "#0083c1" :"#f15a24"}
              maximumTrackTintColor="#e6e6e6"
              value={this.state.test_c}
              step={1}
              onValueChange={value => this.setState({test_c: value})}
              onSlidingComplete={value => {
                this.saveTest('c', value);
              }}
            />
          </View>
        </View>

        <View style={styles.test_outer_container}>
            <Text style={styles.headline}>{trans('test_now', 'en')}</Text>
          <View style={styles.test_c_container}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.left_text}>{100 - this.state.test_n}</Text>
            <Text style={styles.subheadline}>{trans('test_now', 'th')}</Text>
              <Text style={[this.state.isLeftButton ? styles.right_text_left: styles.right_text]}>{this.state.test_n}</Text>
            </View>
            <Slider
              style={{width: 350}}
              thumbImage={this.state.isLeftButton ? require('../../../assets/images/thumbImage2.png') :require('../../../assets/images/thumbImage.png')}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={this.state.isLeftButton ? "#0083c1" :"#f15a24"}
              maximumTrackTintColor="#e6e6e6"
              value={this.state.test_n}
              step={1}
              onValueChange={value =>
                this.setState({
                  test_n: value,
                  // test_p: 100 - value,
                  disabled_test_p: false,
                })
              }
              onSlidingComplete={value => {
                this.saveTest('n', value);
              }}
            />
          </View>
        </View>
        <View style={styles.test_outer_container}>
          <View style={styles.test_c_container}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.left_text}>
              {((this.state.test_f)/100*(100-this.state.test_n)).toFixed(2)}
              </Text>
            <Text style={styles.subheadline}>{trans('test_past_future', 'th')}</Text>
              <Text style={[this.state.isLeftButton ? styles.right_text_left: styles.right_text]}>
              {(this.state.test_p/100*(100-this.state.test_n)).toFixed(2)}
                </Text>
            </View>
            <Slider
              style={{width: 350}}
              thumbImage={this.state.isLeftButton ? require('../../../assets/images/thumbImage2.png') :require('../../../assets/images/thumbImage.png')}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={this.state.isLeftButton ? "#0083c1" :"#f15a24"}
              maximumTrackTintColor="#e6e6e6"
              value={this.state.test_p}
              step={1}
              disabled={this.state.disabled_test_p}
              onValueChange={value=>
                this.setState({
                  test_p: value,
                  test_f:100-value
                })
              }
              onSlidingComplete={value => {
                this.saveTest('p', value);
              }}
            />
          </View>
        </View>

        <View style={styles.test_outer_container}>
            <Text style={styles.headline}>{trans('test_self_communication', 'en')}</Text>

          <View style={styles.test_c_container}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.left_text}>{100 - this.state.test_s}</Text>
            <Text style={styles.subheadline}>{trans('test_self_communication', 'th')}</Text>
              <Text style={[this.state.isLeftButton ? styles.right_text_left: styles.right_text]}>{this.state.test_s}</Text>
            </View>
            <Slider
              style={{width: 350}}
              thumbImage={this.state.isLeftButton ? require('../../../assets/images/thumbImage2.png') :require('../../../assets/images/thumbImage.png')}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={this.state.isLeftButton ? "#0083c1" :"#f15a24"}
              maximumTrackTintColor="#e6e6e6"
              value={this.state.test_s}
              step={1}
              onValueChange={value => this.setState({test_s: value})}
              onSlidingComplete={value => this.saveTest('s', value)}
            />
          </View>
        </View>

        <View style={styles.test_outer_container}>
            <Text style={styles.headline}>{trans('test_focus', 'en')}</Text>
          <View style={styles.test_c_container}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.left_text}>{100 - this.state.test_g}</Text>
            <Text style={styles.subheadline}>{trans('test_focus', 'th')}</Text>
              <Text style={[this.state.isLeftButton ? styles.right_text_left: styles.right_text]}>{this.state.test_g}</Text>
            </View>
            <Slider
              style={{width: 350}}
              thumbImage={this.state.isLeftButton ? require('../../../assets/images/thumbImage2.png') :require('../../../assets/images/thumbImage.png')}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={this.state.isLeftButton ? "#0083c1" :"#f15a24"}
              maximumTrackTintColor="#e6e6e6"
              value={this.state.test_g}
              step={1}
              onValueChange={value => this.setState({test_g: value})}
              onSlidingComplete={value => this.saveTest('g', value)}
            />
          </View>
        </View>

        <View
          style={[this.state.isLeftButton ? styles.bottomCLeft : styles.bottomC]}>
          <View style={styles.test_outer_container2}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            />
            <Text
              style={{
                height:80,
                marginTop:30,
                fontSize: 60,
                fontWeight: 'bold',
                color: 'white',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 2.41,
                elevation: 2,
              }}>
              {this.state.result.toFixed(2)}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'normal',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: 50
              }}
              onPress={this.storeTest}>
              {trans('test_next', this.props.store.lang)} >
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: 50,
    //paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: "#ffffff",
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 25,
    //borderWidth: 1,
    backgroundColor: '#f15a24',
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    paddingTop: 20,
    paddingBottom: 20,
    width: 500
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 25,
    //borderWidth: 1,
    backgroundColor: '#0083c1',
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    paddingTop: 20,
    paddingBottom: 20,
    width: 500
  },

  bottomC: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f15a24',
    paddingBottom: 20,
    paddingTop: 20,
    borderTopLeftRadius: 250,
    borderTopRightRadius: 250,
    width: 500,
  },
  bottomCLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#0083c1',
    paddingBottom: 20,
    paddingTop: 20,
    borderTopLeftRadius: 250,
    borderTopRightRadius: 250,
    width: 500,
  },

  test_outer_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    paddingTop: -20,
  },
  test_outer_container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: "#f15a24"
  },
  test_c_container: {
    flex: 1,
    //flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: 'center',
  },
  left_text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#c1c1c1',
    //borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
  },
  right_text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#f15a24',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'right',
  },
  right_text_left: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0083c1',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'right',
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -20,
  },
  subheadline: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  spinnerTextStyle: {}
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Tests);
