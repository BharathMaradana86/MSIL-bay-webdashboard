import React, { useEffect } from 'react';
import * as echarts from 'echarts';

export default function DailyInspectionChart({dailyData}) {
  // Sample data
  const successful_data =dailyData[0] ? dailyData[0] : [0.001, 0.002, 0.003, 0.001, 0.003, 0.004, 0.006, 0.004, 0.003, 0.005];
  const failed_data = dailyData[1] ? dailyData[1] : [-0.002, -0.002, -0.003, -0.001, -0.003, -0.004, -0.006, -0.004, -0.003, -0.1];
  const dates =dailyData[2] ? dailyData[2] : ['01-01-2024', '02-01-2024', '03-01-2024', '04-01-2024', '05-01-2024', '06-01-2024', '07-01-2024', '08-01-2024', '09-01-2024', '10-01-2024'];

  useEffect(() => {
    const chartDom = document.getElementById('main1');
    const myChart = echarts.init(chartDom);

    // Calculate max label width
    const calculateMaxLabelWidth = (data) => {

      const maxLabelLength = Math.max(...data.map(value => Math.abs(value).toString().length));
      const approxCharWidth = 8; // Approximate width of a character in pixels
      return maxLabelLength * approxCharWidth; // Add some padding

    };

    const maxLabelWidth = calculateMaxLabelWidth([...successful_data, ...failed_data]);
    const leftMargin = maxLabelWidth -  3; // Add some padding

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            backgroundColor: '#101623', // Custom background color
            borderRadius: 10, // Rounded corners
            padding: 10,
            textStyle: {
              fontFamily: 'Inter'
            },
            formatter: function (params) {
              let total = 0;
              let successful = 0;
              let failed = 0;
    
              params.forEach((param) => {
                if (param.seriesName == 'successful') {
                  successful = param.value;
                } else if (param.seriesName == 'failed') {
                  failed = Math.abs(param.value);
                }
              });
    
              total = parseInt(successful) + parseInt(failed);
    
              return `
              <div style="
                min-width: 300px;
                max-width:max-content;
                height: 144px;
                flex-grow: 0;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                padding: 10px;
                border-radius: 10px;
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.1);
                background-color: #101623;
                color: white;
              ">
                <div style="margin: 10px 24px 10px 24px; font-size: 16px; font-weight: bold; color: #FFFFFF; font-family: Inter;letter-spacing:normal;line-height:1.38;font-stretch:normal;font-style:normal">
                  Total Inspections: ${total}
                </div>
                <div style="margin: 10px 24px 10px 24px; font-size: 16px; font-weight: 500; color: #FFFFFF; font-family: Inter;letter-spacing:normal;line-height:1.38;font-stretch:normal;font-style:normal">
                  <span style="color: #395dab;">●</span> Successful Inspections: ${successful}
                </div>
                <div style="margin: 10px 24px 10px 24px; font-size: 16px; font-weight: 500; color: #FFFFFF; font-family: Inter;letter-spacing:normal;line-height:1.38;font-stretch:normal;font-style:normal">
                  <span style="color: #d3d6da;">●</span> Failed Inspections: ${failed}
                </div>
              </div>
            `;
            },
            confine:true,
          },
      grid: {
        left: leftMargin,
        right: '5%',
        bottom: '6%',
        top: '6%',
        containLabel: true
      },
      xAxis: {
        data: dates,
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
          fontWeight: 500,
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
            return Math.abs(value).toLocaleString();
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
          name: 'successful',
          type: 'bar',
          stack: 'total', // Ensure this series is stacked
          data: successful_data,
          barWidth: '32px', // Set the width of the bars
          itemStyle: {
            borderRadius: [5, 5, 0, 0], // Border radius for top-left and top-right corners
            color: '#395dab' // Blue for positive bars
          }
        },
        {
          name: 'failed',
          type: 'bar',
          stack: 'total', // Ensure this series is stacked
          data: failed_data, // Negative values to place bars below the x-axis
          barWidth: '32px', // Set the width of the bars
          itemStyle: {
            borderRadius: [0, 0, 5, 5], // Border radius for bottom-left and bottom-right corners
            color: '#d3d6da' // Red for bars below the axis
          }
        }
      ]
    };

    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, [dates,successful_data,failed_data]);

  // Calculate the dynamic width
  const dynamicWidth = dates.length * 140;

  return (
    <div style={{ width: '100%', overflowX: 'auto'}}>
      <div id="main1" style={{ width: `${dynamicWidth}px`, height: '364px' }}></div>
    </div>
  );
}
