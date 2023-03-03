/* eslint-disable react/jsx-one-expression-per-line */
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
        max: 2,
        ticks: { stepSize: 1},
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
      backgroundColor: '#0081A7',
    }],
  };

  return (
    <div className="results">
      <Scatter options={options} data={graphData} />
      <p>Total Blinks: {data.blinkTimes?.length}</p>
      <p>Blinks per Minute: ~{data.blinkTimes ? Math.round((data.blinkTimes[data.blinkTimes.length - 1] - data.startTime) / 6000) : 0}</p>
    </div>
  );
}
