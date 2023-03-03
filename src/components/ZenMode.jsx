/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ZenMode({ data }) {
  let points = [];
  if (data.blinkTimes) {
    points = data.blinkTimes.map((b) => ((b - data.startTime) / 1000)).map((bt) => ({ x: bt, y: 1 }));
  }
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Blink Rate',
        },
      },
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (seconds)',
        },
      },
    },
  };
  const graphData = {
    datasets: [{
      label: 'Blink Times',
      data: points,
      backgroundColor: 'rgba(255, 99, 132, 1)',
    }],
  };

  return (
    <div className="results">
      <Scatter options={options} data={graphData} />
    </div>
  );
}
