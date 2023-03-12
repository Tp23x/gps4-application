import * as React from 'react';
import {
    Text, 
    View, 
    StyleSheet,
    Dimensions
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';

class LineG extends React.Component {
    constructor(props) {
        super( props );
    }

    
    render() {
      
        const screenWidth = Dimensions.get('screen').width;
        const chartConfig = {
            backgroundColor: "#ff0000",
            backgroundGradientFrom: this.props.color ? this.props.color : 'orange',
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
                data: this.props.data
              }
            ]
          };
        return (
          <LineChart
            data={data}
            width={screenWidth -80}
            height={250}
            chartConfig={chartConfig}
            hideLegend={false}
            //style={styles.graphStyle}
            bezier
              style={{
                //marginVertical: 8,
                borderRadius: 16,
                marginHorizontal: 10
                //padding: 30,
                //borderWidth: 1,
                //backgroundColor: 'red'
              }}
            />
        );
    }
}

const styles = StyleSheet.create({
  graphStyle: {
    marginHorizontal: 20
  }
});

export default LineG;