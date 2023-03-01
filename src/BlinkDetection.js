/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
// import * as tf from '@tensorflow/tfjs-core';
// import '@tensorflow/tfjs-backend-webgl';

// import '@mediapipe/face_mesh';
import '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

let model; let video; let event;
const VIDEO_SIZE = 500;
let blinkCount = 0;
let rendering = true;
const EAR_THRESHOLD = 0.2275;
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

function stopPrediction() {
  rendering = false;
}

function getEucledianDistance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function getEAR(p1, p2, p3, p4, p5, p6) {
  const p2_p6 = getEucledianDistance(p2, p6);
  const p3_p5 = getEucledianDistance(p3, p5);
  const p1_p4 = getEucledianDistance(p1, p4);
  return (p2_p6 + p3_p5) / (2 * p1_p4);
}

async function renderPrediction() {
  rendering = true;
  if (rendering) {
    // const predictions = await model.estimateFaces({
    //   input: video,
    //   returnTensors: false,
    //   flipHorizontal: false,
    //   predictIrises: true,
    // });
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

      if (blinked && leftEAR < lastBlink.left && rightEAR < lastBlink.right) {
        console.log('BLINKED!!!');
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
      };
      console.log('EAR', rightEAR, leftEAR);
      console.log(event);
    }
  }
  return event;
}

const blink = {
  loadModel,
  setUpCamera,
  stopPrediction,
  getBlinkPrediction: renderPrediction,
};

export default blink;
