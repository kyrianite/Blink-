/* eslint-disable max-len */
import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { LinearProgress } from '@mui/material';
import ProgressBar from 'react-bootstrap/ProgressBar';

import RecordBlink from './components/RecordBlink';
import Story from './components/Story';
import UserInfoModal from './components/UserInfoModal';
import ZenMode from './components/ZenMode';
import Results from './components/Results';

export default function App() {
  const [username, setUsername] = useState('anonymous');
  const [email, setEmail] = useState('none');
  const [progress, setProgress] = useState(0);
  const [finishedRecording, setFinishedRecording] = useState(false);

  return (
    <div className="App">
      <div className="title">Blink!</div>
      <div className="subtitle">Meaure your blink rate</div>
      {/* <UserInfoModal setUsername={setUsername} setEmail={setEmail} /> */}
      <RecordBlink username={username} email={email} setProgress={setProgress} setFinishedRecording={setFinishedRecording} />
      {/* <ProgressBar variant="info" animated now={progress} /> */}
      <LinearProgress variant="determinate" value={progress} />
      <div className="tab-menu">
        <Tabs defaultActiveKey="test" fill justify>
          <Tab eventKey="test" title="Test Mode">
            {finishedRecording ? <Results /> : <Story />}
          </Tab>
          <Tab eventKey="zen" title="Zen Mode">
            <ZenMode />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
