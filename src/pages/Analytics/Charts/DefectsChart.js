import React, { useEffect } from 'react';
import * as echarts from 'echarts';

export default function DefectsChart({data}) {

  console.log(data);
    const yAxisData =data ? data : [4, 2, 6,5];

  useEffect(() => {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    // Calculate the width required for the longest y-axis label
    const calculateLeftMargin = (data) => {
      const maxLabelLength = Math.max(...data.map(value => value.toString().length));
      const approxCharWidth = 8; // Approximate width of a character in pixels
      return maxLabelLength * approxCharWidth + 30; // Add some padding
    };

    const leftMargin = calculateLeftMargin(yAxisData);

    var option = {
      grid: {
        left: `${leftMargin}px`, // Dynamically set the left margin
        right: '7%',
        bottom: '45%',
        top: '5%'
      },
      xAxis: {
        data: ['Missed', 'Wrong', 'Flipped'],
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#e5e7eb' // Set the color for the x-axis line
          }
        },
        axisLabel: {
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 'normal',
          fontStyle: 'normal',
          lineHeight: 20, // Line height in pixels (1.43 * 14px)
          color: '#707784',
          align: 'center', // Ensure labels are centered
          letterSpacing: 0.14
        }
      },
      yAxis: {
        axisLine: {
          show: true,
          lineStyle: {
            color: '#e5e7eb' // Set the color for the y-axis line
          }
        },
        axisLabel: {
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 'normal',
          fontStyle: 'normal',
          lineHeight: 20, // Line height in pixels (1.43 * 14px)
          color: '#707784',
          align: 'right',
          letterSpacing: 0.14,
          formatter: function (value) {
            // Format large numbers with commas
            return value.toLocaleString();
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed' // Set the line style to dashed
          }
        }
      },
      series: [
        {
          name: 'Defects',
          type: 'bar',
          data: yAxisData,
          barWidth: '32px', // Set the width of the bars
          itemStyle: {
            color: '#395dab', // Change the color of the bars
            borderRadius: [5, 5, 0, 0] // Border radius for top-left and top-right corners
          },
          label:{
            show:true,
            position:'top',
            formatter:'{c}',
            fontFamily:'Inter',
            fontSize:14,
            fontWeight:'500',
            color:'#101623'
          }
        }
      ]
    };

    option && myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, [yAxisData]);

  return (
    <div id="main" style={{ width: '100%', height: '356px' }}></div>
  );
}
