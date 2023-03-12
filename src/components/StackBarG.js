import * as React from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';

import {StackedBarChart} from 'react-native-chart-kit';

class StackBarG extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const screenWidth = Dimensions.get('screen').width;
    const chartConfig = {
      backgroundColor: '#e26a00',
      backgroundGradientFrom: this.props.color ? this.props.color : '#fb8c00',
      backgroundGradientTo: '#ffa726',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726',
      },
    };
    const data = {
      labels: this.props.labels,
      legend: this.props.legend,
      data: this.props.data,
      barColors: this.props.barColors
    };
    return (
      <StackedBarChart
        style={styles.graphStyle}
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
    );
  }
}

const styles = StyleSheet.create({
    graphStyle: {}
});

export default StackBarG;
