import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


import { connect } from 'react-redux';
import trans from '../../shared/lang';
import { mapStatetoProps, mapDispatchToProps } from '../../store/store';

class TestScreen extends React.Component{

    render(){
        return (
            <View style={styles.container}>
                <Text>this is the test screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default connect(mapStatetoProps, mapDispatchToProps)(TestSCreen);
