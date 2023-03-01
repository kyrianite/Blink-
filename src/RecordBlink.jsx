/* eslint-disable func-names */
import React, { useEffect } from 'react';

import blink from './BlinkDetection';
// import blink from 'blink-detection';

export default function RecordBlink() {
  // const videoElement = document.querySelector('video');
  const videoElement = document.getElementById('video');
  let myInterval = null;

  const getPredictions = () => {
    myInterval = setInterval(() => {
      blink.getBlinkPrediction();
    }, 100);
  };

  useEffect(() => {
    (async function () {
      await blink.loadModel();
      console.log('videoElement', videoElement);
      await blink.setUpCamera(videoElement);
      getPredictions();
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
    }
  };

  return (
    <div className="record-blink">
      RECORD BLINK WINDOW!
      <button id="stopRecording" type="submit" onClick={(e) => handleClick(e)}>STOP RECORDING</button>
    </div>
  );
}
