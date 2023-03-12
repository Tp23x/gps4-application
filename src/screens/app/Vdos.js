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
import Video from 'react-native-video';

import {
  FlexCentered,
  Spacer,
  Text,
  Button,
} from '../../shared/styledComponents';
import {colors} from '../../shared/colors';

import {connect} from 'react-redux';
import trans from '../../shared/lang';
import {mapStatetoProps, mapDispatchToProps} from '../../store/store';
import {routes} from '../../shared/routes';

import firestore from '@react-native-firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';

class Vdos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      paused: true,

      spinner: false,

      vdo_id: '',
      vdo: {
        category: '',
        status: 0,
        title: '',
        title_th: '',
        short_description: '',
        short_description_th: '',
        description: '',
        description_th: '',
        cover_image: '',
      },
      nextVdos: [],
    };

    this.loadVdos = this.loadVdos.bind(this);
  }

  componentDidMount() {
    this.loadVdos();
  }

  async loadVdos() {
    let params = this.props.navigation.state.params;
    let that = this;
    firestore()
      .collection('vdos')
      .doc(params.id)
      .get()
      .then(vdo => {
        let _vdo = vdo.data();
        _vdo.id = params.id;
        that.setState({
          vdo: _vdo,
        });

        this.getNextVdo();
      })
      .catch(error => {
        console.log('load vdo error : ', error);
      });
  }

  getNextVdo() {
    let nextVdos = [];
    let category = this.state.vdo.category.toLowerCase();
    if (this.state.vdo.id) {
      firestore()
        .collection('vdos')
        .where('category', '==', category)
        .limit(3)
        .get()
        .then(data => {
          let _count = 0;
          data.forEach(d => {
            let _id = d.id;
            if (_id != this.state.vdo.id && _count < 2) {
              _count++;
              let v = d.data();
              v.id = _id;
              nextVdos.push(v);
              this.setState({
                nextVdos: nextVdos,
              });
            }
          });
        })
        .catch(error => {
          console.log('next vdo error: ', error);
        });
    }
  }

  render() {
    let vdo = this.state.vdo;

    return (
      <SafeAreaView style={styles.vdoContainer}>
        <Spinner
          visible={this.state.spinner}
          textContent={trans('loading', this.props.store.lang)}
          textStyle={styles.spinnerTextStyle}
          color="#fff"
          size="large"
        />
        <View style={{flex: 1, height: 100}}>
          <View style={{marginHorizontal: 20}}>
            <Text style={styles.vdoHeader}>
              {this.props.store.lang == 'en'
                ? vdo.title
                  ? vdo.title
                  : vdo.title_th
                : vdo.title_th
                ? vdo.title_th
                : vdo.title}
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'normal', marginTop: 5}}>
              {vdo.category == 'control' &&
                trans('gcate_control', this.props.store.lang)}
              {vdo.category == 'focus' &&
                trans('gcate_focus', this.props.store.lang)}
              {vdo.category == 'now' &&
                trans('gcate_time', this.props.store.lang)}
              {vdo.category == 'selfcom' &&
                trans('gcate_self_communication', this.props.store.lang)}
            </Text>
          </View>
          <View>
            {vdo.vdo_url != null && (
              <Video
                source={{
                  uri: vdo.vdo_url,
                }}
                onLoad={() => {}}
                controls={true}
                fullscreen={true}
                resizeMode="cover"
                paused={!this.state.paused}
                //poster={vdo.cover_image}
                posterResizeMode="contain"
                style={{height: 235, marginTop: 10}}
              />
            )}
          </View>
        </View>
        <View style={{flex: 1}}>
          <View>
            <Text style={styles.subtitle}>
              { Platform.OS == 'ios' && trans('subtitle', this.props.store.lang)}
            </Text>
          </View>
          <ScrollView style={{height: 200, marginTop: 10}}>
            <Text
              style={{
                color: '#808080',
                fontSize: 16,
                fontWeight: 'normal',
                lineHeight: 24,
                marginHorizontal: 20,
              }}>
              {this.props.store.lang == 'en' && vdo.description
                ? vdo.description
                : vdo.description_th}
            </Text>

          </ScrollView>
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Button style={{backgroundColor:'#0083c1'}} onPress={() => this.props.navigation.navigate(routes.couses)}>
            <Text color={colors.bright}>
              {trans('back', this.props.store.lang)}
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  vdoContainer: {
    flex: 1,
    //width: 415
  },

  vdoElement: {
    width: Dimensions.get('window').width,
    height: 250,
    marginTop: 90,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'gray',
  },

  vdoHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 15,
  },

  headline: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 10,
  },
  descript: {
    textAlign: 'center',
    fontSize: 18,
    width: '80%',
    maxWidth: 300,
  },
  subtitle: {
    marginTop: Platform.OS == 'android' ? 55: 0,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
    //textDecorationLine: 'underline',
    marginHorizontal: 20,
  },
  watchnext: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginHorizontal: 20,
  },
  nameCourse: {
    marginVertical: 10,
  },
  spinnerTextStyle: {},
});

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Vdos);
