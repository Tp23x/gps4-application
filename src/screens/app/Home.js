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
  ImageBackground,
} from 'react-native';

import {
  FlexCentered,
  Centered,
  Text,
  Spacer,
  Button,
} from '../../shared/styledComponents';
import LineG from '../../components/LineG';
import CustomBarG from '../../components/CustomBarG';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';
import {routes} from '../../shared/routes';

import * as firebase from 'firebase';
import {firebaseConfig} from '../../../firebaseConfig';
import firestore from '@react-native-firebase/firestore';

import Spinner from 'react-native-loading-spinner-overlay';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uuid: null,
      isLoading: true,
      spinner: false,
      goals: [],
      scores: 0,
      scores2: 0,
      data: [],
      data2: [],
      avgScore: 0,
      defaultEmotion: require('../../../assets/images/average.png'),

      dataSet1: [],//week1
      dataSet2: [],//week2
      dataSet3: [],//month1
      dataSet4: [],//month2
    };

    this.loadGoals = this.loadGoals.bind(this);
    this.toTest = this.toTest.bind(this);
    this.getLastResult = this.getLastResult.bind(this);
    this.getWeeklyResult = this.getWeeklyResult.bind(this);
    this.getMonthlyResult = this.getMonthlyResult.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: false, spinner: false});
    this.loadGoals();
    this.getLastResult();
    setTimeout(()=>{
      this.getWeeklyResult();
    },1500);

    setTimeout(()=>{
      this.getMonthlyResult();
    },1500);
    
  }

  async getLastResult() {
    this.setState({
      spinner: true,
    });
    let uuid = await AsyncStorage.getItem('uid', (err, uid) => {
      if (err != null) {
        // console.log('home lastresult -> uid error: ', err);
      } else {
        uuid = uid;
        this.setState({
          uuid,
        });
      }
    });

    if (uuid) {

      let data = [];
      let data2 = [];

      let [goal1, goal2] = this.state.goals;
      let key1 = goal1.key;
      let key2 = goal2.key;
      console.log( 'latest 1 : ', key1);
      console.log( 'latest 2 : ', key2);

      const usertests = await firestore().collection('usertests');

      //get latest for key1
      usertests
        .where('uid', '==', uuid)
        .where('goal', '==', key1)
        .limit(1)
        .orderBy('time', 'DESC')
        .get()
        .then(users => {
          users.forEach(user => {
            var _item = user.data();
            data.push([_item.test_c, 100 - _item.test_c]);
            data.push([_item.test_n, _item.test_p, _item.test_f]);
            data.push([_item.test_s, 100 - _item.test_s]);
            data.push([_item.test_g, 100 - _item.test_g]);
            this.setState({data, scores: _item.result});
          });
          this.setState({spinner: false});
        })
        .catch(uerrors => {
          // console.log('uusers error: ', uerrors);
          this.setState({spinner: false});
        });

      //get latest for key2
      usertests
        .where('uid', '==', uuid)
        .where('goal', '==', key2)
        .limit(1)
        .orderBy('time', 'DESC')
        .get()
        .then(users => {

          users.forEach(user => {
            var _item = user.data();
            data2.push([_item.test_c, 100 - _item.test_c]);
            data2.push([ _item.test_n, _item.test_p, _item.test_f]);
            data2.push([_item.test_s, 100 - _item.test_s]);
            data2.push([_item.test_g, 100 - _item.test_g]);
            this.setState({data2, scores2: _item.result});
          });
          this.setState({spinner: false});
        })
        .catch(uerrors => {
          this.setState({spinner: false});
          // console.log('uusers error: ', uerrors);
        });

    }
  }

  async getWeeklyResult() {
    let uuid = this.state.uuid;

    let [goal1, goal2] = this.state.goals;
    let key1 = goal1.key;
    let key2 = goal2.key;

    //new Date(year, month, day, hours, minutes, seconds, milliseconds)
    const __now = new Date();
    const now = new Date(Date.UTC(__now.getFullYear(), __now.getMonth(), __now.getDate(), __now.getHours(), __now.getMinutes(), __now.getSeconds()));
    const _now = new Date(Date.UTC(__now.getFullYear(), __now.getMonth(), __now.getDate(), 0, 0, 0, 0));
    const _7days = new Date(_now.getTime() - 1000*24*60*60*7);
    const current_day_of_week = _now.getDay();
    const first_date_of_week = new Date(_now.getTime() - 1000*24*60*60*current_day_of_week);
    const last_date_of_week = new Date(_now.getTime() + 1000*24*60*60* ( 7 - current_day_of_week - 1 ) + (1000*24*60*60 - 1) );

    // console.log( '____________________ ');
    // console.log( 'current day of week : ', current_day_of_week );
    // console.log( 'current date time: ', now );
    // console.log( '_now: ', _now );
    // console.log( 'first day of week: ', first_date_of_week);
    // console.log( 'last_day of week: ', last_date_of_week );

    let dataSet1 = [[0], [0] ,[0], [0], [0], [0], [0]];
    let dataSet2 = [[0], [0] ,[0], [0], [0], [0], [0]];
    
    await firestore().collection('usertests')
      .where('uid', '==', uuid)
      // .where('goal', '==', key1)
      .where('time', '>=', first_date_of_week.getTime())
      .where('time', '<=', last_date_of_week.getTime())
      .orderBy('time', 'DESC')
      .get()
      .then(users => {
        if( !users.empty ){
          let _users = users.docs;
          // console.log( 'docs count: ', users.docs.length);
          
          _users.forEach(user => {
              var _item = user.data();
              
              if( _item.goal == key1 ){
                let ___item = _item.day.split('-');
                let _d = new Date(___item[2], (___item[1]-1), ___item[0]);
                let dinweek = _d.getDay();
                if( typeof dataSet1[dinweek] == 'undefined'){
                  dataSet1[dinweek] = new Array();
                }
                if( dataSet1[dinweek].length < 2 ){
                  dataSet1[dinweek].push(_item.result);
                }
                // console.log( 'DATA WEEK 1: ', dataSet1);
                this.setState({dataSet1});

              }else if( _item.goal == key2 ){
                let ___item = _item.day.split('-');
                let _d = new Date(___item[2], (___item[1]-1), ___item[0]);
                let dinweek = _d.getDay();
                if( typeof dataSet2[dinweek] == 'undefined'){
                  dataSet2[dinweek] = new Array();
                }
                if( dataSet2[dinweek].length < 2 ){
                  dataSet2[dinweek].push(_item.result);
                }
                // console.log( 'DATA WEEK 2: ', dataSet2);
                this.setState({dataSet2});
              }
          });
          
        }else{
          console.log( 'empty users');
        }
      })
      .catch(uerrors => {
        console.log('uusers error III 2: ', uerrors);
      });
      
  }

  
  async getMonthlyResult() {
    let uuid = this.state.uuid;

    let [goal1, goal2] = this.state.goals;
    let key1 = goal1.key;
    let key2 = goal2.key;

    //new Date(year, month, day, hours, minutes, seconds, milliseconds)
    const now = new Date();
    const _now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const _1month = new Date(_now.getTime() - 1000*24*60*60*29);
    
    const current_date_of_month = _now.getDay();
    const first_date_of_month = new Date(_now.getFullYear(), now.getMonth(), 1);
    const last_date_of_month = new Date(_now.getFullYear(), now.getMonth() + 1, 0);
    const day_in_month = new Date(_now.getFullYear(), _now.getMonth() + 1 , 0 ).getDate();
    
    var dataSet3 = [];
    var dataSet4 = [];
    let countSet3 = 0;
    let countSet4 = 0;
    // const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
    var _days = [];
    for(var _dd = 1; _dd <= day_in_month; _dd++){
      _days.push(_dd);
      dataSet3.push([0]);
      dataSet4.push([0]);
    }
    const days = _days;

    await firestore().collection('usertests')
      .where('uid', '==', uuid)
      // .where('goal', '==', key1)
      .where('time', '>=', first_date_of_month.getTime())
      .where('time', '<=', last_date_of_month.getTime())
      .orderBy('time', 'DESC')
      .get()
      .then(users => {
        if( !users.empty ){
          let _users = users.docs;
          console.log( 'docs count month: ', users.docs.length);
          
          _users.forEach(user => {
            var _item = user.data();
            let ___item = _item.day.split('-');
            if( _item.goal == key1 ){
              let ___item = _item.day.split('-');
              let _d = new Date(___item[2], (___item[1]-1), ___item[0]);
              let dinmonth = _d.getDate();
              if( typeof dataSet3[dinmonth] == 'undefined'){
                dataSet3[dinmonth] = new Array();
              }
              if( dataSet3[dinmonth].length < 2 ){
                dataSet3[dinmonth].push(_item.result);
              }
              this.setState({dataSet3});

            }else if( _item.goal == key2 ){
              let ___item = _item.day.split('-');
              let _d = new Date(___item[2], (___item[1]-1), ___item[0]);
              let dinmonth = _d.getDate();
              if( typeof dataSet4[dinmonth] == 'undefined'){
                dataSet4[dinmonth] = new Array();
              }
              if( dataSet4[dinmonth].length < 2 ){
                dataSet4[dinmonth].push(_item.result);
              }
              this.setState({dataSet4});
            }
          });

        }else{
          
        }
        
      })
      .catch(uerrors => {
        // console.log('uusers error: ', uerrors);
      });
    
    
  }

  toTest(goalKey, goalName, isLeftButton) {
    this.props.navigation.navigate(routes.tests, {
      goalKey: goalKey,
      goalName: goalName,
      isLeftButton: isLeftButton
    });
  }

  async loadGoals() {
    let userGoals = null;
    await AsyncStorage.getItem('usergoals', (err, goals) => {
      if (err == null && goals == null) {
        // console.log('dashboard -> usergoals error: ', err);
      } else {
        userGoals = JSON.parse(goals);
      }
    });
    if (userGoals) {
      this.setState({goals: userGoals});
    }
  }

  render() {
    const goalKeys = [];
    const goalNames = [];
    this.state.goals.forEach((_g, _idx) => {
      goalKeys.push(_g.key);
      goalNames.push(_g.name);
    });

    let weekSet1 = [];
    let weekSet2 = [];
    let _dataSet1 = this.state.dataSet1;
    _dataSet1.forEach(a => {
      let _sum = 0;
      a.forEach(d => {
        _sum += d;
      })
      if( a.length > 1 ){
        weekSet1.push( _sum / (a.length - 1));
      }else{
        weekSet1.push(0);
      }
    });

    let _dataSet2 = this.state.dataSet2;
    _dataSet2.forEach(a => {
      let _sum = 0;
      a.forEach(d => {
        _sum += d;
      })
      if( a.length > 1 ){
        weekSet2.push( _sum / (a.length - 1));
      }else{
        weekSet2.push(0);
      }
    });

    if( weekSet1.length <= 0 ){
      weekSet1 = [0,0,0,0,0,0,0];
    }
    if( weekSet2.length <= 0 ){
      weekSet2 = [0,0,0,0,0,0,0];
    }
    
    let monthSet1 = [];
    let monthSet2 = [];
    let _dataSet3 = this.state.dataSet3;
    _dataSet3.forEach(a => {
      let _sum = 0;
      a.forEach(d => {
        _sum += d;
      })
      if( a.length > 1 ){
        monthSet1.push( _sum / (a.length - 1));
      }else{
        monthSet1.push(0);
      }
    });

    let _dataSet4 = this.state.dataSet4;
    _dataSet4.forEach(a => {
      let _sum = 0;
      a.forEach(d => {
        _sum += d;
      })
      if( a.length > 1 ){
        monthSet2.push( _sum / (a.length - 1));
      }else{
        monthSet2.push(0);
      }
    });

    if( monthSet1.length <= 0 ){
      monthSet1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    if( monthSet2.length <= 0 ){
      monthSet2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    const chartConfig = {
      backgroundColor: 'white',
      backgroundGradientFrom: 'white',
      backgroundGradientTo: 'white',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726',
      },
    };

    return (
      <ScrollView style={{flex: 1}}>
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
            backgroundColor: '#fdb900',
            height: 400,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ImageBackground
            source={require('../../../assets/images/bg-home.png')}
            style={{
              flex: 1,
              resizeMode: 'contain',
              justifyContent: 'center',
              width: 400,
              marginTop: 70,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.2,
                shadowRadius: 4.84,

                elevation: 5,
              }}>
              <Image
                source={this.state.defaultEmotion}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 100,
                  borderWidth: 5,
                  borderColor: 'white',
                  marginTop: -120,
                }}
              />
            </View>
          </ImageBackground>
        </View>
        <View style={styles.dailyReport}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.headReport}>{trans('latest_test', this.props.store.lang)}</Text>
          </View>
          <ScrollView horizontal={true} style={{flex: 1}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.score}>{trans('score', this.props.store.lang)} : {trans(goalKeys[0], this.props.store.lang, 'goal')}</Text>
                <Text style={styles.scoreTest1}>
                  {this.state.scores.toFixed(2)}
                </Text>
              </View>
              <CustomBarG
                // data={this.state.data}
                data={{
                  labels: [
                    trans('gcate_control', this.props.store.lang),
                    trans('gcate_time', this.props.store.lang),
                    trans('gcate_self_communication', this.props.store.lang),
                    trans('gcate_focus', this.props.store.lang)
                  ],
                  datasets: [
                    {
                      //   data: [20, 45, 28],
                      // data: [[20, 80], [45, 20, 35], [28, 72], [30, 70]],
                      data: this.state.data,
                    },
                  ],
                }}
                chartConfig={chartConfig}
                width={Dimensions.get('window').width}
                height={300}
                fromZero={true}
                mycolors={[
                  `rgba(255,103,19,1)`,
                  `rgba(255,103,19,0.6)`,
                  `rgba(255,103,19,1)`,
                  `rgba(255,103,19,0.6)`,
                  `rgba(255,103,19,0.3)`,
                  `rgba(255,103,19,1)`,
                  `rgba(255,103,19,0.6)`,
                  `rgba(255,103,19,1)`,
                  `rgba(255,103,19,0.6)`,
                ]}
                topBarColor="#ff671d"
                textValueColor="#666666"
                customBarWidth={25}
              />
              <Button
                style={styles.buttonTest1}
                onPress={() => {
                  this.toTest(goalKeys[0], goalNames[0], 0);
                }}>
                <Text style={{color: 'white', fontWeight: 'normal'}}>
                {trans('do_the_test', this.props.store.lang)}
                </Text>
              </Button>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.score}>{trans('score', this.props.store.lang)}: {trans(goalKeys[1], this.props.store.lang, 'goal')}</Text>
                <Text style={styles.scoreTest2}>
                  {this.state.scores2.toFixed(2)}
                </Text>
              </View>
              <CustomBarG
                // data={this.state.data}
                data={{
                  labels: [
                    trans('gcate_control', this.props.store.lang),
                    trans('gcate_time', this.props.store.lang),
                    trans('gcate_self_communication', this.props.store.lang),
                    trans('gcate_focus', this.props.store.lang)
                  ],
                  datasets: [
                    {
                      //   data: [20, 45, 28],
                      // data: [[20, 80], [45, 20, 35], [28, 72], [30, 70]],
                      data: this.state.data2,
                    },
                  ],
                }}
                chartConfig={chartConfig}
                width={Dimensions.get('window').width}
                height={300}
                fromZero={true}
                mycolors={[
                  `rgba(0,131,193,1)`,
                  `rgba(0,131,193,0.6)`,
                  `rgba(0,131,193,1)`,
                  `rgba(0,131,193,0.6)`,
                  `rgba(0,131,193,0.3)`,
                  `rgba(0,131,193,1)`,
                  `rgba(0,131,193,0.6)`,
                  `rgba(0,131,193,1)`,
                  `rgba(0,131,193,0.6)`,
                ]}
                topBarColor="#0083c1"
                textValueColor="#666666"
                customBarWidth={25}
              />
              {/* <BarG
                data={this.state.data2}
                labels={['Control', 'Now', 'Past', 'Self Com', 'Focus']}
                color={(opacity = 1) => `rgba(0,131,193, ${opacity})`}
              /> */}
              <Button
                style={styles.buttonTest2}
                onPress={() => {
                  this.toTest(goalKeys[1], goalNames[1], 1);
                }}>
                <Text style={{color: 'white', fontWeight: 'normal'}}>
                  {trans('do_the_test', this.props.store.lang)}
                </Text>
              </Button>
            </View>
          </ScrollView>
        </View>

        <View style={styles.weeklyReport}>
          <Text style={styles.headReport}>{trans('weekly', this.props.store.lang)}</Text>
          <ScrollView horizontal={true} style={{flex: 1}}>
            <View>
              <LineG
                data={weekSet1}
                labels={[
                  trans('day_sun', this.props.store.lang),
                  trans('day_mon', this.props.store.lang),
                  trans('day_tue', this.props.store.lang),
                  trans('day_wed', this.props.store.lang),
                  trans('day_thu', this.props.store.lang),
                  trans('day_fri', this.props.store.lang),
                  trans('day_sat', this.props.store.lang),
                ]}
              />
            </View>
            <View>
              <LineG
                data={weekSet2}
                labels={[
                  trans('day_sun', this.props.store.lang),
                  trans('day_mon', this.props.store.lang),
                  trans('day_tue', this.props.store.lang),
                  trans('day_wed', this.props.store.lang),
                  trans('day_thu', this.props.store.lang),
                  trans('day_fri', this.props.store.lang),
                  trans('day_sat', this.props.store.lang),
                ]}
                color="#0083c1"
              />
            </View>
          </ScrollView>
        </View>

        <View style={styles.monthlyReport}>
          <Text style={styles.headReport}>{trans('monthly', this.props.store.lang)}</Text>
          <ScrollView horizontal={true} style={{flex: 1}}>
            <View>
              <LineG data={monthSet1} labels={['1','','','','5','','','','','10','','','','','15','','','','','20','','','','','25','','','','','30']} />
            </View>
            <View>
              <LineG
                data={monthSet2}
                labels={['1','','','','5','','','','','10','','','','','15','','','','','20','','','','','25','','','','','30']}
                color="#0083c1"
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  dailyReport: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
    marginTop: -80,
    marginHorizontal: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.1,
    shadowRadius: 9.84,

    elevation: 5,
  },

  weeklyReport: {
    justifyContent: 'center',
    flex: 1,
    //backgroundColor: 'rgba(52, 52, 52, 1)',
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.1,
    shadowRadius: 9.84,
    elevation: 5,
    paddingBottom:10,
  },

  monthlyReport: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.1,
    shadowRadius: 9.84,

    elevation: 5,
    paddingBottom:10,
  },

  headReport: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    color: '#666666',
    fontWeight:'bold'
  },
  score: {
    marginLeft: 20,
    flex: 3,
    fontSize: 14,
    fontWeight: 'normal',
    color: '#808080',
  },
  scoreTest1: {
    textAlign: 'right',
    marginRight: 40,
    marginHorizontal: 20,
    flex: 2,
    color: '#f15a24',
    fontSize: 14,
    fontWeight: 'normal',
  },

  scoreTest2: {
    textAlign: 'right',
    marginRight: 40,
    marginHorizontal: 20,
    flex: 2,
    color: '#0083c1',
    fontSize: 14,
    fontWeight: 'normal',
  },
  buttonTest1: {
    backgroundColor: '#f15a24',
    width: 300,
    marginLeft: 20,
    marginTop: 0,
  },
  buttonTest2: {
    backgroundColor: '#0083c1',
    width: 300,
    marginLeft: 20,
    marginTop: 0,
  },
  spinnerTextStyle: {},
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Home);
