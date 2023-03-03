/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter, Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ZenMode({ data }) {
  let points;
  let bpm = {};

  if (data.blinkTimes) {
    points = data.blinkTimes.map((b) => ((b - data.startTime) / 1000)).map((bt) => ({ x: bt, y: 1 }));
    data.blinkTimes.forEach((t) => {
      const minute = Math.floor((t - data.startTime) / 60000);
      if (bpm[minute]) {
        bpm[minute] += 1;
      } else {
        bpm[minute] = 1;
      }
    });
    bpm = Object.keys(bpm).map((key) => ({ x: key, y: 1, r: bpm[key] }));
    // console.log(bpm);
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Blink Rate (blinks per minute)',
        },
        max: 2,
        ticks: { stepSize: 1},
      },
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (minutes)',
        },
      },
    },
  };
  const graphData = {
    datasets: [{
      label: 'Blink Times',
      data: bpm,
      backgroundColor: '#0081A7',
    }],
  };

  return (
    <div className="results">
      <Bubble options={options} data={graphData} />
      <p>Total Blinks: {data.blinkTimes?.length}</p>
      <p>Blinks per Minute: ~{data.blinkTimes ? Math.round(data.blinkCount / ((data.blinkTimes[data.blinkTimes.length - 1] - data.startTime) / 60000)) : 0}</p>
    </div>
  );
}
