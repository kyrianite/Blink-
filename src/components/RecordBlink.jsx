/* eslint-disable object-curly-newline */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable func-names */
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import AlarmIcon from '@mui/icons-material/Alarm';
import blink from './BlinkDetection';

const axios = require('axios').default;

export default function RecordBlink({ username, email, setProgress, setFinishedRecording, setData, setDataStream, currentTab }) {
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const videoElement = document.getElementById('video');

  let startTime = null;
  let stopTime = null;
  let myInterval = null;
  let dataStreamInterval = null;

  const sendData = (data) => {
    const myData = { ...data, username, email };
    setData(myData);
    console.log('data to send: ', myData);
    axios.post('http://localhost:3030/api', { username, email, blinks: data.blinkCount, blinkTimes: data.blinkTimes })
      .then((res) => {
        console.log('success?', res.status);
      })
      .catch((err) => {
        console.log('uh-oh', err);
      });
  };

  const stopRecording = () => {
    console.log('Stopped Recording');
    videoElement.pause();
    stopTime = Date.now();
    setFinishedRecording(true);
    clearInterval(myInterval);
    setRecording(false);
    sendData({
      startTime, stopTime, blinkCount: blink.getBlinkCount(), blinkTimes: blink.getBlinkTimes(),
    });
    startTime = null;
  };

  const getPredictions = () => {
    blink.clearData();
    startTime = Date.now();
    myInterval = setInterval(() => {
      stopTime = Date.now();
      const diff = stopTime - startTime;
      setProgress(diff / 300);
      if (diff >= 30000 && currentTab === 'test') {
        console.log('STOPPED! 30s is over');
        stopRecording();
      }
    }, 100);
  };

  const startPredictions = () => {
    setInterval(() => {
      blink.getBlinkPrediction();
    }, 100);
    startTime = Date.now();
    dataStreamInterval = setInterval(() => {
      setDataStream({
        startTime, blinkCount: blink.getBlinkCount(), blinkTimes: blink.getBlinkTimes(),
      });
    }, 1000);
  };

  useEffect(() => {
    (async function () {
      await blink.loadModel();
      await blink.setUpCamera(videoElement);
      await blink.getBlinkPrediction();
      startPredictions();
      setLoading(false);
    }());
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (!recording) {
      console.log('Recording!');
      videoElement.play();
      setRecording(true);
      setFinishedRecording(false);
      getPredictions();
    } else {
      stopRecording();
    }
  };

  return (
    <div className="record-container">
      <Button variant="outlined" className="start-stop-button" size="large" type="submit" disabled={loading} endIcon={<AlarmIcon />} onClick={(e) => handleClick(e)}>START!</Button>
      {/* <button className="start-stop-button" type="submit" disabled={loading} onClick={(e) => handleClick(e)}>START!</button> */}
    </div>
  );
}
