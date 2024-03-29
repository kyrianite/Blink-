/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function TestModeResults({ data }) {
  const points = data.blinkTimes.map((b) => ((b - data.startTime) / 1000)).map((bt) => ({ x: bt, y: 1 }));

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Blinked',
        },
        max: 2,
        ticks: { stepSize: 1 },
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
    <div className="results" style={{ height: '40vh' }}>
      <Scatter options={options} data={graphData} />
      <p>Total blinks in 30s: {points.length}</p>
      <p>Estimated blinks per minute: {points.length * 2}</p>
    </div>
  );
}
