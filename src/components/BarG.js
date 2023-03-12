import * as React from 'react';
import {
    Text, 
    View, 
    StyleSheet,
    Dimensions
} from 'react-native';

import { BarChart } from 'react-native-chart-kit';

class BarG extends React.Component {
    constructor(props) {
        super( props );
    }
    
    render() {
        const screenWidth = Dimensions.get('screen').width;
        const chartConfig = {
            backgroundColor: "#e26a00",
            backgroundGradientFrom: this.props.bgcolor ? this.props.bgcolor : "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2, // optional, defaults to 2dp
            //color: (opacity = 1) => `rgba(241, 90, 36, ${opacity})`,
            color: this.props.color ? this.props.color : (opacity = 1 ) => `rgba(241,90,36, ${opacity})`, 
            labelColor: (opacity = 1) => '#4d4d4d',
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          };
        const data = {
            labels: this.props.labels ? this.props.labels : [],
            datasets: [
              {
                data: this.props.data ? this.props.data: []
              }
            ]
          };
        return (
          <BarChart
            data={data}
            width={screenWidth -120}
            height={250}
            chartConfig={chartConfig}
            hideLegend={false}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              width:300,
              marginTop: 10,
              marginRight:30
              //padding: 30,
              //borderWidth: 1,
              //backgroundColor: 'red'
            }}
            />
        );
    }
}

const styles = StyleSheet.create({
    
});

export default BarG;