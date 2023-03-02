/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */

// References: https://medium.com/the-web-tub/recognising-eye-blinking-with-tensorflow-js-3c02b738850d
// References: https://www.npmjs.com/package/blink-detection
// References: https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection

import '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

let model; let video; let event;
let blinkCount = 0;
let blinkTimes = [];
// let rendering = true;

const VIDEO_SIZE = 500;
const EAR_THRESHOLD = 0.20;
const lastBlink = { left: Number.positiveInfinity, right: Number.positiveInfinity };

const loadModel = async () => {
  const model2 = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
  };
  model = await faceLandmarksDetection.createDetector(model2, detectorConfig);
};

const setUpCamera = async (videoElement) => {
  video = videoElement;
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();

  const defaultWebcam = mediaDevices.find(
    (device) => device.kind === 'videoinput' && device.label.includes('Webcam'),
  );

  const cameraId = defaultWebcam ? defaultWebcam?.deviceId : null;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      // facingMode: 'user',
      deviceId: cameraId,
      width: VIDEO_SIZE,
      height: VIDEO_SIZE,
    },
  });

  video.srcObject = stream;
  video.play();
  video.width = VIDEO_SIZE;
  video.height = VIDEO_SIZE;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
};

// function stopPrediction() {
//   rendering = false;
// }

function getEucledianDistance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function getEAR(p1, p2, p3, p4, p5, p6) {
  // Eye Aspect Ratio equation: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9044337/
  const p2_p6 = getEucledianDistance(p2, p6);
  const p3_p5 = getEucledianDistance(p3, p5);
  const p1_p4 = getEucledianDistance(p1, p4);
  return (p2_p6 + p3_p5) / (2 * p1_p4);
}

function isValidBlink(leftEAR, rightEAR) { // prevent double recordings
  return leftEAR < lastBlink.left && rightEAR < lastBlink.right && lastBlink.left > EAR_THRESHOLD && lastBlink.right > EAR_THRESHOLD;
}

async function renderPrediction() {
  // if (rendering) {
  const predictions = await model.estimateFaces(video, false, true, true);

  if (predictions.length > 0) {
    const r1 = predictions[0].keypoints[33];
    const r2 = predictions[0].keypoints[160];
    const r3 = predictions[0].keypoints[158];
    const r4 = predictions[0].keypoints[133];
    const r5 = predictions[0].keypoints[153];
    const r6 = predictions[0].keypoints[144];

    const l1 = predictions[0].keypoints[362];
    const l2 = predictions[0].keypoints[385];
    const l3 = predictions[0].keypoints[387];
    const l4 = predictions[0].keypoints[263];
    const l5 = predictions[0].keypoints[373];
    const l6 = predictions[0].keypoints[380];

    const rightEAR = getEAR(r1, r2, r3, r4, r5, r6);
    const leftEAR = getEAR(l1, l2, l3, l4, l5, l6);

    const blinked = leftEAR <= EAR_THRESHOLD || rightEAR <= EAR_THRESHOLD;

    if (blinked && isValidBlink(leftEAR, rightEAR)) {
      console.log('BLINKED!!!');
      blinkTimes.push(Date.now());
      blinkCount++;
    }

    lastBlink.left = leftEAR;
    lastBlink.right = rightEAR;

    event = {
      left: leftEAR <= EAR_THRESHOLD,
      right: rightEAR <= EAR_THRESHOLD,
      wink: leftEAR <= EAR_THRESHOLD || rightEAR <= EAR_THRESHOLD,
      blink: blinked,
      count: blinkCount,
      blinkTimes,
    };
  }
  // }
  // console.log(event);
  return event;
}

function getBlinkCount() {
  return blinkCount;
}

function getBlinkTimes() {
  return blinkTimes;
}

function clearData() {
  blinkCount = 0;
  blinkTimes = [];
}

const blink = {
  loadModel,
  setUpCamera,
  // stopPrediction,
  getBlinkPrediction: renderPrediction,
  getBlinkCount,
  getBlinkTimes,
  clearData,
};

export default blink;
