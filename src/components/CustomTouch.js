import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// class CustomTouch extends React.Component {
//     constructor(props){
//         super(props);
//     }

//     render() {
//         return (
//             <TouchableOpacity onPress={this.props.onPress}>
//                 {this.props.children}
//             </TouchableOpacity>
//         );
//     }
// }

const CustomTouch = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.container}>
                {props.children}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
    }
});

export default CustomTouch;
