/* eslint-disable func-names */
import React, { useEffect } from 'react';
import blink from './BlinkDetection';

const axios = require('axios').default;

export default function RecordBlink() {
  const videoElement = document.getElementById('video');
  let myInterval = null;

  const getPredictions = () => {
    myInterval = setInterval(() => {
      blink.getBlinkPrediction();
    }, 125);
  };

  useEffect(() => {
    (async function () {
      await blink.loadModel();
      console.log('videoElement', videoElement);
      await blink.setUpCamera(videoElement);
    }());
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (videoElement.paused) {
      videoElement.play();
      getPredictions();
    } else {
      videoElement.pause();
      clearInterval(myInterval);
      blink.stopPrediction();
      axios.get('http://localhost:3030/api')
        .then((res) => {
          console.log('success?');
        })
        .catch((err) => {
          console.log('uh-oh');
        });
    }
  };

  return (
    <div className="record-blink">
      RECORD BLINK WINDOW!
      <button id="stopRecording" type="submit" onClick={(e) => handleClick(e)}>START/STOP</button>
    </div>
  );
}
