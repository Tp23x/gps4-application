import * as React from 'react';
import {
    Text, 
    View, 
    StyleSheet,
    Dimensions
} from 'react-native';

import { ProgressChart } from 'react-native-chart-kit';

class PieG extends React.Component {
    constructor(props) {
        super( props );
    }
    
    render() {
        const screenWidth = Dimensions.get('screen').width;
        let chartColor = this.props.color ? 
                            () => this.props.color:
                            () => `rgba(200, 0, 200, 0.5)`;
        const chartConfig = {
            backgroundGradientFrom: "#ffffff",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#ffffff",
            backgroundGradientToOpacity: 0,
            // color: (opacity = 1) => `rgba(200, 0, 200, ${opacity})`,
            color: chartColor,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5
          };
        const data = {
            // labels: ["Bike"], // optional
            data: [this.props.percentage/100]
          };

          let pieBG = this.props.backgroundColor?this.props.backgroundColor:'#ff0000';
          console.log( pieBG );
        return (
            <View style={styles.container}>
                <View style={{
                    // paddingVertical: 15,
                    flexDirection: 'row',
                    width: 320,
                    height: 150,
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    marginLeft: 140
                }}
                >
                    <ProgressChart
                        data={data}
                        width={190}
                        height={150}
                        chartConfig={chartConfig}
                        hideLegend={false}
                        backgroundColor={pieBG}
                        />

                        <View style={styles.guage}>
                            <Text style={styles.guageText}>{this.props.percentage}%</Text>
                        </View>
                        
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300
    },
    guage: {
        position: 'absolute',
        marginLeft: -85,
        marginTop: -5,
        width: '100%',
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'blue'
    },
    guageText: {
        backgroundColor: 'transparent',
        color: '#000',
        fontSize: 24
    }
});

export default PieG;