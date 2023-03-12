import React from 'react';
import {View} from 'react-native';
import {
  Svg,
  Rect,
  G,
  LinearGradient,
  Line,
  Text,
  Defs,
  Stop,
} from 'react-native-svg';
import AbstractChart from 'react-native-chart-kit/src/abstract-chart';

const barWidth = 32;

class CustomBarChart extends AbstractChart {
  constructor(props) {
    super(props);
  }

  //   renderHorizontalLines(config){

  //     super.renderHorizontalLines({...config, paddingRight: 0} );
  //   }

  //   renderVerticalLabels(config){
  //       super.renderVerticalLabels({...config});
  //   }

  //   renderDefs(config){
  //       super.renderDefs({...config});
  //   }

  getBarPercentage = () => {
    const {barPercentage = 1} = this.props.chartConfig;
    return barPercentage;
  };

  findMaxValue = datas => {
    let max = 0;
    datas.forEach((a, b) => {
      max = a > max ? a : max;
    });

    return max;
  };

  renderBars = config => {
    const {data, width, height, paddingTop, paddingRight, barRadius, mycolors} = config;

    const verticalDatas = this.getVerticalDatas(data);
    const baseHeight = this.calcBaseHeight(verticalDatas, height);

    const barWidth = 32 * this.getBarPercentage();

    let myGraphs = [];
    // let mycolors = [
    //   'red',
    //   'green',
    //   'blue',
    //   'yellow',
    //   'black',
    //   'purple',
    //   'white',
    //   'grey',
    //   'pink',
    // ];
    let _nexti = -1;

    let _dummyData = data.filter((a, b) => a);
    // _dummyData.push(0);

    data.forEach((dt, idx) => {
      if (typeof dt != 'number') {
        let _dummyData = dt.filter((a, b) => a);
        //   _dummyData.push(0);
        dt.map((d, i) => {
          _nexti++;

          const scalar = this.calcScaler(verticalDatas);
          //   const barHeight = this.calcHeight(d, verticalDatas, height);
          const barHeight = height * (d / scalar);
          const barWidth = config.customBarWidth * this.getBarPercentage();

          const actualBarHeight = (Math.abs(barHeight) / 4) * 3;

          let xval =
            paddingRight +
            (_nexti * (width - paddingRight)) / 10 +
            barWidth / 2;
          let yval =
            ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
            paddingTop;
          xval = _nexti % 2 == 1 ? xval - barWidth : xval;
          xval = _nexti == 4 ? xval - barWidth * 2 : xval;
          xval = _nexti == 6 ? xval - barWidth * 2 : xval;
          xval = _nexti == 8 ? xval - barWidth * 2 : xval;

          let _xval = 70;
          switch (_nexti) {
            case 0:
              xval = _xval;
              break;
            case 1:
              xval = _xval + barWidth * _nexti + 1;
              break;
            case 2:
              xval = _xval + barWidth * _nexti + _nexti + 10;
              break;
            case 3:
              xval = _xval + barWidth * _nexti + _nexti + 10;
              break;
            case 4:
              xval = _xval + barWidth * _nexti + _nexti + 10;
              break;
            case 5:
              xval = _xval + barWidth * _nexti + _nexti + 20;
              break;
            case 6:
              xval = _xval + barWidth * _nexti + _nexti + 20;
              break;
            case 7:
              xval = _xval + barWidth * _nexti + _nexti + 30;
              break;
            case 8:
              xval = _xval + barWidth * _nexti + _nexti + 30;
              break;
          }

          myGraphs.push(
            <Rect
              key={Math.random()}
              x={xval}
              y={yval}
              rx={barRadius}
              width={barWidth}
              //   height={(Math.abs(barHeight) / 4) * 3}
              height={actualBarHeight}
              //   height={d}
              fill={mycolors[_nexti]}
              // fill="url(#fillShadowGradient)"
            />,
          );
        });
      } else {
        _nexti++;

        const barHeight = this.calcHeight(dt, verticalDatas, height);
        const barWidth = 32 * this.getBarPercentage();

        myGraphs.push(
          <Rect
            key={Math.random()}
            x={
              paddingRight +
              (idx * (width - paddingRight)) / data.length +
              barWidth / 2
            }
            y={
              ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
              paddingTop
            }
            rx={barRadius}
            width={barWidth}
            height={(Math.abs(barHeight) / 4) * 3}
            fill="url(#fillShadowGradient)"
          />,
        );
      }
    });

    return <>{myGraphs}</>;
  };

  getVerticalDatas = dataSet => {
    let verticalDatas = [0];
    dataSet.forEach((data, a) => {
      if (typeof data != 'number') {
        data.forEach((d, b) => {
          verticalDatas.push(d);
        });
      } else {
        verticalDatas.push(data);
      }
    });

    return verticalDatas;
  };

  renderBarTops = config => {
    const {data, width, height, paddingTop, paddingRight, barRadius, topBarColor, textValueColor} = config;

    const verticalDatas = this.getVerticalDatas(data);
    const baseHeight = this.calcBaseHeight(verticalDatas, height);

    //const barWidth = 32 * this.getBarPercentage();

    let myGraphs = [];
    let _nexti = -1;

    let _dummyData = data.filter((a, b) => a);
    // _dummyData.push(0);

    data.forEach((dt, idx) => {
      if (typeof dt != 'number') {
        let _dummyData = dt.filter((a, b) => a);
        //   _dummyData.push(0);
        dt.map((d, i) => {
          _nexti++;

          const scalar = this.calcScaler(verticalDatas);
          //   const barHeight = this.calcHeight(d, verticalDatas, height);
          const barHeight = height * (d / scalar);
          const barWidth = config.customBarWidth * this.getBarPercentage();

          const actualBarHeight = (Math.abs(barHeight) / 4) * 3;

          let xval =
            paddingRight +
            (_nexti * (width - paddingRight)) / 10 +
            barWidth / 2;
          let yval =
            ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
            paddingTop;
          xval = _nexti % 2 == 1 ? xval - barWidth : xval;
          xval = _nexti == 4 ? xval - barWidth * 2 : xval;
          xval = _nexti == 6 ? xval - barWidth * 2 : xval;
          xval = _nexti == 8 ? xval - barWidth * 2 : xval;

          let _xval = 70;
          switch (_nexti) {
            case 0:
              xval = _xval;
              break;
            case 1:
              xval = _xval + barWidth * _nexti + 1;
              break;
            case 2:
              xval = _xval + barWidth * _nexti + _nexti + 10;
              break;
            case 3:
              xval = _xval + barWidth * _nexti + _nexti + 10;
              break;
            case 4:
              xval = _xval + barWidth * _nexti + _nexti + 10;
              break;
            case 5:
              xval = _xval + barWidth * _nexti + _nexti + 20;
              break;
            case 6:
              xval = _xval + barWidth * _nexti + _nexti + 20;
              break;
            case 7:
              xval = _xval + barWidth * _nexti + _nexti + 30;
              break;
            case 8:
              xval = _xval + barWidth * _nexti + _nexti + 30;
              break;
          }

          myGraphs.push(
            <>
              <Rect
                key={Math.random()}
                x={xval}
                y={yval}
                width={barWidth}
                height={2}
                // fill={this.props.chartConfig.color(0.6)}
                fill={topBarColor}
              />
              <Text
                fill={textValueColor}
                // stroke="white"
                fontSize="10"
                fontWeight="bold"
                x={xval + barWidth / 2}
                y={yval - 2}
                textAnchor="middle">
                {d}
              </Text>
            </>,
          );
        });
      } else {
        _nexti++;

        const barHeight = this.calcHeight(dt, verticalDatas, height);
        const barWidth = 32 * this.getBarPercentage();

        myGraphs.push(
          <Rect
            key={Math.random()}
            x={
              paddingRight +
              (idx * (width - paddingRight)) / data.length +
              barWidth / 2
            }
            y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
            width={barWidth}
            height={2}
            // fill={this.props.chartConfig.color(0.6)}
            fill="black"
          />,
        );
      }
    });

    return <>{myGraphs}</>;
  };

  render() {
    const {
      width,
      height,
      data,
      style = {},
      withHorizontalLabels = true,
      withVerticalLabels = true,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      withInnerLines = true,
      showBarTops = true,
      segments = 4,
      fromZero = true,
      customBarWidth = 30,
      mycolors=[
        'red',
        'green',
        'blue',
        'yellow',
        'black',
        'purple',
        'white',
        'grey',
        'pink',
      ],
      topBarColor='black',
      textValueColor='black'
    } = this.props;
    const {borderRadius = 0, paddingTop = 16, paddingRight = 64} = style;
    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation,
      barRadius:
        (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
      formatYLabel:
        (this.props.chartConfig && this.props.chartConfig.formatYLabel) ||
        function(label) {
          return label;
        },
      formatXLabel:
        (this.props.chartConfig && this.props.chartConfig.formatXLabel) ||
        function(label) {
          return label;
        },
      fromZero,
      customBarWidth,
      mycolors,
      topBarColor,
      textValueColor
    };

    let _dataSet = data.datasets[0].data;
    let verticalDatas = [];
    // verticalDatas.push(0);
    _dataSet.forEach((data, a) => {
      if (typeof data != 'number') {
        data.forEach((d, b) => {
          verticalDatas.push(d);
        });
      } else {
        verticalDatas.push(data);
      }
    });
    // verticalDatas.push(100);

    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig,
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {withInnerLines
              ? this.renderHorizontalLines({
                  ...config,
                  count: segments,
                  paddingTop,
                })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: segments,
                  data: verticalDatas, //data.datasets[0].data,
                  paddingTop,
                  paddingRight,
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  paddingRight,
                  paddingTop,
                  horizontalOffset: barWidth * this.getBarPercentage(),
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight,
            })}
          </G>
          <G>
            {showBarTops &&
              this.renderBarTops({
                ...config,
                data: data.datasets[0].data,
                paddingTop,
                paddingRight,
              })}
          </G>
        </Svg>
      </View>
    );
  }
}

export default CustomBarChart;