import React from "react";
import HeatMap from "react-heatmap-grid";

const HeatMapChart = ({ heatMapData, xLabels, yLabels }) => {
  const xLabelsVisibility = new Array(24).fill(0).map(() => true); // Show all x-axis labels

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center" }}>
      <h2>Weekly Heatmap</h2>
      <HeatMap
        xLabels={xLabels || [-1,0 ,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]}
        yLabels={yLabels || ['2025-05-22', '2025-05-23', '2025-05-24', '2025-05-26', '2025-05-27']}
        xLabelsLocation="bottom"
        xLabelsVisibility={xLabelsVisibility}
        xLabelWidth={40}
        yLabelWidth={100}
        data={heatMapData || [
            new Array(24).fill(0),new Array(24).fill(0),new Array(24).fill(0),new Array(24).fill(0),new Array(24).fill(0)
        ]}
        squares
        onClick={(x, y) => alert(`Clicked ${xLabels[x]}, ${yLabels[y]}`)}
        cellStyle={(background, value, min, max) => ({
          background: `rgba(66, 86, 244, ${value > 0 ? 0.3 + 0.7 * (value / (max || 1)) : 0})`,
          fontSize: "11px",
          height: "32px"
        })}
        title={(value) => `${value} events`}
      />
    </div>
  );
};

export default HeatMapChart;
